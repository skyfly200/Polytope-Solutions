// Faceted buttons. Every button-like element (.v-btn, .btn, .cta-btn) gets an
// SVG polygon behind its text: a six-sided gem outline whose two opposite
// corner cuts are sized by the depth of two vertices of a rotating 24-cell.
// At rest each button holds its own pose; while hovered or focused the cuts
// drift slowly. The cuts are small and capped, so the button's size and the
// room around its text never change.
//
// Reduced-motion users get the static pose only. Nothing here depends on
// scroll position.

import { getPolytope } from "@/lib/polytopes";

const SELECTOR = ".v-btn, .btn, .cta-btn";
const NS = "http://www.w3.org/2000/svg";
const POINTS = 2;

interface State {
  el: HTMLElement;
  svg: SVGSVGElement;
  poly: SVGPolygonElement;
  t: number;
  energy: number;
  hot: boolean;
  w: number;
  h: number;
  ghost: boolean;
}

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
  const { el, svg, poly } = s;
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
  // Corner cuts, kept small so the label never loses room.
  const maxCut = Math.max(3, Math.min(9, padV * 0.9, padH * 0.5));
  const minCut = maxCut * 0.35;
  const v = shape();
  const c1 = minCut + (maxCut - minCut) * depth(v[0], s.t);
  const c2 = minCut + (maxCut - minCut) * depth(v[1], s.t);
  // Six points: the top-left and bottom-right corners are cut.
  const pts: [number, number][] = [
    [c1, 0],
    [w, 0],
    [w, h - c2],
    [w - c2, h],
    [0, h],
    [0, c1]
  ];
  poly.setAttribute("points", pts.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" "));
}

function frame(now: number) {
  const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
  last = now;
  let busy = false;
  states.forEach(s => {
    if (!s.el.isConnected) return;
    const target = s.hot ? 1 : 0;
    s.energy += (target - s.energy) * Math.min(1, dt * 4);
    if (s.hot || s.energy > 0.01) {
      s.t += dt * 0.5 * s.energy;
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
  svg.appendChild(poly);
  el.classList.add("facet");
  el.appendChild(svg);
  const s: State = { el, svg, poly, t: 0.7 + seed++ * 1.9, energy: 0, hot: false, w: 0, h: 0, ghost };
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
