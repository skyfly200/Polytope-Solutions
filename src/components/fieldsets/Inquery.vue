<template lang="pug">
v-form(ref="form" v-model="valid")
    v-text-field(name="subject" @input="update" label="Subject" v-model="subject" :rules="rules.required" placeholder="Meteor Impact Debris" required)
    v-textarea(name="needs" @input="update" label="Tell us about your needs" v-model="needs" :rules="rules.required" placeholder="Our company needs help with..." auto-grow required)
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";

@Component({})
export default class Inquery extends Vue {
  subject: string = "";
  needs: string = "";
  rules = {
    required: [ (v: string) => !!v || 'This field is required' ]
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
      subject: this.subject,
      needs: this.needs
    };
    this.$emit('update', data);
  }
}
</script>

<style lang="sass" scoped>
</style>
