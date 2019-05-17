<template lang="pug">
v-container(fluid).home
  v-layout#landing
    section
      .logo(data-aos="fade-up" data-aos-delay="500")
        img(src="https://upload.wikimedia.org/wikipedia/commons/9/95/600-cell_orthographic-vertex-first-square-sym-2D.svg")
      .brand-name(data-aos="fade" data-aos-delay="250") Polytope Solutions
      .slogan(data-aos="fade" data-aos-delay="750" data-aos-offset="-100") Gain Higher Perspectives
  v-layout.content(v-if="true")
    v-flex(xs10 offset-xs1)
      .blurb(data-aos="zoom-out" data-aos-anchor-placement="top-center")
        i.fas.fa-globe.fa-5x.fa-rotate-270
        span  We help you take a step back.
      .blurb(data-aos="flip-down" data-aos-anchor-placement="top-center")
        i.fas.fa-cube.fa-5x
        span  Look at your problems from new angles.
      .blurb(data-aos="flip-up" data-aos-anchor-placement="top-center")
        i.fas.fa-compass.fa-5x
        span  To explore novel solutions.
      .blurb(data-aos="zoom-in" data-aos-anchor-placement="top-center")
        i.fas.fa-code.fa-5x
        span  Using the latest technology.
      .blurb(data-aos="flip-left" data-aos-anchor-placement="top-center")
        i.fas.fa-drafting-compass.fa-5x
        span  Specialy drafted to your unique needs.
      .blurb(data-aos="flip-right" data-aos-anchor-placement="top-center")
        i.fas.fa-crosshairs.fa-5x
        span  Helping you refine and achieve your visions.
      .blurb(data-aos="zoom-out-down" data-aos-anchor-placement="top-center")
        i.fas.fa-puzzle-piece.fa-5x
        span Solving your puzzles is our specialty.
    ContactForm
  footer#footer &copy; Skyler Fly-Wilson {{ new Date().getFullYear() }}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import ContactForm from "@/components/ContactForm.vue";

@Component({
  components: { ContactForm }
})
export default class Home extends Vue {}
</script>

<style lang="sass" scoped>
.home
  #footer
    width: 100%
    text-align: center
    font-size: 1rem

  section
    scroll-snap-align: center

  #landing
    height: 100vh
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center
    .logo img
        filter: invert(100%)
        width: 40%
    .brand-name
      font-family: "Sirin Stencil", cursive
      font-size: 7rem
    .slogan
      font-size: 2.5rem
      margin: 2rem

  .content
    display: flex
    flex-direction: column
    justify-content: center
    p
      margin: 20px
    .blurb
      font-size: 2.2rem
      height: 100vh
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      i
        margin: 5%
</style>
