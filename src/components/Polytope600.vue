<template lang="pug">
.polytope-600(:style="{ width: size, height: size }" role="img" aria-label="Polytope Solutions logo: a 600-cell rotating in four dimensions")
  canvas(ref="canvas")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { build600Cell } from "@/lib/polytope600";

// Geometry is identical for every instance, so build it once.
const POLY = build600Cell();
const V = POLY.vertices.length;
const E = POLY.edges.length;
// Rest pose: look at the 600-cell vertex-first along w. The 12 neighbours of
// the vertex (0,0,0,1) form an icosahedron; its vertex (0, 1/φ, 1)/|.| is a
// 5-fold axis. Rotating that axis onto +z makes the rest view 10-fold symmetric.
const PHI = (1 + Math.sqrt(5)) / 2;
const AXIS_LEN = Math.hypot(1 / PHI, 1);
const ZX = 0, ZY = 1 / PHI / AXIS_LEN, ZZ = 1 / AXIS_LEN; // new z' = axis
// x' = (1,0,0), y' = z' x x'
const YX = 0, YY = ZZ, YZ = -ZY;
const SRC = new Float32Array(V * 4);
POLY.vertices.forEach((v, i) => {
  SRC[i * 4] = v[0];
  SRC[i * 4 + 1] = v[0] * YX + v[1] * YY + v[2] * YZ;
  SRC[i * 4 + 2] = v[0] * ZX + v[1] * ZY + v[2] * ZZ;
  SRC[i * 4 + 3] = v[3];
});
const EDGE_A = new Uint16Array(E);
const EDGE_B = new Uint16Array(E);
POLY.edges.forEach(([a, b], i) => {
  EDGE_A[i] = a;
  EDGE_B[i] = b;
});

// Edges are batched into depth buckets so each frame costs a handful of
// stroke() calls instead of 720.
const BUCKETS = 8;

@Component({})
export default class Polytope600 extends Vue {
  @Prop({ default: "100%" }) readonly size!: string;
  // Radians per second for the primary 4D rotation (free-spinning mode).
  @Prop({ default: 0.3 }) readonly speed!: number;
  @Prop({ default: 1.2 }) readonly lineWidth!: number;
  @Prop({ default: "255,255,255" }) readonly color!: string;
  // The cursor drives two of the 4D rotation planes (XW and YW). The shape
  // stays centred: the projection origin never moves, only its rotation.
  @Prop({ type: Boolean, default: false }) readonly followMouse!: boolean;
  // How far (radians) the cursor can push the 4D rotation at the screen edge.
  @Prop({ default: 1.6 }) readonly mouseReach!: number;

  // Non-reactive runtime state (left undefined so Vue does not observe it).
  private ctx!: CanvasRenderingContext2D | null;
  private raf!: number;
  private last!: number;
  private t!: number;
  private px!: Float32Array;
  private py!: Float32Array;
  private pd!: Float32Array;
  private buckets!: number[][];
  private visible!: boolean;
  private reduced!: boolean;
  private io!: IntersectionObserver | null;
  private mx!: number;
  private my!: number;
  private vx!: number;
  private vy!: number;
  private lastMove!: number;
  private cssW!: number;
  private cssH!: number;
  private dpr!: number;
  private maxDpr!: number;
  private slow!: number;
  private ema!: number;
  private styles!: string[];
  private settled!: boolean;

