<template lang="pug">
Solution.web(:title="title" :img="img" :topic="topic" :list="list" :blurbs="blurbs")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Solution from "./Solution.vue";

@Component({
  components: { Solution }
})
export default class RNG extends Vue {
  img:string = "/img/spider-web.jpg";
  title:string = "RNG";
  list:Array<string> = ["On-Chain RNG"];
  blurbs:Array<string> = [
    "",
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
