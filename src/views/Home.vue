<template lang="pug">
v-container(fluid).home
  Landing
  v-layout.blurbs.snap-section
    v-flex(xs10 offset-xs1)
      .blurb(v-for="(b, i) in blurbs" :key="b.text" ref="blurb" :data-index="i")
        Projection4D(:shape="b.shape" :color="b.color" :active="activeBlurb === i" :weight="b.weight")
        .reveal(:class="{ 'is-on': activeBlurb === i }")
          span.blurb-text(v-tilt="{ max: 10, depth: 4 }") {{ b.text }}
  #solutions.snap-section(ref="solutions")
    Solutions(:class="{ 'is-on': solutionsActive }")
  v-layout.contact.snap-section#contact
    ContactForm
  Footer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import Landing from "@/components/Landing.vue";
import ContactForm from "@/components/ContactForm.vue";
import Footer from "@/components/Footer.vue";
import Solutions from "@/components/Solutions.vue";
import Projection4D from "@/components/Projection4D.vue";
import { ShapeName } from "@/lib/polytopes";

interface Blurb {
  shape: ShapeName;
  color: string;
  // Stroke width multiplier for the 4D wireframe behind the panel.
  weight: number;
  text: string;
}

@Component({
  components: { Landing, ContactForm, Footer, Projection4D, Solutions }
})
export default class Home extends Vue {
  // Index of the blurb panel currently snapped into view, or -1.
  activeBlurb = -1;
  // True while the Solutions section is snapped into view.
  solutionsActive = false;
  private observer!: IntersectionObserver | null;
  private solutionsObserver!: IntersectionObserver | null;

  blurbs: Blurb[] = [
    { shape: "tesseract", color: "255,160,0", weight: 1, text: "Look at your problems from new angles" },
    { shape: "cell24", color: "255,255,255", weight: 0.5, text: "Using the latest technology" },
    { shape: "cell16", color: "120,200,255", weight: 1, text: "Specially drafted to your unique needs" },
    { shape: "cell600", color: "255,255,255", weight: 0.5, text: "Helping you refine and achieve your visions" }
  ];

  // Each blurb is a full-height snap panel. The 4D visual in it only turns
  // while the panel is the one snapped into view (60% or more on screen).
  mounted() {
    const panels = (this.$refs.blurb as HTMLElement[] | undefined) || [];
    if (!panels.length || !("IntersectionObserver" in window)) return;
    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const i = Number((entry.target as HTMLElement).dataset.index);
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            this.activeBlurb = i;
          } else if (this.activeBlurb === i) {
            this.activeBlurb = -1;
          }
        }
      },
      { threshold: [0, 0.6, 1] }
    );
    panels.forEach(el => this.observer!.observe(el));

    // The Solutions section can be taller than the viewport, so it counts as
    // snapped once it fills 60% of the screen or the whole screen, whichever
    // is smaller. That keeps its text from staying hidden on phones.
    const solutions = this.$refs.solutions as HTMLElement | undefined;
    if (solutions) {
      this.solutionsObserver = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            const h = Math.max(1, entry.boundingClientRect.height);
            const needed = Math.min(0.6, (window.innerHeight * 0.8) / h);
            this.solutionsActive = entry.intersectionRatio >= needed;
          }
        },
        { threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] }
      );
      this.solutionsObserver.observe(solutions);
    }
  }

  beforeDestroy() {
    if (this.observer) this.observer.disconnect();
    if (this.solutionsObserver) this.solutionsObserver.disconnect();
  }
}
</script>

<style lang="sass" scoped>
.home
  .blurbs
    display: flex
    flex-direction: column
    justify-content: center
    p
      margin: 20px
    .blurb
      font-size: 2.2rem
      height: 100vh
      scroll-snap-align: start
      position: relative
      overflow: hidden
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      .projection4d
        opacity: 0.6
      .blurb-text
        position: relative
        z-index: 1
        max-width: 22ch
        text-shadow: 0 2px 8px black
  // Load-in and load-out: text fades and rises as its snap section locks in
  // or leaves. Driven by the snap state above, never by scroll position.
  // Content is only hidden when motion is allowed, so reduced-motion users
  // always see it.
  .reveal
    transition: opacity 0.35s ease-out, transform 0.35s ease-out
  @media (prefers-reduced-motion: no-preference)
    .reveal
      opacity: 0
      transform: translateY(14px)
    .reveal.is-on
      opacity: 1
      transform: none
  #solutions
    margin: 0
  .contact
    min-height: 100vh
</style>
