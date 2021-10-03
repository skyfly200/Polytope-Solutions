<template lang="pug">
Base.about
  v-layout.blurb(data-aos="zoom-out" data-aos-anchor-placement="top-center")
    v-flex(sm10 offset-sm1)
      v-card.pa3.about-card
        v-card-title
          h1 About Us
        v-card-text
          p Maybe you’ve heard about one of my projects somewhere in the space, connected with me on Discord, or perused my NFT gallery...
          p If you haven’t heard of me, I’m the dude who built the code ArtBlocks uses for their Random Number Generator engine -- the foundation of every Generative Art NFT drop on the platform.
          p I’m a man of many interests -- but nowadays, trading in and supporting the growing NFT Art space is perhaps my greatest passion.
          p On top of the many NFT projects I’ve supported and collected, I’ve also been involved in a number of successful drops and other projects built on The Blockchain.
          p And if you’re an artist or developer planning one of your own, I would love to lend you my experience and help you maximize the impact of your project.
          p So if you’d like me to consult on your NFT drop or platform to help you optimize your project for success…
          p Go ahead and click the button below to book your consultation with me.
          v-btn Book a Consultation
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";

@Component({
  components: { Base }
})
export default class About extends Vue {}
</script>

<style lang="sass" scoped>
.about
  scroll-snap-type: y mandatory
  .blurb
    width: 100%
    margin: 30vh 0 35vh 0
  .about-card
    min-height: 20vh
</style>
