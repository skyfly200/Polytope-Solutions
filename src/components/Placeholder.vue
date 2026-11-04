<template lang="pug">
.placeholder(:class="{ round }" role="img" :aria-label="label")
  i.fas(:class="icon")
  span {{ label }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

// A clearly marked image slot, shown until a real photo or embed exists.
@Component({})
export default class Placeholder extends Vue {
  @Prop({ default: "Image coming soon" }) label!: string;
  @Prop({ default: "fa-image" }) icon!: string;
  @Prop({ default: false }) round!: boolean;
}
</script>

<style lang="sass" scoped>
.placeholder
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  gap: 8px
  width: 100%
  min-height: 220px
  border: 2px dashed rgba(255,255,255,0.3)
  border-radius: 8px
  color: rgba(255,255,255,0.6)
  background: rgba(255,255,255,0.04)
  padding: 16px
  i
    font-size: 2rem
  &.round
    width: 220px
    height: 220px
    border-radius: 50%
    margin: 0 auto
</style>
