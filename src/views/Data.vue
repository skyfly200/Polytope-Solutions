<template lang="pug">
.data
  v-layout.blurb(data-aos="zoom-out" data-aos-anchor-placement="top-center")
    v-flex(sm10 offset-sm1)
      v-card.pa3.data-card
        v-card-title
          h1 Data Solutions
        h3 More info soon to come
  Footer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Footer from "@/components/Footer.vue";

@Component({
  components: { Footer }
})
export default class Data extends Vue {}
</script>

<style lang="sass" scoped>
.data
  .blurb
    width: 100%
    margin: 30vh 0 35vh 0
  .data-card
    min-height: 20vh
</style>
