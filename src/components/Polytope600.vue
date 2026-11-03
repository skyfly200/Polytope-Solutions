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
const SRC = new Float32Array(V * 4);
POLY.vertices.forEach((v, i) => SRC.set(v, i * 4));
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
  // Radians per second for the primary 4D rotation.
  @Prop({ default: 0.35 }) readonly speed!: number;
  @Prop({ default: 1.2 }) readonly lineWidth!: number;
  @Prop({ default: "255,255,255" }) readonly color!: string;
  // Lets the cursor nudge the 3D viewing angle.
  @Prop({ default: false }) readonly followMouse!: boolean;

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
  private cssW!: number;
  private cssH!: number;

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
    this.visible = true;
    this.io = null;

    const mq = window.matchMedia
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    this.reduced = !!(mq && mq.matches);

    this.onResize = this.onResize.bind(this);
    this.onMouse = this.onMouse.bind(this);
    this.onVisibility = this.onVisibility.bind(this);
    this.frame = this.frame.bind(this);

    window.addEventListener("resize", this.onResize, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
    if (this.followMouse && !this.reduced) {
      window.addEventListener("mousemove", this.onMouse, { passive: true });
    }
    if ("IntersectionObserver" in window) {
      this.io = new IntersectionObserver(entries => {
        this.visible = entries[0].isIntersecting;
        this.schedule();
      });
      this.io.observe(this.$el);
    }

    this.onResize();
    // Start at an angle that already shows the 4D structure.
    this.t = 2.4;
    this.draw();
    this.schedule();
  }

  beforeDestroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousemove", this.onMouse);
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

  private onMouse(e: MouseEvent) {
    this.mx = (e.clientX / window.innerWidth) * 2 - 1;
    this.my = (e.clientY / window.innerHeight) * 2 - 1;
  }

  private onResize() {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    const rect = (this.$el as HTMLElement).getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cssW = Math.max(1, rect.width);
    this.cssH = Math.max(1, rect.height);
    canvas.width = Math.round(this.cssW * dpr);
    canvas.height = Math.round(this.cssH * dpr);
    if (this.ctx) this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.draw();
  }

  private frame(now: number) {
    const dt = this.last ? Math.min((now - this.last) / 1000, 0.05) : 0;
    this.last = now;
    this.t += dt * this.speed;
    // Ease the view toward the cursor.
    this.vx += (this.mx - this.vx) * Math.min(1, dt * 3);
    this.vy += (this.my - this.vy) * Math.min(1, dt * 3);
    this.draw();
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
    const a = t;
    const b = t * 0.618;
    const c = t * 0.27;
    const ca = Math.cos(a), sa = Math.sin(a);
    const cb = Math.cos(b), sb = Math.sin(b);
    const cc = Math.cos(c), sc = Math.sin(c);
    // 3D viewing angle from the cursor.
    const ry = this.vx * 0.5, rx = this.vy * 0.5;
    const cry = Math.cos(ry), sry = Math.sin(ry);
    const crx = Math.cos(rx), srx = Math.sin(rx);

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
      // 4D -> 3D perspective
      const k4 = D4 / (D4 - q);
      x *= k4;
      y *= k4;
      z *= k4;
      // View rotation (cursor)
      n = x * cry + z * sry;
      z = -x * sry + z * cry;
      x = n;
      n = y * crx - z * srx;
      z = y * srx + z * crx;
      y = n;
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
      ctx.strokeStyle = "rgba(" + this.color + "," + (0.08 + 0.85 * f * f).toFixed(3) + ")";
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
