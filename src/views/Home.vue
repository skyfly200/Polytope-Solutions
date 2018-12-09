<template lang="pug">
  .home
    .brand-name Polytope Solutions
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
.brand-name
  font-family: "Sirin Stencil", cursive
  font-size: 4em
</style>
