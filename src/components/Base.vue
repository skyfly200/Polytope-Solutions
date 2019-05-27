<template lang="pug">
.page
    .solution
        v-layout.blurb(data-aos="zoom-out" data-aos-anchor-placement="top-center")
            v-flex(sm10 offset-sm1 xs12)
                v-card.pa3.card
                    v-card-title
                        h1 {{ title }}
                    v-divider
                    v-card-text
                        v-layout.pa3(wrap)
                            v-flex.description(xl6 lg12)
                                h2 Description
                                p(v-for="b in blurbs" :key="b") {{ b }}
                                v-img(:src="img")
                            v-flex.features(xl6 lg12)
                                h2 List
                                ul.list
                                    li(v-for="i in list" :key="i") {{ i }}
        slot
    Footer
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Footer from "@/components/Footer.vue";

@Component({
    components: { Footer },
    props: [ "title", "img", "list",  "blurbs" ]
})
export default class Base extends Vue {
}
</script>

<style lang="sass" scoped>
.page
    width: 100%
    margin: 30vh 0 35vh 0
    .card
        min-height: 20vh
</style>
