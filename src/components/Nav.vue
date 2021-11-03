<template lang="pug">
v-toolbar#nav(color="primary")
    router-link(to="/")
        v-avatar
            v-img(src="img/favcon.png")
    v-toolbar-title Polytope Solutions
    v-spacer
    v-toolbar-items.hidden-sm-and-down
        v-btn(to="/" flat) Home
        v-btn(to="/about" flat) About
        v-btn(to="/rng" flat) RNG
        v-btn(to="/consulting" flat) Consulting
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Nav extends Vue {
}
</script>

<style lang="sass" scoped>
#nav       
    embed
        height: 90%
        // filter: invert(100%)
        border-radius: 90%
</style>
