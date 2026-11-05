<template lang="pug">
footer#footer
  span &copy; Skyler Fly-Wilson {{ new Date().getFullYear() }}
  nav
    router-link(to="/solutions") Solutions
    router-link(to="/work") Work
    router-link(to="/about") About
    router-link(to="/start") Start a project
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Footer extends Vue {
}
</script>

<style lang="sass" scoped>
#footer
  display: flex
  flex-wrap: wrap
  justify-content: space-between
  gap: 12px 24px
  padding: 24px
  width: 100%
  font-size: 14px
  color: rgba(255,255,255,0.55)
  border-top: 1px solid rgba(255,255,255,0.12)
  scroll-snap-align: end
  nav a
    margin-left: 20px
    color: inherit
    text-decoration: none
    &:hover
      color: #fff
</style>
