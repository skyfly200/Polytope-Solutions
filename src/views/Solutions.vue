<template lang="pug">
Base.solutions
  PageHero(title="Solutions" :lead="solutions.length + ' areas where I help people turn scattered work into systems that run on their own.'" shape="cell24")
  PageSection
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
  PageSection
    v-btn(to="/start" color="secondary" large depressed) Start a project
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";
import PageSection from "@/components/PageSection.vue";
import PageHero from "@/components/PageHero.vue";
import { solutions } from "@/data/solutions";

@Component({ components: { Base, PageSection, PageHero } })
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
