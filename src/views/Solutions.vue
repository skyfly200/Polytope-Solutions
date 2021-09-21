<template lang="pug">
Base
    component(:is="topics[topic]" :topic="topic")
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";
import Solution from "@/components/solutions/Solution.vue";
import Web from "@/components/solutions/Web.vue";

@Component({
    components: { Base }
})
export default class Footer extends Vue {
    topics: Object = {
        web: Web
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
