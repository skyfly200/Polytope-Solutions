<template lang="pug">
.web
  Base(:title="title" :img="img" :list="list" :blurbs="blurbs")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";

@Component({
  components: { Base }
})
export default class Web extends Vue {
  img:string = "http://lorempixel.com/640/480/abstract/3";
  title:string = "Brand";
  list:Array<string> = ["Item 1", "Item 2", "Item 3", "Item 4"];
  blurbs:Array<string> = [
    "Mobile First Sites, Landing Pages, PWAs, CMSs, Stores, Platforms",
    "Accounts, Chat, Profiles, Groups, Activities, Relationships",
    "Domains, Hosting, DNS, Email, SMS",
    "Continuous, Integration, Testing & Deployment"
  ];
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
