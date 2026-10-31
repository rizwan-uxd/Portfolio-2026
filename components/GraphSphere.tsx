"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import { graphLinks, graphNodes, neighbours, nodeById, type GraphNode } from "@/lib/graph";

export type SphereView = {
  hidden: Set<string>; // categories switched off
  selected: string | null;
  matches: Set<string> | null; // search matches
  path: string[] | null; // traced path
};
export type SphereHandle = { reset: () => void; zoomBy: (factor: number) => void };

// Lines are drawn as thin screen-space quads, so they can have a soft glow. WebGL line width is stuck at one pixel.
const LINE_VS = `
attribute vec3 aA, aB;
attribute vec2 aMeta;
attribute float aAlong;
attribute vec4 aColor;
attribute vec2 aStyle;
uniform mat3 uRot;
uniform vec2 uScale, uRes;
uniform float uDist, uDpr, uWidth;
varying vec4 vColor;
varying float vSide, vAlong, vDash, vDepth;
vec2 project(vec3 p, out float z) {
  vec3 v = uRot * p;
  z = v.z;
  return v.xy / (uDist - v.z) * uScale;
}
void main() {
  float za, zb;
  vec2 a = project(aA, za), b = project(aB, zb);
  vec2 dir = normalize((b - a) * uRes + 1e-5);
  vec2 normal = vec2(-dir.y, dir.x);
  vec2 p = mix(a, b, aMeta.y) + normal * aMeta.x * aStyle.x * uWidth * uDpr / uRes * 2.0;
  gl_Position = vec4(p, 0.0, 1.0);
  vColor = aColor;
  vSide = aMeta.x;
  vAlong = aAlong;
  vDash = aStyle.y;
  vDepth = (mix(za, zb, aMeta.y) + 1.0) * 0.5;
}`;

const LINE_FS = `
precision highp float;
uniform float uTime, uFade;
varying vec4 vColor;
varying float vSide, vAlong, vDash, vDepth;
void main() {
  float edge = 1.0 - abs(vSide);
  float a = edge * edge * vColor.a * mix(0.32, 1.0, vDepth) * uFade;
  if (vDash > 0.5) {
    float flow = vDash > 1.5 ? uTime * 0.6 : 0.0;
    a *= step(fract(vAlong * 22.0 - flow * 22.0 * 0.25), 0.55);
  }
  vec3 c = mix(vColor.rgb, vec3(1.0), edge * edge * edge * 0.12);
  gl_FragColor = vec4(c * a, a);
}`;

const POINT_VS = `
attribute vec3 aPos;
attribute vec4 aColor;
attribute float aSize;
uniform mat3 uRot;
uniform vec2 uScale;
uniform float uDist, uDpr, uSizeScale;
varying vec4 vColor;
void main() {
  vec3 v = uRot * aPos;
  float s = 1.0 / (uDist - v.z);
  gl_Position = vec4(v.xy * s * uScale, 0.0, 1.0);
  gl_PointSize = aSize * uDpr * uSizeScale * s * uDist * 0.82;
  vColor = vec4(aColor.rgb, aColor.a * mix(0.3, 1.0, (v.z + 1.0) * 0.5));
}`;

const POINT_FS = `
precision highp float;
uniform float uFade;
varying vec4 vColor;
void main() {
  float r = length(gl_PointCoord - 0.5) * 2.0;
  if (r > 1.0) discard;
  vec2 q = abs(gl_PointCoord - 0.5) * 2.0;
  float core = smoothstep(0.24, 0.12, r);
  float halo = pow(1.0 - r, 2.2) * 1.1;
  float spike = (exp(-q.x * 24.0 - q.y * 3.6) + exp(-q.y * 24.0 - q.x * 3.6)) * 0.8;
  float a = (core + halo + spike) * vColor.a * uFade;
  vec3 c = mix(vColor.rgb, vec3(1.0), core * 0.55);
  gl_FragColor = vec4(c * a, a);
}`;

const CAMERA = 3.4; // camera distance, in sphere radii
const FOCAL = 2.72;
const ZOOM_MIN = 0.7;
const ZOOM_MAX = 2.6;
const AUTO_SPIN = 0.07; // radians per second
const START = { yaw: 0.5, pitch: 0.22 };
const SIZES: Record<GraphNode["kind"], number> = { root: 70, hub: 58, leaf: 36 };
const ARC_SEGMENTS = 10;

const hexToRgb = (value: string) => {
  let hex = value.trim().replace("#", "");
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
};