  mounted() {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d");
    this.px = new Float32Array(V);
    this.py = new Float32Array(V);
    this.pd = new Float32Array(V);
    this.buckets = [];
    for (let i = 0; i < BUCKETS; i++) this.buckets.push([]);
    this.t = 0;
    this.last = 0;
    this.raf = 0;
    this.mx = this.my = this.vx = this.vy = 0;
    this.lastMove = 0;
    this.slow = 0;
    this.ema = 0;
    this.settled = false;
    this.maxDpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.dpr = this.maxDpr;
    this.styles = [];
    for (let i = 0; i < BUCKETS; i++) {
      const f = (i + 0.5) / BUCKETS;
      this.styles.push("rgba(" + this.color + "," + (0.08 + 0.85 * f * f).toFixed(3) + ")");
    }
    this.visible = true;
    this.io = null;

    const mq = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    this.reduced = !!(mq && mq.matches);

    this.onResize = this.onResize.bind(this);
    this.onMouse = this.onMouse.bind(this);
    this.onTouch = this.onTouch.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.onVisibility = this.onVisibility.bind(this);
    this.frame = this.frame.bind(this);

    window.addEventListener("resize", this.onResize, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
    if (this.followMouse && !this.reduced) {
      window.addEventListener("mousemove", this.onMouse, { passive: true });
      // Touch screens have no hover, so a drag steers the rotation instead.
      window.addEventListener("touchmove", this.onTouch, { passive: true });
      window.addEventListener("touchend", this.onLeave, { passive: true });
      document.addEventListener("mouseleave", this.onLeave);
    }
    if ("IntersectionObserver" in window) {
      this.io = new IntersectionObserver(entries => {
        this.visible = entries[0].isIntersecting;
        this.schedule();
      });
      this.io.observe(this.$el);
    }

    this.onResize();
    this.t = 0;
    this.draw();
    this.schedule();
  }

  beforeDestroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousemove", this.onMouse);
    window.removeEventListener("touchmove", this.onTouch);
    window.removeEventListener("touchend", this.onLeave);
    document.removeEventListener("mouseleave", this.onLeave);
    document.removeEventListener("visibilitychange", this.onVisibility);
    if (this.io) this.io.disconnect();
  }

