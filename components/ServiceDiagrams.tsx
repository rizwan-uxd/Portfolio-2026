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

// Complex Interaction Design: data, human approvals, then a resolved exception.
function Screen() {
  const reviewers = [2.25, 4.7].map((y) => at(5, y, 0.6));
  const [statusX, statusY] = at(8.1, 3.45, 0.6);
  return (
    <Art x={-18} y={-90} cycle="--iso-cycle-review">
      <Box x={0} y={0} w={10} d={8} h={0.3} className="iso-plate" />
      <Pads w={10} d={8} />
      <g className="iso-review-plane iso-review-data">
        <Box x={0.55} y={1.1} z={0.3} w={2.6} d={5.6} h={0.25} />
        <path className="iso-review-line" d={line([0.9, 1.7, 0.56], [2.8, 1.7, 0.56])} />
        {[2.3, 2.95, 3.6, 4.25, 4.9, 5.55].map((y, i) => (
          <path key={y} className={i % 2 ? "iso-review-line iso-review-detail" : "iso-review-line"} d={line([0.9, y, 0.56], [i % 2 ? 2.25 : 2.8, y, 0.56])} />
        ))}
      </g>
      <g className="iso-review-plane iso-review-people">
        <Box x={3.7} y={1.1} z={0.3} w={2.6} d={5.6} h={0.25} />
        <path className="iso-review-link" d={line([5, 2.25, 0.6], [5, 4.7, 0.6])} />
        {reviewers.map(([x, y], i) => (
          <g key={i} className={`iso-review-person iso-review-person-${i}`} transform={`translate(${x} ${y})`}>
            <circle className="iso-tool-ring" r="10" />
            <svg x="-6" y="-6" width="12" height="12" viewBox="0 0 256 256"><path className="iso-tool-mark" d={PERSON} /></svg>
          </g>
        ))}
      </g>
      <g className="iso-review-plane iso-review-status">
        <Box x={6.85} y={1.1} z={0.3} w={2.6} d={5.6} h={0.25} />
        <g transform={`translate(${statusX} ${statusY})`}>
          <g className="iso-review-alert"><circle r="10" /><path d="M0 -5 V2 M0 5 V5.1" /></g>
          <g className="iso-review-approved"><circle r="10" /><path d="M-5 0 L-1.5 3.5 L5 -4" /></g>
        </g>
        <path className="iso-review-line" d={line([7.3, 5.5, 0.56], [8.9, 5.5, 0.56])} />
      </g>
      <circle className="iso-review-request" cx={at(1.85, 3.5, 0.6)[0]} cy={at(1.85, 3.5, 0.6)[1]} r="3" />
      <Silk x={1.85} y={9.3}>DATA</Silk>
      <Silk x={5} y={9.3}>REVIEW</Silk>
      <Silk x={8.15} y={9.3}>STATUS</Silk>
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

// Marks drawn flat on a surface at height z, in the same ground coordinates as Box.
const Rule = ({ x, y, z, w }: { x: number; y: number; z: number; w: number }) => <path className="iso-dim" d={line([x, y, z], [x + w, y, z])} />;

function Patch({ x, y, z, w, d, className }: Footprint & { className: string }) {
  return <polygon className={className} points={top({ x, y, z, w, d })} />;
}

function Disc({ x, y, z, r, className = "iso-glyph" }: { x: number; y: number; z: number; r: number; className?: string }) {
  const points = Array.from({ length: 24 }, (_, i) => pt(x + r * Math.cos((i * Math.PI) / 12), y + r * Math.sin((i * Math.PI) / 12), z)).join(" ");
  return <polygon className={className} points={points} />;
}

function Pill({ x, y, z, w, d }: { x: number; y: number; z: number; w: number; d: number }) {
  const r = d / 2;
  const arc = (cx: number, from: number) => Array.from({ length: 9 }, (_, i) => pt(cx + r * Math.cos(from + (i * Math.PI) / 8), y + r + r * Math.sin(from + (i * Math.PI) / 8), z));
  return <polygon className="iso-outline" points={[...arc(x + w - r, -Math.PI / 2), ...arc(x + r, Math.PI / 2)].join(" ")} />;
}

// A flat drawing space lying on a surface: local x runs along the ground x axis, local y along the ground y axis, 1 unit = 1px along each.
function surface(x: number, y: number, z: number) {
  const [tx, ty] = at(x, y, z);
  return `matrix(${COS / UNIT} ${SIN / UNIT} ${-COS / UNIT} ${SIN / UNIT} ${tx.toFixed(1)} ${ty.toFixed(1)})`;
}

// Text printed on a surface, running along x like the rules
function Printed({ x, y, z, children }: { x: number; y: number; z: number; children: string }) {
  return <text className="iso-glyph-text" transform={surface(x, y, z)}>{children}</text>;
}

// Only the front of the two lower planes shows past the plane above (x or y beyond about 4.9), so their elements sit along those two edges.
function TokenTiles() {
  const z = 0.35;
  const tile = { z: 0.2, w: 1.7, d: 1.7, h: 0.15 };
  return (
    <>
      <Box x={5.3} y={0.8} {...tile} />
      {[0, 1, 2].map((i) => <Patch key={i} x={5.55} y={1.05 + i * 0.42} z={z} w={1.2} d={0.3} className={`iso-swatch-${i + 1}`} />)}
      <Box x={5.3} y={3} {...tile} />
      <path className="iso-dim" d={line([5.7, 4.3, z], [5.7, 3.85, z], [5.75, 3.65, z], [5.9, 3.5, z], [6.1, 3.4, z], [6.6, 3.4, z])} />
      <Box x={0.7} y={5.3} {...tile} />
      <Rule x={0.95} y={5.65} z={z} w={1.2} />
      <Rule x={0.95} y={6.65} z={z} w={1.2} />
      <path className="iso-dim" d={line([1.55, 5.75, z], [1.55, 6.55, z])} />
      <Box x={3} y={5.3} {...tile} />
      <Printed x={3.3} y={6.45} z={z}>Aa</Printed>
      <Box x={5.3} y={5.3} {...tile} className="iso-hot" />
    </>
  );
}

function ComponentSet({ z }: { z: number }) {
  return (
    <>
      <Box x={5.2} y={0.5} z={z} w={1.9} d={2.5} h={0.2} />
      <Patch x={5.45} y={0.75} z={z + 0.2} w={1.4} d={1.1} className="iso-swatch-1" />
      <Rule x={5.45} y={2.2} z={z + 0.2} w={1.4} />
      <Rule x={5.45} y={2.6} z={z + 0.2} w={0.9} />
      <Pill x={5.45} y={3.4} z={z} w={1.6} d={0.8} />
      <Disc x={6.65} y={3.8} z={z} r={0.28} />
      <Box x={0.7} y={5.4} z={z} w={2.4} d={1.3} h={0.3} />
      <Rule x={1.3} y={6.05} z={z + 0.3} w={1.2} />
      <Box x={3.5} y={5.4} z={z} w={3.6} d={1.3} h={0.1} />
      <Rule x={3.85} y={6.05} z={z + 0.1} w={1.7} />
      <path className="iso-dim" d={line([6.4, 5.75, z + 0.1], [6.4, 6.35, z + 0.1])} />
    </>
  );
}

function PageLayout({ z }: { z: number }) {
  const picture = z + 0.3;
  return (
    <>
      <Rule x={1} y={0.9} z={z} w={1.3} />
      <Disc x={6.2} y={0.9} z={z} r={0.25} />
      <Box x={1} y={1.5} z={z} w={3.2} d={4.8} h={0.3} />
      <path className="iso-dim" d={line([1.3, 5.7, picture], [2.3, 4, picture], [3, 4.9, picture], [3.5, 4.3, picture], [3.9, 5.7, picture])} />
      <Disc x={3.2} y={2.6} z={picture} r={0.4} />
      {[2, 2.7, 3.4].map((y, i) => <Rule key={y} x={4.7} y={y} z={z} w={i === 2 ? 1.1 : 1.8} />)}
      <Box x={4.7} y={4.4} z={z} w={1.8} d={0.9} h={0.2} />
    </>
  );
}

// Scalable Design Systems & Token Ops: tokens, components and pages fold into one slab that an agent and a person both read.
// It runs on transitions rather than a loop, so it holds the ending while hovered and reverses from any point on leave.
function Layers() {
  const size = 7.5;
  const gap = 2.6;
  const plate = 0.2;
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
            <TokenTiles />
            {links(0)}
          </g>
          <g className="iso-stack-layer" style={fold(gap, 1)}>
            <Box x={0} y={0} z={gap} w={size} d={size} h={plate} className="iso-plate iso-slab" />
            {label("COMPONENTS", gap)}
            <ComponentSet z={gap + plate} />
            {links(gap)}
          </g>
          <g className="iso-stack-layer" style={fold(gap * 2, 2)}>
            <Box x={0} y={0} z={gap * 2} w={size} d={size} h={plate} className="iso-plate iso-slab" />
            {label("PAGES", gap * 2)}
            <PageLayout z={gap * 2 + plate} />
          </g>
        </g>
      </g>
      <Reader side={-1} icon={ROBOT} label="AGENT" />
      <Reader side={1} icon={PERSON} label="HUMAN" />
      <text className="iso-stack-label" x="0" y="92" textAnchor="middle">MACHINE-READABLE DESIGN SYSTEM</text>
    </Art>
  );
}

// Marks from Simple Icons, Lovable's from Lobe Icons. Figma Make has no mark of its own, so it uses Figma's.
const TOOLS: [string, number, string][] = [
  ["Claude Code", 195, "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"],
  ["Cursor", 230, "M11.503.131 1.891 5.678a.84.84 0 0 0-.42.726v11.188c0 .3.162.575.42.724l9.609 5.55a1 1 0 0 0 .998 0l9.61-5.55a.84.84 0 0 0 .42-.724V6.404a.84.84 0 0 0-.42-.726L12.497.131a1.01 1.01 0 0 0-.996 0M2.657 6.338h18.55c.263 0 .43.287.297.515L12.23 22.918c-.062.107-.229.064-.229-.06V12.335a.59.59 0 0 0-.295-.51l-9.11-5.257c-.109-.063-.064-.23.061-.23"],
  ["v0", 265, "M14.066 6.028v2.22h5.729q.075-.001.148.005l-5.853 5.752a2 2 0 0 1-.024-.309V8.247h-2.353v5.45c0 2.322 1.935 4.222 4.258 4.222h5.675v-2.22h-5.675q-.03 0-.059-.003l5.729-5.629q.006.082.006.166v5.465H24v-5.465a4.204 4.204 0 0 0-4.205-4.205zM0 8.245l8.28 9.266c.839.94 2.396.346 2.396-.914V8.245H8.19v5.44l-4.86-5.44Z"],
  ["Lovable", 300, "M7.082 0c3.91 0 7.081 3.179 7.081 7.1v2.7h2.357c3.91 0 7.082 3.178 7.082 7.1 0 3.923-3.17 7.1-7.082 7.1H0V7.1C0 3.18 3.17 0 7.082 0z"],
  ["Figma Make", 335, "M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z"],
];

// The tools fan out above the prompt slab, each sending a pulse down a dotted line into it.
function Tools() {
  const [cx, cy, far, ring, near] = [-3, -1, 100, 14, 38];
  return TOOLS.map(([name, angle, mark], i) => {
    const point = (r: number) => [cx + r * Math.cos((angle * Math.PI) / 180), cy + r * Math.sin((angle * Math.PI) / 180)].map((n) => +n.toFixed(1));
    const [x, y] = point(far);
    const [x1, y1] = point(far - ring - 1);
    const [x0, y0] = point(near);
    const to = { "--i": i, "--to-x": `${(x0 - x1).toFixed(1)}px`, "--to-y": `${(y0 - y1).toFixed(1)}px` } as CSSProperties;
    return (
      <g key={name} className="iso-tool" style={to}>
        <path className="iso-spoke" d={`M${x1} ${y1} L${x0} ${y0}`} />
        <circle className="iso-spoke-pulse" cx={x1} cy={y1} r="2.6" />
        <circle className="iso-tool-ring" cx={x} cy={y} r={ring} />
        <svg x={x - 7.5} y={y - 7.5} width="15" height="15" viewBox="0 0 24 24">
          <path className="iso-tool-mark" d={mark} />
        </svg>
      </g>
    );
  });
}

// A raised chat bubble: a rounded slab with a tail on its front edge, extruded like the boxes. The tail leans out on the left or right.
function Bubble({ x, y, z = 0, w, d, h, tail }: BoxProps & { tail: "left" | "right" }) {
  const r = 0.35;
  const arc = (cx: number, cy: number, from: number): [number, number][] => Array.from({ length: 4 }, (_, i) => {
    const a = ((from + i * 30) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
  const outline: [number, number][] = [
    ...arc(r, r, 180), ...arc(w - r, r, 270), ...arc(w - r, d - r, 0),
    [w - 0.55, d], [w - 0.55, d + 0.45], [w - 1.05, d],
    ...arc(r, d - r, 90),
  ];
  const pts = outline.map(([px, py]) => [x + (tail === "right" ? px : w - px), y + py] as [number, number]);
  const faces = pts.map((a, i) => [a, pts[(i + 1) % pts.length]] as const).sort(([a, b], [c, e]) => a[0] + a[1] + b[0] + b[1] - (c[0] + c[1] + e[0] + e[1]));
  return (
    <g className="iso">
      {faces.map(([a, b], i) => (
        <polygon key={i} className={Math.abs(b[0] - a[0]) > Math.abs(b[1] - a[1]) ? "iso-left" : "iso-right"} points={`${pt(a[0], a[1], z)} ${pt(b[0], b[1], z)} ${pt(b[0], b[1], z + h)} ${pt(a[0], a[1], z + h)}`} />
      ))}
      <polygon className="iso-top" points={pts.map(([px, py]) => pt(px, py, z + h)).join(" ")} />
    </g>
  );
}

// Interactive Code Prototyping: lines of a prompt write themselves, tokens travel down the wire and the prototype builds.
function Build() {
  const rows: [number, number][] = [[1.5, 3.2], [2.4, 2.2], [3.3, 3], [4.2, 1.5]];
  return (
    <Art x={0} y={0} cycle="--iso-cycle-prototype">
      <g transform="translate(-1 -36) scale(0.82)">
        <Box x={0} y={0} w={12} d={6} h={0.3} className="iso-plate" />
        <Pads w={12} d={6} />
        <Box x={0.7} y={0.7} z={0.3} w={4.3} d={4.6} h={0.5} />
        {rows.map(([y, w], i) => <path key={y} className="iso-rule" pathLength={1} style={delay(i)} d={line([1.2, y, 0.8], [1.2 + w, y, 0.8])} />)}
        <path className="iso-wire" d={line([5, 3, 0.3], [8, 3, 0.3])} />
        <g className="iso-token">
          <Box x={6.15} y={2.65} z={0.3} w={0.7} d={0.7} h={0.7} className="iso-hot" />
        </g>
        <g transform={`translate(${pt(7.8, 1.4, 0.55)}) matrix(0.866 0.5 0 1 0 0)`}>
          <g className="iso-laptop-screen">
            <rect className="iso-laptop-frame" x="0" y="-48" width="68" height="48" rx="2" />
            <rect className="iso-laptop-display" x="4" y="-44" width="60" height="40" />
            <g className="iso-prototype-ui">
              <path className="iso-laptop-detail" d="M8 -36 H60 M20 -36 V-8 M24 -28 H56 M24 -23 H48" />
              <rect className="iso-laptop-accent" x="24" y="-17" width="18" height="5" rx="1" />
              <path className="iso-laptop-detail" d="M10 -32 H17 M10 -27 H17 M10 -22 H16" />
            </g>
          </g>
        </g>
        <Box x={7.8} y={1.4} z={0.3} w={3.4} d={3.2} h={0.25} />
        {[2, 2.5, 3].map((y) => <path key={y} className="iso-dim" d={line([8.2, y, 0.55], [10.8, y, 0.55])} />)}
        <path className="iso-dim" d={`${line([8.9, 3.5, 0.55], [10.1, 3.5, 0.55], [10.1, 4.1, 0.55], [8.9, 4.1, 0.55])} Z`} />
        <Silk x={2.8} y={7}>PROMPT</Silk>
        <Silk x={9} y={7.6}>BUILD</Silk>
      </g>
      <Tools />
    </Art>
  );
}

// Three research methods uncover a user problem, inform a design, and test it.
function Loop() {
  const lenses = [
    { x: -15, y: -102, icon: <><circle cx="-4" cy="-3" r="2.5" /><circle cx="4" cy="-3" r="2.5" /><path d="M-9 5 C-9 0 -1 0 -1 5 M1 5 C1 0 9 0 9 5" /></> },
    { x: 55, y: -113, icon: <><rect x="-7" y="-8" width="13" height="16" rx="1" /><path d="M-3 3 L0 0 L2 3 L5 5 M-4 -4 H3" /></> },
    { x: 130, y: -90, icon: <><path d="M-8 7 H8 M-6 4 V0 M0 4 V-5 M6 4 V-9" /><circle cx="6" cy="-9" r="1" /></> },
  ];
  const boxes = [1.4, 4.5, 7.6];
  const centers = boxes.map((y) => at(2.5, y + 1.15, 1.1));
  return (
    <Art x={0} y={0} cycle="--iso-cycle-research">
      {lenses.map(({ x, y, icon }, i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className="iso-research-lens" style={delay(i)}>
            <circle className="iso-research-ring" r="17" />
            <path className="iso-research-handle" d="M12 12 L19 19" />
            <g className="iso-research-icon">{icon}</g>
          </g>
        </g>
      ))}
      <g transform="translate(52 -78)">
        <Box x={0} y={0} w={5} d={11} h={0.3} className="iso-plate" />
        <Pads w={5} d={11} />
        <path className="iso-wire" d={line([2.5, 3.7, 0.3], [2.5, 4.5, 0.3])} />
        <path className="iso-wire" d={line([2.5, 6.8, 0.3], [2.5, 7.6, 0.3])} />
        {boxes.map((y, i) => (
          <g className={`iso-research-stage iso-research-stage-${i}`} key={y}>
            <Box x={1.15} y={y} z={0.3} w={2.7} d={2.3} h={0.6} />
          </g>
        ))}
        <g className="iso-research-stage iso-research-stage-0" transform={`translate(${centers[0][0]} ${centers[0][1] - 3})`}>
          <g className="iso-research-icon"><circle cy="-5" r="3" /><path d="M-7 6 C-7 -1 7 -1 7 6" /></g>
          <g className="iso-research-warning" transform="translate(9 -14)"><path d="M0 -6 L6 5 H-6 Z M0 -2 V1 M0 3 V3.1" /></g>
        </g>
        <g className="iso-research-stage iso-research-stage-1 iso-research-icon" transform={`translate(${centers[1][0]} ${centers[1][1] - 2})`}>
          <path d="M-8 5 L-5 0 L4 -9 L8 -5 L-1 4 Z M-5 0 L-1 4 M3 -8 L7 -4 M-8 7 H8" />
        </g>
        <g className="iso-research-stage iso-research-stage-2 iso-research-icon" transform={`translate(${centers[2][0]} ${centers[2][1] - 2})`}>
          <rect x="-10" y="-8" width="17" height="14" rx="1" /><path d="M-7 -4 H3 M-7 -1 H0 M-7 2 H-3" /><g className="iso-research-test"><circle cx="3" cy="1" r="4" /><path d="M6 4 L9 7" /></g>
        </g>

      </g>
      <g className="iso-research-links"><path d="M-4 -90 L31 -67 M54 -96 L51 -70 M114 -83 L72 -58" /></g>
      <text className="iso-silk" x="-25" y="78" textAnchor="start">VALIDATE</text>
      <text className="iso-silk" x="27" y="48" textAnchor="start">DESIGN</text>
      <text className="iso-silk" x="82" y="16" textAnchor="start">PROBLEM</text>
      {[0, 1, 2].map((i) => <circle key={i} className={`iso-research-signal iso-research-input iso-research-input-${i}`} r="2.5" />)}
      <circle className="iso-research-signal iso-research-to-design" r="2.5" />
      <circle className="iso-research-signal iso-research-to-test" r="2.5" />
    </Art>
  );
}

// Product Strategy & Growth Alignment: four roadmap stages connect the selected validation step to an outcome.
function Growth() {
  const stages = [
    { label: "BUILD", x: 0.6, h: 2.8, i: 4.5 },
    { label: "VALIDATE", x: 2.4, h: 2, i: 3 },
    { label: "EXPLORE", x: 4.2, h: 1.3, i: 1.5 },
    { label: "IDEA", x: 6, h: 0.7, i: 0 },
  ];
  const [vx, vy] = at(3.1, 4.5, 2.3);
  const [kx, ky] = at(1.3, 4.5, 3.1);
  return (
    <Art x={-9} y={-68} cycle="--iso-cycle-drop">
      <g className="iso-growth">
        <Box x={0} y={0} w={9} d={8} h={0.3} className="iso-plate" />
        <Pads w={9} d={8} />
        {[1.2, 2.4, 3.6, 4.8, 6].map((y, i) => <path key={y} className="iso-dim" d={line([0.8, y, 0.3], [2.6 - (i % 2) * 0.6, y, 0.3])} />)}
        {stages.map(({ label, x, h, i }) => {
          const [tx, ty] = at(x + 0.7, 9.6, 0.3);
          const [iconX, iconY] = at(x + 0.7, 4.5, 0.3 + h);
          return (
            <g key={label}>
              <polygon className="iso-cast" points={top({ x, y: 3.4, z: 0.3, w: 1.4, d: 2.2 })} />
              <clipPath id={`iso-growth-clip-${i}`}>
                <polygon points={`${pt(x, 3.4, 0.3 + h)} ${pt(x + 1.4, 3.4, 0.3 + h)} ${pt(x + 1.4, 3.4, 0.3)} ${pt(x + 1.4, 5.6, 0.3)} ${pt(x, 5.6, 0.3)} ${pt(x, 5.6, 0.3 + h)}`} />
              </clipPath>
              <g clipPath={`url(#iso-growth-clip-${i})`}>
                <g className="iso-growth-rise" style={{ "--i": i, "--growth-rise": `${h * UNIT}px` } as CSSProperties}>
                  <Box x={x} y={3.4} z={0.3} w={1.4} d={2.2} h={h} className={label === "VALIDATE" ? "iso-growth-selected" : ""} />
                </g>
              </g>
              <defs>
                <g id={`iso-growth-symbol-${i}`} transform={`matrix(${COS / UNIT} ${-SIN / UNIT} 0 1 ${iconX} ${iconY - 9})`}>
                    {label === "IDEA" && <><path d="M-5 0 A6 6 0 1 1 5 0 C3 2 3 3 3 4 H-3 C-3 3 -3 2 -5 0 Z M-3 7 H3 M-2 9 H2" /></>}
                    {label === "EXPLORE" && <><circle cx="-2" cy="-2" r="5.5" /><path d="M2 2 L7 7" /></>}
                    {label === "VALIDATE" && <><circle r="8" /><path d="M-4 0 L-1 3 L5 -4" /></>}
                    {label === "BUILD" && <><path d="M-7 -5 L0 -9 L7 -5 V4 L0 8 L-7 4 Z M-7 -5 L0 -1 L7 -5 M0 -1 V8" /></>}
                </g>
              </defs>
              <g className="iso-growth-icon" style={delay(i)}>
                <use href={`#iso-growth-symbol-${i}`} />
              </g>
              <text className={`iso-silk${label === "VALIDATE" ? " iso-growth-selected-label" : ""}`} x={tx} y={ty + 12} textAnchor="middle" dominantBaseline="central">{label}</text>
            </g>
          );
        })}
        <g className="iso-growth-outcome">
          <path className="iso-growth-connection" d={`M${vx} ${vy} C${vx + 6} ${vy - 36}, ${kx - 25} ${ky - 12}, ${kx} ${ky}`} />
          <circle cx={vx} cy={vy} r="2.5" />
          <circle cx={kx} cy={ky} r="2.5" />
          <path className="iso-growth-kpi-stem" d={`M${kx} ${ky} v-22`} />
        </g>
        <text className="iso-silk" x={kx} y={ky - 28} textAnchor="middle">GROWTH / KPI</text>
      </g>
    </Art>
  );
}

// AI-Native & Conversational Experience: at rest the flow already waits at a closed gate with a person beside it. On hover the signal
// stops short of the gate, only then does the person react and tap confirm, the gate sinks and the flat action box rises. It holds there; moving off is a quick undo.
function Gate() {
  const offset = { x: 52, y: -90 };
  const onScreen = ([x, y]: readonly [number, number]) => [x + offset.x, y + offset.y];
  const gate = { x: 0.9, y: 6, w: 4.2, d: 0.9 };
  const base = 0.3;
  const clip = `${pt(gate.x, gate.y + gate.d, base)} ${pt(gate.x + gate.w, gate.y + gate.d, base)} ${pt(gate.x + gate.w, gate.y, base)} ${pt(gate.x + gate.w, gate.y, 3)} ${pt(gate.x, gate.y + gate.d, 3)}`;
  const actionClip = `${pt(1.2, 11.4, base)} ${pt(4.8, 11.4, base)} ${pt(4.8, 8.6, base)} ${pt(4.8, 8.6, 3)} ${pt(1.2, 11.4, 3)}`;
  const bubbleClip = `${pt(1, 4.7, 0.8)} ${pt(5, 4.7, 0.8)} ${pt(5, 0.7, 0.8)} ${pt(5, 0.7, 3)} ${pt(1, 4.7, 3)}`;
  const [pulseX, pulseY] = at(3, 4.7, base);
  const [ax, ay] = onScreen(at(7.6, 6.45));
  const [cx, cy] = onScreen(at(3, 6.45, 0.85));
  const [hx, hy] = [ax - 12, ay - 12];
  return (
    <Art x={0} y={0} cycle="--iso-gate-run">
      <g transform={`translate(${offset.x} ${offset.y})`}>
        <Box x={0} y={0} w={6} d={12} h={base} className="iso-plate" />
        <Pads w={6} d={12} />
        <Box x={1} y={0.7} z={base} w={4} d={4} h={0.5} />
        <clipPath id="iso-gate-bubble-clip"><polygon points={bubbleClip} /></clipPath>
        <g clipPath="url(#iso-gate-bubble-clip)">
          <g className="iso-gate-bubble" style={delay(0)}><Bubble x={1.3} y={1} z={0.8} w={2.6} d={1.2} h={0.25} tail="left" /></g>
          <g className="iso-gate-bubble" style={delay(1)}><Bubble x={2.1} y={2.8} z={0.8} w={2.6} d={1.2} h={0.25} tail="right" /></g>
        </g>
        <path className="iso-wire" d={line([3, 4.7, base], [3, 6, base])} />
        <path className="iso-wire" d={line([3, 6.9, base], [3, 8.6, base])} />
        <clipPath id="iso-gate-clip"><polygon points={clip} /></clipPath>
        <g clipPath="url(#iso-gate-clip)">
          <g className="iso-gate-press">
            <Box {...gate} z={base} h={0.55} className="iso-hot" />
            <Patch x={2.3} y={6.2} z={0.85} w={1.4} d={0.5} className="iso-gate-confirm" />
          </g>
        </g>
        <circle className="iso-gate-pulse" cx={pulseX.toFixed(1)} cy={pulseY.toFixed(1)} r="3" />
        <clipPath id="iso-gate-action-clip"><polygon points={actionClip} /></clipPath>
        <g clipPath="url(#iso-gate-action-clip)">
          <g className="iso-gate-action">
            <Box x={1.2} y={8.6} z={base} w={3.6} d={2.8} h={0.6} />
            <g className="iso-gate-tick">
              <g transform={surface(3, 10, 0.9)}>
                <circle className="iso-gate-mark" r="17" />
                <path className="iso-gate-mark" d="M-8 1 L-3 7 L8 -7" />
              </g>
            </g>
          </g>
        </g>
        <Silk x={-1} y={2.5} anchor="end">CONVERSATION</Silk>
        <Silk x={-1} y={8} anchor="end">CONFIRM</Silk>
      </g>
      <path className="iso-spoke" d={`M${hx} ${hy} L${cx} ${cy}`} />
      <circle className="iso-gate-tap" style={{ "--to-x": `${cx - hx}px`, "--to-y": `${cy - hy}px` } as CSSProperties} cx={hx} cy={hy} r="3" />
      <svg x={ax - 14} y={ay - 14} width="28" height="28" viewBox="0 0 256 256">
        <path className="iso-reader-icon iso-gate-person" d={PERSON} />
      </svg>
      <text className="iso-silk" x={ax} y={ay + 27} textAnchor="middle">HUMAN</text>
    </Art>
  );
}

export const serviceDiagrams = [Growth, Loop, Screen, Gate, Build, Layers];
