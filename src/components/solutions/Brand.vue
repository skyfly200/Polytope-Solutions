<template lang="pug">
Solution.brand(:title="title" :img="img" :topic="topic" :list="list" :blurbs="blurbs")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Solution from "./Solution.vue";

@Component({
  components: { Solution }
})
export default class Brand extends Vue {
  img:string = "http://lorempixel.com/640/480/abstract/3";
  title:string = "Brand";
  list:Array<string> = ["Strategy", "Video", "Social", "Market"];
  blurbs:Array<string> = [
    "Youtube, Instagram, Facebook, Twitter, Podcasts",
    "Presence, Message, Aesthetic, Following, Communication",
    "Stories, Process, Promotions, Personable Posts",
    "Content Creation, Scheduling, Strategy, Targeting",
    "Audio / Video Production, Photography, Web / Print Ads",
  ];
  @Prop(String) readonly topic!: string;
}
</script>

<style lang="sass" scoped>
</style>
