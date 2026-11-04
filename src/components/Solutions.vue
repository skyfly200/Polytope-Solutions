<template lang="pug">
section.solutions-section
  header.head
    svg.mark(viewBox="0 0 48 48" aria-hidden="true")
      polygon(points="24,3 43,14 43,34 24,45 5,34 5,14")
      polygon(points="24,13 34,19 34,29 24,35 14,29 14,19")
      line(x1="24" y1="3" x2="24" y2="13")
      line(x1="43" y1="14" x2="34" y2="19")
      line(x1="43" y1="34" x2="34" y2="29")
      line(x1="24" y1="45" x2="24" y2="35")
      line(x1="5" y1="34" x2="14" y2="29")
      line(x1="5" y1="14" x2="14" y2="19")
    h1(v-tilt) Solutions
  ol.list
    li.item(v-for="(s, i) in items" :key="s.title" :style="{ transitionDelay: (i * 70) + 'ms' }")
      span.num {{ pad(i + 1) }}
      .body
        h2
          | {{ s.title }}
          span.tag(v-if="s.tag") {{ s.tag }}
        p {{ s.description }}
        .links(v-if="s.links")
          router-link.more(v-for="l in s.links" :key="l.path" :to="l.path") {{ l.label }} →
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { solutions } from "@/data/solutions";

@Component
export default class Solutions extends Vue {
  items = solutions;
  pad(n: number) {
    return n < 10 ? "0" + n : String(n);
  }
}
</script>

<style lang="sass" scoped>
.solutions-section
  min-height: 100vh
  box-sizing: border-box
  display: flex
  flex-direction: column
  justify-content: center
  max-width: 1100px
  margin: 0 auto
  padding: 4rem 24px
  .head
    display: flex
    align-items: center
    gap: 20px
    margin-bottom: 2.5rem
    .mark
      width: 44px
      height: 44px
      fill: none
      stroke: rgba(255,255,255,0.55)
      stroke-width: 1
      vector-effect: non-scaling-stroke
    h1
      font-size: clamp(36px, 5vw, 56px)
      font-weight: 500
      line-height: 1.1
  .list
    list-style: none
    margin: 0
    padding: 0
    display: grid
    grid-template-columns: 1fr 1fr
    column-gap: 56px
  .item
    display: flex
    gap: 20px
    padding: 1.4rem 0
    border-top: 1px solid rgba(255,255,255,0.18)
    text-align: left
    transition: opacity 0.35s ease-out, transform 0.35s ease-out
  .num
    font-size: 14px
    letter-spacing: 0.1em
    opacity: 0.5
    padding-top: 0.45em
    flex: 0 0 24px
  h2
    font-size: clamp(20px, 1.8vw, 26px)
    font-weight: 500
    line-height: 1.2
    margin-bottom: 0.4em
  p
    font-size: clamp(16px, 1.3vw, 18px)
    line-height: 1.55
    opacity: 0.78
    margin: 0
  .tag
    margin-left: 0.7em
    padding: 2px 8px
    font-size: 12px
    letter-spacing: 0.12em
    text-transform: uppercase
    vertical-align: middle
    border: 1px solid rgba(255,255,255,0.35)
    border-radius: 999px
    opacity: 0.8
  .links
    display: flex
    flex-wrap: wrap
    gap: 0 1.4em
  .more
    display: inline-block
    margin-top: 0.7em
    font-size: 16px
    color: inherit
    text-decoration: none
    border-bottom: 1px solid rgba(255,255,255,0.4)
    &:hover
      border-bottom-color: #fff
  @media (max-width: 800px)
    padding: 3rem 20px
    .list
      grid-template-columns: 1fr
    .item
      padding: 1rem 0
  // Snap-synced: items fade in once the section is snapped into view.
  // Motion-reduced users always see everything.
  @media (prefers-reduced-motion: no-preference)
    .item
      opacity: 0
      transform: translateY(14px)
    &.is-on .item
      opacity: 1
      transform: none
</style>
