<template lang="pug">
v-form(ref="form" v-model="valid" @submit.prevent="sendContact")
    v-text-field(name="name" label="Name" v-model="name" :rules="rules.name" placeholder="John Smith" autocomplete="name" required)
    v-text-field(name="company" label="Company" v-model="company" placeholder="Regolith Redistributors")
    v-text-field(name="industry" label="Industry" v-model="industry" placeholder="Aerospace")
    v-text-field(name="email" type="email" label="Email" v-model="email" :rules="rules.email" placeholder="name@example.com" autocomplete="email" required)
    v-textarea(name="needs" label="Tell us about your needs" v-model="needs" :rules="rules.needs" placeholder="Our company needs help with..." auto-grow required)
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";

@Component({})
export default class Survey extends Vue {
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
