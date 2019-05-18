<template lang="pug">
.web
  v-layout.blurb(data-aos="zoom-out" data-aos-anchor-placement="top-center")
    v-flex(sm10 offset-sm1)
      v-card.pa3.web-card
        v-card-title
          h1 {{ title }}
        v-divider
        v-card-text
          v-layout.pa3(wrap)
            v-flex.description(xl6 lg12)
              h2 Description
              p Mobile First Sites, Landing Pages, PWAs, CMSs, Stores, Platforms
              p Accounts, Chat, Profiles, Groups, Activities, Relationships
              p Domains, Hosting, DNS, Email, SMS
              p Continuous, Integration, Testing & Deployment
              v-img(:src="img")
            v-flex.features(xl6 lg12)
              h2 List
              ul.list
                li(v-for="i in list") {{ i }}
  Footer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Footer from "@/components/Footer.vue";

@Component({
  components: { Footer }
})
export default class Web extends Vue {
  img:string = "http://lorempixel.com/640/480/abstract/3";
  title:string = "Brand";
  list:Array<string> = ["Item 1", "Item 2", "Item 3", "Item 4"];
}
</script>

<style lang="sass" scoped>
.web
  .blurb
    width: 100%
    margin: 30vh 0 35vh 0
  .web-card
    min-height: 20vh
</style>
