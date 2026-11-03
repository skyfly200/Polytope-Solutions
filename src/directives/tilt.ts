// v-tilt: gives text a 3D perspective tilt that follows the mouse cursor.
//
//   h1(v-tilt) Title
//   h1(v-tilt="{ max: 12, depth: 6 }") Title
//
// Each element turns to "face" the cursor: the further the cursor is from the
// element's centre, the more it rotates (up to `max` degrees), and a layered
// text-shadow is offset in the opposite direction to give the glyphs depth.
//
// A single shared mousemove listener and a single requestAnimationFrame loop
// drive every tilted element, and the loop stops as soon as everything has
// settled. Nothing is attached on touch-only devices or when the user prefers
// reduced motion.
//
// Do not put v-tilt on an element that is itself animated with a CSS transform
// (e.g. an AOS `data-aos` element); wrap the text in an inner element instead.

import { DirectiveOptions } from "vue";

interface TiltOptions {
  max: number; // max rotation in degrees
  depth: number; // shadow extrusion in px at full tilt
  perspective: number; // px
}

interface TiltState {
  el: HTMLElement;
  opts: TiltOptions;
  rx: number;
  ry: number;
}

const DEFAULTS: TiltOptions = { max: 14, depth: 6, perspective: 700 };

const items: TiltState[] = [];
let mouseX = 0;
let mouseY = 0;
let hasMouse = false;
let raf = 0;
let listening = false;

function enabled(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function onMove(e: MouseEvent) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  hasMouse = true;
  kick();
}

function onLeave(e: MouseEvent) {
  if (!e.relatedTarget) {
    hasMouse = false;
    kick();
  }
}

function kick() {
  if (!raf) raf = requestAnimationFrame(tick);
}

function tick() {
  raf = 0;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let moving = false;

  for (let i = 0; i < items.length; i++) {
    const s = items[i];
    const r = s.el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) continue; // off-screen
    let tx = 0;
    let ty = 0;
    if (hasMouse) {
      const dx = (mouseX - (r.left + r.width / 2)) / (vw / 2);
      const dy = (mouseY - (r.top + r.height / 2)) / (vh / 2);
      ty = Math.max(-1, Math.min(1, dx)) * s.opts.max;
      tx = -Math.max(-1, Math.min(1, dy)) * s.opts.max;
    }
    s.rx += (tx - s.rx) * 0.12;
    s.ry += (ty - s.ry) * 0.12;
    if (Math.abs(tx - s.rx) > 0.01 || Math.abs(ty - s.ry) > 0.01) moving = true;
    apply(s);
  }

  if (moving) kick();
}

function apply(s: TiltState) {
  const { el, opts, rx, ry } = s;
  el.style.transform =
    "perspective(" + opts.perspective + "px) rotateX(" + rx.toFixed(2) +
    "deg) rotateY(" + ry.toFixed(2) + "deg)";
  // Extrude the text away from the viewer with stacked shadows.
  const sx = (-ry / opts.max) * opts.depth;
  const sy = (rx / opts.max) * opts.depth;
  const layers: string[] = [];
  const steps = 4;
  for (let i = 1; i <= steps; i++) {
    const f = i / steps;
    const a = (0.35 * (1 - f) + 0.1).toFixed(2);
    layers.push(
      (sx * f).toFixed(1) + "px " + (sy * f).toFixed(1) + "px 0 rgba(124,77,255," + a + ")"
    );
  }
  el.style.textShadow = layers.join(",");
}

function options(value: any): TiltOptions {
  return Object.assign({}, DEFAULTS, value && typeof value === "object" ? value : {});
}

const tilt: DirectiveOptions = {
  inserted(el, binding) {
    if (!enabled()) return;
    const s: TiltState = { el, opts: options(binding.value), rx: 0, ry: 0 };
    el.style.transformStyle = "preserve-3d";
    el.style.setProperty("will-change", "transform");
    items.push(s);
    if (!listening) {
      window.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseout", onLeave);
      listening = true;
    }
    apply(s);
    if (hasMouse) kick();
  },
  update(el, binding) {
    const s = items.find(i => i.el === el);
    if (s) s.opts = options(binding.value);
  },
  unbind(el) {
    const idx = items.findIndex(i => i.el === el);
    if (idx >= 0) items.splice(idx, 1);
    if (!items.length && listening) {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseout", onLeave);
      listening = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }
  }
};

export default tilt;
