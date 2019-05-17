<template lang="pug">
v-container(fluid).home
  Landing
  v-layout.blurbs
    v-flex(xs10 offset-xs1)
      .blurb(v-for="b in blurbs" :data-aos="b.aos" data-aos-anchor-placement="top-center")
        i.fas.fa-5x(:class="b.icon")
        span {{ b.text }}
  v-layout.solutions-header
    h1 Offered Solutions
  v-layout.solutions(wrap)
    v-flex.solution(md4 sm6 xs12 v-for="s in solutions")
      v-card
        v-img(:src="s.img")
        v-card-title
          h1 {{ s.title }}
        v-card-text
          h2 List
          ul
            li(v-for="i in s.list")
        v-card-actions
          v-btn(:to="s.path") More
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
export default class Home extends Vue {
  solutions: object = {
    web: {title: "Web", path: "/web", img: "http://lorempixel.com/640/480/abstract", list: []},
    brand: {title: "Brand", path: "/brand", img: "http://lorempixel.com/640/480/abstract", list: []},
    data: {title: "Data", path: "/brand", img: "http://lorempixel.com/640/480/abstract", list: []}
  };
  blurbs: object = [
    {"icon": {"fa-cube": "true"}, "aos": "flip-down", "text": "Look at your problems from new angles."},
    {"icon": {"fa-code": "true"}, "aos": "flip-down", "text": "Using the latest technology."},
    {"icon": {"fa-drafting-compass": "true"}, "aos": "flip-down", "text": "Specialy drafted to your unique needs."},
    {"icon": {"fa-crosshairs": "true"}, "aos": "flip-down", "text": "Helping you refine and achieve your visions."}
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
