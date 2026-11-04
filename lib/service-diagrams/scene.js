import { iconNames } from './icons.js';
import { boardForms } from './board.js';

export const defaultTheme = Object.freeze({
  background:'#151611', body:'#272923', face:'#20231c', muted:'#d6d4c9', accent:'#b3c66f'
});

const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}
function number(value, min, max, name) {
  requireValue(Number.isFinite(value) && value >= min && value <= max, `${name} must be a number between ${min} and ${max}.`);
  return value;
}
function string(value, max, name) {
  requireValue(typeof value === 'string' && value.trim().length > 0 && value.length <= max,
    `${name} must be text of 1–${max} characters.`);
  return value.trim();
}
function list(value, max, name) {
  requireValue(Array.isArray(value) && value.length <= max, `${name} must be an array with at most ${max} entries.`);
  return value;
}
function references(value, index, name) {
  const ids = list(value, index.size, name);
  requireValue(ids.every(id => index.has(id)), `${name} contains an unknown ID.`);
  requireValue(new Set(ids).size === ids.length, `${name} contains a repeated ID.`);
  return [...ids];
}
function contour(points, name) {
  list(points, 96, name);
  requireValue(points.length >= 3, `${name} needs at least three points.`);
  const polygon = points.map(point => {
    requireValue(Array.isArray(point) && point.length === 2, `${name} points must be [x, y] pairs.`);
    return point.map(axis => number(axis, 0, 24, name));
  });
  const area = polygon.reduce((sum, [x,y], i) => {
    const [nextX,nextY] = polygon[(i+1)%polygon.length];
    return sum + x*nextY - y*nextX;
  }, 0);
  requireValue(Math.abs(area) > .01, `${name} must enclose an area.`);
  return polygon;
}

