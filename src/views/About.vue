<template lang="pug">
.about
  v-layout#landing
    .logo(data-aos="fade-up" data-aos-delay="500")
      img(src="https://upload.wikimedia.org/wikipedia/commons/9/95/600-cell_orthographic-vertex-first-square-sym-2D.svg")
    .brand-name(data-aos="fade" data-aos-delay="250") Polytope Solutions
    .slogan(data-aos="fade" data-aos-delay="750" data-aos-offset="-100") Gain Higher Perspectives
  v-layout.blurb(data-aos="zoom-out" data-aos-anchor-placement="top-center")
    v-flex(sm10 offset-sm1)
      v-card.pa3.about-card
        v-card-title
          h1 About us
        h3 More info soon to come
  Footer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Footer from "@/components/Footer.vue";

@Component({
  components: { Footer }
})
export default class About extends Vue {}
</script>

<style lang="sass">
.about
  scroll-snap-type: y mandatory
  #landing
    height: 100vh
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    scroll-snap-align: center
    .logo img
        filter: invert(100%)
        width: 40%
    .brand-name
      font-family: "Sirin Stencil", cursive
      font-size: 7rem
    .slogan
      font-size: 2.5rem
      margin: 2rem
  .blurb
    width: 100%
    margin: 30vh 0 35vh 0
  .about-card
    min-height: 20vh
</style>
