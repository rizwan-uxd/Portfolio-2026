import type { CSSProperties, ReactNode } from "react";

// Isometric line diagrams for the Services boxes, one per service and in the same order as `services` in lib/content.ts.
// Coordinates are grid units on the ground: x runs down-right, y runs down-left, z runs up. Motion and colours live in tokens.css (.iso-*).
const UNIT = 20;
const COS = UNIT * Math.cos(Math.PI / 6);
const SIN = UNIT / 2;

const at = (x: number, y: number, z = 0) => [(x - y) * COS, (x + y) * SIN - z * UNIT] as const;
const pt = (x: number, y: number, z = 0) => at(x, y, z).map((n) => n.toFixed(1)).join(",");
const line = (...points: [number, number, number?][]) => "M" + points.map(([x, y, z]) => pt(x, y, z)).join(" L");
const delay = (i: number) => ({ "--i": i }) as CSSProperties;

type Footprint = { x: number; y: number; z?: number; w: number; d: number };
type BoxProps = Footprint & { h: number; className?: string };

const top = ({ x, y, z = 0, w, d }: Footprint) => `${pt(x, y, z)} ${pt(x + w, y, z)} ${pt(x + w, y + d, z)} ${pt(x, y + d, z)}`;

function Box({ x, y, z = 0, w, d, h, className = "" }: BoxProps) {
  const t = z + h;
  return (
    <g className={`iso ${className}`}>
      <polygon className="iso-left" points={`${pt(x, y + d, z)} ${pt(x + w, y + d, z)} ${pt(x + w, y + d, t)} ${pt(x, y + d, t)}`} />
      <polygon className="iso-right" points={`${pt(x + w, y, z)} ${pt(x + w, y + d, z)} ${pt(x + w, y + d, t)} ${pt(x + w, y, t)}`} />
      <polygon className="iso-top" points={top({ x, y, z: t, w, d })} />
    </g>
  );
}

// A block that lifts off and lands again, leaving its footprint on the plate. List them back to front.
function Drop({ i, children, ...box }: BoxProps & { i: number; children?: ReactNode }) {
  return (
    <>
      <polygon className="iso-cast" points={top(box)} />
      <g className="iso-drop" style={delay(i)}>
        <Box {...box} />
        {children}
      </g>
    </>
  );
}

function Pads({ w, d, z = 0.3 }: { w: number; d: number; z?: number }) {
  const pads: ReactNode[] = [];
  for (let x = 1; x < w; x++) {
    for (let y = 1; y < d; y++) {
      const [cx, cy] = at(x, y, z);
      pads.push(<circle key={`${x}-${y}`} className="iso-pad" cx={cx.toFixed(1)} cy={cy.toFixed(1)} r="1.6" />);
    }
  }
  return <g>{pads}</g>;
}

function Led({ x, y, z, step }: { x: number; y: number; z: number; step: number }) {
  const [cx, cy] = at(x, y, z);
  return (
    <g className="iso-led" style={delay(step)}>
      <circle className="iso-halo" cx={cx.toFixed(1)} cy={cy.toFixed(1)} r="8" />
      <circle cx={cx.toFixed(1)} cy={cy.toFixed(1)} r="3" />
    </g>
  );
}

// Small mono labels printed on the board. Decoration only, the svg is hidden from screen readers.
function Silk({ x, y, z, anchor = "middle", children }: { x: number; y: number; z?: number; anchor?: "start" | "middle" | "end"; children: string }) {
  const [tx, ty] = at(x, y, z);
  return <text className="iso-silk" x={tx.toFixed(1)} y={ty.toFixed(1)} textAnchor={anchor}>{children}</text>;
}

function Art({ x, y, cycle, children }: { x: number; y: number; cycle: string; children: ReactNode }) {
  return (
    <svg className="iso-art" viewBox="-180 -126 360 252" aria-hidden="true" style={{ "--iso-cycle": `var(${cycle})` } as CSSProperties}>
      <g transform={`translate(${x} ${y})`}>{children}</g>
    </svg>
  );
}

