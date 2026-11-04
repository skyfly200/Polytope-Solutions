<template lang="pug">
section.page-section
  .inner
    h2(v-if="title") {{ title }}
    slot
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class PageSection extends Vue {
  @Prop() title?: string;
}
</script>

<style lang="sass" scoped>
.page-section
  padding: 48px 16px
  .inner
    max-width: 900px
    margin: 0 auto
    text-align: left
  h2
    text-align: center
    margin-bottom: 24px
</style>
