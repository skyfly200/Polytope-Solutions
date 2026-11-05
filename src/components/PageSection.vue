<template lang="pug">
section.page-section(ref="sec" :class="{ 'is-on': on }")
  .inner
    h2(v-if="title") {{ title }}
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

// Content block. Each one is a snap point, and its content fades in once it
// is snapped into view (never timed to scroll position). Blocks taller than
// the screen count as snapped once most of the screen is filled.
@Component({})
export default class PageSection extends Vue {
  @Prop() title?: string;
  on = false;
  private observer: IntersectionObserver | null = null;

  mounted() {
    if (!("IntersectionObserver" in window)) {
      this.on = true;
      return;
    }
    this.observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          const h = Math.max(1, e.boundingClientRect.height);
          const needed = Math.min(0.5, (window.innerHeight * 0.7) / h);
          if (e.intersectionRatio >= needed) this.on = true;
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    this.observer.observe(this.$refs.sec as HTMLElement);
  }

  beforeDestroy() {
    if (this.observer) this.observer.disconnect();
  }
}
</script>

<style lang="sass" scoped>
.page-section
  padding: 10vh 24px
  scroll-snap-align: start
  .inner
    max-width: 900px
    margin: 0 auto
    text-align: left
  h2
    margin-bottom: 1.5rem
    padding-top: 1rem
    border-top: 1px solid rgba(255,255,255,0.18)
  @media (prefers-reduced-motion: no-preference)
    .inner
      opacity: 0
      transform: translateY(14px)
      transition: opacity 0.35s ease-out, transform 0.35s ease-out
    &.is-on .inner
      opacity: 1
      transform: none
</style>
