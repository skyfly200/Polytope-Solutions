<template lang="pug">
Solution.web(:title="title" :img="img" :topic="topic" :list="list" :blurbs="blurbs")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Solution from "./Solution.vue";

@Component({
  components: { Solution }
})
export default class Web extends Vue {
  img:string = "/img/spider-web.jpg";
  title:string = "Web";
  list:Array<string> = ["Websites", "Apps", "SEO", "Infrastructure"];
  blurbs:Array<string> = [
    "Mobile First Sites, Landing Pages, PWAs, CMSs, Stores, Platforms",
    "Accounts, Chat, Profiles, Groups, Activities, Relationships",
    "Domains, Hosting, DNS, Email, SMS",
    "Continuous, Integration, Testing & Deployment"
  ];
  @Prop(String) readonly topic!: string;
}
</script>

<style lang="sass" scoped>
.web
  .blurb
    width: 100%
    margin: 30vh 0 35vh 0
  .web-card
    min-height: 20vh
</style>
