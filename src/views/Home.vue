<template lang="pug">
v-container(fluid).home
  Landing
  v-layout.blurbs
    v-flex(xs10 offset-xs1)
      .blurb(data-aos="flip-down" data-aos-anchor-placement="top-center")
        i.fas.fa-cube.fa-5x
        span  Look at your problems from new angles.
      .blurb(data-aos="zoom-in" data-aos-anchor-placement="top-center")
        i.fas.fa-code.fa-5x
        span  Using the latest technology.
      .blurb(data-aos="flip-left" data-aos-anchor-placement="top-center")
        i.fas.fa-drafting-compass.fa-5x
        span  Specialy drafted to your unique needs.
      .blurb(data-aos="flip-right" data-aos-anchor-placement="top-center")
        i.fas.fa-crosshairs.fa-5x
        span  Helping you refine and achieve your visions.
  v-layout.solutions-header
    h1 Offered Solutions
  v-layout.solutions(wrap)
    v-flex.solution
      v-card
        v-img(src="")
        v-card-title
          h1 Web
        v-card-text
          h2 List
          ul
            li Item 1
            li Item 2
            li Item 3
        v-card-actions
          v-btn(to="#") More
    v-flex.solution
      v-card
        v-img(src="")
        v-card-title
          h1 Brand
        v-card-text
          h2 List
          ul
            li Item 1
            li Item 2
            li Item 3
        v-card-actions
          v-btn(to="#") More
    v-flex.solution
      v-card
        v-img(src="")
        v-card-title
          h1 Data
        v-card-text
          h2 List
          ul
            li Item 1
            li Item 2
            li Item 3
        v-card-actions
          v-btn(to="#") More
  v-layout.contact
    ContactForm
  Footer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import Landing from "@/components/Landing.vue";
import ContactForm from "@/components/ContactForm.vue";
import Footer from "@/components/Footer.vue";

@Component({
  components: { Landing, ContactForm, Footer }
})
export default class Home extends Vue {}
</script>

<style lang="sass" scoped>
.home
  .blurbs
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
  .solutions-header
    justify-content: center
    padding: 2em
  .solutions
    justify-content: space-between
    .solution
      .v-card
        margin: 1em
  .contact
    hin-height: 100vh
</style>
