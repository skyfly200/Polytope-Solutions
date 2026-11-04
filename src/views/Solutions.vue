<template lang="pug">
Base.solutions
  PageSection
    h1 Solutions
    p.lead Four areas where I help people turn scattered work into systems that run on their own.
    v-layout(wrap)
      v-flex(xs12 md6 v-for="s in solutions" :key="s.slug")
        v-card.sol-card
          v-card-text
            i.fas(:class="s.icon")
            h3 {{ s.title }}
            p {{ s.short }}
          v-card-actions
            v-spacer
            v-btn(:to="'/solutions/' + s.slug" color="primary" depressed) Learn more
  PageSection(title="Specialty")
    p.lead On-chain randomness and NFT consulting, where Polytope began.
    v-layout(wrap justify-center)
      v-btn(to="/rng" outline) On-Chain RNG
      v-btn(to="/consulting" outline) NFT Consulting
  PageSection
    v-btn(to="/start" color="secondary" large depressed) Start a project
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";
import PageSection from "@/components/PageSection.vue";
import { solutions } from "@/data/solutionPages";

@Component({ components: { Base, PageSection } })
export default class Solutions extends Vue {
  solutions = solutions;
}
</script>

<style lang="sass" scoped>
.solutions
  text-align: center
  .lead
    font-size: 1.2rem
    opacity: 0.85
  .sol-card
    margin: 8px
    height: calc(100% - 16px)
    i
      font-size: 2rem
      margin-bottom: 8px
</style>
