<template lang="pug">
v-form(ref="form" v-model="valid")
    v-text-field(name="name" @input="update" label="Full Name" v-model="name" :rules="rules.required" placeholder="John Smith" autocomplete="name" required)
    v-text-field(name="phone" @input="update" label="Phone Number" v-model="phone" :rules="rules.required" placeholder="720-555-5555" autocomplete="tel" required)
    v-text-field(name="email" @input="update" label="Email" v-model="email" type="email" :rules="rules.email" placeholder="name@example.com" autocomplete="email" required)
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";

@Component({})
export default class Identity extends Vue {
  name: string = "";
  phone: string = "";
  email: string = "";
  rules = {
    required: [ (v: string) => !!v || 'This field is required' ],
    email: [
      (v: string) => !!v || 'E-mail is required',
      (v: string) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ]
  };
  valid: boolean = false;

  validate() {
    let form: any = this.$refs.form;
    this.valid = form.validate();
  }

  update() {
    this.validate();
    const data = {
      valid: this.valid,
      name: this.name,
      phone: this.phone,
      email: this.email
    };
    this.$emit('update', data);
  }
}
</script>

<style lang="sass" scoped>
</style>
