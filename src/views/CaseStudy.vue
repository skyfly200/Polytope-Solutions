<template lang="pug">
Base.case-study
  template(v-if="c")
    PageHero(:eyebrow="c.client" :title="c.title" :lead="c.summary" shape="cell16" color="120,200,255")
      v-chip(small v-for="t in c.tags" :key="t") {{ t }}
    PageSection(v-if="c.confirm && c.confirm.length")
      v-alert(:value="true" type="warning" outline) Draft. Still to confirm: {{ c.confirm.join("; ") }}.
    PageSection(title="The problem")
      p {{ c.problem }}
    PageSection(title="What was built")
      ul
        li(v-for="x in c.built" :key="x") {{ x }}
    PageSection(title="The result")
      ul
        li(v-for="x in c.result" :key="x") {{ x }}
    PageSection.cta
      v-btn(v-if="c.link" :to="c.link" outline) Learn more
      v-btn(to="/work" flat) All work
      v-btn(to="/start" color="secondary" depressed) Get started
  PageSection(v-else)
    h1 Case study not found
    v-btn(to="/work" depressed) All work
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";
import PageSection from "@/components/PageSection.vue";
import PageHero from "@/components/PageHero.vue";
import { findCaseStudy } from "@/data/work";

@Component({ components: { Base, PageSection, PageHero } })
export default class CaseStudy extends Vue {
  get c() {
    return findCaseStudy(this.$route.params.slug);
  }
}
</script>

<style lang="sass" scoped>
.case-study
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
  .cta
    text-align: center
</style>
