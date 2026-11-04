import * as THREE from "three";

// The Tools section's 3D coins (owner, 2026-11-03, after Revolut's coin row). Loaded on demand by components/ToolCoins.tsx.
// Satin silver faces with the logo engraved, a milled edge and a polished bevel, lit by a studio scene fed into PMREM.
// Motion (animations.md): spin in once when the row is in view, lean toward the cursor, and on hover (tap on touch)
// a coin faces the viewer, comes forward and shows its brand colours. Colours and timings come from app/tokens.css.

export type CoinOptions = { names: readonly string[]; logos: Record<string, readonly string[]>; reduced: boolean };

// Multi-colour marks, drawn over the engraving on hover: [colour token, path] in the mark's own viewBox.
// Figma: the official five-colour mark (Simple Icons only has the outline). Slack: its eight subpaths in pairs.
// ProtoPie: the three stacked shields of components/ToolLogos.tsx, back to front.
const SLACK = (d: string) => d.split(/(?=M)/);
const MULTI: Record<string, { box: [number, number]; parts: (logos: Record<string, readonly string[]>) => [string, string][] }> = {
  Figma: { box: [38, 57], parts: () => [
    ["--tool-figma-red", "M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"],
    ["--tool-figma-coral", "M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"],
    ["--tool-figma-purple", "M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"],
    ["--tool-figma-blue", "M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"],
    ["--tool-figma-green", "M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"],
  ] },
  Slack: { box: [24, 24], parts: (l) => {
    const p = SLACK(l.Slack[0]);
    const tokens = ["--tool-slack-red", "--tool-slack-blue", "--tool-slack-green", "--tool-slack-yellow"];
    return p.map((d, i) => [tokens[i >> 1], d] as [string, string]);
  } },
  ProtoPie: { box: [24, 24], parts: (l) => l.ProtoPie.map((d, i) => [["--tool-protopie-3", "--tool-protopie-2", "--tool-protopie-1"][i], d] as [string, string]) },
};
const BRAND_VAR: Record<string, string> = {
  Claude: "--tool-claude", Supabase: "--tool-supabase", Tailwind: "--tool-tailwind", Adobe: "--tool-adobe",
  Miro: "--tool-miro", SurveyMonkey: "--tool-surveymonkey",
  Cursor: "--tool-mono", Vercel: "--tool-mono", OpenAI: "--tool-mono", GitHub: "--tool-mono", Notion: "--tool-mono",
};

const R = 1, H = 0.085, FACE = 0.93, BEVEL = 0.022, REEDS = 160;
const GAP = 1.6; // coin centres, in coin radii: a light overlap (owner asked for more space, 2026-11-03)
const ANGLES = [0.5, -0.62, 0.36, -0.55, 0.55, -0.36, 0.62, -0.5]; // alternate so neighbours tuck behind each other; repeats
const DEPTH = [0.2, -0.3, 0.4, -0.1, 0.0, 0.35, -0.25, 0.15];
const TEX = 1024;
const LOGO_SIZE = 0.48; // of the face texture

