<template lang="pug">
#example-projects
  v-layout(justify-center)
    v-flex(xs12 md10 lg8)
      h2.section-title Selected work
      v-layout(wrap justify-center)
        v-flex.project(xs12 md6 v-for="(p, i) in projects" :key="p.title")
          v-card.project-card(data-aos="fade-up" :data-aos-delay="i * 120")
            v-img(:src="p.img" height="180px" gradient="to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)")
              span.placeholder-badge(v-if="p.placeholder") Sample
            v-card-text
              .category {{ p.category }}
              h3 {{ p.title }}
              p.summary {{ p.summary }}
              .role
                strong Role:&nbsp;
                | {{ p.role }}
              ul.outcomes
                li(v-for="o in p.outcomes" :key="o") {{ o }}
              .tags
                span.tag(v-for="t in p.tags" :key="t") {{ t }}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { projects } from "@/data/portfolio";

@Component({})
export default class ExampleProjects extends Vue {
  projects = projects;
}
</script>

<style lang="sass" scoped>
#example-projects
  min-height: 100vh
  padding: 10vh 0
  scroll-snap-align: start
  display: flex
  align-items: center
  .section-title
    font-size: 2.4rem
    margin-bottom: 4vh
  .project
    padding: 0.75em
  .project-card
    height: 100%
    text-align: left
    .v-card__text
      display: flex
      flex-direction: column
    .category
      font-size: 0.85rem
      text-transform: uppercase
      letter-spacing: 0.1em
      color: #ffa000
    h3
      font-size: 1.6rem
      margin: 0.25rem 0 0.5rem
    .summary
      flex-grow: 1
    .role
      margin: 0.75rem 0
    .outcomes
      padding-left: 1.2em
      li
        margin: 0.25rem 0
    .tags
      margin-top: 1rem
      display: flex
      flex-wrap: wrap
      gap: 0.5rem
      .tag
        font-size: 0.8rem
        padding: 0.2rem 0.6rem
        border-radius: 999px
        border: 1px solid rgba(255, 255, 255, 0.3)
  .placeholder-badge
    position: absolute
    top: 0.5rem
    right: 0.5rem
    font-size: 0.75rem
    text-transform: uppercase
    letter-spacing: 0.1em
    padding: 0.15rem 0.5rem
    background: rgba(0, 0, 0, 0.7)
    border: 1px dashed #ffa000
    color: #ffa000
    border-radius: 4px
</style>
