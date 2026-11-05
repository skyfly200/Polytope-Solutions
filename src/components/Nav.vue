<template lang="pug">
v-toolbar#nav(color="black" flat)
    router-link(to="/")
        v-avatar
            Polytope600(size="48px" :speed="0.15" :line-width="0.8")
    v-toolbar-title Polytope Solutions
    v-spacer
    v-toolbar-items.hidden-sm-and-down
        v-btn(to="/" flat) Home
        v-btn(to="/solutions" flat) Solutions
        v-btn(to="/work" flat) Work
        v-btn(to="/about" flat) About
        v-btn(to="/start" color="secondary" depressed) Start a project
    v-menu.hidden-md-and-up(offset-y left)
        v-btn(slot="activator" icon aria-label="Menu")
            i.fas.fa-bars
        v-list
            v-list-tile(v-for="l in links" :key="l.to" :to="l.to")
                v-list-tile-title {{ l.text }}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Polytope600 from "@/components/Polytope600.vue";

@Component({
    components: { Polytope600 }
})
export default class Nav extends Vue {
    links = [
        { to: "/", text: "Home" },
        { to: "/solutions", text: "Solutions" },
        { to: "/work", text: "Work" },
        { to: "/about", text: "About" },
        { to: "/start", text: "Start a project" }
    ];
}
</script>

<style lang="sass" scoped>
#nav
  border-bottom: 1px solid rgba(255,255,255,0.12)
  .v-toolbar__title
    font-weight: 500
    letter-spacing: 0.02em
</style>