// Complex Interaction Design: a screen assembling itself on its artboard, with the main action lighting up once it lands.
function Screen() {
  const [px, py] = at(1.2, 4, 1.5);
  return (
    <Art x={-18} y={-90} cycle="--iso-cycle-drop">
      <Box x={0} y={0} w={10} d={8} h={0.3} className="iso-plate" />
      <Pads w={10} d={8} />
      <Drop i={0} x={1.2} y={0.8} z={0.3} w={4} d={3.2} h={1.2}>
        <path className="iso-stem" d={`M${px.toFixed(1)} ${py.toFixed(1)} v-30`} />
        <circle className="iso-tip" cx={px.toFixed(1)} cy={py.toFixed(1)} r="3" />
        <Silk x={0.2} y={4.2} z={2.9} anchor="end">U1</Silk>
      </Drop>
      <Drop i={2} x={6} y={0.8} z={0.3} w={3.2} d={2.8} h={0.5}>
        {[1.5, 2.2, 2.9].map((y) => <path key={y} className="iso-dim" d={line([6.5, y, 0.8], [8.7, y, 0.8])} />)}
      </Drop>
      <Drop i={4} x={1} y={4.6} z={0.3} w={8.2} d={2.6} h={0.6} className="iso-hot">
        <Led x={7.9} y={5.9} z={0.9} step={1.4} />
      </Drop>
      <path className="iso-dim" d={line([0.4, 8.7], [10.4, 8.7])} />
      <path className="iso-dim" d={line([0.4, 8.4], [0.4, 9])} />
      <path className="iso-dim" d={line([10.4, 8.4], [10.4, 9])} />
      <Silk x={3.6} y={10.4}>1440 · 12 COL</Silk>
      <Silk x={11.4} y={3}>ART</Silk>
    </Art>
  );
}

// Phosphor icons, light weight
const ROBOT = "M200,50H134V16a6,6,0,0,0-12,0V50H56A30,30,0,0,0,26,80V192a30,30,0,0,0,30,30H200a30,30,0,0,0,30-30V80A30,30,0,0,0,200,50Zm18,142a18,18,0,0,1-18,18H56a18,18,0,0,1-18-18V80A18,18,0,0,1,56,62H200a18,18,0,0,1,18,18ZM74,108a10,10,0,1,1,10,10A10,10,0,0,1,74,108Zm88,0a10,10,0,1,1,10,10A10,10,0,0,1,162,108Zm2,30H92a26,26,0,0,0,0,52h72a26,26,0,0,0,0-52Zm-22,12v28H114V150ZM78,164a14,14,0,0,1,14-14h10v28H92A14,14,0,0,1,78,164Zm86,14H154V150h10a14,14,0,0,1,0,28Z";
const PERSON = "M229.19,213c-15.81-27.32-40.63-46.49-69.47-54.62a70,70,0,1,0-63.44,0C67.44,166.5,42.62,185.67,26.81,213a6,6,0,1,0,10.38,6C56.4,185.81,90.34,166,128,166s71.6,19.81,90.81,53a6,6,0,1,0,10.38-6ZM70,96a58,58,0,1,1,58,58A58.07,58.07,0,0,1,70,96Z";

// One reader of the finished system, at either side of the slab. `side` is -1 for the left, 1 for the right.
function Reader({ side, icon, label }: { side: -1 | 1; icon: string; label: string }) {
  const y = -14;
  return (
    <>
      <path className="iso-beam" style={{ transformOrigin: side < 0 ? "0 50%" : "100% 50%" }} d={`M${side * 143} ${y} L${side * 112} ${y}`} />
      <circle className="iso-read-pulse" style={{ "--to": `${side * -31}px` } as CSSProperties} cx={side * 143} cy={y} r="3" />
      <g className="iso-reader" style={{ "--from": `${side * 10}px` } as CSSProperties}>
        <svg x={side * 160 - 15} y={y - 15} width="30" height="30" viewBox="0 0 256 256">
          <path className="iso-reader-icon" d={icon} />
        </svg>
        <text className="iso-silk" x={side * 160} y={y + 29} textAnchor="middle">{label}</text>
      </g>
    </>
  );
}