export function normalizeScene(input) {
  requireValue(record(input), 'A scene must be a JSON object.');
  const title = string(input.title, 80, 'title');
  const description = input.description === undefined ? '' : string(input.description, 300, 'description');
  let board;
  if(input.board!==undefined) {
    requireValue(record(input.board),'board must be an object.');
    board={
      x:number(input.board.x ?? 0,-30,30,'board.x'),
      z:number(input.board.z ?? 0,-30,30,'board.z'),
      width:number(input.board.width,1,20,'board.width'),
      depth:number(input.board.depth,1,20,'board.depth')
    };
  }
  const nodesById = new Map();
  const nodes = list(input.nodes, 24, 'nodes').map((node, i) => {
    const name = `Node ${i+1}`;
    requireValue(record(node), `${name} must be an object.`);
    const id = string(node.id, 48, `${name} id`);
    requireValue(!nodesById.has(id), `Duplicate node ID “${id}”.`);
    const label = string(node.label, 34, `${name} label`);
    const icon = node.icon === undefined ? 'build' : node.icon;
    let contours;
    if (record(icon)) {
      contours = list(icon.contours, 12, `${name} icon contours`).map((part, j) => {
        const key = `${name} icon contour ${j+1}`;
        requireValue(record(part), `${key} must be an object.`);
        return {
          outline:contour(part.outline,key),
          holes:list(part.holes ?? [],6,`${key} holes`).map(hole=>contour(hole,`${key} hole`))
        };
      });
      requireValue(contours.length, `${name} needs at least one icon contour.`);
    } else requireValue(iconNames.includes(icon), `${name} has an unknown icon. Use ${iconNames.join(', ')} or custom contours.`);
    const labelSide=node.labelSide ?? 'front';
    requireValue(['front','above'].includes(labelSide), `${name} labelSide must be “front” or “above”.`);
    if(board) requireValue(typeof node.form==='string' && Object.hasOwn(boardForms,node.form),`${name} needs a board form.`);
    const normalized = {id,label,labelSide,form:board ? node.form : undefined,icon:contours ? null : icon,contours,
      x:number(node.x === undefined ? (i-(input.nodes.length-1)/2)*2.15 : node.x,-30,30,`${name} x`),
      z:number(node.z === undefined ? 0 : node.z,-30,30,`${name} z`),
      height:number(node.height === undefined ? .75 : node.height,.25,6,`${name} height`)};
    nodesById.set(id, normalized);
    return normalized;
  });
  requireValue(nodes.length > 0, 'Add at least one node.');
  const edgesById = new Map();
  const edges = list(input.edges === undefined ? [] : input.edges, 48, 'edges').map((edge, i) => {
    requireValue(record(edge), `Edge ${i+1} must be an object.`);
    const id = string(edge.id, 48, `Edge ${i+1} id`);
    requireValue(!edgesById.has(id), `Duplicate edge ID “${id}”.`);
    requireValue(nodesById.has(edge.from) && nodesById.has(edge.to), `Edge “${id}” needs two existing node IDs.`);
    requireValue(edge.from !== edge.to, `Edge “${id}” must connect different nodes.`);
    const via=list(edge.via ?? [],6,`Edge “${id}” via`).map(point=>{
      requireValue(Array.isArray(point) && point.length===2,`Edge “${id}” waypoints must be [x, z] pairs.`);
      return point.map(axis=>number(axis,-30,30,`Edge “${id}” waypoint`));
    });
    const normalized = {id,from:edge.from,to:edge.to,via,
      lift:number(edge.lift === undefined ? .32 : edge.lift,0,5,`Edge “${id}” lift`),
      bend:number(edge.bend === undefined ? 0 : edge.bend,-6,6,`Edge “${id}” bend`)};
    edgesById.set(id,normalized);
    return normalized;
  });
  const theme = {...defaultTheme};
  if (input.theme !== undefined) {
    requireValue(record(input.theme), 'theme must be an object.');
    for (const key of Object.keys(theme)) {
      if (!Object.hasOwn(input.theme,key)) continue;
      const hex = input.theme[key];
      requireValue(typeof hex === 'string' && /^#[\da-f]{6}$/i.test(hex), `theme.${key} must be a six-digit hex color.`);
      theme[key] = hex;
    }
  }
  const start = references(input.start === undefined ? (edges.length ? [edges[0].from] : nodes.map(node=>node.id)) : input.start, nodesById, 'start');
  const rawBeats = input.beats === undefined ? edges.map(edge=>({edges:[edge.id]})) : list(input.beats,48,'beats');
  const beats = rawBeats.map((beat, i) => {
    const name = `Beat ${i+1}`;
    requireValue(record(beat), `${name} must be an object.`);
    const ids = references(beat.edges === undefined ? [] : beat.edges,edgesById,`${name} edges`);
    const active = references(beat.active === undefined ? [...new Set(ids.map(id=>edgesById.get(id).to))] : beat.active,
      nodesById,`${name} active nodes`);
    return {edges:ids,active,seconds:number(beat.seconds === undefined ? .9 : beat.seconds,.15,15,`${name} seconds`)};
  });
  const intro = number(input.intro === undefined ? .45 : input.intro,0,15,'intro');
  const outro = number(input.outro === undefined ? 1.05 : input.outro,0,15,'outro');
  const projection=input.projection ?? 'perspective';
  requireValue(['perspective','isometric'].includes(projection),'projection must be “perspective” or “isometric”.');
  const blockFinish=input.blockFinish ?? 'graphite';
  requireValue(['graphite','panel'].includes(blockFinish),'blockFinish must be “graphite” or “panel”.');
  const cameraMotion=input.cameraMotion ?? 'journey';
  requireValue(['journey','fixed'].includes(cameraMotion),'cameraMotion must be “journey” or “fixed”.');
  const figure=input.figure;
  requireValue(figure===undefined || (['prototype','token-stack'].includes(figure) && projection==='isometric' && !board),
    'A reference figure needs isometric projection and its own composition.');
  if (figure==='token-stack') {
    requireValue(['tokens','components','pages','system','agent','human'].every(id=>nodesById.has(id)),
      'The token stack needs Tokens, Components, Pages, System, Agent, and Human stages.');
  }
  return {title,description,nodes,edges,theme,start,beats,intro,outro,projection,board,figure,blockFinish,cameraMotion};
}

export const clamp = x => Math.max(0,Math.min(1,x));
export const smooth = x => {
  const t=clamp(x);
  return t*t*t*(t*(t*6-15)+10);
};

export function actionTileLift(time,arrivalAt) {
  return smooth((time-arrivalAt)/.22);
}

export function createTimeline(scene) {
  let end=scene.intro;
  const arrivals=new Map();
  const beats=scene.beats.map(beat=>{
    const start=end;
    end+=beat.seconds;
    for (const id of beat.edges) if (!arrivals.has(id)) arrivals.set(id,end);
    return {...beat,start,end};
  });
  const duration=end+scene.outro;
  function sample(seconds) {
    const time=Math.max(0,Math.min(seconds,duration));
    const levels=new Map();
    const traces=new Map();
    let signals=[];
    let active=scene.start;
    for (const beat of beats) {
      if (time < beat.start) break;
      const progress=clamp((time-beat.start)/(beat.end-beat.start));
      for (const id of beat.edges) traces.set(id,Math.max(traces.get(id) ?? 0,progress));
      if (time < beat.end) {
        const fade=smooth((progress-.8)/.2);
        active.forEach(id=>levels.set(id,1-fade));
        beat.active.forEach(id=>levels.set(id,(levels.get(id) ?? 0)+fade));
        if (progress > 0) signals=beat.edges.map(id=>({id,progress}));
        return {levels,traces,signals,camera:smooth((time-scene.intro)/(duration-scene.intro || 1))};
      }
      active=beat.active;
    }
    active.forEach(id=>levels.set(id,1));
    return {levels,traces,signals,camera:time>=duration ? 1 : smooth((time-scene.intro)/(duration-scene.intro || 1))};
  }
  return {duration,sample,arrivals};
}
