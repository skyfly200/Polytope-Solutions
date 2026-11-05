<template lang="pug">
Base.work
  PageHero(title="Work" lead="Selected projects across networks, software, and on-chain systems." shape="cell16" color="120,200,255")
  PageSection
    v-layout(wrap)
      v-flex(xs12 sm6 md4 v-for="c in caseStudies" :key="c.slug")
        v-card.case-card
          v-card-text
            h3 {{ c.title }}
            p {{ c.summary }}
            v-chip(small v-for="t in c.tags" :key="t") {{ t }}
            v-chip(small color="orange" text-color="black" v-if="c.confirm && c.confirm.length") Draft
          v-card-actions
            v-btn(:to="'/work/' + c.slug" flat) Read more
  PageSection
    v-btn(to="/start" color="secondary" large depressed) Start a project
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";
import PageSection from "@/components/PageSection.vue";
import PageHero from "@/components/PageHero.vue";
import { caseStudies } from "@/data/work";

@Component({ components: { Base, PageSection, PageHero } })
export default class Work extends Vue {
  caseStudies = caseStudies;
}
</script>

<style lang="sass" scoped>
.work
  text-align: center
  .lead
    font-size: 1.2rem
    opacity: 0.85
  .case-card
    margin: 8px
    height: calc(100% - 16px)
</style>
