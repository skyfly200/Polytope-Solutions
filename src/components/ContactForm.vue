<template lang="pug">
v-flex(xs10 offset-xs1)
  v-card#contact-form.pa-5.call-to-action(v-if="!sent" data-aos="zoom-in-up" data-aos-anchor-placement="center-center" data-aos-offset="-200")
    i.fas.fa-rocket.fa-5x
    .action-header Let us help you find solutions today!
    v-form(ref="form" v-model="valid" @submit.prevent="sendContact")
      v-text-field(label="Your Name" v-model="name" :rules="rules.name" required)
      v-text-field(label="Company Name" v-model="company")
      v-text-field(label="Industry" v-model="industry")
      v-text-field(label="Email" v-model="email" :rules="rules.email" required)
      v-textarea(label="Tell us about your needs" v-model="needs" :rules="rules.needs" auto-grow required)
      v-btn(type="submit" :disabled="!valid" @click.prevent="sendContact") Send
      v-btn(@click="clearForm") Reset
      v-alert(:value="alert" :type="alertType" dismissible) {{ alert }}
  v-card#contact-form.pa-5.form-confirmation(v-else)
    .action-header Thanks for reaching out! We will be in touch very soon.
    .response {{ response }}
    v-btn(@click="sent = false") Back
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios, { AxiosResponse } from "axios";

@Component({})
export default class ContactForm extends Vue {
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
    needs: [ (v: string) => !!v || 'Body is required' ]
  };
  valid: boolean = false;
  alert: string = "";
  alertType: string = "info";
  sent: boolean = false;
  response: (AxiosResponse | null) = null;

  sendContact(): void {
    if (this.valid) {
      let t = this;
      axios
        .post("https://polytopesolutions.com/.netlify/functions/contact", {
          name: this.name,
          company: this.company,
          industry: this.industry,
          email: this.email,
          needs: this.needs
        })
        .then(function(response) {
          console.log(response);
          t.sent = true;
          t.response = response;
          t.alert = "Message Sent";
          t.alertType = "success";
        })
        .catch(function(error) {
          t.alert = "An error occured while sending. Please try again or email us at webmaster@polytopesolutions.com";
          t.alertType = "error";
          console.log(error);
        });
    } else {
      this.alert = "Please fix form errors";
      this.alertType = "error";
      this.alertType = "warning";
    }
  }

  clearForm(): void {
    let form = this.$refs.form as HTMLFormElement;
    form.reset();
    this.alert = "";
    this.alertType = "info";
  }
}
</script>

<style lang="sass">
</style>
