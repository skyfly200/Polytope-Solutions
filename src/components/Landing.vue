<template lang="pug">
v-layout#landing.snap-section
  .logo(data-aos="fade-up" data-aos-delay="500")
    Polytope600(size="min(40vw, 46vh)" follow-mouse)
  .brand-name(data-aos="fade" data-aos-delay="250")
    span.tilt(v-tilt="{ max: 16, depth: 8 }") Polytope Solutions
  .slogan(data-aos="fade" data-aos-delay="750" data-aos-offset="-100")
    span.tilt(v-tilt="{ max: 12, depth: 4 }") Gain Higher Perspectives
  .cta(data-aos="fade" data-aos-delay="1000" data-aos-offset="-100")
    router-link.cta-btn(to="/start") Start a project
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
    margin: 1.5rem 2rem 1rem
  .cta-btn
    display: inline-block
    padding: 0.85rem 2.25rem
    min-height: 48px
    font-size: 1.15rem
    font-weight: 600
    letter-spacing: 0.04em
    color: #fff
    text-decoration: none
    background-color: #7c4dff
    transition: background 0.2s, box-shadow 0.2s, transform 0.2s
    &:hover
      background-color: #7c4dff
  @media (max-width: 600px)
    .brand-name
      font-size: 3.5rem
    .slogan
      font-size: 1.6rem
      margin: 1rem
    .cta-btn
      font-size: 1rem
      padding: 0.75rem 1.75rem
</style>
