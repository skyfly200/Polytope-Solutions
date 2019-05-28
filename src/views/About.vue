<template lang="pug">
Base.about
  v-layout.blurb(data-aos="zoom-out" data-aos-anchor-placement="top-center")
    v-flex(sm10 offset-sm1)
      v-card.pa3.about-card
        v-card-title
          h1 About us
        h3 More info soon to come
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";

@Component({
  components: { Base }
})
export default class About extends Vue {}
</script>

<style lang="sass" scoped>
.about
  scroll-snap-type: y mandatory
  .blurb
    width: 100%
    margin: 30vh 0 35vh 0
  .about-card
    min-height: 20vh
</style>
