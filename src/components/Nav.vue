<template lang="pug">
v-toolbar#nav(color="primary")
    router-link(to="/")
        v-avatar
            v-img(src="https://upload.wikimedia.org/wikipedia/commons/9/95/600-cell_orthographic-vertex-first-square-sym-2D.svg")
    v-toolbar-title Polytope Solutions
    v-spacer
    v-toolbar-items.hidden-sm-and-down
        v-btn(to="/" flat) Home
        v-btn(to="/about" flat) About
        v-btn(to="/solution/rng" flat) RNG
        v-btn(to="/solution/consult" flat) Consulting
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Nav extends Vue {
}
</script>

<style lang="sass" scoped>
#nav
    .v-image
        filter: invert(100%)
</style>
