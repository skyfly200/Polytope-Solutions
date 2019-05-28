<template lang="pug">
v-form(ref="form" v-model="valid" @submit.prevent="sendContact")
    v-text-field(name="company" label="Company Name" v-model="company" placeholder="Regolith Redistributors" required)
    v-text-field(name="industry" label="Industry" v-model="industry" placeholder="Aerospace" required)
    v-text-field(name="role" label="Role" v-model="role" :rules="rules.role" placeholder="Rock Inspector" required)
    v-textarea(name="about" label="Tell us about your company" v-model="about" :rules="rules.about" placeholder="About your company" auto-grow required)
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";

@Component({})
export default class Background extends Vue {
  name: string = "";
  company: string = "";
  industry: string = "";
  email: string = "";
  needs: string = "";
  rules = {
    name: [ (v: string) => !!v || 'Name is required' ],
    email: [
      (v: string) => !!v || 'E-mail is required',
      (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ],
    needs: [ (v: string) => !!v || 'This field is required' ]
  };
  valid: boolean = false;
}
</script>

<style lang="sass" scoped>
#contact-form
  display: flex
  align-items: center
  justify-content: center
  padding: 10vh 0
  min-height: 100vh
  .v-card
    width: 100%
    min-height: 600px
  .header
    font-size: 2.5rem
  .form-confirmation
    display: flex
    flex-direction: column
    justify-content: space-between
</style>
