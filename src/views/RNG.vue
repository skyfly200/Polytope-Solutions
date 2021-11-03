<template lang="pug">
Base.about

  v-flex(sm10 offset-sm1)
    v-row.titleContainer
      v-col.titleText  
        div.titleTxt Random 
        div.titleTxt Number 
        div.titleTxt Generator
      v-col.RNGexist
        v-row.imgCard(v-for="a in art" :key="a")
          img(:src="'/img/art/'+a")
      //- v-col.description
      //-   h3 Create Your On-Chain Generative Art NFT Drop With The Same RNG Engine As ArtBlocks.

    //- v-card.pa3.about-card
    //-   v-card-title
    //-     h2 The Polytope Paradox™
    //-   v-card-text.cardContainer
    //-     div.textBody
    //-         h4 Have the foundation of your Generative Art NFT drop, allowing you to drop your NFT:
    //-         ul
    //-           li Without Oracle Fees
    //-           li Independent of any centralized platform
    //-           li With the highest level of security currently available in the world of Generative Art NFTs
    //-         v-btn Get Started

    div.quoteContainer
      div.textInfo
        h1 Have you seen this NFT art piece before? 
        p This is the Exploited Token from the Chainfaces NFT drop in 2019. If you’re not familiar with it, this is the Exploited Token from the Chainfaces NFT drop in 2019. The hacker exploited a loophole in the generative number code, and manually created a token with the rarest golf score trait. 
        p The hacker exploited a loophole in the generative number code, and manually created a token with the rarest golf score trait.
        b
        h5 In order to save the integrity of all the other tokens, the drop artist ended up having to buy the exploited token back from the hacker.
        b
        p It’s one of the risks you run when you launch a project in this medium, I suppose… 
      div.userImage           
        div.imageCard
          a(href="https://www.chainfaces.co/")
            img(src="https://storage.opensea.io/files/b7adba012d92bb80c8575ad1c34fabb1.svg").quoteImage

    div.quoteContainer
      div.userImage
        img(src="/img/skyler.JPG").quoteImage
        h5(style="margin:0") Skyler Fly-Wilson 
        h5 founder of Polytope Solutions
      
      div.textInfo
        h2 I heard about the Chainfaces Exploit early on in my career as an NFT Developer.
        p For the next year and a half, as I learned more about the space and started working on my own NFT drop 
          a(href="http://tinybox.shop/") TinyBoxes 
          | I realized that this exploit was a consistent risk to the integrity of new NFT drops.

    div.centeredContainer.quoteContainer
      div.textInfo
        h4 Perhaps you saw Nate Alex’s tweet about this exploit being an issue in the MeBits drop
      div.userImage
        blockquote.twitter-tweet.tw-align-center(data-theme='light')
          p(lang='en' dir='ltr')
            | this is where i landed on the meebits exploit. the basic idea is that you run the same on-chain calculation the meebits contract is running (randomIndex()), and if it yields an ID that you like (set in the constructor or with addApproved), you proceed to call mintWithPunkOrGlyph 
            a(href='https://t.co/Ow16tVxXr6') pic.twitter.com/Ow16tVxXr6
            | &mdash; NateAlex (@NateAlexNFT) 
          a(href='https://twitter.com/NateAlexNFT/status/1391154055242731527?ref_src=twsrc%5Etfw') May 8, 2021
        script(async='' src='https://platform.twitter.com/widgets.js' charset='utf-8' type="application/javascript")

    div.quoteContainer
      div.textInfo
        h5 So after countless hours of coding, I developed our proprietary Random Number Generator code -- which now is the foundation of ArtBlocks’ Generative Art Engine for all drops on their platform, and the foundation of my own TinyBoxes project.
        ul
          li Without Oracle Fees
          li Independent of any centralized platform
          li With the highest level of security currently available in the world of Generative Art NFTs
        v-btn Get Started
    div.quoteContainer
      div.textInfo
        p Now, while there’s no guarantee that installing The Polytope Paradox™ will make your drop 100% un-gameable… It WILL put your independent NFT project to the leading edge in Cost-Effectiveness and Security -- and the Security only continues to improve.The way The Polytope Paradox™ works is like a chaotic math equation, using entropy sources straight from the Blockchain to provide the minting call with a randomized hash, drawn from an ever-growing pool of random number modules.In layman’s terms -- it would be a ROYAL pain in the ass to reverse-engineer and exploit this code, and the whole thing is getting exponentially more complex all the time.The Polytope Paradox™ is quickly becoming the industry standard for RNG solutions in the Generative NFT Art space. Click the button below, and my team and I will help you integrate it into your NFT Project.

</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";

@Component({
  components: { Base }
})
export default class about extends Vue {

    mounted() {
      window.scrollTo(0,0);
    }

    art: string[] = [
      "6.png",
      "22.png",
      "86.png",
      "142.png"
  ];
}
</script>

<style lang="sass" scoped>
.about
  // scroll-snap-type: y mandatory
  text-align: left
  blockquote.twitter-tweet
    max-width: 25vw
    // max-height: 1vh

  .blurb
    width: 100%
    margin: 30vh 0 35vh 0
  .about-card
    margin-top: 10px
    margin-bottom: 10px
    min-height: 10vh
    border-radius: 25px
  .titleContainer
    margin: 40px
    display: flex
    text-align: left
    align-items: center
    .RNGexist
      flex:3
      margin: 10px
      display: flex
      justify-content: flex-end
      align-items: center
      .imgCard
        margin: 5px
        img
          max-width: 100%
          border-radius: 25px
    @media screen and (max-width: 500px)
      text-align: center
      flex-direction: column
    // .description
    //   flex:3
    //   font-size: 25px
    .titleText
      flex-shrink:1
      font-size: 70px
      line-height: 70px
      .titleTxt:first-letter
        color: #ffa000
  .cardContainer
    display: flex
    flex-direction: row
    @media screen and (max-width: 500px)
        flex-direction: column
    .textBody
      flex: 4
    .imageCard
      flex:1
      .quoteImage
        height: 100%
        max-height: 250px
        border-radius: 40px
  
  .centeredContainer
    flex-direction: column !important

  .quoteContainer
    display: flex
    flex-direction: row
    margin-left: 15%
    margin-right:15%
    margin-top: 40px
    .textInfo
      flex:4
      margin: 10px
    .twitter-tweet
        max-width: 100px
    .userImage
      flex-shrink: 1
      .quoteImage
        max-width: 10vw
        border-radius: 25px
    @media screen and (max-width: 500px)
      flex-direction: column-reverse
      justify-items: center
      align-items: center
      .userImage
        flex-shrink: 0
        .quoteImage
          max-width: 50vw
          border-radius: 25px
</style>
