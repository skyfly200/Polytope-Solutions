<template lang="pug">
v-form(ref="form" v-model="valid" @submit.prevent="sendContact")
    v-text-field(name="name" label="Full Name" v-model="name" :rules="rules.required" placeholder="John Smith" autocomplete="name" required)
    v-text-field(name="phone" label="Phone Number" v-model="name" :rules="rules.required" placeholder="720-555-5555" autocomplete="phone" required)
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
    required: [ (v: string) => !!v || 'This field is required' ],
    email: [
      (v: string) => !!v || 'E-mail is required',
      (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ]
  };
  valid: boolean = false;
}
</script>

<style lang="sass" scoped>
</style>
