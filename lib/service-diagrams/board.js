import * as THREE from 'three';
import { accentMaterial, businessIcon, extrude, graphiteBodyMaterial, graphiteFaceMaterial, graphitePanelMaterial, rounded } from './materials.js';

export const boardForms = Object.freeze({
  'data-sheet': [1.625,3.5,.156],
  'review-sheet': [1.625,3.5,.156],
  'status-sheet': [1.625,3.5,.156],
  conversation: [2.5,2.5,.3125],
  'confirm-key': [2.625,.5625,.34375],
  'action-tile': [2.25,1.75,.375],
  person: [.76,.76,.105]
});
const top = .1875;

function mesh(parent,geometry,material,x,y,z) {
  const part=new THREE.Mesh(geometry,material);
  part.position.set(x,y,z);
  part.castShadow=true;
  part.receiveShadow=true;
  parent.add(part);
  return part;
}

function slab(parent,material,w,d,h,x,y,z,r=.055) {
  const part=mesh(parent,rounded(w,d,h,r),material,x,y,z);
  part.rotation.x=-Math.PI/2;
  return part;
}

function circle(parent,material,x,y,z,r,h=.025) {
  return mesh(parent,new THREE.CylinderGeometry(r,r,h,36),material,x,y,z);
}

function line(parent,material,points,y,r=.018) {
  const path=new THREE.CurvePath();
  const coords=points.map(([x,z])=>new THREE.Vector3(x,y,z));
  for(let i=1;i<coords.length;i++) path.add(new THREE.LineCurve3(coords[i-1],coords[i]));
  mesh(parent,new THREE.TubeGeometry(path,Math.max(6,points.length*4),r,6,false),material,0,0,0);
}

function bubble(parent,material,color,message,x,y,z,width,rightAligned) {
  const right=width/2;
  const side=rightAligned ? 1 : -1;
  const outline=new THREE.Shape();
  outline.moveTo(side*-right,-.145);
  outline.quadraticCurveTo(side*-right,-.27,side*(-right+.13),-.27);
  outline.lineTo(side*(right-.26),-.27);
  outline.quadraticCurveTo(side*(right-.08),-.27,side*(right+.06),-.37);
  outline.quadraticCurveTo(side*(right+.035),-.30,side*right,-.16);
  outline.lineTo(side*right,.145);
  outline.quadraticCurveTo(side*right,.27,side*(right-.13),.27);
  outline.lineTo(side*(-right+.13),.27);
  outline.quadraticCurveTo(side*-right,.27,side*-right,.145);
  outline.closePath();
  const body=mesh(parent,extrude(outline,.062,.017),material,x,y,z);
  body.rotation.x=-Math.PI/2;

  const canvas=document.createElement('canvas');
  canvas.width=640;
  canvas.height=184;
  const ctx=canvas.getContext('2d');
  ctx.font='600 72px system-ui, sans-serif';
  ctx.fillStyle=color;
  ctx.textBaseline='middle';
  ctx.fillText(message,19,92,602);
  const texture=new THREE.CanvasTexture(canvas);
  texture.colorSpace=THREE.SRGBColorSpace;
  const ink=new THREE.MeshBasicMaterial({map:texture,transparent:true,toneMapped:false,depthWrite:false});
  const label=mesh(parent,new THREE.PlaneGeometry(width-.15,.38),ink,x,y+.039,z);
  label.rotation.x=-Math.PI/2;
  label.castShadow=false;
  label.receiveShadow=false;
}

