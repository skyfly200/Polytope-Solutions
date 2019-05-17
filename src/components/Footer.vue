<template lang="pug">
footer#footer &copy; Skyler Fly-Wilson {{ new Date().getFullYear() }}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Footer extends Vue {
}
</script>

<style lang="sass" scoped>
#footer
  padding: 1em
  width: 100%
  text-align: center
  font-size: 1rem
</style>
