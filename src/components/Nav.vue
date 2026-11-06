<template lang="pug">
v-toolbar#nav(color="black" flat)
    router-link(to="/")
        v-avatar
            img(src="/img/polytopes/seal-tesseract.svg" alt="Polytope Solutions" width="48" height="48")
    v-toolbar-title Polytope Solutions
    v-spacer
    v-toolbar-items.hidden-sm-and-down
        v-btn(to="/" flat exact) Home
        v-btn(to="/solutions" flat) Solutions
        v-btn(to="/work" flat) Work
        v-btn(to="/about" flat) About
        v-btn(to="/start" color="secondary" depressed) Get started
    v-menu.hidden-md-and-up(offset-y left)
        v-btn(slot="activator" icon aria-label="Menu")
            i.fas.fa-bars
        v-list
            v-list-tile(v-for="l in links" :key="l.to" :to="l.to")
                v-list-tile-title {{ l.text }}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
    components: {}
})
export default class Nav extends Vue {
    links = [
        { to: "/", text: "Home" },
        { to: "/solutions", text: "Solutions" },
        { to: "/work", text: "Work" },
        { to: "/about", text: "About" },
        { to: "/start", text: "Get started" }
    ];
}
</script>

<style lang="sass" scoped>
#nav
  scroll-snap-align: start
  border-bottom: 1px solid rgba(255,255,255,0.12)
  // Compact, centred buttons instead of full-height slabs; the facet shape
  // behind each one is drawn by directives/facets.ts.
  .v-toolbar__items
    align-items: center
    gap: 6px
    .v-btn
      height: 36px
      margin: 0
      padding: 0 18px
      font-size: 14px
  .v-toolbar__title
    font-weight: 500
    letter-spacing: 0.02em
</style>
