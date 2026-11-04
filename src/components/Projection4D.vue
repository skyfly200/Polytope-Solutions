<template lang="pug">
.projection4d(role="presentation")
  canvas(ref="canvas")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { getPolytope, ShapeName } from "@/lib/polytopes";

interface Geometry {
  n: number;
  m: number;
  src: Float32Array;
  ea: Uint16Array;
  eb: Uint16Array;
}

const GEO = new Map<ShapeName, Geometry>();

function geometry(shape: ShapeName): Geometry {
  let g = GEO.get(shape);
  if (!g) {
    const poly = getPolytope(shape);
    const n = poly.vertices.length;
    const m = poly.edges.length;
    const src = new Float32Array(n * 4);
    poly.vertices.forEach((v, i) => src.set(v, i * 4));
    const ea = new Uint16Array(m);
    const eb = new Uint16Array(m);
    poly.edges.forEach(([a, b], i) => {
      ea[i] = a;
      eb[i] = b;
    });
    g = { n, m, src, ea, eb };
    GEO.set(shape, g);
  }
  return g;
}

const BUCKETS = 6;
// Depth ramps up over this many seconds once a panel becomes active.
const EASE = 2.5;

// A 4D wireframe that only turns while it is the active snap section. The
// parent decides `active` (from the snap position), so motion starts when a
// panel locks into place and freezes when the user moves on. Nothing is timed
// to scroll position.
@Component({})
export default class Projection4D extends Vue {
  @Prop({ required: true }) readonly shape!: ShapeName;
  @Prop({ default: "255,255,255" }) readonly color!: string;
  @Prop({ default: false }) readonly active!: boolean;
  @Prop({ default: 0.35 }) readonly speed!: number;
  // Multiplies the stroke width. Below 1 gives a finer wireframe.
  @Prop({ default: 1 }) readonly weight!: number;

  private ctx!: CanvasRenderingContext2D | null;
  private geo!: Geometry;
  private raf!: number;
  private last!: number;
  private t!: number;
  private energy!: number;
  private cssW!: number;
  private cssH!: number;
  private px!: Float32Array;
  private py!: Float32Array;
  private pd!: Float32Array;
  private buckets!: number[][];
  private reduced!: boolean;
  private onResize!: () => void;
  private onVisibility!: () => void;

  mounted() {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d");
    this.geo = geometry(this.shape);
    this.px = new Float32Array(this.geo.n);
    this.py = new Float32Array(this.geo.n);
    this.pd = new Float32Array(this.geo.n);
    this.buckets = [];
    for (let i = 0; i < BUCKETS; i++) this.buckets.push([]);
    this.raf = 0;
    this.last = 0;
    this.t = 0.6;
    this.energy = 0;
    this.reduced = !!(
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );

    this.onResize = this.resize.bind(this);
    this.onVisibility = this.schedule.bind(this);
    window.addEventListener("resize", this.onResize, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);

    this.resize();
    this.schedule();
  }

  beforeDestroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }

  @Watch("active")
  onActiveChange() {
    this.schedule();
  }

  private wantsMotion() {
    return !this.reduced && !document.hidden && (this.active || this.energy > 0.001);
  }

  private schedule() {
    if (this.wantsMotion()) {
      if (!this.raf) {
        this.last = 0;
        this.raf = requestAnimationFrame(this.frame);
      }
    } else if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  private resize() {
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
    // Ease the spin speed up when the panel locks in and back down when it leaves.
    const target = this.active ? 1 : 0;
    this.energy += (target - this.energy) * Math.min(1, dt * EASE);
    if (!this.active && this.energy < 0.001) {
      this.energy = 0;
      this.raf = 0;
      this.draw();
      return;
    }
    this.t += dt * this.speed * this.energy;
    this.draw();
    this.raf = requestAnimationFrame(this.frame);
  }

  private draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    const { n, m, src, ea, eb } = this.geo;
    const w = this.cssW;
    const h = this.cssH;
    const t = this.t;
    const a = t;
    const b = t * 0.618;
    const c = t * 0.27;
    const e = 0.4; // fixed tilt in YW so the shape never sits edge-on
    const ca = Math.cos(a), sa = Math.sin(a);
    const cb = Math.cos(b), sb = Math.sin(b);
    const cc = Math.cos(c), sc = Math.sin(c);
    const ce = Math.cos(e), se = Math.sin(e);

    const D4 = 2.6;
    const D3 = 3.2;
    const scale = (Math.min(w, h) / 2) * 0.5;
    const cx = w / 2, cy = h / 2;
    const { px, py, pd } = this;

    for (let i = 0; i < n; i++) {
      const o = i * 4;
      let x = src[o], y = src[o + 1], z = src[o + 2], q = src[o + 3];
      let nn = x * ca - q * sa;
      q = x * sa + q * ca;
      x = nn;
      nn = y * cb - z * sb;
      z = y * sb + z * cb;
      y = nn;
      nn = z * cc - q * sc;
      q = z * sc + q * cc;
      z = nn;
      nn = y * ce - q * se;
      q = y * se + q * ce;
      y = nn;
      const k4 = D4 / (D4 - q);
      x *= k4;
      y *= k4;
      z *= k4;
      const k3 = D3 / (D3 - z);
      px[i] = cx + x * k3 * scale;
      py[i] = cy + y * k3 * scale;
      pd[i] = z * 0.5 + q * 0.6;
    }

    const buckets = this.buckets;
    for (let k = 0; k < BUCKETS; k++) buckets[k].length = 0;
    for (let i = 0; i < m; i++) {
      const d = (pd[ea[i]] + pd[eb[i]]) * 0.5;
      let k = Math.floor(((d + 1.3) / 2.6) * BUCKETS);
      if (k < 0) k = 0;
      else if (k >= BUCKETS) k = BUCKETS - 1;
      buckets[k].push(i);
    }

    ctx.clearRect(0, 0, w, h);
    ctx.lineCap = "round";
    const lw = 1.2 * this.weight * Math.max(0.6, Math.min(w, h) / 320);
    for (let k = 0; k < BUCKETS; k++) {
      const list = buckets[k];
      if (!list.length) continue;
      const f = (k + 0.5) / BUCKETS;
      ctx.strokeStyle = "rgba(" + this.color + "," + (0.1 + 0.8 * f * f).toFixed(3) + ")";
      ctx.lineWidth = lw * (0.5 + f);
      ctx.beginPath();
      for (let j = 0; j < list.length; j++) {
        const i = list[j];
        const ia = ea[i], ib = eb[i];
        ctx.moveTo(px[ia], py[ia]);
        ctx.lineTo(px[ib], py[ib]);
      }
      ctx.stroke();
    }
  }
}
</script>

<style lang="sass" scoped>
.projection4d
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  pointer-events: none
  canvas
    display: block
    width: 100%
    height: 100%
</style>