// Scalable Design Systems & Token Ops: tokens, components and pages fold into one slab that an agent and a person both read.
// It runs on transitions rather than a loop, so it holds the ending while hovered and reverses from any point on leave.
function Layers() {
  const size = 7.5;
  const gap = 2.6;
  const plate = 0.2;
  const tiles = [1, 3, 5];
  const corners: [number, number][] = [[0, size], [size, size], [size, 0]];
  const fold = (z: number, i: number) => ({ "--fold": `${(z - i * plate) * UNIT}px` }) as CSSProperties; // down onto the plates below
  const links = (z: number) => corners.map(([x, y]) => <path key={`${x}-${y}`} className="iso-link" d={line([x, y, z + plate], [x, y, z + gap])} />);
  const label = (text: string, z: number) => <g className="iso-stack-note"><Silk x={-0.4} y={size} z={z + 0.1} anchor="end">{text}</Silk></g>;
  return (
    <Art x={0} y={0} cycle="--iso-cycle-build">
      <g transform="translate(10 -23)">
        <g className="iso-stack-body">
          <g>
            <Box x={0} y={0} w={size} d={size} h={plate} className="iso-plate iso-slab" />
            {label("TOKENS", 0)}
            {tiles.flatMap((y) => tiles.map((x) => <Box key={`${x}-${y}`} x={x} y={y} z={plate} w={1.5} d={1.5} h={0.15} className={x === 5 && y === 5 ? "iso-hot" : ""} />))}
            {links(0)}
          </g>
          <g className="iso-stack-layer" style={fold(gap, 1)}>
            <Box x={0} y={0} z={gap} w={size} d={size} h={plate} className="iso-plate iso-slab" />
            {label("COMPONENTS", gap)}
            <Box x={1} y={1} z={gap + plate} w={2.5} d={2.5} h={0.5} />
            <Box x={4} y={1} z={gap + plate} w={2.5} d={2.5} h={0.3} />
            <Box x={1} y={4} z={gap + plate} w={2.5} d={2.5} h={0.3} />
            <Box x={4} y={4} z={gap + plate} w={2.5} d={2.5} h={0.5} />
            {links(gap)}
          </g>
          <g className="iso-stack-layer" style={fold(gap * 2, 2)}>
            <Box x={0} y={0} z={gap * 2} w={size} d={size} h={plate} className="iso-plate iso-slab" />
            {label("PAGES", gap * 2)}
            <Box x={1} y={1} z={gap * 2 + plate} w={5.5} d={1.2} h={0.3} />
            <Box x={1} y={2.8} z={gap * 2 + plate} w={5.5} d={3.7} h={0.6} />
          </g>
        </g>
      </g>
      <Reader side={-1} icon={ROBOT} label="AGENT" />
      <Reader side={1} icon={PERSON} label="HUMAN" />
      <text className="iso-stack-label" x="0" y="92" textAnchor="middle">MACHINE-READABLE DESIGN SYSTEM</text>
    </Art>
  );
}

// Interactive Code Prototyping: lines of a prompt write themselves, tokens travel down the wire and the prototype builds.
function Build() {
  const rows: [number, number][] = [[1.5, 3.2], [2.4, 2.2], [3.3, 3], [4.2, 1.5]];
  return (
    <Art x={-52} y={-85} cycle="--iso-cycle-build">
      <Box x={0} y={0} w={12} d={6} h={0.3} className="iso-plate" />
      <Pads w={12} d={6} />
      <Box x={0.7} y={0.7} z={0.3} w={4.3} d={4.6} h={0.5} />
      {rows.map(([y, w], i) => <path key={y} className="iso-rule" pathLength={1} style={delay(i)} d={line([1.2, y, 0.8], [1.2 + w, y, 0.8])} />)}
      <path className="iso-wire" d={line([5, 3, 0.3], [8, 3, 0.3])} />
      <g className="iso-token">
        <Box x={6.15} y={2.65} z={0.3} w={0.7} d={0.7} h={0.7} className="iso-hot" />
      </g>
      <Drop i={3} x={8} y={1.5} z={0.3} w={3} d={3} h={0.6} />
      <Drop i={4.6} x={8} y={1.5} z={1} w={3} d={3} h={0.6} />
      <Drop i={6.2} x={8} y={1.5} z={1.7} w={3} d={3} h={0.6} className="iso-hot" />
      <Silk x={2.8} y={7}>PROMPT</Silk>
      <Silk x={10.2} y={5.6}>BUILD</Silk>
    </Art>
  );
}

