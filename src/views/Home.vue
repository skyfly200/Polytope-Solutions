<template lang="pug">
v-container(fluid).home
  v-layout.landing
    .logo
      img(src="https://upload.wikimedia.org/wikipedia/commons/9/95/600-cell_orthographic-vertex-first-square-sym-2D.svg")
    .brand-name Polytope Solutions
    .slogan Gain Higher Perspectives
  v-layout.content(v-if="true")
    v-flex(xs10 offset-xs1)
      .blurb Lost in a sea of information?
      .blurb Unable to see the undercurrents?
      .blurb We help you take a step back.
      .blurb To look at your problems from new angles.
      .blurb Custom data analysis and visualization.
      .blurb Specialized to your unique problems.
      .blurb Solving your puzzles is our specialty.
    v-flex(xs10 offset-xs1)
      v-card.call-to-action
      .action-header Let us help you find solutions today!
      v-form
        v-text-field(label="Your Name" required)
        v-text-field(label="Company Name" required)
        v-text-field(label="Industry" required)
        v-text-field(label="Email" required)
        v-textarea(label="Tell us a little about your problem" required)
        v-btn(type="submit" ) Send

</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Home extends Vue {}
</script>

<style lang="sass">
.home
  .landing
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
      margin: 20rem 0
    .action-header
      font-size: 2.5rem
</style>
