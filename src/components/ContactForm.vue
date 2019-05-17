<template lang="pug">
v-flex(sm10 offset-sm1)
  v-card#contact-form.pa-3.call-to-action(v-if="!sent" data-aos="zoom-in-up" data-aos-anchor-placement="center-center" data-aos-offset="-200")
    i.fas.fa-rocket.fa-5x
    .action-header Let us help you find solutions today!
    v-form(ref="form" v-model="valid" @submit.prevent="sendContact")
      v-text-field(name="name" label="Name" v-model="name" :rules="rules.name" placeholder="John Smith" autocomplete="name" required)
      v-text-field(name="company" label="Company" v-model="company" placeholder="Regolith Redistributors")
      v-text-field(name="industry" label="Industry" v-model="industry" placeholder="Aerospace")
      v-text-field(name="email" type="email" label="Email" v-model="email" :rules="rules.email" placeholder="name@example.com" autocomplete="email" required)
      v-textarea(name="needs" label="Tell us about your needs" v-model="needs" :rules="rules.needs" placeholder="Our company needs help with..." auto-grow required)
      v-btn(type="submit" :disabled="!valid" @click.prevent="sendContact") Send
      v-btn(@click="clearForm"  :disabled="!name && !company && !industry && !email && !needs") Reset
      v-alert(:value="alert" :type="alertType" dismissible) {{ alert }}
  v-card#contact-form.pa-3.form-confirmation(v-else)
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
    needs: [ (v: string) => !!v || 'This field is required' ]
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

<style lang="sass" scoped>
.action-header
  font-size: 2.5rem
</style>
