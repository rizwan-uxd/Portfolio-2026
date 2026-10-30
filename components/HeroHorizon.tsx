"use client";

import { useEffect, useRef } from "react";

const VERTEX = `attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

// Distances are in canvas heights, measured from the top of the arc. The light fades to nothing at the
// canvas top edge, and the canvas sits below the CTA, so it can't reach the hero text.
const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform vec3 uBrand, uCore;
uniform float uTime, uIntro, uRadius, uRimY, uRimGlow, uAtmosphere, uBeams, uFlare;

float hash(float n) { return fract(sin(n) * 43758.5453); }
float noise(float x) {
  float i = floor(x), f = fract(x);
  return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
}

void main() {
  vec2 p = gl_FragCoord.xy;
  vec2 q = (p - vec2(0.5 * uRes.x, uRimY * uRes.y)) / uRes.y;
  float aspect = uRes.x / uRes.y;
  float R = uRadius * aspect;
  float d = length(q - vec2(0.0, -R)) - R;

  vec2 sun = vec2(sin(uTime * 0.05) * 0.03 * aspect, 0.0);
  float arc = atan(q.x, q.y + R) * R - sun.x;
  float spread = mix(0.02, 0.45, uIntro) * aspect;
  float along = exp(-arc * arc / (spread * spread));
  float breathe = 0.92 + 0.08 * sin(uTime * 0.4);

  float rim = exp(-abs(d) / (d > 0.0 ? 0.008 : 0.003)) * (0.12 + along) * uRimGlow;
  float above = smoothstep(-0.002, 0.006, d);
  float atmosphere = exp(-max(d, 0.0) / 0.2) * (0.08 + 0.6 * along) * above * uAtmosphere * breathe;

  // Beams fan out from a point behind the horizon, so they read as a sunburst and not one thin spike.
  vec2 v = q - sun;
  vec2 origin = q - sun + vec2(0.0, 0.7);
  float a = atan(origin.x, origin.y);
  float wide = noise(a * 15.0 + uTime * 0.14);
  float fine = noise(a * 41.0 - uTime * 0.09 + 7.0);
  float shafts = pow(0.7 * wide + 0.3 * fine, 2.0) * 1.6;
  float beams = shafts * (0.25 + 0.75 * along) * exp(-max(d, 0.0) / 0.42) * above * uBeams * uIntro * breathe;

  float flare = exp(-dot(v * vec2(0.28, 1.0), v * vec2(0.28, 1.0)) / 0.003) * uFlare * uIntro;
  float top = 1.0 - uRimY;
  float fade = smoothstep(top, top * 0.45, q.y);

  float tint = (rim + atmosphere + beams) * fade;
  float core = (flare + rim * along * along * 0.8) * fade;
  vec3 color = uBrand * tint + uCore * core;
  float dither = (fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  color = max(color + dither, 0.0);
  gl_FragColor = vec4(color, clamp(max(color.r, max(color.g, color.b)), 0.0, 1.0));
}`;

const rgb = (hex: string) => {
  const n = parseInt(hex.trim().slice(1), 16);
  return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255] as const;
};

export function HeroHorizon() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!canvas || !gl) return; // no WebGL: the space under the CTA stays empty

    const css = getComputedStyle(canvas);
    const token = (name: string) => parseFloat(css.getPropertyValue(name));
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.bindAttribLocation(program, 0, "a");
    gl.linkProgram(program);
    gl.useProgram(program);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const at = (name: string) => gl.getUniformLocation(program, name);
    gl.uniform3fv(at("uBrand"), rgb(css.getPropertyValue("--brand")));
    gl.uniform3fv(at("uCore"), rgb(css.getPropertyValue("--foreground")));
    gl.uniform1f(at("uRadius"), token("--horizon-radius"));
    gl.uniform1f(at("uRimY"), token("--horizon-rim-y"));
    gl.uniform1f(at("uRimGlow"), token("--horizon-rim-glow"));
    gl.uniform1f(at("uAtmosphere"), token("--horizon-atmosphere"));
    gl.uniform1f(at("uBeams"), token("--horizon-beams"));
    gl.uniform1f(at("uFlare"), token("--horizon-flare"));
    const uRes = at("uRes"), uTime = at("uTime"), uIntro = at("uIntro");
    const introLength = token("--horizon-intro");
    const maxDpr = token("--horizon-max-dpr");

    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let time = 0, last = 0, frame = 0, onScreen = true;

    const draw = () => {
      const settled = motion.matches ? 1 : 1 - Math.pow(1 - Math.min(time / introLength, 1), 3);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uIntro, settled);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    const tick = (now: number) => {
      time += last ? (now - last) / 1000 : 0;
      last = now;
      draw();
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
      if (motion.matches) draw();
      else if (onScreen && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, maxDpr);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      draw();
    };

    const sizes = new ResizeObserver(resize);
    sizes.observe(canvas);
    const visible = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    visible.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);

    return () => {
      cancelAnimationFrame(frame);
      sizes.disconnect();
      visible.disconnect();
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      gl.deleteProgram(program);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="hero-horizon" />;
}
