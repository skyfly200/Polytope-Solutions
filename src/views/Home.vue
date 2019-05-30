<template lang="pug">
v-container(fluid).home
  Landing
  v-layout.blurbs
    v-flex(xs10 offset-xs1)
      .blurb(v-for="b in blurbs" :data-aos="b.aos" data-aos-anchor-placement="top-center")
        i.fas.fa-5x(:class="b.icon")
        span {{ b.text }}
  #solutions
    v-layout.solutions-header
      h1 Solutions
    v-layout.solutions(wrap)
      v-flex.solution(md4 xs12 v-for="s in solutions" :key="s.title")
        v-card(data-aos="flip-up" data-aos-anchor-placement="top-center" data-aos-easing="ease-in-cubic")
          v-img(:src="s.img" height="10em")
            h1.card-title {{ s.title }}
          v-divider
          v-card-text.content
            v-layout.pa3(wrap)
              v-flex.description
                p {{ s.description }}
          v-divider
          v-card-actions
            v-btn(:to="s.path" color="primary") More
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
      path: "/solution/web",
      img: "http://lorempixel.com/640/480/abstract/5",
      description: "With mobile dominating at 52% of traffic and new form factors emerging. A modern cross-platform presence will help your company make the most impact and reach on the web of the future "
    },
    brand: {
      title: "Brand",
      path: "/solution/brand",
      img: "http://lorempixel.com/640/480/abstract/3",
      description: "With today's oversaturation of content, it is easy to be lost in the shuffle. Building a brand with a community will keep you connected and on clients minds. Video and social are your new best friends."
    },
    data: {
      title: "Data",
      path: "/solution/data",
      img: "http://lorempixel.com/640/480/abstract/1",
      description: "Data is key and there is more of it than ever. So much, in fact, it can be hard to make sense of. Turn your data into actionable insights and stay a step ahead with advanced forecast and analysis. "
    }
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
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center
      i
        margin: 5%
  #solutions
    margin: 55vh 0
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
        .v-responsive__content
          display: flex
        .card-title
          margin: auto
          text-shadow: 0px 2px 3px black
        .content
          flex-grow: 1
        .list
          text-align: left
        .features
          padding-left: 1em
        .v-card__actions
          padding: 1em 0
          margin: 0 auto
  .contact
    hin-height: 100vh
</style>
