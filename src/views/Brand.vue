<template lang="pug">
.brand
  v-layout.blurb(data-aos="zoom-out" data-aos-anchor-placement="top-center")
    v-flex(sm10 offset-sm1)
      v-card.pa3.brand-card
        v-card-title
          h1 Brand Solutions
        h3 More info soon to come
  Footer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Footer from "@/components/Footer.vue";

@Component({
  components: { Footer }
})
export default class Brand extends Vue {}
</script>

<style lang="sass" scoped>
.brand
  .blurb
    width: 100%
    margin: 30vh 0 35vh 0
  .brand-card
    min-height: 20vh
</style>