function compile(gl: WebGLRenderingContext, vs: string, fs: string) {
  const program = gl.createProgram()!;
  for (const [type, source] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  return program;
}

// The wire shell: an icosphere subdivided a few times, so its edges form the faceted lattice around the data.
function icosphere(depth: number) {
  const t = (1 + Math.sqrt(5)) / 2;
  let verts = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]];
  let faces = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  const unit = (v: number[]) => {
    const l = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / l, v[1] / l, v[2] / l];
  };
  verts = verts.map(unit);
  for (let d = 0; d < depth; d++) {
    const mids = new Map<string, number>();
    const mid = (a: number, b: number) => {
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      if (!mids.has(key)) {
        mids.set(key, verts.length);
        verts.push(unit(verts[a].map((v, i) => (v + verts[b][i]) / 2)));
      }
      return mids.get(key)!;
    };
    faces = faces.flatMap(([a, b, c]) => {
      const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a);
      return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]];
    });
  }
  const edges = new Set<string>();
  for (const [a, b, c] of faces) for (const [p, q] of [[a, b], [b, c], [c, a]]) edges.add(p < q ? `${p}_${q}` : `${q}_${p}`);
  return { verts, edges: [...edges].map((e) => e.split("_").map(Number) as [number, number]) };
}

// Decorative structure around the data, from Riz's sphere references: a coarse bright shell, an irregular web
// between extra points on the surface, violet lines running in towards the core, and short rays leaving the rim.
function sphereStructure(cyan: number[], blue: number[], violet: number[]) {
  let seed = 11;
  const random = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const randomUnit = () => {
    const y = random() * 2 - 1, a = random() * Math.PI * 2, ring = Math.sqrt(1 - y * y);
    return [Math.cos(a) * ring, y, Math.sin(a) * ring];
  };
  const tint = (v: number[]) => {
    const t = Math.sin(v[1] * 2.6 + v[0] * 1.7) * 0.5 + 0.5;
    return cyan.map((c, i) => c + (blue[i] - c) * t);
  };
  const shell = icosphere(1);
  const webPoints = [...shell.verts, ...Array.from({ length: 64 }, randomUnit)];
  const distance = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  type Segment = { a: number[]; b: number[]; rgb: number[]; from: number; to: number; width: number };
  const segments: Segment[] = shell.edges.map(([p, q]) => ({ a: shell.verts[p], b: shell.verts[q], rgb: tint(shell.verts[p]), from: 0.62, to: 0.62, width: 1.5 }));
  webPoints.forEach((p, i) => {
    const nearest = webPoints.map((q, j) => ({ j, d: distance(p, q) })).filter(({ j }) => j !== i).sort((a, b) => a.d - b.d).slice(2, 5);
    for (const { j } of nearest) if (j > i) segments.push({ a: p, b: webPoints[j], rgb: tint(p), from: 0.3, to: 0.3, width: 1 });
  });
  for (const v of shell.verts) segments.push({ a: v, b: v.map((c) => c * 0.2), rgb: violet, from: 0.26, to: 0.72, width: 1.2 });
  for (let i = 0; i < 26; i++) {
    const v = randomUnit();
    segments.push({ a: v, b: v.map((c) => c * 0.3), rgb: violet, from: 0.1, to: 0.5, width: 0.9 });
  }
  for (let i = 0; i < 80; i++) {
    const v = randomUnit();
    segments.push({ a: v, b: v.map((c) => c * (1.05 + random() * 0.14)), rgb: tint(v), from: 0.55, to: 0, width: 0.8 });
  }
  const points = webPoints.map((v, i) => ({ v, rgb: tint(v), size: i < shell.verts.length ? 19 : 11 + random() * 6, alpha: i < shell.verts.length ? 0.95 : 0.8 }));
  return { segments, points };
}

type Props = {
  view: SphereView;
  onSelect: (id: string | null) => void;
  ref?: Ref<SphereHandle>;
};

