<template lang="pug">
Base.about
  PageHero(:title="a.name" :eyebrow="a.role" :lead="a.intro" shape="cell600")
  PageSection
    Placeholder(round icon="fa-user" :label="a.placeholders.photo")
  PageSection(title="Story")
    p(v-for="p in a.story" :key="p") {{ p }}
    Placeholder(icon="fa-pen" :label="a.placeholders.bio")
  PageSection(title="Humans, augmented")
    p(v-for="p in a.perspective" :key="p") {{ p }}
  PageSection(title="One partner, the whole stack")
    p {{ a.partner.lead }}
    ul
      li(v-for="i in a.partner.items" :key="i") {{ i }}
    router-link(to="/solutions") See all solutions
    Placeholder(icon="fa-certificate" :label="a.placeholders.credentials")
  PageSection(title="What I value")
    ul
      li(v-for="v in a.values" :key="v") {{ v }}
  PageSection.cta
    v-btn(to="/start" color="secondary" large depressed) Get started
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";
import PageSection from "@/components/PageSection.vue";
import PageHero from "@/components/PageHero.vue";
import Placeholder from "@/components/Placeholder.vue";
import { about } from "@/data/about";

@Component({ components: { Base, PageSection, PageHero, Placeholder } })
export default class About extends Vue {
  a = about;
}
</script>

<style lang="sass" scoped>
.about
  .role
    opacity: 0.7
    margin-bottom: 16px
  .lead
    font-size: 1.2rem
  ul
    padding-left: 1.2em
  .cta
    text-align: center
</style>
