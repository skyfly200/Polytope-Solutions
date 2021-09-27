<template lang="pug">
Base
    component(:is="topics[topic]" :topic="topic")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";
import Solution from "@/components/solutions/Solution.vue";
import RNG from "@/components/solutions/RNG.vue";
import Consulting from "@/components/solutions/Consulting.vue";

@Component({
    components: { Base }
})
export default class Footer extends Vue {
    topics: Object = {
        rng: RNG,
        consult: Consulting
    };
    @Prop(String) readonly topic!: string;
}
</script>

<style lang="sass" scoped>
#footer
  padding: 1em
  width: 100%
  text-align: center
  font-size: 1rem
</style>
