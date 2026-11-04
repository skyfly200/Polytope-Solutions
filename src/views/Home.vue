<template lang="pug">
v-container(fluid).home
  Landing
  v-layout.blurbs.snap-section
    v-flex(xs10 offset-xs1)
      .blurb(v-for="b in blurbs" :data-aos="b.aos" data-aos-anchor-placement="top-center")
        i.fas.fa-5x(:class="b.icon")
        span(v-tilt="{ max: 10, depth: 4 }") {{ b.text }}
  #solutions.snap-section
    v-layout.solutions-header
      h1(v-tilt) Solutions
    v-layout
      v-flex(md12 lg10 offset-lg1)
        v-layout.solutions(wrap)
          v-flex.solution(md6 xs12 v-for="s in solutions" :key="s.title")
            v-card(data-aos="flip-up" data-aos-anchor-placement="top-center" data-aos-easing="ease-in-cubic")
              .solution-img(:style="{ backgroundImage: 'url(' + s.img + ')' }")
                .img-overlay
                  h1.card-title(v-tilt="{ max: 10, depth: 3 }") {{ s.title }}
              v-card-text.content.pa3
                p {{ s.description }}
                v-btn(:to="s.path" color="primary") Learn More
  ExampleProjects.snap-section
  Testimonials.snap-section
  v-layout.contact.snap-section#contact
    ContactForm
  Footer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";
import Landing from "@/components/Landing.vue";
import ContactForm from "@/components/ContactForm.vue";
import Footer from "@/components/Footer.vue";
import Testimonials from "@/components/Testimonials.vue";
import ExampleProjects from "@/components/ExampleProjects.vue";

@Component({
  components: { Landing, ContactForm, Footer, Testimonials, ExampleProjects }
})
export default class Home extends Vue {
  solutions: object = {
    web: {
      title: "On-Chain RNG",
      path: "/rng",
      img: "/img/spider-web.jpg",
      description: "Want to drop your own Generative Art NFT, without the Oracle fees, without depending on a centralized platform, and with the same level of security and dependability as ArtBlocks on your own platform?"
    },
    consult: {
      title: "NFT Consulting",
      path: "/consulting",
      img: "/img/spider-web.jpg",
      description: "Want to bring in one of the leading innovators in the Generative Art NFT space to help optimize your upcoming NFT drop for security, efficiency, and success?"
    },
  };
  blurbs: object = [
    {"icon": {"fa-cube": "true"}, "aos": "flip-down", "text": "Look at your problems from new angles"},
    {"icon": {"fa-code": "true"}, "aos": "flip-down", "text": "Using the latest technology"},
    {"icon": {"fa-drafting-compass": "true"}, "aos": "flip-down", "text": "Specialy drafted to your unique needs"},
    {"icon": {"fa-crosshairs": "true"}, "aos": "flip-down", "text": "Helping you refine and achieve your visions"}
  ];
}
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
      scroll-snap-align: start
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      i
        margin: 5%
  #solutions
    margin: 0
    .solutions-header
      justify-content: center
      padding: 2em
      font-size: 1.8em
  .solutions
    justify-content: space-between
    .solution
      margin: 2em 0
      .v-card
        margin: 1em
        display: flex
        flex-direction: column
        height: 100%
        .solution-img
          height: 10em
          background-size: cover
          background-position: center
        .img-overlay
          height: 100%
          display: flex
          background-color: rgba(0,0,0,0.25)
        .card-title
          margin: auto
          text-shadow: 0px 2px 3px black
          font-size: 2.5em
        .content
          flex-grow: 1
        .list
          text-align: left
        .features
          padding-left: 1em
  .contact
    min-height: 100vh
</style>
