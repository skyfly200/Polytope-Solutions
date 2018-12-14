<template lang="pug">
v-container(fluid).home
  v-layout#landing
    .logo
      img(src="https://upload.wikimedia.org/wikipedia/commons/9/95/600-cell_orthographic-vertex-first-square-sym-2D.svg")
    .brand-name Polytope Solutions
    .slogan Gain Higher Perspectives
  v-layout.content(v-if="true")
    v-flex(xs10 offset-xs1)
      .blurb
        i.fas.fa-globe.fa-5x.fa-rotate-270
        span  We help you take a step back.
      .blurb
        i.fas.fa-cube.fa-5x
        span  Look at your problems from new angles.
      .blurb
        i.fas.fa-compass.fa-5x
        span  To explore novel solutions.
      .blurb
        i.fas.fa-code.fa-5x
        span  Using the latest technology.
      .blurb
        i.fas.fa-drafting-compass.fa-5x
        span  Specialy drafted to your unique problems.
      .blurb
        i.fas.fa-crosshairs.fa-5x
        span  Helping you refine and achieve your visions.
      .blurb
        i.fas.fa-puzzle-piece.fa-5x
        span Solving your puzzles is our specialty.
    v-flex(xs10 offset-xs1)
      v-card#contact-form.pa-5
        template.call-to-action(v-if="!sent")
          i.fas.fa-rocket.fa-5x
          .action-header Let us help you find solutions today!
          v-form(@submit.prevent="sendContact")
            v-text-field(label="Your Name" v-model="name" required)
            v-text-field(label="Company Name" v-model="company" required)
            v-text-field(label="Industry" v-model="industry" required)
            v-text-field(label="Email" v-model="email" required)
            v-textarea(label="Tell us a little about your problem" v-model="problem" required)
            v-btn(type="submit") Send
        template.form-confirmation(v-else)
          .action-header Thanks for reaching out! We will be in touch very soon.
          .response {{ response }}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

@Component({
  components: {},
  data: function(): Object {
    return {
      name: "",
      company: "",
      industry: "",
      email: "",
      problem: "",
      sent: false,
      response: ""
    };
  },
  methods: {
    sendContact(): void {
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
          this.sent = true;
          this.response = response;
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
})
export default class Home extends Vue {}
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
