<template lang="pug">
v-layout#landing.snap-section
  .logo(data-aos="fade-up" data-aos-delay="500")
    Polytope600(size="min(40vw, 46vh)" follow-mouse)
  .brand-name(data-aos="fade" data-aos-delay="250")
    span.tilt(v-tilt="{ max: 16, depth: 8 }") Polytope Solutions
  .slogan(data-aos="fade" data-aos-delay="750" data-aos-offset="-100")
    span.tilt(v-tilt="{ max: 12, depth: 4 }") Gain Higher Perspectives
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Polytope600 from "@/components/Polytope600.vue";

@Component({
  components: { Polytope600 }
})
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
  perspective: 900px
  .tilt
    display: inline-block
  .brand-name
    font-family: "Sirin Stencil", cursive
    font-size: 7rem
    line-height: 1.1
  .slogan
    font-size: 2.5rem
    margin: 2rem
  @media (max-width: 600px)
    .brand-name
      font-size: 3.5rem
    .slogan
      font-size: 1.6rem
</style>
