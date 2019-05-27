<template lang="pug">
.brand
  Base(:title="title" :img="img" :list="list" :blurbs="blurbs")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";

@Component({
  components: { Base }
})
export default class Brand extends Vue {
  img:string = "http://lorempixel.com/640/480/abstract/3";
  title:string = "Brand";
  list:Array<string> = ["Item 1", "Item 2", "Item 3", "Item 4"];
  blurbs:Array<string> = [
    "Youtube, Instagram, Facebook, Twitter, Podcasts",
    "Presence, Message, Aesthetic, Following, Communication",
    "Stories, Process, Promotions, Personable Posts",
    "Content Creation, Scheduling, Strategy, Targeting",
    "Audio / Video Production, Photography, Web / Print Ads",
  ];
}
</script>

<style lang="sass" scoped>
</style>
