<template lang="pug">
.web
  v-layout.blurb(data-aos="zoom-out" data-aos-anchor-placement="top-center")
    v-flex(sm10 offset-sm1)
      v-card.pa3.web-card
        v-card-title
          h1 Web Solutions
        h3 More info soon to come
  Footer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Footer from "@/components/Footer.vue";

@Component({
  components: { Footer }
})
export default class Web extends Vue {}
</script>

<style lang="sass" scoped>
.web
  .blurb
    width: 100%
    margin: 30vh 0 35vh 0
  .web-card
    min-height: 20vh
</style>
