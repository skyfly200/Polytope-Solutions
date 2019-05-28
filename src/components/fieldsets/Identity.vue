<template lang="pug">
v-form(ref="form" v-model="valid" @submit.prevent="sendContact")
    v-text-field(name="name" label="Full Name" v-model="name" :rules="rules.name" placeholder="John Smith" autocomplete="name" required)
    v-text-field(name="phone" label="Phone Number" v-model="name" :rules="rules.name" placeholder="720-555-5555" autocomplete="phone" required)
    v-text-field(name="email" type="email" label="Email" v-model="email" :rules="rules.email" placeholder="name@example.com" autocomplete="email" required)
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";

@Component({})
export default class Identity extends Vue {
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
