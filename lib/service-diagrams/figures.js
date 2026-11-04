import * as THREE from 'three';
import { accentMaterial, businessIcon, graphiteBodyMaterial, graphiteFaceMaterial, rounded } from './materials.js';
import { stackArtwork, toolContours } from './figure-assets.js';

const unit=1/32;
const v=(x,y,z)=>new THREE.Vector3(x,y,z);
// Invert the reference SVG's 30° floor axes at the given elevation.
const ref=(u,w,y)=>v((w+u/Math.sqrt(3))*unit+y,y,(w-u/Math.sqrt(3))*unit+y);
const clamp=x=>Math.max(0,Math.min(1,x));
const phase=(t,a,b)=>clamp((t-a)/(b-a));
const ease=(t,a,b)=>THREE.MathUtils.smootherstep(t,a,b);
const window=(t,a,b,c,d)=>ease(t,a,b)*(1-ease(t,c,d));

function makeParts(config) {
  const accent=new THREE.Color(config.theme.accent);
  const muted=new THREE.Color(config.theme.muted);
  const graphite=new THREE.Color(config.theme.body);
  const flat=(color)=>new THREE.MeshBasicMaterial({color,toneMapped:false});
  const face=graphiteFaceMaterial(new THREE.Color(config.theme.face).lerp(muted,.055));
  const base=graphiteBodyMaterial(graphite);
  const dark=graphiteBodyMaterial(graphite.clone().multiplyScalar(.60));
  const detail=graphiteBodyMaterial(graphite.clone().lerp(muted,.24));
  const brand=accentMaterial();
  brand.color.copy(accent);
  const live=flat(accent);
  const dormant=flat(graphite.clone().lerp(muted,.19));
  return {accent,muted,face,base,dark,detail,brand,live,dormant};
}

function mesh(parent,geometry,material,p) {
  const object=new THREE.Mesh(geometry,material);
  object.position.copy(p);
  object.castShadow=true;
  object.receiveShadow=true;
  parent.add(object);
  return object;
}

function slab(parent,material,w,d,h,p,r=.05) {
  const object=mesh(parent,rounded(w,d,h,r),material,p);
  object.rotation.x=-Math.PI/2;
  return object;
}

function group(parent,p=v()) {
  const object=new THREE.Group();
  object.position.copy(p);
  parent.add(object);
  return object;
}

function wire(parent,material,points,r=.012) {
  const path=new THREE.CurvePath();
  for(let i=1;i<points.length;i++) path.add(new THREE.LineCurve3(points[i-1],points[i]));
  const object=mesh(parent,new THREE.TubeGeometry(path,points.length===2 ? 24 : points.length*5,r,6,false),material,v());
  object.castShadow=false;
  return object;
}

function pulse(parent,material,r=.05) {
  const object=mesh(parent,new THREE.SphereGeometry(r,16,10),material,v());
  object.castShadow=false;
  return object;
}

function boundsAt(include,center,x,y,z) {
  for(const sx of [-x,x]) for(const sy of [-y,y]) for(const sz of [-z,z])
    include(center.clone().add(v(sx,sy,sz)));
}

function badge(parent,config,material,icon,p,size,customContours) {
  const object=businessIcon(icon,material,config.theme,customContours);
  object.position.copy(p);
  object.scale.setScalar(size);
  object.rotation.x=-Math.PI*19/180;
  parent.add(object);
  return object;
}

function planeMark(parent,material,points) {
  const shape=new THREE.Shape(points.map(p=>new THREE.Vector2(p.x,-p.z)));
  const object=mesh(parent,new THREE.ShapeGeometry(shape),material,v(0,points[0].y,0));
  object.rotation.x=-Math.PI/2;
  object.castShadow=false;
  return object;
}

function rectangle(points,y) {
  const corners=points.map(([x,z])=>ref(x,z,y));
  const bounds=new THREE.Box3().setFromPoints(corners);
  return {center:bounds.getCenter(v()),size:bounds.getSize(v())};
}

function labelNodes(config,anchors,include) {
  return new Map(config.nodes.map(node=>{
    const position=anchors[node.id] ?? v();
    if (anchors[node.id]) include(position);
    return [node.id,{node,anchor:position,labelAnchor:position,select(){},opacity:anchors[node.id] ? 1 : 0}];
  }));
}

