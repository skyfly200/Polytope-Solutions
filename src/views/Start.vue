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
export default class Start extends Vue {
  // No snap sections on this page: let the form scroll freely (see App.vue).
  mounted() {
    document.documentElement.classList.add("no-snap");
  }
  beforeDestroy() {
    document.documentElement.classList.remove("no-snap");
  }
}
</script>

<style lang="sass" scoped>
.start-page
  padding-top: 2rem
  padding-bottom: 3rem
</style>
