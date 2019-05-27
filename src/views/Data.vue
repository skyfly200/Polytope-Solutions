<template lang="pug">
.data
  Base(:title="title" :img="img" :list="list" :blurbs="blurbs")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";

@Component({
  components: { Base },
})
export default class Data extends Vue {
  img:string = "http://lorempixel.com/640/480/abstract/3";
  title:string = "Brand";
  list:Array<string> = ["Item 1", "Item 2", "Item 3", "Item 4"];
  blurbs:Array<string> = [
    "IOT, Sensors, Networking, Logging, Display, Analysis",
    "Data Collection, Organization, Transformation, Visualization",
    "Insights, Analytics, Planning, Projection, Action",
    "Databases, Machine Learning, Data Science",
  ];
}
</script>

<style lang="sass" scoped>
</style>