export function prototypeFigure(scene,config,include) {
  const p=makeParts(config);
  const board=v(3.75,.095,1.875);
  slab(scene,p.base,7.5,3.75,.19,board,.09);
  slab(scene,p.face,7.42,3.67,.027,v(3.75,.183,1.875),.08);
  boundsAt(include,board,3.75,.1,1.875);
  const pads=new THREE.InstancedMesh(new THREE.CylinderGeometry(.025,.025,.01,8),p.detail,55);
  const matrix=new THREE.Matrix4();
  for(let i=0;i<11;i++) for(let j=0;j<5;j++) {
    matrix.makeTranslation(.6+i*.625,.205,.6+j*.625);
    pads.setMatrixAt(i*5+j,matrix);
  }
  scene.add(pads);

  const prompt=rectangle([[0,-2],[74.5,41],[-5.2,87],[-79.7,44]],.50);
  slab(scene,p.face,prompt.size.x,prompt.size.z,.31,prompt.center.clone().add(v(0,-.155,0)),.055);
  const rules=[
    [[-5.2,11],[50.2,43]],[[-20.8,20],[17.3,42]],
    [[-36.4,29],[15.6,59]],[[-52,38],[-26,53]]
  ].map(segment=>{
    const line=wire(scene,p.detail,segment.map(([x,z])=>ref(x,z,.514)),.021);
    const write=wire(scene,p.live,segment.map(([x,z])=>ref(x,z,.518)),.022);
    return {line,write};
  });

  const [start,end]=[[34.6,74],[86.6,104]].map(([x,z])=>ref(x,z,.25));
  wire(scene,p.dormant,[start,end],.016);
  const token=mesh(scene,rounded(.4375,.4375,.4375,.055),p.brand,v());

  const laptop=rectangle([[110.9,81],[169.7,115],[114.3,147],[55.4,113]],.35);
  const basePos=laptop.center.clone().add(v(0,-.079,0));
  slab(scene,p.base,laptop.size.x,laptop.size.z,.158,basePos,.075);
  const rear=laptop.center.clone().add(v(0,.032,-laptop.size.z/2+.05));
  const lid=group(scene,rear);
  const width=laptop.size.x-.055;
  mesh(lid,rounded(width,1.50,.101,.07),p.base,v(0,.75,0));
  mesh(lid,rounded(width-.15,1.34,.031,.055),p.dark,v(0,.755,.060));
  const ui=group(lid,v(0,.12,.085));
  const uiPanel=(w,h,x,y,material)=>mesh(ui,rounded(w,h,.013,.012),material,v(x,y,0));
  uiPanel(width-.31,.022,0,1.03,p.detail);
  uiPanel(.02,.89,-.54,.57,p.detail);
  for(const [i,w] of [.23,.19,.21].entries()) uiPanel(w,.024,-.74,.91-i*.16,p.detail);
  for(const [i,w] of [.93,.72,.83].entries()) uiPanel(w,.029,.06,.80-i*.143,p.detail);
  uiPanel(.61,.14,-.08,.31,p.brand);
  boundsAt(include,rear.clone().add(v(0,.77,0)),width/2,.78,.10);
  for(let i=0;i<4;i++) for(let j=0;j<11;j++){
    const key=slab(scene,p.detail,.115,.095,.017,laptop.center.clone().add(v((j-5)*.148,.018,-.56+i*.13)),.016);
    key.castShadow=false;
  }
  slab(scene,p.face,.71,.34,.018,laptop.center.clone().add(v(0,.019,.47)),.035);

  const toLocal=(x,y,h)=>ref((x+1)/.82,(y+36)/.82,h);
  const emblem=accentMaterial();
  const tools=[
    ['claude',-99.6,-26.9,-85.1,-23,-39.7,-10.8,1.42],
    ['cursor',-67.3,-77.6,-57.6,-66.1,-27.4,-30.1,1.63],
    ['v0',-11.7,-100.6,-10.4,-85.7,-6.3,-38.9,1.72],
    ['lovable',47,-87.6,39.5,-74.6,16,-33.9,1.63],
    ['figma',87.6,-43.3,74,-36.9,31.4,-17.1,1.44]
  ].map(([name,x,y,ax,ay,bx,by,h])=>{
    const center=toLocal(x,y,h);
    const from=toLocal(ax,ay,h-.03);
    const to=toLocal(bx,by,.54);
    const icon=badge(scene,config,emblem,'custom',center,.72,toolContours[name]);
    boundsAt(include,center,.45,.46,.18);
    wire(scene,p.dormant,[from,to],.010);
    return {icon,from,to,bead:pulse(scene,p.live,.047)};
  });
  emblem.dispose();
  const nodes=labelNodes(config,{prompt:ref(-72.7,101,.18),build:ref(24.2,166,.17)},include);
  return {nodes,animate(time) {
    tools.forEach(({icon,from,to,bead},i)=>{
      const t=time-i*.18;
      icon.userData.setSelection(window(t,0,.195,.78,1.3));
      bead.visible=t>.04 && t<.91;
      bead.position.lerpVectors(from,to,phase(t,0,.91));
    });
    rules.forEach(({line,write},i)=>{
      const t=time-1.2-i*.14;
      line.visible=t<.13 || t>=1.04;
      write.visible=t>=.195 && t<1.21;
      write.geometry.setDrawRange(0,Math.ceil(24*phase(t,.195,1.04))*36);
    });
    const flight=phase(time,2.825,3.41);
    const inFlight=time>=2.825 && time<3.54;
    token.position.lerpVectors(start,end,inFlight ? flight : .5);
    token.position.y+=.235;
    token.visible=time<2.63 || inFlight || time>=3.61;
    const open=window(time,3.38,4.355,5.525,6.37);
    lid.rotation.x=THREE.MathUtils.lerp(1.48,0,open);
    ui.scale.setScalar(Math.max(.001,window(time,4.16,4.68,5.525,5.98)));
  }};
}

