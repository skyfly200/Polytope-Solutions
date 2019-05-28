<template lang="pug">
v-toolbar#nav
    v-avatar
        v-img(src="https://upload.wikimedia.org/wikipedia/commons/9/95/600-cell_orthographic-vertex-first-square-sym-2D.svg")
    v-toolbar-title Polytope Solutions
    v-spacer
    v-btn(to="/" flat) Home
    v-btn(to="/solution/brand" flat) Brand
    v-btn(to="/solution/data" flat) Data
    v-btn(to="/solution/web" flat) Web
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