export function mountCoins(stage: HTMLElement, canvas: HTMLCanvasElement, labels: HTMLElement[], { names, logos, reduced }: CoinOptions) {
  const css = (name: string) => getComputedStyle(stage).getPropertyValue(name).trim();
  const num = (name: string) => parseFloat(css(name));

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.autoClear = false;

  // Studio: dark graphite room, a large softbox upper left, a dim rim strip right, a broad front fill.
  const scene = new THREE.Scene();
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({ color: css("--coin-room"), side: THREE.BackSide })));
  const panel = (w: number, h: number, intensity: number, pos: [number, number, number]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
    m.material.color.setScalar(intensity);
    m.position.set(...pos);
    m.lookAt(0, 0, 0);
    env.add(m);
  };
  panel(14, 9, 5.5, [-8, 8, 9]);
  panel(3, 12, 1.1, [11, 1, 4]);
  panel(10, 4, 0.5, [0, -9, 6]);
  panel(16, 6, 0.9, [0, 2, 14]);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envMap = pmrem.fromScene(env, 0.02).texture;
  scene.environment = envMap;
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(-5, 6, 7);
  key.layers.enableAll();
  scene.add(key);

  // Narrow lens from far back: a wide lens on this wide canvas stretched the end coins into ovals.
  const camera = new THREE.PerspectiveCamera(10, 1, 0.1, 400);

  // Milled edge: a cylinder whose radius dips at every reed.
  const edgeGeo = new THREE.CylinderGeometry(R, R, 2 * (H - BEVEL), REEDS * 6, 1, true);
  const p = edgeGeo.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const reed = Math.pow(Math.abs(Math.sin((Math.atan2(v.z, v.x) * REEDS) / 2)), 0.5);
    const k = (R - 0.014 * (1 - reed)) / Math.hypot(v.x, v.z);
    p.setXYZ(i, v.x * k, v.y, v.z * k);
  }
  edgeGeo.computeVertexNormals();
  edgeGeo.rotateX(Math.PI / 2);

  // Polished bevel: a quarter round from the face out to the edge.
  const bev: THREE.Vector2[] = [];
  for (let i = 10; i >= 0; i--) {
    const t = (i / 10) * (Math.PI / 2);
    bev.push(new THREE.Vector2(FACE + (R - 0.014 - FACE) * Math.sin(t), H - BEVEL + BEVEL * Math.cos(t)));
  }
  const bevelFront = new THREE.LatheGeometry(bev, 256).rotateX(Math.PI / 2);
  const bevelBack = bevelFront.clone().rotateY(Math.PI);
  const faceGeo = new THREE.CircleGeometry(FACE, 128);
  const ringGeo = new THREE.RingGeometry(0.872, 0.878, 192);

  const textures: THREE.Texture[] = [];
  const canvasTex = (draw: (ctx: CanvasRenderingContext2D) => void, color = false) => {
    const c = document.createElement("canvas");
    c.width = c.height = TEX;
    draw(c.getContext("2d")!);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textures.push(t);
    return t;
  };
  // Fine satin grain with faint concentric brushing.
  const grain = (ctx: CanvasRenderingContext2D) => {
    const img = ctx.getImageData(0, 0, TEX, TEX), d = img.data;
    for (let y = 0; y < TEX; y++) for (let x = 0; x < TEX; x++) {
      const r = Math.hypot(x - TEX / 2, y - TEX / 2);
      const n = (Math.random() - 0.5) * 20 + Math.sin(r * 1.7 + Math.sin(r * 0.13) * 3) * 6;
      const o = (y * TEX + x) * 4;
      d[o] = d[o + 1] = d[o + 2] = Math.max(0, Math.min(255, d[o] + n));
    }
    ctx.putImageData(img, 0, 0);
  };
  // Grain is generated once per base level and copied into every coin's maps.
  const bases = new Map<string, HTMLCanvasElement>();
  const grainBase = (ctx: CanvasRenderingContext2D, level: string) => {
    let c = bases.get(level);
    if (!c) {
      c = document.createElement("canvas");
      c.width = c.height = TEX;
      const g = c.getContext("2d")!;
      g.fillStyle = level; g.fillRect(0, 0, TEX, TEX);
      grain(g);
      bases.set(level, c);
    }
    ctx.drawImage(c, 0, 0);
  };
  const drawLogo = (ctx: CanvasRenderingContext2D, paths: readonly string[]) => {
    const s = (TEX * LOGO_SIZE) / 24;
    ctx.save();
    ctx.translate(TEX / 2 - 12 * s, TEX / 2 - 12 * s);
    ctx.scale(s, s);
    const path = new Path2D();
    paths.forEach((d) => path.addPath(new Path2D(d)));
    ctx.fill(path);
    ctx.restore();
  };
  const faceMaterial = (paths: readonly string[]) => new THREE.MeshPhysicalMaterial({
    // Height: grain, with the logo as a soft-walled recess.
    bumpMap: canvasTex((ctx) => {
      grainBase(ctx, "#808080");
      ctx.filter = "blur(1.5px)"; ctx.fillStyle = "#2a2a2a"; drawLogo(ctx, paths); ctx.filter = "none";
    }),
    bumpScale: 1.6,
    // Colour: satin silver, the engraved floor a few shades darker.
    map: canvasTex((ctx) => {
      ctx.fillStyle = css("--coin-silver"); ctx.fillRect(0, 0, TEX, TEX);
      ctx.fillStyle = css("--coin-engrave"); drawLogo(ctx, paths);
    }, true),
    // Roughness: satin face, matte engraved floor.
    roughnessMap: canvasTex((ctx) => {
      grainBase(ctx, "#6b6b6b");
      ctx.fillStyle = "#c4c4c4"; drawLogo(ctx, paths);
    }),
    metalness: 1,
    roughness: 1,
  });
  // Brand colours, an inlay that fades in on hover (owner's exception to lime as the only accent).
  const brandMaterial = (name: string) => new THREE.MeshStandardMaterial({
    map: canvasTex((ctx) => {
      const multi = MULTI[name];
      if (multi) {
        const [w, h] = multi.box, s = (TEX * LOGO_SIZE) / Math.max(w, h); // same box as the 24-unit icons
        ctx.save();
        ctx.translate(TEX / 2 - (w / 2) * s, TEX / 2 - (h / 2) * s);
        ctx.scale(s, s);
        for (const [color, d] of multi.parts(logos)) { ctx.fillStyle = css(color); ctx.fill(new Path2D(d)); }
        ctx.restore();
      } else {
        ctx.fillStyle = css(BRAND_VAR[name] ?? "--tool-mono");
        drawLogo(ctx, logos[name]);
      }
    }, true),
    transparent: true, opacity: 0, metalness: 0.15, roughness: 0.45, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1,
  });

  const reedMetal = new THREE.MeshPhysicalMaterial({ color: css("--coin-reed"), metalness: 1, roughness: 0.32 });
  const polished = new THREE.MeshPhysicalMaterial({ color: css("--coin-bevel"), metalness: 1, roughness: 0.14 });
  const ringMat = new THREE.MeshBasicMaterial({ color: css("--coin-ring"), transparent: true, opacity: 0.5, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 });

  const coins = names.map((name, i) => {
    const coin = new THREE.Group();
    const face = faceMaterial(logos[name]);
    const brand = brandMaterial(name);
    coin.add(new THREE.Mesh(edgeGeo, reedMetal), new THREE.Mesh(bevelFront, polished), new THREE.Mesh(bevelBack, polished));
    for (const side of [1, -1]) {
      const flip = side < 0 ? Math.PI : 0;
      const add = (geo: THREE.BufferGeometry, mat: THREE.Material, z: number) => {
        const m = new THREE.Mesh(geo, mat);
        m.position.z = side * z;
        m.rotation.y = flip;
        coin.add(m);
      };
      add(faceGeo, face, H);
      add(ringGeo, ringMat, H + 0.0005);
      add(faceGeo, brand, H + 0.0008);
    }
    coin.traverse((o) => { o.userData.coin = i; o.layers.set(i + 1); }); // one layer per coin, drawn back to front
    const holder = new THREE.Group();
    holder.add(coin);
    const z = DEPTH[i % DEPTH.length];
    holder.position.set((i - (names.length - 1) / 2) * GAP, 0.15, z);
    scene.add(holder);
    return { holder, coin, brand, base: ANGLES[i % ANGLES.length], z, h: 0 };
  });

  // Coins are --coins-size across (per breakpoint, on .tools-stage); if the row is wider than the stage, it shrinks to fit.
  const resize = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const half = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
    // The row starts at the content's left edge (--coins-pad, the section's side padding), left aligned with the heading.
    const pad = num("--coins-pad");
    const rowW = (names.length - 1) * GAP + 2 * R + 0.6; // 0.6: room for the last coin to grow on hover
    const viewH = (h * 2 * R) / num("--coins-size");
    const fitW = rowW / ((1 - (2 * pad) / w) * 2 * half * camera.aspect); // shrink if the row is wider than the content
    camera.position.z = Math.max(fitW, viewH / 2 / half);
    const halfW = half * camera.aspect * camera.position.z, unitsPerPx = (2 * halfW) / w;
    camera.position.x = -((names.length - 1) / 2) * GAP - R + halfW - pad * unitsPerPx;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    // Perspective pushes the first coin's rim a few px past that line (it is angled and nearer the camera); nudge it back.
    const first = coins[0];
    v.set(first.holder.position.x - R * Math.cos(first.base), 0.15, first.z + R * Math.sin(first.base)).project(camera);
    camera.position.x += ((v.x * 0.5 + 0.5) * w - pad) * unitsPerPx;
    camera.updateMatrixWorld();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(stage);
  resize();

  // Spin-in, once, when most of the row is in view. Reduced motion starts at rest.
  const SPIN = num("--coins-spin"), STAGGER = num("--coins-stagger"), HOVER = num("--coins-hover");
  const ease = (t: number) => 1 - Math.pow(1 - t, 4);
  let start: number | null = reduced ? -Infinity : null;
  let visible = false, raf = 0;
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && start === null && e.intersectionRatio >= 0.4) start = performance.now();
    if (visible && !raf) raf = requestAnimationFrame(frame);
  }, { threshold: [0, 0.4] });
  io.observe(stage);

  // Cursor tilt: the cluster leans a few degrees toward the pointer.
  const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
  const fine = matchMedia("(pointer: fine)").matches;
  // Hover (tap on touch): raycast to the coin under the pointer.
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  ray.layers.enableAll();
  let hover = -1;
  const pick = (e: PointerEvent) => {
    const r = stage.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(coins.map((c) => c.holder), true)[0];
    return hit ? (hit.object.userData.coin as number) : -1;
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const r = stage.getBoundingClientRect();
    if (!reduced && fine) {
      tilt.ty = ((e.clientX - r.left) / r.width - 0.5) * 0.35;
      tilt.tx = ((e.clientY - r.top) / r.height - 0.5) * 0.25;
    }
    hover = pick(e);
    stage.style.cursor = hover >= 0 ? "pointer" : "";
  };
  const onLeave = () => { tilt.tx = tilt.ty = 0; hover = -1; };
  const onUp = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    const i = pick(e);
    hover = i === hover ? -1 : i;
  };
  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerleave", onLeave);
  stage.addEventListener("pointerup", onUp);

  let last = performance.now();
  function frame(now: number) {
    raf = 0;
    const dt = Math.min(64, Math.max(0, now - last));
    last = now;
    tilt.x += (tilt.tx - tilt.x) * 0.08;
    tilt.y += (tilt.ty - tilt.y) * 0.08;
    coins.forEach((c, i) => {
      c.h += ((i === hover ? 1 : 0) - c.h) * (1 - Math.exp(-dt / HOVER));
      const h = reduced ? 0 : c.h; // reduced motion: colour only
      c.brand.opacity = c.h;
      const t = start === null ? 0 : start === -Infinity ? 1 : Math.min(1, Math.max(0, (now - start - i * STAGGER) / SPIN));
      const k = ease(t);
      c.coin.rotation.y = (c.base + (1 - k) * Math.PI * 1.5) * (1 - h);
      c.coin.rotation.x = tilt.x * (1 - h);
      c.holder.rotation.y = tilt.y * 0.6 * (1 - h);
      c.holder.position.y = 0.15 - (1 - k) * 0.6;
      c.holder.position.z = c.z + h * 1.6;
      c.coin.scale.setScalar((0.85 + 0.15 * k) * (1 + 0.08 * h));
      c.holder.updateMatrixWorld();
      const label = labels[i];
      if (label) {
        v.set(0, i % 2 ? -1.62 : -1.28, 0).applyMatrix4(c.holder.matrixWorld).project(camera); // alternate rows so long names never collide
        label.style.translate = `${(v.x * 0.5 + 0.5) * stage.clientWidth}px ${(-v.y * 0.5 + 0.5) * stage.clientHeight}px`;
        label.toggleAttribute("data-on", t >= 0.7);
        label.toggleAttribute("data-hover", c.h > 0.5);
      }
    });
    // Painter's order: each coin draws whole over the ones behind it, so neighbours that cross in 3D never show
    // one coin's edge through another's face.
    renderer.clear();
    for (const i of coins.map((c, i) => i).sort((a, b) => coins[a].holder.position.z - coins[b].holder.position.z)) {
      camera.layers.set(i + 1);
      renderer.clearDepth();
      renderer.render(scene, camera);
    }
    if (visible) raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", onLeave);
    stage.removeEventListener("pointerup", onUp);
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
    });
    [edgeGeo, bevelFront, bevelBack, faceGeo, ringGeo].forEach((g) => g.dispose());
    textures.forEach((t) => t.dispose());
    envMap.dispose();
    pmrem.dispose();
    renderer.dispose();
  };
}