function stackText(parent,position,color,text) {
  const canvas=document.createElement('canvas');
  canvas.width=256;
  canvas.height=128;
  const ctx=canvas.getContext('2d');
  ctx.font='600 105px system-ui';
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillStyle=color.getStyle();
  ctx.fillText(text,128,68);
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  const label=mesh(parent,new THREE.PlaneGeometry(.88,.44),new THREE.MeshBasicMaterial({
    map:texture,transparent:true,toneMapped:false,depthWrite:false
  }),position);
  label.rotation.x=-Math.PI/2;
  label.castShadow=false;
}

export function tokenFigure(scene,config,include) {
  const p=makeParts(config);
  const body=group(scene,v());
  const size=150*unit;
  const thickness=4*unit;
  const originalPitch=52*unit;
  const layerRim=[p.base,p.base,p.base].map(material=>material.clone());
  const swatches=[p.brand,p.detail,p.dark];
  const layers=stackArtwork.map((art,i)=>{
    const layer=group(body,v(0,i*originalPitch,0));
    const detail=group(layer,v());
    slab(layer,layerRim[i],size,size,thickness,v(size/2,thickness/2,size/2),.07);
    slab(layer,p.face,size-.03,size-.03,.022,v(size/2,thickness-.010,size/2),.065);
    let tileHeight=0;
    art.forEach(([type,points,height,hot])=>{
      if(type==='tile') {
        tileHeight=height*unit;
        const {size,center}=rectangle(points,thickness+i*originalPitch+tileHeight);
        center.y=thickness+tileHeight/2;
        slab(detail,hot ? p.brand : p.dark,size.x,size.z,tileHeight,center,.045);
        return;
      }
      const y=thickness+i*originalPitch+tileHeight+.01;
      const corners=points.map(([x,z])=>ref(x,z,y));
      corners.forEach(point=>point.y-=i*originalPitch);
      if(type==='line') wire(detail,p.detail,corners,.017);
      else planeMark(detail,type.startsWith('swatch') ? swatches[Number(type.at(-1))-1] : type==='glyph' ? p.brand : p.detail,corners);
    });
    if(i===0) stackText(detail,ref(-39.8,93,.23),p.muted,'Aa');
    return {layer,detail};
  });
  const ties=group(scene,v());
  for(let i=0;i<2;i++) for(const [x,z] of [[0,size],[size,size],[size,0]]) {
    const y=thickness+i*originalPitch;
    wire(ties,p.dormant,[v(x,y,z),v(x,y+originalPitch-thickness,z)],.014);
  }
  boundsAt(include,v(size/2,1.70,size/2),size/2,1.74,size/2);
  const emblem=accentMaterial();
  const readers=[['agent','robot',-1],['human','person',1]].map(([id,icon,side])=>{
    const center=ref(side*160,-14,1.49);
    const mark=badge(scene,config,emblem,icon,center,.87);
    const start=ref(side*143,-14,1.45);
    const end=ref(side*112,-14,1.45);
    const beam=wire(scene,p.dormant,[start,end],.012);
    const bead=pulse(scene,p.live,.057);
    boundsAt(include,center,.55,.55,.21);
    return {id,mark,start,end,beam,bead,label:ref(side*160,16,.9)};
  });
  emblem.dispose();
  p.base.dispose();
  const anchors={tokens:ref(-129.9,71,.125),components:ref(-129.9,19,1.75),pages:ref(-129.9,-33,3.375),
    agent:readers[0].label,human:readers[1].label,system:ref(0,93,.2)};
  const nodes=labelNodes(config,anchors,include);
  for(const id of ['tokens','components','pages']) nodes.get(id).outsideLeft=true;
  return {nodes,animate(time) {
    const fold=ease(time,.3,1.1);
    body.scale.setScalar(1-.15*fold);
    body.position.set(-.50*fold,.97*fold,-.14*fold);
    layers.forEach(({layer,detail},i)=>{
      layer.position.y=i*THREE.MathUtils.lerp(originalPitch,thickness+.005,fold);
      detail.visible=i===2 || fold<.93;
      layerRim[i].color.set(config.theme.body).lerp(p.accent,.76*ease(time,1.1,1.4));
    });
    ties.scale.y=Math.max(.001,1-ease(time,0,.3));
    ties.visible=time<.3;
    for(const id of ['tokens','components','pages']) nodes.get(id).opacity=1-ease(time,0,.3);
    nodes.get('system').opacity=ease(time,1.1,1.4);
    readers.forEach(({id,mark,start,end,beam,bead})=>{
      const appear=ease(time,1.4,1.7);
      mark.visible=appear>0;
      mark.scale.setScalar(.87*appear);
      beam.visible=time>=1.7;
      nodes.get(id).opacity=appear;
      const read=time>=1.9 && time<4.4 ? ((time-1.9)%1.5)/1.5 : 0;
      mark.userData.setSelection(read>0 ? Math.sin(read*Math.PI) : .48);
      bead.visible=read>.04 && read<.96;
      bead.position.lerpVectors(start,end,read);
    });
  }};
}
