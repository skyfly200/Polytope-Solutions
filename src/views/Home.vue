<template lang="pug">
v-container(fluid).home
  Landing
  v-layout.blurbs
    v-flex(xs10 offset-xs1)
      .blurb(v-for="b in blurbs" :data-aos="b.aos" data-aos-anchor-placement="top-center")
        i.fas.fa-5x(:class="b.icon")
        span {{ b.text }}
  v-layout.solutions-header#solutions
    h1 Offered Solutions
  v-layout.solutions(wrap)
    v-flex.solution(lg4 md6 xs12 v-for="s in solutions")
      v-card
        v-img(:src="s.img")
        v-card-title
          h1 {{ s.title }}
        v-divider
        v-card-text
          v-layout.pa3(wrap)
            v-flex.description(xl6 lg12)
              h2 Description
              p Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            v-flex.features(xl6 lg12)
              h2 List
              ul.list
                li(v-for="i in s.list") {{ i }}
        v-divider
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
    web: {
      title: "Web",
      path: "/web",
      img: "http://lorempixel.com/640/480/abstract/5",
      list: ["Item 1", "Item 2", "Item 3", "Item 4"]
    },
    brand: {
      title: "Brand",
      path: "/brand",
      img: "http://lorempixel.com/640/480/abstract/3",
      list: ["Item 1", "Item 2", "Item 3", "Item 4"]
    },
    data: {
      title: "Data",
      path: "/brand",
      img: "http://lorempixel.com/640/480/abstract/1",
      list: ["Item 1", "Item 2", "Item 3", "Item 4"]
    }
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
        .list
          text-align: left
        .features
          padding-left: 1em
  .contact
    hin-height: 100vh
</style>
