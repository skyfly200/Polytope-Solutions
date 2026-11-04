<template lang="pug">
v-toolbar#nav(color="primary")
    router-link(to="/")
        v-avatar
            Polytope600(size="48px" :speed="0.15" :line-width="0.8")
    v-toolbar-title Polytope Solutions
    v-spacer
    v-toolbar-items.hidden-sm-and-down
        v-btn(to="/" flat) Home
        v-btn(to="/about" flat) About
        v-btn(to="/services" flat) Services
        v-btn(to="/rng" flat) RNG
        v-btn(to="/consulting" flat) Consulting
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Polytope600 from "@/components/Polytope600.vue";

@Component({
    components: { Polytope600 }
})
export default class Nav extends Vue {
}
</script>

<style lang="sass" scoped>
</style>
