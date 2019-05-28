<template lang="pug">
v-layout.ma-4.solution
    v-flex(sm10 offset-sm1 xs12)
        v-card.pa3.card
            v-img.image(:src="img")
            v-card-title
                h1 {{ title }}
            v-divider
            v-card-text
                v-layout.pa3(wrap)
                    v-flex.description(lg6 md12)
                        h2 Description
                        p(v-for="b in blurbs" :key="b") {{ b }}
                    v-flex.features(lg6 md12)
                        h2 List
                        ul.list
                            li(v-for="i in list" :key="i") {{ i }}
                    v-flex.content(xs12)
                        slot
            v-divider
            v-card-actions
                v-btn(:to="/form/ + topic" color="primary" large) Inquire
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
    props: [ "img", "title", "topic", "blurbs", "list" ]
})
export default class Solution extends Vue {
}
</script>

<style lang="sass" scoped>
.flex
    width: 100%
    .card
        width: 100%
    .v-card__actions a
        margin: auto
    .image
        height: 300px
</style>
