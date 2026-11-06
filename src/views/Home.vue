<template lang="pug">
v-container(fluid).home
  Landing
  v-layout.blurbs.snap-section
    v-flex(xs10 offset-xs1)
      .blurb(v-for="(b, i) in blurbs" :key="b.title" ref="blurb" :data-index="i")
        Projection4D(:shape="b.shape" :color="b.color" :active="activeBlurb === i" :weight="b.weight")
        .reveal(:class="{ 'is-on': activeBlurb === i }")
          h2.blurb-title(v-tilt="{ max: 10, depth: 4 }") 
            span.title-line(v-for="(line, j) in b.title.split('|')" :key="j") {{ line }}
          p.blurb-text {{ b.text }}
  #solutions.snap-section(ref="solutions")
    Solutions(:class="{ 'is-on': solutionsActive }")
  v-layout.contact.snap-section#contact(ref="contact")
    Projection4D(shape="cell16" color="200,140,255" :active="contactActive" :weight="0.8")
    .start-cta
      i.fas.fa-rocket(aria-hidden="true")
      h2(v-tilt="{ max: 10, depth: 4 }") Let us help you find solutions today!
      p(v-tilt="{ max: 8, depth: 3 }") Tell us what you are working on and we will reply asap.
      v-btn(to="/start" color="primary" large) Get started
  Footer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import Landing from "@/components/Landing.vue";
import Footer from "@/components/Footer.vue";
import Solutions from "@/components/Solutions.vue";
import Projection4D from "@/components/Projection4D.vue";
import { ShapeName } from "@/lib/polytopes";

interface Blurb {
  shape: ShapeName;
  color: string;
  // Stroke width multiplier for the 4D wireframe behind the panel.
  weight: number;
  title: string;
  text: string;
}

@Component({
  components: { Landing, Footer, Projection4D, Solutions }
})
export default class Home extends Vue {
  // Index of the blurb panel currently snapped into view, or -1.
  activeBlurb = -1;
  // True while the Solutions section is snapped into view.
  solutionsActive = false;
  // True while the closing Get started panel is snapped into view.
  contactActive = false;
  private contactObserver!: IntersectionObserver | null;
  private observer!: IntersectionObserver | null;
  private solutionsObserver!: IntersectionObserver | null;

  blurbs: Blurb[] = [
    {
      shape: "tesseract",
      color: "255,160,0",
      weight: 1,
      title: "AI that makes people better",
      text: "We build AI harnesses and agentic workflows that augment your people instead of replacing them. Routine work runs on its own within clear limits; the calls that matter stay with a human, who sees more and decides better."
    },
    {
      shape: "cell24",
      color: "255,255,255",
      weight: 0.5,
      title: "Systems that run themselves",
      text: "Business automation, web products, data and networks, built around how you already work and managed after launch."
    },
    {
      shape: "cell600",
      color: "120,200,255",
      weight: 0.5,
      title: "One partner,|the whole stack",
      text: "From smart contracts and hardware to the site in front of them, we design it, build it, and keep it running, so you and your customers get a seamless experience."
    }
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

    const contact = (this.$refs.contact as Vue | undefined)?.$el as HTMLElement | undefined;
    if (contact) {
      this.contactObserver = new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            this.contactActive = entry.intersectionRatio >= 0.6;
          }
        },
        { threshold: [0, 0.6, 1] }
      );
      this.contactObserver.observe(contact);
    }
  }

  beforeDestroy() {
    if (this.observer) this.observer.disconnect();
    if (this.solutionsObserver) this.solutionsObserver.disconnect();
    if (this.contactObserver) this.contactObserver.disconnect();
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
      .reveal
        position: relative
        z-index: 1
        text-align: center
        padding: 0 1rem
      .blurb-title
        font-size: clamp(2rem, 5vw, 3.2rem)
        line-height: 1.15
        max-width: 18ch
        margin: 0 auto 1rem
        text-shadow: 0 2px 8px black
        .title-line
          display: block
      .blurb-text
        font-size: clamp(1rem, 1.8vw, 1.25rem)
        max-width: 40ch
        margin: 0 auto
        color: rgba(255, 255, 255, 0.8)
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
    align-items: center
    justify-content: center
    position: relative
    overflow: hidden
    .projection4d
      opacity: 0.6
    .start-cta
      position: relative
      z-index: 1
      text-align: center
      padding: 0 1.5rem
      .fa-rocket
        color: #ffa000
        font-size: 2.5rem
        margin-bottom: 0.5rem
      h2
        font-size: clamp(24px, 3.6vw, 34px)
        margin: 0 0 0.5rem
      p
        font-size: clamp(16px, 1.3vw, 18px)
        color: rgba(255, 255, 255, 0.72)
        margin: 0 0 1.5rem
</style>
