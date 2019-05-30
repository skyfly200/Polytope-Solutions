<template lang="pug">
.page
    Nav
    slot
    Footer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Nav from "@/components/Nav.vue";
import Footer from "@/components/Footer.vue";

@Component({
    components: { Nav, Footer }
})
export default class Base extends Vue {
}
</script>

<style lang="sass" scoped>
</style>
