import * as THREE from 'three';
import { accentMaterial, businessIcon, graphiteBodyMaterial, graphitePanelMaterial, reflectionEnvironment, rounded } from './materials.js';
import { actionTileLift, createTimeline, easeInOut, normalizeScene } from './scene.js';
import { assembleBoard } from './board.js';
import { prototypeFigure, tokenFigure } from './figures.js';

const vector = (x,y,z) => new THREE.Vector3(x,y,z);
const mix = THREE.MathUtils.lerp;
const steps = 64;
const sides = 6;
const labelGap = 14;

function connectorTube(curve,radius,sourceRise,destinationRise) {
  const geometry=new THREE.TubeGeometry(curve,steps,radius,sides,false);
  if (sourceRise || destinationRise) {
    const count=geometry.attributes.position.count;
    const source=new Float32Array(count*3);
    const destination=new Float32Array(count*3);
    for (let i=0;i<count;i++) {
      const t=Math.floor(i/(sides+1))/steps;
      source[i*3+1]=(1-t)*sourceRise;
      destination[i*3+1]=t*destinationRise;
    }
    geometry.morphTargetsRelative=true;
    geometry.morphAttributes.position=[new THREE.BufferAttribute(source,3),new THREE.BufferAttribute(destination,3)];
  }
  return geometry;
}

function release(scene) {
  const materials = new Set();
  const geometries = new Set();
  scene.traverse(object=>{
    if (object.geometry) geometries.add(object.geometry);
    if (object.material) materials.add(object.material);
    if (object.shadow) object.shadow.dispose();
  });
  materials.forEach(material=>material.dispose());
  new Set([...materials].map(material=>material.map).filter(Boolean)).forEach(texture=>texture.dispose());
  geometries.forEach(geometry=>geometry.dispose());
}

