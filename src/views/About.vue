<template lang="pug">
Base.about
  PageSection
    Placeholder(round icon="fa-user" :label="a.placeholders.photo")
    h1 {{ a.name }}
    .role {{ a.role }}
    p.lead {{ a.intro }}
  PageSection(title="Story")
    p(v-for="p in a.story" :key="p") {{ p }}
    Placeholder(icon="fa-pen" :label="a.placeholders.bio")
  PageSection(title="What I value")
    ul
      li(v-for="v in a.values" :key="v") {{ v }}
  PageSection.cta
    v-btn(to="/start" color="secondary" large depressed) Start a project
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";
import PageSection from "@/components/PageSection.vue";
import Placeholder from "@/components/Placeholder.vue";
import { about } from "@/data/about";

@Component({ components: { Base, PageSection, Placeholder } })
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
