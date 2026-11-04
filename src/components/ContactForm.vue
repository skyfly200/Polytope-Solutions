<template lang="pug">
section#contact-form.contact-card
  .card(v-if="!sent")
    .call-to-action
      i.fas.fa-rocket.rocket(aria-hidden="true")
      h2.header Let us help you find solutions today!
      p.intro Tell us a little about you and what you are working on. We reply within a day or two.
    form.form(novalidate @submit.prevent="sendContact")
      .field
        label(for="cf-name") Name
          span.required *
        input#cf-name(v-model="name" name="name" type="text" placeholder="John Smith" autocomplete="name" :aria-invalid="submitted && !!errors.name")
        .field-error(v-if="submitted && errors.name") {{ errors.name }}
      .field
        label(for="cf-company") Company
        input#cf-company(v-model="company" name="company" type="text" placeholder="Regolith Redistributors" autocomplete="organization")
      .field
        label(for="cf-industry") Industry
        input#cf-industry(v-model="industry" name="industry" type="text" placeholder="Aerospace")
      .field
        label(for="cf-email") Email
          span.required *
        input#cf-email(v-model="email" name="email" type="email" placeholder="name@example.com" autocomplete="email" :aria-invalid="submitted && !!errors.email")
        .field-error(v-if="submitted && errors.email") {{ errors.email }}
      .field
        label(for="cf-needs") Tell us about your needs
          span.required *
        textarea#cf-needs(v-model="needs" name="needs" rows="5" placeholder="Our company needs help with..." :aria-invalid="submitted && !!errors.needs")
        .field-error(v-if="submitted && errors.needs") {{ errors.needs }}
      .actions
        button.btn.btn-primary(type="submit" :disabled="sending") {{ sending ? "Sending..." : "Send" }}
        button.btn.btn-ghost(type="button" :disabled="sending || isEmpty" @click="clearForm") Reset
      p.alert(v-if="alert" :class="alertType" role="status") {{ alert }}
  .card.confirmation(v-else)
    h2.header Thanks for reaching out!
    p.intro We will be in touch very soon.
    .actions
      button.btn.btn-ghost(type="button" @click="sent = false") Send another message
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

const EMAIL_PATTERN = /.+@.+\..+/;

@Component({})
export default class ContactForm extends Vue {
  name: string = "";
  company: string = "";
  industry: string = "";
  email: string = "";
  needs: string = "";
  // Errors are only shown once the visitor has tried to send.
  submitted: boolean = false;
  sending: boolean = false;
  sent: boolean = false;
  alert: string = "";
  alertType: string = "info";

  get errors(): { name?: string; email?: string; needs?: string } {
    const errors: { name?: string; email?: string; needs?: string } = {};
    if (!this.name.trim()) errors.name = "Name is required";
    if (!this.email.trim()) {
      errors.email = "Email is required";
    } else if (!EMAIL_PATTERN.test(this.email.trim())) {
      errors.email = "Email must be valid";
    }
    if (!this.needs.trim()) errors.needs = "Please tell us about your needs";
    return errors;
  }

  get isEmpty(): boolean {
    return !this.name && !this.company && !this.industry && !this.email && !this.needs;
  }

  sendContact(): void {
    this.submitted = true;
    if (Object.keys(this.errors).length > 0) {
      this.alert = "Please fill in the highlighted fields.";
      this.alertType = "warning";
      return;
    }
    this.sending = true;
    this.alert = "";
    axios
      .post("https://polytopesolutions.com/.netlify/functions/contact", {
        name: this.name,
        company: this.company,
        industry: this.industry,
        email: this.email,
        needs: this.needs
      })
      .then(() => {
        this.sent = true;
        this.clearForm();
      })
      .catch(error => {
        console.log(error);
        this.alert = "An error occurred while sending. Please try again or email us at webmaster@polytopesolutions.com";
        this.alertType = "error";
      })
      .finally(() => {
        this.sending = false;
      });
  }

