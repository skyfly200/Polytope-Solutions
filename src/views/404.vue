<template lang="pug">
Base.error404
  v-layout.blurb(data-aos="zoom-out" data-aos-anchor-placement="top-center")
    v-flex(sm10 offset-sm1)
      v-card.pa3.error404-card
        v-card-title
          h1 404
        v-card-text
          h3 Page not found
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";

@Component({
  components: { Base }
})
export default class Web extends Vue {}
</script>

<style lang="sass" scoped>
.error404
  .blurb
    width: 100%
    margin: 30vh 0 35vh 0
  .error404-card
    min-height: 20vh
</style>
