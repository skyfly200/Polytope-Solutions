<template lang="pug">
Solution.data(:title="title" :img="img" :list="list" :blurbs="blurbs")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Solution from "./Solution.vue";

@Component({
  components: { Solution }
})
export default class Data extends Vue {
  img:string = "http://lorempixel.com/640/480/abstract/1";
  title:string = "Data";
  list:Array<string> = ["Item 1", "Item 2", "Item 3", "Item 4"];
  blurbs:Array<string> = [
    "IOT, Sensors, Networking, Logging, Display, Analysis",
    "Data Collection, Organization, Transformation, Visualization",
    "Insights, Analytics, Planning, Projection, Action",
    "Databases, Machine Learning, Data Science",
  ];
  @Prop(String) readonly topic!: string;
}
</script>

<style lang="sass" scoped>
</style>