// UX Research & Validation: a signal runs the loop between stations, each one lifting and lighting as it arrives.
function Loop() {
  const stations: [number, number, number][] = [[2.5, 2.5, 0], [7.5, 2.5, 1], [2.5, 7.5, 3], [7.5, 7.5, 2]]; // back to front; the last number is the order round the loop
  const [sx, sy] = at(2.5, 2.5, 0.3);
  return (
    <Art x={0} y={-100} cycle="--iso-cycle-loop">
      <Box x={0} y={0} w={10} d={10} h={0.3} className="iso-plate" />
      <Pads w={10} d={10} />
      <path className="iso-wire" d={`${line([2.5, 2.5, 0.3], [7.5, 2.5, 0.3], [7.5, 7.5, 0.3], [2.5, 7.5, 0.3])} Z`} />
      {stations.map(([x, y, step]) => (
        <g key={`${x}-${y}`} className="iso-station" style={delay(step)}>
          <Box x={x - 1} y={y - 1} z={0.3} w={2} d={2} h={0.9} className={step === 0 ? "iso-hot" : ""} />
          <Led x={x} y={y} z={1.2} step={step} />
        </g>
      ))}
      {stations.map(([x, y, step]) => <Silk key={step} x={x + 1.5} y={y + 1.5} z={0.3}>{`T${step + 1}`}</Silk>)}
      <circle className="iso-pulse" cx={sx.toFixed(1)} cy={sy.toFixed(1)} r="4" />
    </Art>
  );
}

// Product Strategy & Growth Alignment: bars rise one after the other towards the KPI, beside the roadmap.
function Growth() {
  const [px, py] = at(4.5, 2, 3.1);
  return (
    <Art x={-9} y={-68} cycle="--iso-cycle-drop">
      <Box x={0} y={0} w={9} d={8} h={0.3} className="iso-plate" />
      <Pads w={9} d={8} />
      {[1.2, 2.4, 3.6, 4.8, 6].map((y, i) => <path key={y} className="iso-dim" d={line([0.8, y, 0.3], [2.6 - (i % 2) * 0.6, y, 0.3])} />)}
      <Drop i={4.5} x={3.4} y={0.6} z={0.3} w={2.2} d={1.4} h={2.8} className="iso-hot">
        <path className="iso-stem" d={`M${px.toFixed(1)} ${py.toFixed(1)} v-24`} />
        <circle className="iso-tip" cx={px.toFixed(1)} cy={py.toFixed(1)} r="3" />
      </Drop>
      <Drop i={3} x={3.4} y={2.4} z={0.3} w={2.2} d={1.4} h={2} />
      <Drop i={1.5} x={3.4} y={4.2} z={0.3} w={2.2} d={1.4} h={1.3} />
      <Drop i={0} x={3.4} y={6} z={0.3} w={2.2} d={1.4} h={0.7} />
      <Silk x={5.3} y={0.3} z={4.6} anchor="start">KPI</Silk>
      <Silk x={2} y={10}>ROADMAP</Silk>
    </Art>
  );
}

// AI-Native & Conversational Experience: the turns of a conversation land in order, and the person's control lights up last.
function Chat() {
  const [px, py] = at(2, 7.2, 0.9);
  const turns: [number, number, number, number][] = [[0.8, 0.7, 5.5, 0], [3.7, 2.4, 5.5, 2], [0.8, 4.1, 6, 4]]; // x, y, width, stagger
  return (
    <Art x={-18} y={-90} cycle="--iso-cycle-drop">
      <Box x={0} y={0} w={10} d={8} h={0.3} className="iso-plate" />
      <Pads w={10} d={8} />
      {turns.map(([x, y, w, i]) => (
        <Drop key={y} i={i} x={x} y={y} z={0.3} w={w} d={1.3} h={0.35}>
          <path className="iso-dim" d={line([x + 0.5, y + 0.45, 0.65], [x + w - 0.5, y + 0.45, 0.65])} />
          <path className="iso-dim" d={line([x + 0.5, y + 0.9, 0.65], [x + w - 1.6, y + 0.9, 0.65])} />
        </Drop>
      ))}
      <Drop i={6} x={2} y={5.8} z={0.3} w={7.2} d={1.4} h={0.6} className="iso-hot">
        <path className="iso-stem" d={`M${px.toFixed(1)} ${py.toFixed(1)} v-30`} />
        <circle className="iso-tip" cx={px.toFixed(1)} cy={py.toFixed(1)} r="3" />
        <Led x={8.2} y={6.5} z={0.9} step={1.4} />
      </Drop>
      <Silk x={11} y={1.6}>AGENT</Silk>
      <Silk x={2.2} y={10.2}>HUMAN</Silk>
    </Art>
  );
}

export const serviceDiagrams = [Growth, Loop, Screen, Chat, Build, Layers];
