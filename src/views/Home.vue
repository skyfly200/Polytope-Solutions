<template lang="pug">
.home
  .wrapper
    .logo
      img(src="https://upload.wikimedia.org/wikipedia/commons/9/95/600-cell_orthographic-vertex-first-square-sym-2D.svg")
    .brand-name Polytope Solutions
    .slogan Gain Higher Perspectives
  .footer Copyright Skyler Fly-Wilson 2018
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {}
</script>

<style lang="sass">
.home
  .wrapper
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
  .footer
    width: 100%
    position: absolute
    bottom: 0px
    text-align: center
    font-size: 1rem
</style>