function assemble(config, environment) {
  const scene = new THREE.Scene();
  scene.environment = environment.texture;
  const bounds = new THREE.Box3();
  const points=[];
  function include(point) {
    bounds.expandByPoint(point);
    points.push(point);
  }
  const accent = new THREE.Color(config.theme.accent);
  const add = (geometry,material,x,y,z,castShadow=true) => {
    const mesh = new THREE.Mesh(geometry,material);
    mesh.position.set(x,y,z);
    mesh.castShadow=castShadow;
    mesh.receiveShadow=true;
    scene.add(mesh);
    return mesh;
  };

  function pedestals() {
    const bodyMaterial=config.blockFinish==='panel'
      ? graphitePanelMaterial(config.theme.body,config.theme.muted)
      : graphiteBodyMaterial(config.theme.body);
    const stemMaterial=new THREE.MeshStandardMaterial({color:0x181b15,roughness:.56,metalness:.15,envMapIntensity:.45});
    const symbolMaterial=accentMaterial();
    const nodes=new Map(config.nodes.map(node=>{
      const {x,z,height} = node;
      add(rounded(1.45,height,1.6,.065),bodyMaterial,x,height/2,z);
      add(rounded(.18,.2,.2,.03),stemMaterial,x,height+.1,z-.1);
      const icon=businessIcon(node.icon,symbolMaterial,config.theme,node.contours);
      icon.position.set(x,height+.59,z+.035);
      icon.rotation.x=-THREE.MathUtils.degToRad(19);
      icon.scale.setScalar(.91);
      scene.add(icon);
      const slit=new THREE.MeshStandardMaterial({color:0x38402b,roughness:.3,emissive:accent,emissiveIntensity:0});
      add(rounded(.35,.018,.015,.008),slit,x,Math.max(.13,height-.2),z+.817,false);
      const labelAnchor=node.labelSide==='above' ? vector(x,height+1.45,z+.11) : vector(x,-.095,z+1.24);
      include(labelAnchor);
      for (const dx of [-.76,.76]) for (const dz of [-.83,.83]) {
        include(vector(x+dx,-.03,z+dz));
        include(vector(x+dx,height+.03,z+dz));
      }
      for (const dx of [-.55,.55]) {
        include(vector(x+dx,height+1.13,z+.28));
        include(vector(x+dx,height+.05,z+.07));
      }
      function select(level) {
        icon.userData.setSelection(level);
        slit.color.setHex(0x38402b).lerp(slit.emissive,level);
        slit.emissiveIntensity=level*.8;
      }
      return [node.id,{node,select,anchor:vector(x,height+.59,z),labelAnchor}];
    }));
    symbolMaterial.dispose();
    return nodes;
  }
  const figure=config.figure==='prototype' ? prototypeFigure(scene,config,include)
    : config.figure==='token-stack' ? tokenFigure(scene,config,include) : null;
  const nodes=figure?.nodes ?? (config.board ? assembleBoard(scene,config,include) : pedestals());
  const idle=new THREE.MeshStandardMaterial({color:0x3d4433,roughness:.6,metalness:.15});
  const live=new THREE.MeshStandardMaterial({color:accent,emissive:accent,emissiveIntensity:.24,roughness:.32});
  const signalMaterial=new THREE.MeshStandardMaterial({color:accent,emissive:accent,emissiveIntensity:1});
  const links=figure ? [] : config.edges;
  const signalGeometry=links.length ? new THREE.SphereGeometry(.037,16,10) : null;
  const edges=new Map(links.map(edge=>{
    const source=nodes.get(edge.from);
    const destination=nodes.get(edge.to);
    const from=source.anchor;
    const to=destination.anchor;
    const direction=vector(to.x-from.x,0,to.z-from.z);
    const length=direction.length();
    if (length<.001) direction.set(1,0,0);
    else direction.divideScalar(length);
    const port=Math.min(.47,Math.max(.05,length*.32));
    const route=edge.via.map(([x,z])=>vector(x,Math.min(from.y,to.y)-.12,z));
    function terminal(part, toward, defaultSign) {
      if(!config.board) return part.anchor.clone().addScaledVector(direction,defaultSign*port);
      const offset=vector(toward.x-part.anchor.x,0,toward.z-part.anchor.z);
      const distance=offset.length();
      if(distance<.001) return part.anchor.clone();
      offset.divideScalar(distance);
      const rim=Math.min(part.halfWidth/Math.abs(offset.x),part.halfDepth/Math.abs(offset.z));
      const reach=route.length ? Math.min(rim*1.015,distance*.93) : Math.min(rim*.90,distance*.49);
      return part.anchor.clone().addScaledVector(offset,reach);
    }
    const a=terminal(source,route[0] ?? to,1);
    const b=terminal(destination,route.at(-1) ?? from,-1);
    const sideways=vector(-direction.z,0,direction.x);
    const c1=a.clone().lerp(b,.23).addScaledVector(sideways,edge.bend);
    const c2=a.clone().lerp(b,.77).addScaledVector(sideways,edge.bend);
    c1.y=c2.y=Math.max(a.y,b.y)+edge.lift;
    const curve=route.length ? new THREE.CatmullRomCurve3([a,...route,b]) : new THREE.CubicBezierCurve3(a,c1,c2,b);
    curve.getPoints(16).forEach(include);
    const wire=add(connectorTube(curve,.009,source.rise,destination.rise),idle,0,0,0,false);
    const trace=add(connectorTube(curve,.013,source.rise,destination.rise),live,0,0,0,false);
    const bead=add(signalGeometry,signalMaterial,0,0,0,false);
    bead.visible=false;
    return [edge.id,{curve,wire,trace,bead,edge,sourceRise:source.rise ?? 0,destinationRise:destination.rise ?? 0}];
  }));
  if (!edges.size) [idle,live,signalMaterial].forEach(material=>material.dispose());

  const center=bounds.getCenter(vector());
  const span=bounds.getSize(vector()).length();
  const light=new THREE.DirectionalLight(0xe4e5da,2);
  light.position.copy(center).add(vector(-3,7,5).setLength(span*1.35));
  light.target.position.copy(center);
  light.castShadow=true;
  light.shadow.mapSize.set(1536,1536);
  Object.assign(light.shadow.camera,{left:-span*.64,right:span*.64,top:span*.64,bottom:-span*.64,near:.1,far:span*3});
  light.shadow.normalBias=.02;
  light.shadow.bias=-.0001;
  scene.add(light,light.target,new THREE.HemisphereLight(0xe4e5da,0x111210,.4));
  const fill=new THREE.DirectionalLight(0xe4e5da,.6);
  fill.position.set(4,3,6);
  scene.add(fill);
  const ground=add(new THREE.PlaneGeometry(span*5,span*5),new THREE.ShadowMaterial({opacity:.19}),center.x,-.035,center.z,false);
  ground.rotation.x=-Math.PI/2;
  const start=vector();
  for (const id of config.start) start.add(nodes.get(id).anchor);
  if (config.start.length) start.divideScalar(config.start.length);
  else start.copy(center);
  const opening=center.clone().lerp(start,.21);
  opening.y=mix(center.y,start.y,.14);
  return {scene,nodes,edges,center,points,opening,span,figure};
}

