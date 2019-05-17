<template lang="pug">
v-layout#landing
  .logo(data-aos="fade-up" data-aos-delay="500")
    img(src="https://upload.wikimedia.org/wikipedia/commons/9/95/600-cell_orthographic-vertex-first-square-sym-2D.svg")
  .brand-name(data-aos="fade" data-aos-delay="250") Polytope Solutions
  .slogan(data-aos="fade" data-aos-delay="750" data-aos-offset="-100") Gain Higher Perspectives
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Landing extends Vue {
}
</script>

<style lang="sass" scoped>
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

</style>
