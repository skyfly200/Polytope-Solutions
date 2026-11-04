<template lang="pug">
Base.start
  v-container(fluid).start-page
    StartForm
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";
import StartForm from "@/components/StartForm.vue";

@Component({
  components: { Base, StartForm }
})
export default class Start extends Vue {}
</script>

<style lang="sass" scoped>
.start-page
  padding-top: 2rem
  padding-bottom: 3rem
</style>