/** Mount an independently seekable WebGL diagram in a sized HTML element. */
export class DiagramRenderer {
  /**
   * @param {HTMLElement} host
   * @param {unknown} input
   * @param {{onFrame?: (frame: {time: number, duration: number, playing: boolean, active: string[]}) => void}} options
   */
  constructor(host, input, {onFrame=()=>{}}={}) {
    this.host=host;
    this.onFrame=onFrame;
    this.motion=matchMedia('(prefers-reduced-motion: reduce)');
    this.time=0;
    this.playing=false;
    this.hover=vector(0,0,0);
    this.pointer=vector(0,0,0);
    this.listeners=new AbortController();
    const options={signal:this.listeners.signal};
    host.classList.add('diagram-engine');
    try {
      this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
    } catch {
      this.renderer=null;
    }
    if (this.renderer) {
      const renderer=this.renderer;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,2));
      renderer.setClearColor(0,0);
      renderer.outputColorSpace=THREE.SRGBColorSpace;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;
      renderer.shadowMap.enabled=true;
      renderer.shadowMap.type=THREE.PCFSoftShadowMap;
      renderer.shadowMap.autoUpdate=false;
      renderer.domElement.setAttribute('aria-hidden','true');
      host.append(renderer.domElement);
      this.environment=reflectionEnvironment(renderer);
      renderer.domElement.addEventListener('webglcontextlost',event=>{
        event.preventDefault();
        this.lost=true;
        this.pause();
        this.showFallback();
      },options);
      renderer.domElement.addEventListener('webglcontextrestored',()=>{
        this.lost=false;
        this.environment.dispose();
        this.environment=reflectionEnvironment(renderer);
        this.world.scene.environment=this.environment.texture;
        renderer.shadowMap.needsUpdate=true;
        this.fallback.hidden=true;
        this.resize();
      },options);
    }
    this.labels=document.createElement('div');
    this.labels.className='diagram-labels';
    this.labels.setAttribute('aria-hidden','true');
    this.fallback=document.createElement('div');
    this.fallback.className='diagram-fallback';
    this.fallback.hidden=true;
    host.append(this.labels,this.fallback);
    host.addEventListener('pointermove',event=>{
      if (this.config.cameraMotion==='fixed' || this.camera.isOrthographicCamera || event.pointerType==='touch' || this.playing || this.time<this.duration || this.motion.matches || !this.renderer || this.lost) return;
      const rect=host.getBoundingClientRect();
      this.pointer.set((event.clientX-rect.left)/rect.width*2-1,(event.clientY-rect.top)/rect.height*2-1,0);
      this.wake();
    },options);
    host.addEventListener('pointerleave',()=>{
      this.pointer.set(0,0,0);
      if (this.hover.lengthSq()>.00001) this.wake();
    },options);
    this.motion.addEventListener('change',()=>{
      if(this.motion.matches) this.seek(this.duration);
    },options);
    document.addEventListener('visibilitychange',()=>{this.previous=performance.now();},options);
    this.resizeObserver=new ResizeObserver(()=>this.resize());
    this.setScene(input);
    this.resizeObserver.observe(host);
  }

  setScene(input) {
    const config=normalizeScene(input);
    const world=this.renderer ? assemble(config,this.environment) : null;
    this.pause(false);
    if (this.world) release(this.world.scene);
    this.world=world;
    this.config=config;
    this.camera=config.projection==='isometric'
      ? new THREE.OrthographicCamera(-1,1,1,-1,.1,600)
      : new THREE.PerspectiveCamera(27,1,.1,600);
    this.timeline=createTimeline(config);
    if (world) {
      for (const [id,part] of world.nodes) {
        if (part.node.form!=='action-tile') continue;
        const arrivals=config.edges.filter(edge=>edge.to===id).map(edge=>this.timeline.arrivals.get(edge.id) ?? Infinity);
        part.actionAt=Math.min(...arrivals);
      }
    }
    this.duration=this.timeline.duration;
    this.time=this.motion.matches ? this.duration : 0;
    this.hover.set(0,0,0);
    this.pointer.set(0,0,0);
    this.host.style.backgroundColor=config.theme.background;
    this.host.setAttribute('role','img');
    const labelById=new Map(config.nodes.map(node=>[node.id,node.label]));
    const connections=config.edges.map(({from,to})=>`${labelById.get(from)} to ${labelById.get(to)}`);
    const lightBackground=new THREE.Color(config.theme.background).toArray()
      .reduce((sum,channel,i)=>sum+channel*[.2126,.7152,.0722][i],0)>.36;
    this.host.style.setProperty('--diagram-text',lightBackground ? '#303329' : '#a7a99a');
    const activeText=new THREE.Color(config.theme.accent)
      .lerp(new THREE.Color(lightBackground ? '#13180c' : '#f6f7eb'),lightBackground ? .72 : .56);
    this.host.style.setProperty('--diagram-active',activeText.getStyle());
    this.host.setAttribute('aria-label',[` ${config.title}`,config.description,
      `Stages: ${config.nodes.map(node=>node.label).join(', ')}.`,
      connections.length ? `Connections: ${connections.join(', ')}.` : ''].filter(Boolean).join(' ').trim());
    this.labels.replaceChildren();
    if (world) {
      for (const part of world.nodes.values()) {
        part.label=document.createElement('span');
        part.label.className='diagram-label';
        part.label.classList.toggle('above',part.node.labelSide==='above');
        if (part.outsideLeft) {
          part.label.classList.add('outside-left');
          part.label.style.marginLeft=`-${labelGap}px`;
        }
        part.label.textContent=part.node.label;
        this.labels.append(part.label);
      }
      this.renderer.shadowMap.needsUpdate=true;
    }
    if (!world || this.lost) this.showFallback();
    this.resize();
  }

  showFallback() {
    this.fallback.textContent=`3D preview unavailable. ${this.config.nodes.map(node=>node.label).join(' · ')}`;
    this.fallback.hidden=false;
  }

  resize() {
    this.width=this.host.clientWidth;
    this.height=this.host.clientHeight;
    if (!this.width || !this.height) return;
    if (this.renderer && !this.lost) {
      this.renderer.setSize(this.width,this.height);
      const {camera,world}=this;
      if (camera.isOrthographicCamera) {
        // Equal offsets along all three world axes give an exact isometric view.
        camera.position.copy(world.center).addScalar(world.span);
        camera.lookAt(world.center);
        camera.updateMatrixWorld();
        const bounds=new THREE.Box3().setFromPoints(world.points.map(point=>point.clone().applyMatrix4(camera.matrixWorldInverse)));
        const center=bounds.getCenter(vector());
        const size=bounds.getSize(vector());
        const aspect=this.width/this.height;
        let halfHeight=Math.max(size.y,size.x/aspect)/1.63;
        const sideLabels=[...world.nodes.values()].filter(part=>part.outsideLeft).map(part=>({
          x:part.labelAnchor.clone().applyMatrix4(camera.matrixWorldInverse).x,
          gutter:2*(part.label.offsetWidth+labelGap)/this.height
        }));
        // Reserve space for the actual label widths without letting the text overlap the figure.
        for (const {x,gutter} of sideLabels) {
          const usable=1.63*aspect-gutter;
          if (usable>0) halfHeight=Math.max(halfHeight,(bounds.max.x-x)/usable);
        }
        let left=bounds.min.x;
        for (const {x,gutter} of sideLabels) left=Math.min(left,x-gutter*halfHeight);
        center.x=(left+bounds.max.x)/2;
        const halfWidth=halfHeight*aspect;
        Object.assign(camera,{left:center.x-halfWidth,right:center.x+halfWidth,top:center.y+halfHeight,bottom:center.y-halfHeight});
        camera.updateProjectionMatrix();
      } else {
        camera.aspect=this.width/this.height;
        camera.updateProjectionMatrix();
        this.openDistance=this.fit(world.opening,.88);
        if (this.config.cameraMotion==='fixed') this.pose(world.opening,this.openDistance);
        else this.finalDistance=Math.max(this.openDistance*1.08,this.fit(world.center,.81));
      }
    }
    this.render();
  }

  pose(focus,distance,hoverX=0,hoverY=0) {
    const azimuth=.43+hoverX*.0436;
    const elevation=.58+hoverY*.0262;
    this.camera.position.set(focus.x+Math.sin(azimuth)*Math.cos(elevation)*distance,
      focus.y+Math.sin(elevation)*distance,focus.z+Math.cos(azimuth)*Math.cos(elevation)*distance);
    this.camera.lookAt(focus);
    this.camera.updateMatrixWorld();
  }

  fit(focus,limit) {
    let lower=.5;
    let upper=this.world.span*18;
    const projected=vector();
    for (let i=0;i<22;i++) {
      const distance=(lower+upper)/2;
      this.pose(focus,distance);
      const fits=this.world.points.every(corner=>{
        projected.copy(corner).project(this.camera);
        return projected.z<1 && projected.z>-1 && Math.abs(projected.x)<limit && Math.abs(projected.y)<limit;
      });
      if(fits) upper=distance;
      else lower=distance;
    }
    return upper;
  }

  render() {
    const {world,renderer,camera}=this;
    const state=this.timeline.sample(this.time);
    this.onFrame({time:this.time,duration:this.duration,playing:this.playing,active:[...state.levels].filter(([,level])=>level>.5).map(([id])=>id)});
    if (!renderer || this.lost || !this.width || !this.height) return;
    if (camera.isPerspectiveCamera && this.config.cameraMotion!=='fixed') {
      this.pose(world.opening.clone().lerp(world.center,state.camera),mix(this.openDistance,this.finalDistance,state.camera),this.hover.x,this.hover.y);
    }
    if (world.figure) {
      world.figure.animate(this.time);
      renderer.shadowMap.needsUpdate=true;
    }
    for (const [id,part] of world.nodes) {
      const level=state.levels.get(id) ?? 0;
      const arrived=part.node.form==='status-sheet' && this.config.edges.some(edge=>edge.to===id && state.traces.get(edge.id)===1);
      let approval=1;
      if (part.node.form==='confirm-key') {
        const humanLinks=this.config.edges.filter(edge=>edge.to===id && world.nodes.get(edge.from).node.form==='person');
        if (humanLinks.length) {
          const progress=Math.max(...humanLinks.map(edge=>state.traces.get(edge.id) ?? 0));
          approval=THREE.MathUtils.smoothstep(progress,.90,1);
        }
      }
      const rise=state.rises.get(id) ?? 0;
      part.motionLevel=part.actionAt===undefined ? easeInOut(rise) : actionTileLift(this.time,part.actionAt);
      if (part.select(level,arrived,part.motionLevel,approval,rise)) renderer.shadowMap.needsUpdate=true;
      part.label.classList.toggle('active',level>.5);
      if (part.opacity!==undefined) part.label.style.opacity=part.opacity;
      const point=part.labelAnchor.clone().project(camera);
      part.label.style.left=`${(point.x*.5+.5)*100}%`;
      part.label.style.top=`${(.5-point.y*.5)*100}%`;
    }
    const signals=new Map(state.signals.map(({id,progress})=>[id,progress]));
    for (const [id,{curve,wire,trace,bead,edge,sourceRise,destinationRise}] of world.edges) {
      const progress=state.traces.get(id) ?? 0;
      const sourceLevel=world.nodes.get(edge.from).motionLevel;
      const destinationLevel=world.nodes.get(edge.to).motionLevel;
      if (wire.morphTargetInfluences) {
        wire.morphTargetInfluences[0]=trace.morphTargetInfluences[0]=sourceLevel;
        wire.morphTargetInfluences[1]=trace.morphTargetInfluences[1]=destinationLevel;
      }
      trace.geometry.setDrawRange(0,Math.floor(steps*sides*2*progress)*3); // per triangle, so the line grows smoothly
      bead.visible=signals.has(id);
      if (bead.visible) {
        const progress=signals.get(id);
        bead.position.copy(this.config.board ? curve.getPointAt(progress) : curve.getPoint(progress));
        bead.position.y+=mix(sourceLevel*sourceRise,destinationLevel*destinationRise,progress);
      }
    }
    renderer.render(world.scene,camera);
  }

  wake() {
    if (this.frameId || !this.renderer || this.lost) return;
    this.previous=performance.now();
    this.frameId=requestAnimationFrame(this.frame);
  }

  frame = now => {
    this.frameId=0;
    const elapsed=Math.min(.1,Math.max(0,(now-this.previous)/1000));
    this.previous=now;
    if (this.playing && !document.hidden) {
      this.time=Math.min(this.duration,this.time+elapsed);
      if (this.time>=this.duration) this.playing=false;
    }
    this.hover.lerp(this.pointer,1-Math.exp(-8*elapsed));
    this.render();
    if (this.playing || this.hover.distanceToSquared(this.pointer)>.00001) this.frameId=requestAnimationFrame(this.frame);
  };

  play() {
    if (this.motion.matches || !this.renderer || this.lost) {
      this.seek(this.duration);
      return;
    }
    if (this.time>=this.duration) this.seek(0);
    if (!this.duration) return;
    this.playing=true;
    this.render();
    this.wake();
  }

  pause(notify=true) {
    this.playing=false;
    cancelAnimationFrame(this.frameId);
    this.frameId=0;
    if (notify && this.timeline) this.render();
  }

  seek(seconds) {
    if (!Number.isFinite(seconds)) throw new TypeError('Seek time must be a finite number.');
    this.pause(false);
    this.time=seconds>=this.duration-1e-6 ? this.duration : Math.max(0,seconds);
    this.hover.set(0,0,0);
    this.pointer.set(0,0,0);
    this.render();
  }

  async png() {
    if (!this.renderer || this.lost || !this.width || !this.height) throw new Error('The diagram needs a visible 3D preview to export a PNG.');
    this.render();
    const source=this.renderer.domElement;
    const canvas=document.createElement('canvas');
    canvas.width=source.width;
    canvas.height=source.height;
    const ctx=canvas.getContext('2d');
    ctx.scale(canvas.width/this.width,canvas.height/this.height);
    ctx.fillStyle=this.config.theme.background;
    ctx.fillRect(0,0,this.width,this.height);
    ctx.drawImage(source,0,0,this.width,this.height);
    for (const {label} of this.world.nodes.values()) {
      const style=getComputedStyle(label);
      ctx.globalAlpha=Number(style.opacity);
      ctx.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      ctx.fillStyle=style.color;
      const outsideLeft=label.classList.contains('outside-left');
      ctx.textAlign=outsideLeft ? 'right' : 'center';
      ctx.textBaseline=outsideLeft ? 'middle' : label.classList.contains('above') ? 'bottom' : 'top';
      ctx.fillText(label.textContent.toUpperCase(),parseFloat(label.style.left)*this.width/100-(outsideLeft ? labelGap : 0),parseFloat(label.style.top)*this.height/100);
    }
    return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob ? resolve(blob) : reject(new Error('PNG export failed.')),'image/png'));
  }

  destroy() {
    this.pause(false);
    this.listeners.abort();
    this.resizeObserver.disconnect();
    if(this.world) release(this.world.scene);
    this.environment?.dispose();
    this.renderer?.dispose();
    this.renderer?.forceContextLoss();
    this.renderer?.domElement.remove();
    this.labels.remove();
    this.fallback.remove();
    this.host.classList.remove('diagram-engine');
    this.host.removeAttribute('role');
    this.host.removeAttribute('aria-label');
    for(const property of ['background-color','--diagram-text','--diagram-active']) this.host.style.removeProperty(property);
  }
}
