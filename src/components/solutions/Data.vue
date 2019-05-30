<template lang="pug">
Solution.data(:title="title" :img="img" :topic="topic" :list="list" :blurbs="blurbs")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Solution from "./Solution.vue";

@Component({
  components: { Solution }
})
export default class Data extends Vue {
  img:string = "/img/data-wave.jpg";
  title:string = "Data";
  list:Array<string> = ["Visualization", "Storage, Processing and Retrieval", "Data Science", "IOT & Sensors"];
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