export function assembleBoard(scene,config,include) {
  const {x,z,width,depth}=config.board;
  const accent=new THREE.Color(config.theme.accent);
  const muted=new THREE.Color(config.theme.muted);
  const graphite=new THREE.Color(config.theme.body);
  const enamel=accentMaterial();
  const base=graphiteBodyMaterial(graphite);
  const surface=graphiteFaceMaterial(new THREE.Color(config.theme.face).lerp(muted,.033));
  const moduleSurface=graphitePanelMaterial(graphite,muted);
  const dim=graphiteBodyMaterial(graphite.clone().lerp(muted,.18));
  const rail=graphiteBodyMaterial(graphite.clone().lerp(accent,.11));
  slab(scene,base,width,depth,top,x,top/2,z,.10);
  slab(scene,surface,width-.08,depth-.08,.04,x,top-.005,z,.09);
  const panelY=top+.02;
  const cols=Math.max(1,Math.floor(width/.63));
  const rows=Math.max(1,Math.floor(depth/.63));
  const pads=new THREE.InstancedMesh(new THREE.CylinderGeometry(.027,.027,.013,9),rail,cols*rows);
  const matrix=new THREE.Matrix4();
  for(let i=0;i<cols;i++) for(let j=0;j<rows;j++) {
    matrix.makeTranslation(x+(i-(cols-1)/2)*.63,panelY+.007,z+(j-(rows-1)/2)*.63);
    pads.setMatrixAt(i*rows+j,matrix);
  }
  scene.add(pads);

  for(const dx of [-width/2,width/2]) for(const dz of [-depth/2,depth/2]) {
    include(new THREE.Vector3(x+dx,0,z+dz));
    include(new THREE.Vector3(x+dx,panelY,z+dz));
  }

  const nodes=new Map(config.nodes.map(node=>{
    const {form,x:nx,z:nz}=node;
    const [w,d,h]=boardForms[form];
    const group=new THREE.Group();
    group.position.set(nx,form==='person' ? .025 : panelY,nz);
    scene.add(group);
    const mark=enamel.clone();
    mark.color.copy(muted);
    const y=h+.026;
    const restHeight=form==='action-tile' ? .11 : h;
    const rise=form.endsWith('-sheet') ? .23 : h-restHeight;
    const badges=[];
    let warning;
    let approved;
    let panel;
    let shape=group;
    const face=new THREE.Group();
    group.add(face);
    function uprightBadge(icon,scale,z=0) {
      const iconMesh=businessIcon(icon,enamel,config.theme);
      iconMesh.rotation.x=-THREE.MathUtils.degToRad(19);
      iconMesh.scale.setScalar(scale);
      iconMesh.position.set(0,h+.58*scale,z);
      face.add(iconMesh);
      badges.push(iconMesh);
      if (form.endsWith('-sheet')) {
        for (const dx of [-.61,.61]) {
          include(new THREE.Vector3(nx+dx*scale,group.position.y+h+1.19*scale+rise,nz+z-.20*scale));
        }
      }
      return iconMesh;
    }
    if(form==='person') {
      circle(group,base,0,h/2,0,w/2,h);
    } else {
      if(form==='confirm-key') {
        slab(group,base,w+.12,d+.16,.10,0,.05,0,.08);
        shape=new THREE.Group();
        group.add(shape);
      }
      panel=slab(shape,moduleSurface,w,d,h,0,h/2,0);
    }

    if(form==='data-sheet') {
      uprightBadge('storage',.76,-1.04);
      for(let i=0;i<4;i++) {
        const row=-.28+i*.44;
        slab(face,rail,1.25,.024,.014,0,y,row+.16,.01);
        slab(face,i===0 ? mark : dim,.44+i%3*.12,.044,.017,-.15,y,row,.017);
        circle(face,i===0 ? mark : dim,.51,y,row,.038,.023);
      }
    } else if(form==='review-sheet') {
      line(face,rail,[[0,-.70],[0,.70]],y,.019);
      uprightBadge('person',.72,-.80);
      uprightBadge('person',.72,.80);
      circle(face,mark,0,y,0,.047);
    } else if(form==='status-sheet') {
      warning=uprightBadge('alert',.86,-.20);
      approved=uprightBadge('check',.86,-.20);
      slab(face,mark,.95,.046,.019,0,y,1.02,.02);
    } else if(form==='conversation') {
      slab(face,surface,2.26,2.23,.04,0,y,.01,.11);
      const incoming=graphiteBodyMaterial(graphite.clone().lerp(muted,.12));
      bubble(face,incoming,muted.getStyle(),'Update this report',-.31,y+.064,-.53,1.45,false);
      bubble(face,mark,graphite.getStyle(),'Confirm update?',.18,y+.064,.43,1.70,true);
    } else if(form==='confirm-key') {
      slab(shape,mark,1.08,.26,.036,0,y,0,.09);
    } else if(form==='action-tile') {
      uprightBadge('check',.83);
    } else {
      uprightBadge('person',.75);
    }

    const labelAnchor=new THREE.Vector3(nx,group.position.y,nz);
    const outsideLeft=!form.endsWith('-sheet') && form!=='person';
    if(form.endsWith('-sheet')) labelAnchor.set(nx+.12,panelY,z+depth/2+.46);
    else if(form==='person') labelAnchor.z+=.70;
    else labelAnchor.set(x-width/2,panelY,nz);
    include(labelAnchor);
    if(form==='person' || form==='action-tile') {
      for(const dx of [-.52,.52]) include(new THREE.Vector3(nx+dx,group.position.y+h+1.03,nz));
      mark.dispose();
    }
    for(const dx of [-w/2,w/2]) for(const dz of [-d/2,d/2])
      include(new THREE.Vector3(nx+dx,group.position.y+restHeight+.17+rise,nz+dz));

    function select(level,arrived,motionLevel,approval) {
      if(form!=='person' && form!=='action-tile') {
        mark.color.copy(muted).lerp(accent,level);
        mark.emissive.copy(accent);
        mark.emissiveIntensity=.13*level;
      }
      for(const badge of badges) badge.userData.setSelection(level);
      let changed=false;
      if (approved) {
        const showCheck=arrived || level>.75;
        changed=approved.visible!==showCheck;
        approved.visible=showCheck;
        warning.visible=!showCheck;
      }
      if (rise) {
        const height=restHeight+rise*motionLevel;
        const offset=height-h;
        changed ||= Math.abs(face.position.y-offset)>.00001;
        face.position.y=offset;
        panel.scale.z=height/h;
        panel.position.y=height/2;
        return changed;
      }
      if (form==='confirm-key') {
        const pressed=-.085*level*approval;
        const moved=Math.abs(shape.position.y-pressed)>.001;
        shape.position.y=pressed;
        return moved;
      }
      return false;
    }
    return [node.id,{node,select,anchor:new THREE.Vector3(nx,group.position.y+restHeight+.026,nz),
      halfWidth:w/2,halfDepth:d/2,labelAnchor,outsideLeft,rise}];
  }));
  enamel.dispose();
  if (!config.nodes.some(node=>node.form==='data-sheet')) dim.dispose();
  return nodes;
}