  clearForm(): void {
    this.name = "";
    this.company = "";
    this.industry = "";
    this.email = "";
    this.needs = "";
    this.submitted = false;
    this.alert = "";
    this.alertType = "info";
  }
}
</script>

<style lang="sass" scoped>
// Sits inside the snap-section wrapper (Home.vue), which centres it and gives
// it a full-height screen. The card is a fixed-width column so the labels and
// fields line up on every screen size.
.contact-card
  width: 100%
  max-width: 640px
  margin: 0 auto
  text-align: left
  color: white

.card
  background: rgba(255, 255, 255, 0.04)
  border: 1px solid rgba(255, 255, 255, 0.14)
  border-radius: 14px
  padding: clamp(1.25rem, 4vw, 2.5rem)
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5)

.call-to-action
  text-align: center
  margin-bottom: 1.5rem
  .rocket
    color: #ffa000
    font-size: 2.5rem
    margin-bottom: 0.5rem

// The root font is 14px (Vuetify sets it), so sizes here are in px.
.header
  font-size: clamp(24px, 3.6vw, 34px)
  font-weight: 600
  line-height: 1.2
  margin: 0 0 0.5rem

.intro
  font-size: clamp(16px, 1.3vw, 18px)
  line-height: 1.5
  color: rgba(255, 255, 255, 0.72)
  margin: 0

.form
  display: flex
  flex-direction: column
  gap: 1.1rem

.field
  display: flex
  flex-direction: column
  gap: 0.4rem
  label
    font-size: 16px
    font-weight: 500
    color: rgba(255, 255, 255, 0.9)
    .required
      color: #ffa000
      margin-left: 0.25rem
  input,
  textarea
    font: inherit
    font-size: 16px
    color: white
    background: rgba(0, 0, 0, 0.45)
    border: 1px solid rgba(255, 255, 255, 0.22)
    border-radius: 8px
    padding: 0.75rem 0.9rem
    width: 100%
    outline: none
    transition: border-color 0.2s, box-shadow 0.2s
    &::placeholder
      color: rgba(255, 255, 255, 0.4)
    &:focus
      border-color: #ffa000
      box-shadow: 0 0 0 3px rgba(255, 160, 0, 0.2)
    &[aria-invalid="true"]
      border-color: #ff6b6b
  textarea
    resize: vertical
    min-height: 8rem
  .field-error
    color: #ff8a8a
    font-size: 15px

.actions
  display: flex
  flex-wrap: wrap
  gap: 0.75rem
  margin-top: 0.5rem

.btn
  font: inherit
  font-size: 16px
  font-weight: 600
  letter-spacing: 0.02em
  border-radius: 8px
  padding: 0.7rem 1.6rem
  cursor: pointer
  transition: background-color 0.2s, opacity 0.2s
  &:disabled
    opacity: 0.5
    cursor: not-allowed
  &.btn-primary
    background: #ffa000
    color: #000
    border: 1px solid #ffa000
    &:hover:not(:disabled)
      background: #ffb733
  &.btn-ghost
    background: transparent
    color: white
    border: 1px solid rgba(255, 255, 255, 0.4)
    &:hover:not(:disabled)
      background: rgba(255, 255, 255, 0.08)

.alert
  margin: 0.25rem 0 0
  padding: 0.75rem 1rem
  border-radius: 8px
  font-size: 15px
  line-height: 1.4
  &.warning
    background: rgba(255, 160, 0, 0.15)
    border: 1px solid rgba(255, 160, 0, 0.5)
  &.error
    background: rgba(255, 80, 80, 0.15)
    border: 1px solid rgba(255, 80, 80, 0.5)

.confirmation
  text-align: center
  .actions
    justify-content: center
    margin-top: 1.5rem

@media (max-width: 600px)
  .actions .btn
    flex: 1 1 100%
</style>
