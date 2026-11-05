<template lang="pug">
header.page-hero(ref="hero")
  ShadowProjection.art(v-if="seed !== undefined" :seed="seed" :active="active" follow-mouse)
  Projection4D.art(v-else :shape="shape" :color="color" :active="active" :weight="0.6")
  .copy
    .eyebrow(v-if="eyebrow") {{ eyebrow }}
    h1 {{ title }}
    p.lead(v-if="lead") {{ lead }}
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Projection4D from "@/components/Projection4D.vue";
import ShadowProjection from "@/components/ShadowProjection.vue";
import { ShapeName } from "@/lib/polytopes";

// Opening block for inner pages. Mirrors the homepage panels: big type over a
// thin 4D wireframe that only turns while the hero is snapped into view.
// Pass `seed` to show a Shadow Projection figure (a different one per seed)
// in place of the regular polytope.
@Component({ components: { Projection4D, ShadowProjection } })
export default class PageHero extends Vue {
  @Prop() eyebrow?: string;
  @Prop({ required: true }) title!: string;
  @Prop() lead?: string;
  @Prop({ default: "tesseract" }) shape!: ShapeName;
  @Prop({ default: "255,255,255" }) color!: string;
  @Prop() seed?: number;

  active = false;
  private observer: IntersectionObserver | null = null;

  mounted() {
    const el = this.$refs.hero as HTMLElement;
    if (!("IntersectionObserver" in window)) {
      this.active = true;
      return;
    }
    this.observer = new IntersectionObserver(
      entries => {
        for (const e of entries) this.active = e.intersectionRatio >= 0.6;
      },
      { threshold: [0, 0.6, 1] }
    );
    this.observer.observe(el);
  }

  beforeDestroy() {
    if (this.observer) this.observer.disconnect();
  }
}
</script>

<style lang="sass" scoped>
.page-hero
  position: relative
  overflow: hidden
  min-height: 80vh
  display: flex
  align-items: center
  justify-content: center
  padding: 12vh 24px 8vh
  // No snap point of its own: the nav above it is the page's first snap
  // point, so the nav is never scrolled out of view on arrival.
  .art
    position: absolute
    inset: 0
    opacity: 0.45
  .copy
    position: relative
    z-index: 1
    width: 100%
    max-width: 900px
    text-align: left
  h1
    max-width: 18ch
  .lead
    max-width: 52ch
  @media (max-width: 600px)
    min-height: 70vh
    .copy
      text-align: left
</style>
