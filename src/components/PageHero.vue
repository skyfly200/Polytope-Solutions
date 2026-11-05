<template lang="pug">
header.page-hero(ref="hero")
  Projection4D.art(:shape="shape" :color="color" :active="active" :weight="0.6")
  .copy
    .eyebrow(v-if="eyebrow") {{ eyebrow }}
    h1 {{ title }}
    p.lead(v-if="lead") {{ lead }}
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Projection4D from "@/components/Projection4D.vue";
import { ShapeName } from "@/lib/polytopes";

// Opening block for inner pages. Mirrors the homepage panels: big type over a
// thin 4D wireframe that only turns while the hero is snapped into view.
@Component({ components: { Projection4D } })
export default class PageHero extends Vue {
  @Prop() eyebrow?: string;
  @Prop({ required: true }) title!: string;
  @Prop() lead?: string;
  @Prop({ default: "tesseract" }) shape!: ShapeName;
  @Prop({ default: "255,255,255" }) color!: string;

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
  scroll-snap-align: start
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