export function GraphSphere({ view, onSelect, ref }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewRef = useRef(view);
  const onSelectRef = useRef(onSelect);
  const handleRef = useRef<SphereHandle & { refresh: () => void } | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => handleRef.current?.reset(),
    zoomBy: (factor) => handleRef.current?.zoomBy(factor),
  }), []);

  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => {
    viewRef.current = view;
    handleRef.current?.refresh();
  }, [view]);

  useEffect(() => {
    const stage = stageRef.current!;
    const canvas = canvasRef.current!;
    const labels = new Map<string, HTMLElement>();
    stage.querySelectorAll<HTMLElement>("[data-node]").forEach((el) => labels.set(el.dataset.node!, el));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(stage);
    const color = (name: string) => hexToRgb(css.getPropertyValue(name));
    const palette = {
      brand: color("--brand"),
      violet: color("--graph-impact"),
      cyan: color("--graph-tools"),
      blue: color("--graph-companies"),
      root: color("--foreground"),
    };
    const catColor = (cat: string) => (cat === "root" ? palette.root : color(`--graph-${cat}`));

    const nodes = graphNodes;
    const index = new Map(nodes.map((n, i) => [n.id, i]));
    const positions = new Float32Array(nodes.length * 3);
    const placeNodes = () => nodes.forEach((n, i) => {
      positions[i * 3] = n.kind === "root" ? 0 : n.x;
      positions[i * 3 + 1] = n.kind === "root" ? 0 : n.y;
      positions[i * 3 + 2] = n.kind === "root" ? 0 : n.z;
    });
    placeNodes();

    // ---- Link geometry: arcs along the surface for structure, straight chords through the sphere for spokes and cross-links
    const links = graphLinks.map((l) => {
      const segments = l.kind === "structure" ? ARC_SEGMENTS : 1;
      return { ...l, ia: index.get(l.a)!, ib: index.get(l.b)!, segments, start: 0 };
    });
    let quadCount = 0;
    links.forEach((l) => { l.start = quadCount; quadCount += l.segments; });

    const GEOM = 9; // aA, aB, aMeta, aAlong
    const STYLE = 6; // aColor, aStyle
    const linkGeom = new Float32Array(quadCount * 4 * GEOM);
    const linkStyle = new Float32Array(quadCount * 4 * STYLE);

    const writeQuad = (target: Float32Array, q: number, a: number[], b: number[], along0: number, along1: number) => {
      const corners = [[-1, 0, along0], [1, 0, along0], [-1, 1, along1], [1, 1, along1]];
      corners.forEach(([side, end, along], c) => {
        const o = (q * 4 + c) * GEOM;
        target[o] = a[0]; target[o + 1] = a[1]; target[o + 2] = a[2];
        target[o + 3] = b[0]; target[o + 4] = b[1]; target[o + 5] = b[2];
        target[o + 6] = side; target[o + 7] = end; target[o + 8] = along;
      });
    };
    const pointAt = (i: number) => [positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]];
    const writeLink = (l: typeof links[number]) => {
      const a = pointAt(l.ia), b = pointAt(l.ib);
      if (l.segments === 1) {
        writeQuad(linkGeom, l.start, a, b, 0, Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]));
        return;
      }
      const angle = Math.acos(Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
      const sin = Math.sin(angle) || 1;
      const at = (t: number) => {
        const f = Math.sin((1 - t) * angle) / sin, g = Math.sin(t * angle) / sin;
        return [a[0] * f + b[0] * g, a[1] * f + b[1] * g, a[2] * f + b[2] * g];
      };
      for (let s = 0; s < l.segments; s++) {
        const t0 = s / l.segments, t1 = (s + 1) / l.segments;
        writeQuad(linkGeom, l.start + s, at(t0), at(t1), t0 * angle, t1 * angle);
      }
    };
    links.forEach(writeLink);

    const quadIndices = (quads: number) => {
      const out = new Uint16Array(quads * 6);
      for (let q = 0; q < quads; q++) out.set([q * 4, q * 4 + 1, q * 4 + 2, q * 4 + 2, q * 4 + 1, q * 4 + 3], q * 6);
      return out;
    };

    // ---- Wire shell
    const structure = sphereStructure(palette.cyan, palette.blue, palette.violet);
    const shellGeom = new Float32Array(structure.segments.length * 4 * GEOM);
    const shellStyle = new Float32Array(structure.segments.length * 4 * STYLE);
    const shellPoints = new Float32Array(structure.points.length * 8);
    structure.segments.forEach(({ a, b, rgb, from, to, width }, e) => {
      writeQuad(shellGeom, e, a, b, 0, 0);
      [from, from, to, to].forEach((alpha, c) => shellStyle.set([rgb[0], rgb[1], rgb[2], alpha, width, 0], (e * 4 + c) * STYLE));
    });
    structure.points.forEach(({ v, rgb, size, alpha }, i) => shellPoints.set([v[0], v[1], v[2], rgb[0], rgb[1], rgb[2], alpha, size], i * 8));

    // ---- Animated state per node and link
    const nodeState = nodes.map((n) => ({ a: 1, ta: 1, s: 1, ts: 1, rgb: catColor(n.cat), size: SIZES[n.kind] }));
    const nodePoints = new Float32Array(nodes.length * 8);
    const linkState = links.map((l) => {
      const other = nodes[l.ib];
      const rgb = l.kind === "structure" ? catColor(other.cat) : palette.violet;
      const base = l.kind === "structure" ? { a: 0.6, w: 1.4, dash: 0 } : l.kind === "spoke" ? { a: 0.7, w: 1.6, dash: 0 } : { a: 0.62, w: 1.3, dash: 1 };
      return { rgb: [...rgb], a: base.a, w: base.w, dash: base.dash, base: { rgb, ...base }, t: { rgb: [...rgb], a: base.a, w: base.w } };
    });

    let hover: string | null = null;
    let settling = 2;

    const refresh = () => {
      const { hidden, selected, matches, path } = viewRef.current;
      const active = hover ?? selected;
      const pathSet = path ? new Set(path) : null;
      const pathEdges = new Set<string>();
      path?.forEach((id, i) => { if (i) pathEdges.add([id, path[i - 1]].sort().join("|")); });
      const focus = pathSet ?? (active ? new Set([active, ...neighbours(active)]) : matches);
      const isHidden = (n: GraphNode) => n.kind !== "root" && hidden.has(n.cat);

      nodes.forEach((n, i) => {
        const s = nodeState[i];
        s.ta = isHidden(n) ? 0 : focus ? (focus.has(n.id) ? 1 : 0.1) : 1;
        s.ts = n.id === active || pathSet?.has(n.id) ? 1.4 : 1;
      });
      links.forEach((l, i) => {
        const s = linkState[i];
        const a = nodes[l.ia], b = nodes[l.ib];
        s.dash = s.base.dash;
        s.t.rgb = s.base.rgb;
        s.t.a = isHidden(a) || isHidden(b) ? 0 : s.base.a;
        s.t.w = s.base.w;
        if (s.t.a === 0 || !focus) return;
        if (pathSet) {
          if (pathEdges.has([a.id, b.id].sort().join("|"))) {
            s.t.rgb = palette.brand; s.t.a = 1; s.t.w = 3.2; s.dash = 2;
          } else s.t.a = 0.05;
        } else if (active && (a.id === active || b.id === active)) {
          s.t.rgb = catColor((a.id === active ? b : a).cat); s.t.a = 0.95; s.t.w = 2.4;
        } else s.t.a = active || !focus.has(a.id) || !focus.has(b.id) ? 0.05 : s.base.a;
      });
      settling = 60;
    };

    // ---- Camera
    let yaw = START.yaw, pitch = START.pitch;
    let flyYaw: number | null = null, flyPitch = 0;
    let spinVel = 0, tiltVel = 0;
    let zoom = 1, zoomTarget = 1;
    let w = 1, h = 1, dpr = 1;
    let rot = new Float32Array(9);
    const scale = [1, 1];
    const updateCamera = () => {
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      // Column-major: x' = cy x + sy z; y' = sp sy x + cp y - sp cy z; z' = -cp sy x + sp y + cp cy z
      rot = new Float32Array([cy, sp * sy, -cp * sy, 0, cp, sp, sy, -sp * cy, cp * cy]);
      const u = Math.min(w, h) / 2;
      scale[0] = (FOCAL * zoom * u) / (w / 2);
      scale[1] = (FOCAL * zoom * u) / (h / 2);
    };
    const flyTo = (ids: string[]) => {
      const pts = ids.filter((id) => nodeById.get(id)!.kind !== "root").map((id) => pointAt(index.get(id)!));
      if (!pts.length) return;
      const c = [0, 1, 2].map((k) => pts.reduce((sum, p) => sum + p[k], 0));
      const l = Math.hypot(c[0], c[1], c[2]) || 1;
      const [x, y, z] = c.map((v) => v / l);
      const nextYaw = Math.atan2(-x, z);
      const nextPitch = Math.max(-1.3, Math.min(1.3, Math.atan2(y, Math.hypot(x, z))));
      flyYaw = yaw + (((nextYaw - yaw + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
      flyPitch = nextPitch;
      spinVel = tiltVel = 0;
      if (reduced) {
        yaw = flyYaw; pitch = flyPitch; flyYaw = null;
      }
    };

    // ---- Projection, for picking and labels
    const screen = nodes.map(() => ({ x: 0, y: 0, z: 0, r: 0 }));
    const project = () => {
      const u = Math.min(w, h) / 2;
      nodes.forEach((n, i) => {
        const [x, y, z] = pointAt(i);
        const vx = rot[0] * x + rot[3] * y + rot[6] * z;
        const vy = rot[1] * x + rot[4] * y + rot[7] * z;
        const vz = rot[2] * x + rot[5] * y + rot[8] * z;
        const s = (FOCAL * zoom * u) / (CAMERA - vz);
        const out = screen[i];
        out.x = w / 2 + vx * s;
        out.y = h / 2 - vy * s;
        out.z = n.kind === "root" ? 0 : vz;
        out.r = (nodeState[i].size * 0.2 * Math.sqrt(zoom) * CAMERA) / (CAMERA - vz);
      });
    };
    const pick = (x: number, y: number) => {
      let best = -1, bestScore = Infinity;
      nodes.forEach((n, i) => {
        if (nodeState[i].ta <= 0.01) return;
        const s = screen[i];
        const d = Math.hypot(s.x - x, s.y - y);
        if (d > s.r + 7) return;
        const score = d - s.z * 12 + (n.kind === "root" ? 8 : 0);
        if (score < bestScore) { bestScore = score; best = i; }
      });
      return best;
    };

    // ---- Labels. Front-most and most important win; the rest stay hidden until there's room.
    let labelTick = 0;
    const shown = new Set<string>();
    const widths = new Map<string, number>();
    const declutter = () => {
      const { selected, path } = viewRef.current;
      const active = hover ?? selected;
      const pinned = new Set(path ?? (active ? [active, ...neighbours(active)] : []));
      const order = nodes.map((n, i) => ({ n, i, rank: (pinned.has(n.id) ? 1000 : 0) + (n.kind !== "leaf" ? 100 : 0) + screen[i].z * 10 })).sort((a, b) => b.rank - a.rank);
      const placed: number[][] = [];
      shown.clear();
      for (const { n, i } of order) {
        const s = screen[i];
        const pin = pinned.has(n.id);
        if (nodeState[i].ta < 0.5 || (!pin && n.kind !== "root" && s.z < 0.05)) continue;
        const el = labels.get(n.id);
        if (!el) continue;
        if (!widths.has(n.id)) widths.set(n.id, el.offsetWidth);
        const lw = widths.get(n.id)! + 6, lh = 14, top = s.y + s.r + 2;
        const box = [s.x - lw / 2, top, s.x + lw / 2, top + lh];
        if (!pin && placed.some((p) => box[0] < p[2] && box[2] > p[0] && box[1] < p[3] && box[3] > p[1])) continue;
        placed.push(box);
        shown.add(n.id);
      }
      labels.forEach((el, id) => {
        const on = shown.has(id);
        if (el.dataset.on !== String(on)) {
          el.dataset.on = String(on);
          el.style.opacity = on ? "1" : "0";
        }
      });
    };
    const placeLabels = () => {
      nodes.forEach((n, i) => {
        const el = labels.get(n.id);
        if (el) el.style.transform = `translate3d(${screen[i].x.toFixed(1)}px, ${(screen[i].y + screen[i].r + 2).toFixed(1)}px, 0) translateX(-50%)`;
      });
    };

    // ---- GL setup
    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true });
    let draw = () => {};
    if (gl) {
      const lineProgram = compile(gl, LINE_VS, LINE_FS);
      const pointProgram = compile(gl, POINT_VS, POINT_FS);
      const buffer = (data: BufferSource, target: number = gl.ARRAY_BUFFER, usage: number = gl.STATIC_DRAW) => {
        const b = gl.createBuffer();
        gl.bindBuffer(target, b);
        gl.bufferData(target, data, usage);
        return b;
      };
      const shellGeomBuf = buffer(shellGeom), shellStyleBuf = buffer(shellStyle), shellIndex = buffer(quadIndices(structure.segments.length), gl.ELEMENT_ARRAY_BUFFER);
      const linkGeomBuf = buffer(linkGeom, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW), linkStyleBuf = buffer(linkStyle, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW), linkIndex = buffer(quadIndices(quadCount), gl.ELEMENT_ARRAY_BUFFER);
      const shellPointBuf = buffer(shellPoints), nodePointBuf = buffer(nodePoints, gl.ARRAY_BUFFER, gl.DYNAMIC_DRAW);

      const attr = (program: WebGLProgram, name: string, size: number, stride: number, offset: number) => {
        const loc = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride * 4, offset * 4);
      };
      const uniforms = (program: WebGLProgram, time: number) => {
        gl.useProgram(program);
        const u = (n: string) => gl.getUniformLocation(program, n);
        gl.uniformMatrix3fv(u("uRot"), false, rot);
        gl.uniform2f(u("uScale"), scale[0], scale[1]);
        gl.uniform2f(u("uRes"), canvas.width, canvas.height);
        gl.uniform1f(u("uDist"), CAMERA);
        gl.uniform1f(u("uDpr"), dpr);
        gl.uniform1f(u("uTime"), time);
        gl.uniform1f(u("uSizeScale"), Math.sqrt(zoom));
      };
      const drawLines = (geom: WebGLBuffer | null, style: WebGLBuffer | null, indices: WebGLBuffer | null, count: number, fade: number) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, geom);
        attr(lineProgram, "aA", 3, GEOM, 0);
        attr(lineProgram, "aB", 3, GEOM, 3);
        attr(lineProgram, "aMeta", 2, GEOM, 6);
        attr(lineProgram, "aAlong", 1, GEOM, 8);
        gl.bindBuffer(gl.ARRAY_BUFFER, style);
        attr(lineProgram, "aColor", 4, STYLE, 0);
        attr(lineProgram, "aStyle", 2, STYLE, 4);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices);
        // A wide faint pass under a thin bright one reads as the line glowing
        for (const [width, strength] of [[5, 0.2], [1, 1]]) {
          gl.uniform1f(gl.getUniformLocation(lineProgram, "uWidth"), width);
          gl.uniform1f(gl.getUniformLocation(lineProgram, "uFade"), fade * strength);
          gl.drawElements(gl.TRIANGLES, count * 6, gl.UNSIGNED_SHORT, 0);
        }
      };
      const drawPoints = (buf: WebGLBuffer | null, count: number, fade: number) => {
        gl.uniform1f(gl.getUniformLocation(pointProgram, "uFade"), fade);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        attr(pointProgram, "aPos", 3, 8, 0);
        attr(pointProgram, "aColor", 4, 8, 3);
        attr(pointProgram, "aSize", 1, 8, 7);
        gl.drawArrays(gl.POINTS, 0, count);
      };

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);
      gl.clearColor(0, 0, 0, 0);

      draw = () => {
        const time = performance.now() / 1000;
        const pulse = 1 + Math.sin(time * 3) * 0.05;
        nodes.forEach((n, i) => {
          const s = nodeState[i];
          nodePoints.set([positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2], s.rgb[0], s.rgb[1], s.rgb[2], s.a, s.size * s.s * (s.ts > 1 ? pulse : 1)], i * 8);
        });
        gl.bindBuffer(gl.ARRAY_BUFFER, nodePointBuf);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, nodePoints);
        gl.bindBuffer(gl.ARRAY_BUFFER, linkGeomBuf);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, linkGeom);
        gl.bindBuffer(gl.ARRAY_BUFFER, linkStyleBuf);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, linkStyle);

        const v = viewRef.current;
        const dimmed = v.path || v.selected || hover || v.matches ? 0.22 : 1;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        uniforms(lineProgram, time);
        drawLines(shellGeomBuf, shellStyleBuf, shellIndex, structure.segments.length, dimmed);
        drawLines(linkGeomBuf, linkStyleBuf, linkIndex, quadCount, 1);
        uniforms(pointProgram, time);
        drawPoints(shellPointBuf, structure.points.length, dimmed);
        drawPoints(nodePointBuf, nodes.length, 1);
      };
    }

    const writeLinkStyles = () => {
      links.forEach((l, i) => {
        const s = linkState[i];
        for (let q = 0; q < l.segments * 4; q++) linkStyle.set([s.rgb[0], s.rgb[1], s.rgb[2], s.a, s.w, s.dash], (l.start * 4 + q) * STYLE);
      });
    };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      w = rect.width; h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      settling = Math.max(settling, 2);
    };

    // ---- Frame
    const ease = (from: number, to: number, k: number) => from + (to - from) * k;
    let last = performance.now();
    let dragging = false;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const v = viewRef.current;
      const k = 1 - Math.exp(-dt * 7);

      if (flyYaw !== null) {
        yaw = ease(yaw, flyYaw, 1 - Math.exp(-dt * 4));
        pitch = ease(pitch, flyPitch, 1 - Math.exp(-dt * 4));
        if (Math.abs(yaw - flyYaw) + Math.abs(pitch - flyPitch) < 0.002) flyYaw = null;
      } else if (!dragging) {
        yaw += spinVel * dt;
        pitch = Math.max(-1.4, Math.min(1.4, pitch + tiltVel * dt));
        spinVel *= Math.exp(-dt * 2.6);
        tiltVel *= Math.exp(-dt * 2.6);
        if (!reduced && !v.selected && !v.path && !hover && Math.abs(spinVel) < 0.2) yaw += AUTO_SPIN * dt;
      }
      zoom = ease(zoom, zoomTarget, 1 - Math.exp(-dt * 8));
      updateCamera();

      if (settling > 0) {
        settling--;
        nodeState.forEach((s) => { s.a = ease(s.a, s.ta, k); s.s = ease(s.s, s.ts, k); });
        linkState.forEach((s) => {
          s.a = ease(s.a, s.t.a, k);
          s.w = ease(s.w, s.t.w, k);
          s.rgb = s.rgb.map((c, i) => ease(c, s.t.rgb[i], k));
        });
        writeLinkStyles();
      }

      project();
      placeLabels();
      if (labelTick++ % 8 === 0) declutter();
      const silhouette = ((FOCAL * zoom * Math.min(w, h)) / 2) / Math.sqrt(CAMERA * CAMERA - 1);
      stage.style.setProperty("--sphere-r", `${silhouette.toFixed(0)}px`);
      draw();
    };

    // ---- Run only on screen
    let raf = 0;
    let onScreen = false;
    const loop = (now: number) => {
      frame(now);
      raf = onScreen && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const wake = () => {
      if (!raf && onScreen && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    const seen = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) { resize(); wake(); }
    }, { rootMargin: "120px" });
    seen.observe(stage);
    const sized = new ResizeObserver(resize);
    sized.observe(stage);
    document.addEventListener("visibilitychange", wake);

    // ---- Pointer: drag empty space to rotate, drag a node to move it over the surface, click to select, pinch to zoom
    const pointers = new Map<number, { x: number; y: number }>();
    let pressed = -1, moved = false, pinchFrom = 0, lastMove = 0;
    let engaged = false; // plain wheel only zooms once the graph has been touched, so the page keeps scrolling past it
    const local = (e: { clientX: number; clientY: number }) => {
      const rect = stage.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const setHover = (id: string | null) => {
      if (hover === id) return;
      hover = id;
      refresh();
      labelTick = 0;
    };
    const moveNode = (i: number, x: number, y: number) => {
      // Ray through the pointer, in view space
      const u = Math.min(w, h) / 2;
      const sx = (x - w / 2) / (FOCAL * zoom * u), sy = (h / 2 - y) / (FOCAL * zoom * u);
      const a = sx * sx + sy * sy + 1, b = -2 * CAMERA, c = CAMERA * CAMERA - 1;
      const disc = b * b - 4 * a * c;
      const t = disc > 0 ? (-b - Math.sqrt(disc)) / (2 * a) : -b / (2 * a); // front of the sphere, or the rim when outside it
      let vx = sx * t, vy = sy * t, vz = CAMERA - t;
      const l = Math.hypot(vx, vy, vz);
      vx /= l; vy /= l; vz /= l;
      // Back to sphere space with the transposed rotation
      positions[i * 3] = rot[0] * vx + rot[1] * vy + rot[2] * vz;
      positions[i * 3 + 1] = rot[3] * vx + rot[4] * vy + rot[5] * vz;
      positions[i * 3 + 2] = rot[6] * vx + rot[7] * vy + rot[8] * vz;
      links.forEach((link) => { if (link.ia === i || link.ib === i) writeLink(link); });
    };
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest("[data-stage-ui]")) return;
      engaged = true;
      stage.setPointerCapture(e.pointerId);
      const p = local(e);
      pointers.set(e.pointerId, p);
      flyYaw = null;
      spinVel = tiltVel = 0;
      moved = false;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchFrom = Math.hypot(a.x - b.x, a.y - b.y) / zoomTarget;
        pressed = -1;
        return;
      }
      project();
      pressed = pick(p.x, p.y);
      dragging = true;
      lastMove = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      const before = pointers.get(e.pointerId);
      if (!before) {
        if (e.pointerType !== "mouse") return;
        const i = pick(p.x, p.y);
        setHover(i >= 0 ? nodes[i].id : null);
        stage.style.cursor = i >= 0 ? "pointer" : "grab";
        return;
      }
      pointers.set(e.pointerId, p);
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        zoomTarget = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.hypot(a.x - b.x, a.y - b.y) / (pinchFrom || 1)));
        moved = true;
        return;
      }
      const dx = p.x - before.x, dy = p.y - before.y;
      if (!moved && Math.hypot(dx, dy) < 2) return;
      moved = true;
      stage.style.cursor = "grabbing";
      if (pressed >= 0 && nodes[pressed].kind !== "root" && screen[pressed].z > -0.1) {
        moveNode(pressed, p.x, p.y);
        return;
      }
      pressed = -1;
      const rate = 2.6 / Math.min(w, h) / zoom;
      const nowMs = performance.now();
      const dtMove = Math.max(1, nowMs - lastMove) / 1000;
      lastMove = nowMs;
      yaw += dx * rate;
      pitch = Math.max(-1.4, Math.min(1.4, pitch + dy * rate));
      spinVel = (dx * rate) / dtMove;
      tiltVel = (dy * rate) / dtMove;
    };
    const onUp = (e: PointerEvent) => {
      if (!pointers.delete(e.pointerId)) return;
      if (pointers.size) return;
      dragging = false;
      stage.style.cursor = "grab";
      if (performance.now() - lastMove > 90) spinVel = tiltVel = 0;
      if (moved || e.type === "pointercancel") return;
      onSelectRef.current(pressed >= 0 ? nodes[pressed].id : null);
    };
    const onLeave = () => {
      engaged = false;
      setHover(null);
    };
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !engaged) return; // trackpad pinch arrives as ctrl + wheel
      e.preventDefault();
      zoomTarget = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomTarget * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015))));
    };
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("wheel", onWheel, { passive: false });

    let previousFocus = "";
    const refreshAndFly = () => {
      refresh();
      labelTick = 0;
      const { selected, path } = viewRef.current;
      const key = path ? `path:${path.join()}` : selected ?? "";
      if (key !== previousFocus) {
        previousFocus = key;
        if (path) flyTo(path);
        else if (selected) flyTo([selected]);
      }
    };

    handleRef.current = {
      refresh: refreshAndFly,
      reset: () => {
        placeNodes();
        links.forEach(writeLink);
        flyYaw = START.yaw + Math.round((yaw - START.yaw) / (Math.PI * 2)) * Math.PI * 2;
        flyPitch = START.pitch;
        spinVel = tiltVel = 0;
        zoomTarget = 1;
        if (reduced) { yaw = flyYaw; pitch = flyPitch; flyYaw = null; }
      },
      zoomBy: (factor) => { zoomTarget = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoomTarget * factor)); },
    };

    resize();
    writeLinkStyles();
    refreshAndFly();
    updateCamera();

    return () => {
      cancelAnimationFrame(raf);
      seen.disconnect();
      sized.disconnect();
      document.removeEventListener("visibilitychange", wake);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerup", onUp);
      stage.removeEventListener("pointercancel", onUp);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("wheel", onWheel);
      handleRef.current = null;
    };
  }, []);

  const { selected, path } = view;
  const reachable = new Set(path ?? (selected ? [selected, ...neighbours(selected)] : []));

  return (
    <div
      ref={stageRef}
      className="relative h-full w-full cursor-grab select-none overflow-hidden"
      style={{
        touchAction: "pan-y",
        background: "radial-gradient(circle at center, color-mix(in srgb, var(--graph-companies) 16%, transparent) 0, color-mix(in srgb, var(--graph-tools) 13%, transparent) calc(var(--sphere-r, 240px) * 0.98), color-mix(in srgb, var(--graph-tools) 7%, transparent) calc(var(--sphere-r, 240px) * 1.1), transparent calc(var(--sphere-r, 240px) * 1.55)), var(--graph-canvas)",
      }}
    >
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block size-full" />
      {graphNodes.map((n) => (
        <button
          key={n.id}
          type="button"
          data-node={n.id}
          tabIndex={n.kind !== "leaf" || reachable.has(n.id) ? 0 : -1}
          onClick={() => onSelect(n.id)}
          aria-pressed={selected === n.id}
          className={`pointer-events-none absolute left-0 top-0 whitespace-nowrap rounded-[var(--radius-sm)] px-1 opacity-0 transition-opacity duration-200 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-1 focus-visible:outline-ring [text-shadow:0_0_3px_var(--graph-canvas),0_0_3px_var(--graph-canvas),0_0_8px_var(--graph-canvas)] ${n.kind === "leaf" ? "micro text-muted-foreground" : "label text-foreground"}`}
          style={reachable.has(n.id) ? { color: "var(--foreground)" } : undefined}
        >
          {n.label}
        </button>
      ))}
    </div>
  );
}
