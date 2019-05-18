<template lang="pug">
.data
  v-layout.blurb(data-aos="zoom-out" data-aos-anchor-placement="top-center")
    v-flex(sm10 offset-sm1)
      v-card.pa3.data-card
        v-card-title
          h1 {{ title }}
        v-divider
        v-card-text
          v-layout.pa3(wrap)
            v-flex.description(xl6 lg12)
              h2 Description
              p IOT, Sensors, Networking, Logging, Display, Analysis
              p Data Collection, Organization, Transformation, Visualization
              p Insights, Analytics, Planning, Projection, Action
              p Databases, Machine Learning, Data Science
              v-img(:src="img")
            v-flex.features(xl6 lg12)
              h2 List
              ul.list
                li(v-for="i in list") {{ i }}
  Footer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Footer from "@/components/Footer.vue";

@Component({
  components: { Footer }
})
export default class Data extends Vue {
  img:string = "http://lorempixel.com/640/480/abstract/3";
  title:string = "Brand";
  list:Array<string> = ["Item 1", "Item 2", "Item 3", "Item 4"];
}
</script>

<style lang="sass" scoped>
.data
  .blurb
    width: 100%
    margin: 30vh 0 35vh 0
  .data-card
    min-height: 20vh
</style>
