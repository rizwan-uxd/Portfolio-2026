import * as THREE from 'three';
import { silhouettes } from './icons.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
export const lime=0xb3c66f;
export function extrude(shape,depth=.14,bevel=.035,crown=0){
 const thickness=Math.min(bevel,depth*.28);
 let geometry=new THREE.ExtrudeGeometry(shape,{depth:depth-2*thickness,bevelEnabled:true,bevelSegments:8,steps:1,bevelSize:bevel,bevelThickness:thickness,curveSegments:crown?32:8});
 geometry.translate(0,0,-(depth-2*thickness)/2);
 if(crown){const p=geometry.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);p.setZ(i,z+crown*Math.max(0,1-2*(x*x+y*y))*Math.max(0,z/(depth/2)));}}
 // Keep UVs on the rounded badge face for its subtle surface texture.
 geometry.deleteAttribute('normal');
 if(crown)geometry.deleteAttribute('uv');
 const smooth=mergeVertices(geometry,1e-5);geometry.dispose();smooth.computeVertexNormals();return smooth;
}
export function rounded(w,h,d,r=.065){
 const x=-w/2,y=-h/2,s=new THREE.Shape();
 s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);
 return extrude(s,d,Math.min(.025,d*.2));
}
export function accentMaterial(){return new THREE.MeshPhysicalMaterial({color:lime,metalness:.35,roughness:.3,clearcoat:.3,clearcoatRoughness:.24,envMapIntensity:.65});}
function polygon(points){const s=new THREE.Shape();s.moveTo(...points[0]);for(const p of points.slice(1))s.lineTo(...p);s.closePath();return s;}
let faceTexture;
function graphiteTexture(){
 if(faceTexture)return faceTexture;
 const c=document.createElement('canvas');c.width=c.height=256;const context=c.getContext('2d'),data=context.createImageData(256,256);let seed=371;
 for(let i=0;i<data.data.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const v=112+(seed>>>24)*.15;data.data[i]=data.data[i+1]=data.data[i+2]=v;data.data[i+3]=255;}
 context.putImageData(data,0,0);faceTexture=new THREE.CanvasTexture(c);faceTexture.colorSpace=THREE.NoColorSpace;faceTexture.wrapS=faceTexture.wrapT=THREE.RepeatWrapping;faceTexture.repeat.set(3,3);return faceTexture;
}
export function graphiteBodyMaterial(color=0x272923){
 return new THREE.MeshStandardMaterial({color,roughness:.48,metalness:.25,envMapIntensity:.65});
}
export function graphiteFaceMaterial(color=0x20231c){
 return new THREE.MeshStandardMaterial({color,metalness:.08,roughness:.73,bumpMap:graphiteTexture(),bumpScale:.018,envMapIntensity:.4});
}
export function graphitePanelMaterial(body,muted){
 return graphiteFaceMaterial(new THREE.Color(body).lerp(new THREE.Color(muted),.07));
}
export function businessIcon(kind, mat=accentMaterial(), theme={}, customContours, symbolRotation=0){
 mat=mat.clone();
 const group=new THREE.Group();
 const rimMaterial=new THREE.MeshPhysicalMaterial({color:0x8c9f55,metalness:.65,roughness:.29,clearcoat:.2,envMapIntensity:.65});
 const faceMaterial=graphiteFaceMaterial(theme.face);
 const outer=new THREE.Mesh(rounded(1.16,1.16,.22,.23),rimMaterial);outer.castShadow=true;outer.receiveShadow=true;group.add(outer);
 const inset=new THREE.Mesh(rounded(1.095,1.095,.12,.205),faceMaterial);inset.position.z=.112;inset.castShadow=true;inset.receiveShadow=true;group.add(inset);
 const symbol=new THREE.Group();symbol.position.z=.225;symbol.rotation.z=symbolRotation;group.add(symbol);
 function add(shape,depth=.115,bevel=.025,z=0){const m=new THREE.Mesh(extrude(shape,depth,bevel,.008),mat);m.position.z=z;m.castShadow=true;m.receiveShadow=true;symbol.add(m);return m;}
 if(kind==='idea'){
  const bulb=new THREE.Shape();bulb.moveTo(-.14,-.19);bulb.bezierCurveTo(-.16,-.04,-.29,.01,-.29,.18);bulb.bezierCurveTo(-.29,.53,.29,.53,.29,.18);bulb.bezierCurveTo(.29,.01,.16,-.04,.14,-.19);bulb.closePath();add(bulb);
  const base=new THREE.Mesh(rounded(.265,.085,.115,.025),mat);base.position.y=-.265;symbol.add(base);const cap=new THREE.Mesh(rounded(.18,.06,.105,.025),mat);cap.position.y=-.355;symbol.add(cap);
  // Raised detail carries a real shadow, rather than a decal or a cutout.
  const filament=add(polygon([[-.13,.17],[-.085,.2],[0,.07],[.085,.2],[.13,.17],[.035,.025],[.035,-.105],[-.035,-.105],[-.035,.025]]),.035,.008,.07);filament.material=new THREE.MeshStandardMaterial({color:0x71813e,metalness:.3,roughness:.35});
 }
 if(kind==='explore'){
  const lens=new THREE.Shape();lens.absarc(-.085,.095,.285,0,Math.PI*2,false);add(lens,.13,.03);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(.225,.038,12,64),mat);ring.position.set(-.085,.095,.085);ring.castShadow=true;symbol.add(ring);
  const glass=new THREE.Mesh(new THREE.CircleGeometry(.18,64),new THREE.MeshPhysicalMaterial({color:0x303b21,metalness:.2,roughness:.22,clearcoat:.5}));glass.position.set(-.085,.095,.087);symbol.add(glass);
  const handle=new THREE.Mesh(rounded(.15,.38,.13,.065),mat);handle.position.set(.205,-.235,-.002);handle.rotation.z=Math.PI/4;handle.castShadow=true;symbol.add(handle);
 }
 if(kind==='validate'){
  const shield=new THREE.Shape();shield.moveTo(-.31,.31);shield.quadraticCurveTo(0,.44,.31,.31);shield.lineTo(.29,-.04);shield.quadraticCurveTo(.25,-.27,0,-.40);shield.quadraticCurveTo(-.25,-.27,-.29,-.04);shield.closePath();add(shield,.13,.035);
  const check=add(polygon([[-.19,.035],[-.135,.09],[-.035,-.015],[.16,.18],[.215,.12],[-.035,-.15],[-.085,-.15]]),.055,.014,.087);check.material=new THREE.MeshStandardMaterial({color:0x333f24,metalness:.15,roughness:.38});
 }
 if(kind==='build'){
  const top=polygon([[0,.4],[.34,.205],[0,.01],[-.34,.205]]);add(top,.12,.024,.025);
  const left=add(polygon([[-.34,.16],[-.025,-.025],[-.025,-.39],[-.34,-.20]]),.12,.02);left.material=new THREE.MeshPhysicalMaterial({color:0x98ad59,metalness:.3,roughness:.32,clearcoat:.25});
  const right=add(polygon([[.025,-.025],[.34,.16],[.34,-.20],[.025,-.39]]),.12,.02);right.material=new THREE.MeshPhysicalMaterial({color:0x7c9147,metalness:.3,roughness:.32,clearcoat:.25});
 }
 const contours=customContours ?? silhouettes[kind];
 if(contours){
  const convert=points=>points.map(([x,y])=>[(x-12)*.038,(12-y)*.038]);
  for(const {outline,holes=[]} of contours){
   const points=convert(outline).map(([x,y])=>new THREE.Vector2(x,y));
   if(!THREE.ShapeUtils.isClockWise(points))points.reverse();
   const shape=polygon(points.map(point=>point.toArray()));
   shape.holes=holes.map(hole=>{
    const points=convert(hole).map(([x,y])=>new THREE.Vector2(x,y));
    if(THREE.ShapeUtils.isClockWise(points))points.reverse();
    return polygon(points.map(point=>point.toArray()));
   });
   add(shape,.105,.011);
  }
 }
 const symbolMaterials=new Map();
 const mutedColors=new Map([[0xb3c66f,0xd6d4c9],[0x98ad59,0xbab9ae],[0x7c9147,0xa2a397],[0x71813e,0x77776b],[0x303b21,0x34362f],[0x333f24,0x33352f]]);
 symbol.traverse(mesh=>{if(mesh.material&&!symbolMaterials.has(mesh.material)){const highlighted=mesh.material.color.clone();symbolMaterials.set(mesh.material,{highlighted,muted:new THREE.Color(mutedColors.get(highlighted.getHex())??0xd6d4c9)});}});
 const idleRim=new THREE.Color(0x414338),selectedRim=new THREE.Color(0x8c9f55);
 const accent=new THREE.Color(theme.accent ?? lime);
 const muted=new THREE.Color(theme.muted ?? 0xd6d4c9);
 const referenceAccent=new THREE.Color(lime);
 const referenceMuted=new THREE.Color(0xd6d4c9);
 for(const colors of symbolMaterials.values()){
  colors.highlighted.multiply(accent);
  colors.highlighted.r/=referenceAccent.r;
  colors.highlighted.g/=referenceAccent.g;
  colors.highlighted.b/=referenceAccent.b;
  colors.muted.r*=muted.r/referenceMuted.r;
  colors.muted.g*=muted.g/referenceMuted.g;
  colors.muted.b*=muted.b/referenceMuted.b;
 }
 if(accent.getHex()!==lime)selectedRim.copy(idleRim).lerp(accent,.60);
 group.userData.setSelection=amount=>{
  const t=THREE.MathUtils.clamp(amount,0,1);
  rimMaterial.color.copy(idleRim).lerp(selectedRim,t);
  for(const [material,colors] of symbolMaterials)material.color.copy(colors.muted).lerp(colors.highlighted,t);
  rimMaterial.metalness=THREE.MathUtils.lerp(.18,.65,t);
  rimMaterial.roughness=THREE.MathUtils.lerp(.66,.29,t);
  rimMaterial.envMapIntensity=THREE.MathUtils.lerp(.25,.65,t);
  group.userData.selection=t;
 };
 group.userData.setSelection(1);
 return group;
}
export function reflectionEnvironment(renderer){
 const studio=new THREE.Scene();studio.background=new THREE.Color().setRGB(.012,.014,.01);
 const specs=[{p:[-2.7,0,7],s:[3,5],v:.85},{p:[-4,5,5],s:[3,7],v:5},{p:[5,2,1],s:[.8,6],v:3},{p:[0,7,-2],s:[5,3],v:2},{p:[-3,-2,4],s:[1.2,4],v:1.1}];
 for(const spec of specs){const material=new THREE.MeshBasicMaterial({side:THREE.DoubleSide,toneMapped:false});material.color.setRGB(spec.v,spec.v,spec.v*.94);const panel=new THREE.Mesh(new THREE.PlaneGeometry(...spec.s),material);panel.position.set(...spec.p);panel.lookAt(0,0,0);studio.add(panel);}
 const pmrem=new THREE.PMREMGenerator(renderer);const target=pmrem.fromScene(studio,.015,.1,100);pmrem.dispose();
 for(const panel of studio.children){panel.geometry.dispose();panel.material.dispose();}
 return target;
}
