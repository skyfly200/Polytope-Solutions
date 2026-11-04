<template lang="pug">
v-toolbar#nav(color="primary")
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
        v-menu(offset-y)
            v-btn(slot="activator" flat) Specialty
            v-list
                v-list-tile(v-for="l in specialtyLinks" :key="l.path" :to="l.path")
                    v-list-tile-title {{ l.label }}
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
import { specialtyLinks } from "@/data/solutions";

@Component({
    components: { Polytope600 }
})
export default class Nav extends Vue {
    links = [
        { to: "/", text: "Home" },
        { to: "/solutions", text: "Solutions" },
        { to: "/work", text: "Work" },
        { to: "/about", text: "About" },
        ...specialtyLinks.map(l => ({ to: l.path, text: "Specialty: " + l.label })),
        { to: "/start", text: "Start a project" }
    ];
    specialtyLinks = specialtyLinks;
}
</script>

<style lang="sass" scoped>
</style>
