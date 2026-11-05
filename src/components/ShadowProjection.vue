<template lang="pug">
.shadow-projection(aria-hidden="true")
  canvas(ref="canvas")
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import {
  buildFigure,
  createProjection,
  project,
  ShadowFigure,
  Projection
} from "@/lib/shadow";

// Edges and points are batched into depth buckets (and edges also into short
// and long classes) so each frame costs a few dozen stroke() calls.
const BUCKETS = 6;
const TILT = 0.3;
// Figure radius as a fraction of half the canvas.
const FIT = 0.8;

function parseRGB(s: string): number[] {
  return s.split(",").map(n => parseInt(n, 10) || 0);
}

function mix(a: number[], b: number[], f: number): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * f);
  const g = Math.round(a[1] + (b[1] - a[1]) * f);
  const bl = Math.round(a[2] + (b[2] - a[2]) * f);
  return r + "," + g + "," + bl;
}

@Component({})
export default class ShadowProjection extends Vue {
  // The seed picks the figure and its cadence of turning.
  @Prop({ default: 12345 }) readonly seed!: number;
  @Prop({ default: 110 }) readonly count!: number;
  @Prop({ default: 4 }) readonly neighbors!: number;
  // Rotation speed, radians per second for the primary 4D plane.
  @Prop({ default: 0.3 }) readonly speed!: number;
  // 4D camera distance; larger is gentler.
  @Prop({ default: 3 }) readonly depth!: number;
  // How much of each frame fades away. Smaller leaves longer trails.
  @Prop({ default: 0.14 }) readonly fade!: number;
  // "r,g,b" triplets: far in the hidden dimension, and near.
  @Prop({ default: "126,87,194" }) readonly farColor!: string;
  @Prop({ default: "255,160,0" }) readonly nearColor!: string;
  // Lets the cursor turn the viewing angle.
  @Prop({ default: false }) readonly followMouse!: boolean;
  // The parent can freeze the motion, as PageHero does when it is off screen.
  @Prop({ default: true }) readonly active!: boolean;

  // A different seed or density builds a different figure; the route can
  // change the seed while this component stays mounted.
  @Watch("seed")
  @Watch("count")
  @Watch("neighbors")
  private onFigureChange() {
    if (!this.ctx) return;
    this.rebuild();
    this.draw(true);
  }

  @Watch("active")
  private onActiveChange() {
    this.schedule();
  }

  // Non-reactive runtime state (left undefined so Vue does not observe it).
  private ctx!: CanvasRenderingContext2D | null;
  private fig!: ShadowFigure;
  private proj!: Projection;
  private raf!: number;
  private last!: number;
  private t!: number;
  private visible!: boolean;
  private reduced!: boolean;
  private io!: IntersectionObserver | null;
  private mx!: number;
  private my!: number;
  private yaw!: number;
  private pitch!: number;
  private cssW!: number;
  private cssH!: number;
  private far!: number[];
  private near!: number[];

  mounted() {
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    this.ctx = canvas.getContext ? canvas.getContext("2d") : null;
    this.raf = 0;
    this.last = 0;
    this.t = 0;
    this.mx = this.my = this.yaw = this.pitch = 0;
    this.visible = true;
    this.io = null;
    this.far = parseRGB(this.farColor);
    this.near = parseRGB(this.nearColor);
    this.rebuild();

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
    this.schedule();
  }

  beforeDestroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousemove", this.onMouse);
    document.removeEventListener("visibilitychange", this.onVisibility);
    if (this.io) this.io.disconnect();
  }

  // A different seed or density builds a different figure.
  private rebuild() {
    this.fig = buildFigure(this.seed, this.count, this.neighbors);
    this.proj = createProjection(this.fig.vertices.length);
    this.t = 2.4;
    this.clear();
  }

  private clear() {
    if (this.ctx && this.cssW) this.ctx.clearRect(0, 0, this.cssW, this.cssH);
  }

  private schedule() {
    const shouldRun =
      !this.reduced && this.active && this.visible && !document.hidden;
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
    this.draw(true);
  }

  private frame(now: number) {
    const dt = this.last ? Math.min((now - this.last) / 1000, 0.05) : 0;
    this.last = now;
    this.t += dt * this.speed * 2;

    // Ease the view toward the cursor; otherwise a slow sway.
    const tyaw = this.followMouse ? this.mx * 0.6 : Math.sin(this.t * 0.05) * 0.25;
    const tpitch = this.followMouse ? this.my * 0.4 : 0;
    const e = Math.min(1, dt * 2);
    this.yaw += (tyaw - this.yaw) * e;
    this.pitch += (tpitch - this.pitch) * e;

    this.draw(false);
    this.raf = requestAnimationFrame(this.frame);
  }

  // `fresh` draws one clean frame with no trails (first paint, resize and the
  // reduced-motion still).
  private draw(fresh: boolean) {
    const ctx = this.ctx;
    if (!ctx) return;
    const w = this.cssW;
    const h = this.cssH;

    if (fresh) {
      ctx.clearRect(0, 0, w, h);
    } else {
      // Trails: fade what is already there instead of clearing it.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0," + this.fade + ")";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
    }

    const fig = this.fig;
    const p = this.proj;
    project(fig, this.t, this.depth, this.yaw, TILT + this.pitch, p);

    const scale = (Math.min(w, h) / 2) * FIT;
    const cx = w / 2;
    const cy = h / 2;
    const lw = Math.max(0.6, Math.min(w, h) / 700);

    // Edges: [depth bucket][short, long]
    const lists: number[][][] = [];
    for (let k = 0; k < BUCKETS; k++) lists.push([[], []]);
    for (let e = 0; e < fig.edges.length; e++) {
      const ed = fig.edges[e];
      const d = (p.w[ed[0]] + p.w[ed[1]]) * 0.5; // -1 .. 1
      let k = Math.floor(((d + 1) / 2) * BUCKETS);
      if (k < 0) k = 0;
      else if (k >= BUCKETS) k = BUCKETS - 1;
      lists[k][ed[2] > fig.maxEdge * 0.6 ? 1 : 0].push(e);
    }

    ctx.lineCap = "round";
    ctx.lineWidth = lw;
    for (let k = 0; k < BUCKETS; k++) {
      const f = (k + 0.5) / BUCKETS;
      const rgb = mix(this.far, this.near, f);
      for (let cls = 0; cls < 2; cls++) {
        const list = lists[k][cls];
        if (!list.length) continue;
        const alpha = (0.14 + 0.62 * f) * (cls ? 0.5 : 1);
        ctx.strokeStyle = "rgba(" + rgb + "," + alpha.toFixed(3) + ")";
        ctx.beginPath();
        for (let j = 0; j < list.length; j++) {
          const ed = fig.edges[list[j]];
          ctx.moveTo(cx + p.x[ed[0]] * scale, cy + p.y[ed[0]] * scale);
          ctx.lineTo(cx + p.x[ed[1]] * scale, cy + p.y[ed[1]] * scale);
        }
        ctx.stroke();
      }
    }

    // Vertices, sized by perspective and brighter when near in the hidden axis.
    for (let i = 0; i < fig.vertices.length; i++) {
      const f = (p.w[i] + 1) / 2;
      const r = (0.8 + 1.8 * f) * p.k[i] * Math.max(0.7, Math.min(w, h) / 700);
      ctx.fillStyle =
        "rgba(" + mix(this.far, this.near, f) + "," + (0.35 + 0.65 * f).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(cx + p.x[i] * scale, cy + p.y[i] * scale, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
</script>

<style lang="sass" scoped>
.shadow-projection
  display: block
  position: relative
  width: 100%
  height: 100%
  canvas
    display: block
    width: 100%
    height: 100%
</style>
