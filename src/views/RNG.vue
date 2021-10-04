<template lang="pug">
Base.about
  v-layout.blurb(data-aos="zoom-out" data-aos-anchor-placement="top-center")
    v-flex(sm10 offset-sm1)
      v-card.pa3.about-card
        v-card-title
          h1 RNG Service
        v-card-text
          h3 Create Your On-Chain Generative Art NFT Drop With The Same RNG Engine As ArtBlocks
          p Have you seen this NFT art piece before? If you’re not familiar with it, this is the Exploited Token from the Chainfaces NFT drop in 2019. The hacker exploited a loophole in the generative number code, and manually created a token with the rarest golf score trait.
          p In order to save the integrity of all the other tokens, the drop artist ended up having to buy the exploited token back from the hacker.
          p It’s one of the risks you run when you launch a project in this medium, I suppose…
          p My name is Skyler Fly-Wilson -- the founder of Polytope Solutions -- and I heard about the Chainfaces Exploit early on in my career as an NFT Developer.
          p For the next year and a half, as I learned more about the space and started working on my own NFT drop TinyBoxes -- I realized that this exploit was a consistent risk to the integrity of new NFT drops.
          p (Perhaps you saw Nate Alex’s tweet about this exploit being an issue in the MeBits drop)
          p TODO: Twitter embed - https://twitter.com/natealexnft/status/1391154055242731527
          blockquote.twitter-tweet(data-theme='light')
            p(lang='en' dir='ltr')
              | this is where i landed on the meebits exploit. the basic idea is that you run the same on-chain calculation the meebits contract is running (randomIndex()), and if it yields an ID that you like (set in the constructor or with addApproved), you proceed to call mintWithPunkOrGlyph 
              a(href='https://t.co/Ow16tVxXr6') pic.twitter.com/Ow16tVxXr6
              | &mdash; NateAlex (@NateAlexNFT) 
            a(href='https://twitter.com/NateAlexNFT/status/1391154055242731527?ref_src=twsrc%5Etfw') May 8, 2021
          p So after countless hours of coding, I developed our proprietary Random Number Generator code -- which now is the foundation of ArtBlocks’ Generative Art Engine for all drops on their platform, and the foundation of my own TinyBoxes project.
          h3 I’m calling my RNG code, The Polytope Paradox™…
          h4 And now, with our help, you can have it at the foundation of your Generative Art NFT drop as well, allowing you to drop your NFT:
          ul
            li Without Oracle Fees
            li Independent of any centralized platform
            li With the highest level of security currently available in the world of Generative Art NFTs
          v-btn Get Started
          br
          br
          p Now, while there’s no guarantee that installing The Polytope Paradox™ will make your drop 100% un-gameable… It WILL put your independent NFT project to the leading edge in Cost-Effectiveness and Security -- and the Security only continues to improve.
          p You see, The Polytope Paradox™ works like an chaotic math equation, using entropy sources straight from the Blockchain to provide the minting call with a randomized hash, drawn from an ever-growing pool of random number modules.
          p In layman’s terms -- it would be a ROYAL pain in the ass to reverse-engineer and exploit this code, and the whole thing is getting exponentially more complex all the time.
          p The Polytope Paradox™ is quickly becoming the industry standard for RNG solutions in the Generative NFT Art space. Click the button below, and my team and I will provide support implementing it in your NFT Project.
          v-btn Get Started
</template>

<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
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