  private schedule() {
    const shouldRun = !this.reduced && this.visible && !document.hidden;
    if (shouldRun && !this.raf) {
      this.last = 0;
      this.raf = requestAnimationFrame(this.frame);
    } else if (!shouldRun && this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  private onVisibility() {
    this.schedule();
  }

  // Pointer left the window or the finger lifted: glide back to the rest pose.
  private onLeave() {
    this.mx = this.my = 0;
    this.lastMove = performance.now();
    this.wake();
  }

  private wake() {
    this.settled = false;
    this.schedule();
  }

  private onMouse(e: MouseEvent) {
    this.setPointer(e.clientX, e.clientY);
  }

  private onTouch(e: TouchEvent) {
    const touch = e.touches[0];
    if (touch) this.setPointer(touch.clientX, touch.clientY);
  }

  // Maps a viewport point to [-1, 1] on each axis, centre = 0.
  private setPointer(x: number, y: number) {
    this.mx = Math.max(-1, Math.min(1, (x / window.innerWidth) * 2 - 1));
    this.my = Math.max(-1, Math.min(1, (y / window.innerHeight) * 2 - 1));
    this.lastMove = performance.now();
    this.wake();
  }

  private onResize() {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    const rect = (this.$el as HTMLElement).getBoundingClientRect();
    const dpr = this.dpr;
    this.cssW = Math.max(1, rect.width);
    this.cssH = Math.max(1, rect.height);
    canvas.width = Math.round(this.cssW * dpr);
    canvas.height = Math.round(this.cssH * dpr);
    if (this.ctx) this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.draw();
  }

  private frame(now: number) {
    const rawDt = this.last ? (now - this.last) / 1000 : 0;
    const dt = Math.min(rawDt, 0.05);
    this.last = now;
    let tx = 0, ty = 0;
    if (this.followMouse) {
      // The pointer offset from the centre of the window sets the target
      // rotation; centred pointer = the symmetric rest pose. Before any
      // pointer input the pose sways gently around the rest pose.
      if (this.lastMove) {
        tx = this.mx;
        ty = this.my;
      } else {
        this.t += dt;
        tx = Math.sin(this.t * 0.6) * 0.3;
        ty = Math.cos(this.t * 0.45) * 0.22;
      }
    } else {
      this.t += dt * this.speed;
    }
    // Ease toward the target (about 0.15s time constant) so it is brisk but
    // never snaps.
    const k = 1 - Math.exp(-dt * 7);
    this.vx += (tx - this.vx) * k;
    this.vy += (ty - this.vy) * k;
    // Once the pose has stopped changing there is nothing to redraw.
    const still = this.followMouse && this.lastMove &&
      Math.abs(tx - this.vx) < 1e-4 && Math.abs(ty - this.vy) < 1e-4;
    if (still) {
      if (!this.settled) this.draw();
      this.settled = true;
      this.raf = 0;
      return;
    }
    this.draw();
    // Adaptive resolution: if the smoothed frame time stays over budget,
    // drop the pixel ratio a step (never below 1).
    if (rawDt > 0 && rawDt < 0.2) {
      this.ema = this.ema ? this.ema * 0.9 + rawDt * 0.1 : rawDt;
      this.slow++;
      if (this.slow > 20 && this.ema > 0.021 && this.dpr > 1) {
        this.dpr = Math.max(1, this.dpr - 0.25);
        this.slow = 0;
        this.ema = 0;
        this.onResize();
      }
    }
    this.raf = requestAnimationFrame(this.frame);
  }

  private draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    const w = this.cssW;
    const h = this.cssH;
    const t = this.t;

    // Double rotation in two orthogonal planes (XW and YZ) plus a slow
    // third (ZW) so the motion never settles into a simple loop.
    // The cursor adds an offset to the XW plane (horizontal) and a rotation
    // in the YW plane (vertical), so the shape turns in 4D as you move.
    const reach = this.mouseReach;
    // Follow mode: t = 0 and the pointer offsets give the rest pose at centre.
    const free = !this.followMouse;
    const a = free ? t + this.vx * reach : this.vx * reach;
    const b = free ? t * 0.618 : this.vx * reach * 0.35;
    const c = free ? t * 0.27 : this.vy * reach * 0.25;
    const e = this.vy * reach;
    const ca = Math.cos(a), sa = Math.sin(a);
    const cb = Math.cos(b), sb = Math.sin(b);
    const cc = Math.cos(c), sc = Math.sin(c);
    const ce = Math.cos(e), se = Math.sin(e);

    const D4 = 2.6; // 4D camera distance (w axis)
    const D3 = 3.2; // 3D camera distance (z axis)
    const scale = (Math.min(w, h) / 2) * 0.62;
    const cx = w / 2, cy = h / 2;
    const px = this.px, py = this.py, pd = this.pd;

    for (let i = 0; i < V; i++) {
      const o = i * 4;
      let x = SRC[o], y = SRC[o + 1], z = SRC[o + 2], q = SRC[o + 3];
      // XW
      let n = x * ca - q * sa;
      q = x * sa + q * ca;
      x = n;
      // YZ
      n = y * cb - z * sb;
      z = y * sb + z * cb;
      y = n;
      // ZW
      n = z * cc - q * sc;
      q = z * sc + q * cc;
      z = n;
      // YW (cursor, vertical)
      n = y * ce - q * se;
      q = y * se + q * ce;
      y = n;
      // 4D -> 3D perspective
      const k4 = D4 / (D4 - q);
      x *= k4;
      y *= k4;
      z *= k4;
      // 3D -> 2D perspective
      const k3 = D3 / (D3 - z);
      px[i] = cx + x * k3 * scale;
      py[i] = cy + y * k3 * scale;
      // Depth cue: nearer in both z and w is brighter.
      pd[i] = z * 0.5 + q * 0.6;
    }

    const buckets = this.buckets;
    for (let k = 0; k < BUCKETS; k++) buckets[k].length = 0;
    for (let e = 0; e < E; e++) {
      const d = (pd[EDGE_A[e]] + pd[EDGE_B[e]]) * 0.5;
      // d spans roughly [-1.3, 1.3]
      let k = Math.floor(((d + 1.3) / 2.6) * BUCKETS);
      if (k < 0) k = 0;
      else if (k >= BUCKETS) k = BUCKETS - 1;
      buckets[k].push(e);
    }

    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round";
    const lw = this.lineWidth * Math.max(0.6, Math.min(w, h) / 320);
    for (let k = 0; k < BUCKETS; k++) {
      const list = buckets[k];
      if (!list.length) continue;
      const f = (k + 0.5) / BUCKETS;
      ctx.strokeStyle = this.styles[k];
      ctx.lineWidth = lw * (0.5 + f);
      ctx.beginPath();
      for (let j = 0; j < list.length; j++) {
        const e = list[j];
        const ia = EDGE_A[e], ib = EDGE_B[e];
        ctx.moveTo(px[ia], py[ia]);
        ctx.lineTo(px[ib], py[ib]);
      }
      ctx.stroke();
    }
  }
}
</script>

<style lang="sass" scoped>
.polytope-600
  display: inline-block
  position: relative
  canvas
    display: block
    width: 100%
    height: 100%
</style>
