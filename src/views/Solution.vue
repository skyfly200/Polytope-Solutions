<template lang="pug">
Base.solution
  template(v-if="s")
    PageSection
      .eyebrow Solution {{ s.letter }}
      h1 {{ s.title }}
      p.lead {{ s.tagline }}
    PageSection(v-if="s.flags && s.flags.length")
      v-alert(:value="true" type="warning" outline) Draft. Still to confirm: {{ s.flags.join("; ") }}.
    PageSection(title="Who it is for")
      ul
        li(v-for="x in s.forWho" :key="x") {{ x }}
    PageSection(title="What you get")
      ul
        li(v-for="x in s.youGet" :key="x") {{ x }}
    PageSection(title="Deliverables")
      ul
        li(v-for="x in s.deliverables" :key="x") {{ x }}
    PageSection(title="How we work together")
      v-layout(wrap)
        v-flex(xs12 md4 v-for="e in s.engagement" :key="e.title")
          v-card.eng-card
            v-card-text
              h3 {{ e.title }}
              .duration {{ e.duration }}
              p {{ e.text }}
      p.note Pricing is scoped per project. Tell me what you need and I will propose a fixed scope.
    PageSection(v-if="cs" title="Related case study")
      v-card
        v-card-text
          h3 {{ cs.title }}
          p {{ cs.summary }}
        v-card-actions
          v-btn(:to="'/work/' + cs.slug" flat) Read the case study
    PageSection(title="FAQ")
      v-expansion-panel(expand)
        v-expansion-panel-content(v-for="f in s.faqs" :key="f.q")
          div(slot="header") {{ f.q }}
          v-card
            v-card-text {{ f.a }}
    PageSection.cta
      h2 Ready to talk?
      v-btn(to="/start" color="secondary" large depressed) Start a project
  PageSection(v-else)
    h1 Solution not found
    v-btn(to="/solutions" depressed) All solutions
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";
import PageSection from "@/components/PageSection.vue";
import { findSolution } from "@/data/solutions";
import { findCaseStudy } from "@/data/work";

@Component({ components: { Base, PageSection } })
export default class Solution extends Vue {
  get s() {
    return findSolution(this.$route.params.slug);
  }
  get cs() {
    return this.s ? findCaseStudy(this.s.caseStudy) : undefined;
  }
}
</script>

<style lang="sass" scoped>
.solution
  .eyebrow
    text-transform: uppercase
    letter-spacing: 0.15em
    opacity: 0.6
  .lead
    font-size: 1.2rem
    opacity: 0.85
  ul
    padding-left: 1.2em
    li
      margin-bottom: 8px
  .eng-card
    margin: 8px
    .duration
      opacity: 0.7
      margin-bottom: 8px
  .note
    opacity: 0.7
    margin-top: 16px
  .cta
    text-align: center
</style>
