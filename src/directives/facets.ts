// Faceted buttons. Every button-like element (.v-btn, .btn, .cta-btn) gets an
// SVG polygon behind its text: an eight-sided gem outline whose four
// corner cuts are each sized by the depth of a vertex of a rotating 24-cell.
// At rest each button holds its own pose; while hovered or focused the cuts
// drift slowly. The cuts are small and capped, so the button's size and the
// room around its text never change.
//
// The gem also leans toward the cursor with the same mouse-driven perspective
// as v-tilt text (tilt.ts): the polygon rotates in 3D and trails stacked,
// darker copies behind it for depth. Label text stays flat and readable.
// Touch devices and reduced-motion users get the static pose only. Nothing
// here depends on scroll position.

import { getPolytope } from "@/lib/polytopes";
import { perspectiveEnabled, tiltTarget, onPerspective, DEPTH_SCALE } from "./tilt";

const SELECTOR = ".v-btn, .btn, .cta-btn";
const NS = "http://www.w3.org/2000/svg";
const POINTS = 4;

interface State {
  el: HTMLElement;
  svg: SVGSVGElement;
  poly: SVGPolygonElement;
  lite: SVGPolygonElement;
  t: number;
  energy: number;
  hot: boolean;
  w: number;
  h: number;
  ghost: boolean;
  rx: number;
  ry: number;
  layers: SVGPolygonElement[];
  label: HTMLElement | null;
}

const MAX_TILT = 14;
const DEPTH = 6 * DEPTH_SCALE;
const PERSPECTIVE = 700;
const LAYERS = 6;
// Label extrusion relative to the button's, so the text sits just above the face.
const LABEL_DEPTH = 0.35;
let tiltOn = false;

const states = new Map<HTMLElement, State>();
let raf = 0;
let last = 0;
let seed = 0;
let reduced = false;
let verts: number[][] | null = null;

function shape() {
  if (!verts) {
    const p = getPolytope("cell24");
    // Spread the 12 sample vertices across the whole shape.
    verts = [];
    for (let i = 0; i < POINTS; i++) verts.push(p.vertices[(i * 2 + 1) % p.vertices.length] as number[]);
  }
  return verts;
}

// 4D rotation of vertex v by angle t in three planes; returns the depth (w)
// scaled to roughly 0..1.
function depth(v: number[], t: number): number {
  let [x, y, z, q] = v;
  const ca = Math.cos(t), sa = Math.sin(t);
  const cb = Math.cos(t * 0.618), sb = Math.sin(t * 0.618);
  const cc = Math.cos(t * 0.27), sc = Math.sin(t * 0.27);
  let n = x * ca - q * sa;
  q = x * sa + q * ca;
  x = n;
  n = y * cb - z * sb;
  z = y * sb + z * cb;
  y = n;
  n = z * cc - q * sc;
  q = z * sc + q * cc;
  return Math.max(0, Math.min(1, 0.5 + q * 0.55 + x * 0.1));
}

function draw(s: State) {
  const { el, svg, poly, lite } = s;
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  if (!w || !h) return;
  if (w !== s.w || h !== s.h) {
    s.w = w;
    s.h = h;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
  }
  const cs = getComputedStyle(el);
  const padH = parseFloat(cs.paddingLeft) || 12;
  const fs = parseFloat(cs.fontSize) || 14;
  const padV = Math.max(0, (h - fs * 1.3) / 2);
  // Corner cuts, each sized by its own 4D vertex depth. Capped so the label
  // never loses room.
  const maxCut = Math.max(4, Math.min(14, padV * 1.3, padH * 0.7));
  const minCut = maxCut * 0.3;
  const v = shape();
  const c: number[] = [];
  for (let i = 0; i < POINTS; i++) c.push(minCut + (maxCut - minCut) * depth(v[i], s.t));
  // Eight points: all four corners are cut, each by a different amount.
  const pts: [number, number][] = [
    [c[0], 0],
    [w - c[1], 0],
    [w, c[1]],
    [w, h - c[2]],
    [w - c[2], h],
    [c[3], h],
    [0, h - c[3]],
    [0, c[0]]
  ];
  const fmt = (a: [number, number][]) => a.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  poly.setAttribute("points", fmt(pts));
  for (const l of s.layers) l.setAttribute("points", fmt(pts));
  // Second tone: a lighter facet across the cut top-left corner, bounded by
  // the line x + y = k (the original gem-button look). Clip the outline to
  // that half-plane.
  const k = 0.22 * (w + h);
  const out: [number, number][] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    const da = a[0] + a[1] - k, db = b[0] + b[1] - k;
    if (da <= 0) out.push(a);
    if (da * db < 0) {
      const f = da / (da - db);
      out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
    }
  }
  lite.setAttribute("points", fmt(out));
}

function applyTilt(s: State) {
  const sx = (-s.ry / MAX_TILT) * DEPTH;
  const sy = (s.rx / MAX_TILT) * DEPTH;
  // Rotate the whole button (shape, extrusion and label) as one rigid piece.
  s.el.style.transform =
    "perspective(" + PERSPECTIVE + "px) rotateX(" + s.rx.toFixed(2) + "deg) rotateY(" + s.ry.toFixed(2) + "deg)";
  s.layers.forEach((l, i) => {
    const f = (i + 1) / LAYERS;
    l.setAttribute("transform", "translate(" + (sx * f).toFixed(2) + " " + (sy * f).toFixed(2) + ")");
  });
  if (s.label) {
    // Label gets the same tilt and stacked-shadow extrusion as v-tilt text.
    const ls: string[] = [];
    for (let i = 1; i <= 8; i++) {
      const f = i / 8;
      // Dark shadow: the button face is the same purple as the text extrusion.
      ls.push((sx * LABEL_DEPTH * f).toFixed(1) + "px " + (sy * LABEL_DEPTH * f).toFixed(1) + "px 0 rgba(30,8,90," + (0.85 * (1 - f) + 0.1).toFixed(2) + ")");
    }
    s.label.style.textShadow = ls.join(",");
  }
}

