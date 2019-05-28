<template lang="pug">
v-form(ref="form" v-model="valid" @submit.prevent="sendContact")
    v-text-field(name="company" label="Company Name" v-model="company" :rules="rules.required" placeholder="Regolith Redistributors" required)
    v-text-field(name="industry" label="Industry" v-model="industry" :rules="rules.required" placeholder="Aerospace" required)
    v-text-field(name="role" label="Role" v-model="role" :rules="rules.required" placeholder="Rock Inspector" required)
    v-textarea(name="about" label="Tell us about your company" v-model="about" :rules="rules.required" placeholder="About your company" auto-grow required)
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";

@Component({})
export default class Background extends Vue {
  company: string = "";
  industry: string = "";
  role: string = "";
  about: string = "";
  rules = {
    required: [ (v: string) => !!v || 'This field is required' ]
  };
  valid: boolean = false;
}
</script>

<style lang="sass" scoped>
</style>
