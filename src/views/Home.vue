<template lang="pug">
v-container(fluid).home
  v-layout#landing
    .logo(data-aos="fade-up" data-aos-delay="500")
      img(src="https://upload.wikimedia.org/wikipedia/commons/9/95/600-cell_orthographic-vertex-first-square-sym-2D.svg")
    .brand-name(data-aos="fade") Polytope Solutions
    .slogan(data-aos="fade" data-aos-delay="750" data-aos-offset="-100") Gain Higher Perspectives
  v-layout.content(v-if="true")
    v-flex(xs10 offset-xs1)
      .blurb(data-aos="zoom-out")
        i.fas.fa-globe.fa-5x.fa-rotate-270
        span  We help you take a step back.
      .blurb(data-aos="flip-down")
        i.fas.fa-cube.fa-5x
        span  Look at your problems from new angles.
      .blurb(data-aos="flip-up")
        i.fas.fa-compass.fa-5x
        span  To explore novel solutions.
      .blurb(data-aos="zoom-in")
        i.fas.fa-code.fa-5x
        span  Using the latest technology.
      .blurb(data-aos="flip-left")
        i.fas.fa-drafting-compass.fa-5x
        span  Specialy drafted to your unique problems.
      .blurb(data-aos="flip-right")
        i.fas.fa-crosshairs.fa-5x
        span  Helping you refine and achieve your visions.
      .blurb(data-aos="zoom-out-down")
        i.fas.fa-puzzle-piece.fa-5x
        span Solving your puzzles is our specialty.
    v-flex(xs10 offset-xs1)
      v-card#contact-form.pa-5.call-to-action(v-if="!sent" data-aos="zoom-in-up")
        i.fas.fa-rocket.fa-5x
        .action-header Let us help you find solutions today!
        v-form(@submit.prevent="sendContact")
          v-text-field(label="Your Name" v-model="name" required)
          v-text-field(label="Company Name" v-model="company" required)
          v-text-field(label="Industry" v-model="industry" required)
          v-text-field(label="Email" v-model="email" required)
          v-textarea(label="Tell us a little about your problem" v-model="problem" required)
          v-btn(type="submit" @click.prevent="sendContact") Send
      v-card#contact-form.pa-5.form-confirmation(v-else)
        .action-header Thanks for reaching out! We will be in touch very soon.
        .response {{ response }}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";

@Component({
  components: {}
})
export default class Home extends Vue {
  name: string = "";
  company: string = "";
  industry: string = "";
  email: string = "";
  problem: string = "";
  sent: boolean = false;
  response: any = null;
  sendContact(): void {
    let t = this;
    axios
      .post("https://polytopesolutions.com/.netlify/functions/contact", {
        name: "",
        companyName: "",
        industry: "",
        email: "",
        problem: ""
      })
      .then(function(response) {
        console.log(response);
        t.sent = true;
        t.response = response;
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}
</script>

<style lang="sass">
.home
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
    min-height: 100vh
    display: flex
    flex-direction: column
    justify-content: center
    p
      margin: 20px
    .blurb
      font-size: 2.2rem
      margin: 75% 0
      display: flex
      flex-direction: column
      align-items: center
      i
        margin: 5%
    .action-header
      font-size: 2.5rem
</style>