function frame(now: number) {
  const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
  last = now;
  let busy = false;
  states.forEach(s => {
    if (!s.el.isConnected) return;
    if (tiltOn) {
      const r = s.el.getBoundingClientRect();
      if (r.bottom >= 0 && r.top <= window.innerHeight) {
        const t = tiltTarget(r, MAX_TILT);
        s.rx += (t.rx - s.rx) * 0.12;
        s.ry += (t.ry - s.ry) * 0.12;
        applyTilt(s);
        if (Math.abs(t.rx - s.rx) > 0.01 || Math.abs(t.ry - s.ry) > 0.01) busy = true;
      }
    }
    const target = s.hot ? 1 : 0;
    s.energy += (target - s.energy) * Math.min(1, dt * 4);
    if (s.hot || s.energy > 0.01) {
      s.t += dt * 0.7 * s.energy;
      draw(s);
      busy = true;
    }
  });
  raf = busy ? requestAnimationFrame(frame) : 0;
  if (!busy) last = 0;
}

function wake() {
  if (!raf && !reduced) raf = requestAnimationFrame(frame);
}

function attach(el: HTMLElement) {
  if (states.has(el)) return;
  const cs = getComputedStyle(el);
  const fill = cs.backgroundColor;
  const svg = document.createElementNS(NS, "svg") as SVGSVGElement;
  svg.setAttribute("class", "facet-bg");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("preserveAspectRatio", "none");
  const poly = document.createElementNS(NS, "polygon") as SVGPolygonElement;
  const ghost = /rgba\(\s*255,\s*255,\s*255|rgba\(.*,\s*0\)$/.test(fill) || fill === "transparent";
  poly.setAttribute("fill", ghost ? "rgba(255,255,255,0.1)" : fill);
  if (ghost) {
    poly.setAttribute("stroke", "rgba(255,255,255,0.5)");
    poly.setAttribute("stroke-width", "1");
  }
  poly.setAttribute("vector-effect", "non-scaling-stroke");
  const layers: SVGPolygonElement[] = [];
  if (tiltOn) {
    // Extrusion copies sit behind the face, darker and fainter the deeper.
    for (let i = LAYERS; i >= 1; i--) {
      const l = document.createElementNS(NS, "polygon") as SVGPolygonElement;
      l.setAttribute("fill", "rgba(124,77,255," + (0.5 * (1 - i / LAYERS) + 0.12).toFixed(2) + ")");
      l.setAttribute("class", "facet-depth");
      svg.appendChild(l);
      layers.unshift(l);
    }
    el.style.transformStyle = "preserve-3d";
  }
  svg.appendChild(poly);
  const lite = document.createElementNS(NS, "polygon") as SVGPolygonElement;
  lite.setAttribute("class", "facet-lite");
  svg.appendChild(lite);
  let label: HTMLElement | null = null;
  if (tiltOn) {
    label = el.querySelector<HTMLElement>(".v-btn__content");
    if (!label) {
      // Plain buttons/links: wrap the existing content so it can tilt.
      label = document.createElement("span");
      label.className = "facet-label";
      Array.from(el.childNodes).forEach(n => label!.appendChild(n));
      el.appendChild(label);
    }
    label.style.display = "inline-flex";
  }
  el.classList.add("facet");
  el.appendChild(svg);
  const s: State = { el, svg, poly, lite, t: 0.7 + seed++ * 1.9, energy: 0, hot: false, w: 0, h: 0, ghost, rx: 0, ry: 0, layers, label };
  states.set(el, s);
  const on = () => {
    s.hot = true;
    wake();
  };
  const off = () => {
    s.hot = false;
    wake();
  };
  el.addEventListener("mouseenter", on);
  el.addEventListener("mouseleave", off);
  el.addEventListener("focus", on);
  el.addEventListener("blur", off);
  draw(s);
  if ("ResizeObserver" in window) new ResizeObserver(() => draw(s)).observe(el);
}

function scan(root: ParentNode) {
  root.querySelectorAll<HTMLElement>(SELECTOR).forEach(attach);
  if ((root as HTMLElement).matches && (root as HTMLElement).matches(SELECTOR)) attach(root as HTMLElement);
}

export function startFacets() {
  if (typeof document === "undefined") return;
  reduced = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  tiltOn = !reduced && perspectiveEnabled();
  if (tiltOn) onPerspective(wake);
  scan(document);
  new MutationObserver(muts => {
    for (const m of muts) {
      m.addedNodes.forEach(n => {
        if (n.nodeType === 1) scan(n as HTMLElement);
      });
    }
    // Re-add the background if a re-render dropped it.
    states.forEach((s, el) => {
      if (!el.isConnected) states.delete(el);
      else if (!el.contains(s.svg)) el.appendChild(s.svg);
    });
  }).observe(document.body, { childList: true, subtree: true });
}
