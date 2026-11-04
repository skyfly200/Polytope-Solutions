<template lang="pug">
section#contact-form.contact-card
  .card(v-if="!sent" :class="{ 'is-folded': folded }" :aria-hidden="folded ? 'true' : null")
    .call-to-action
      i.fas.fa-rocket.rocket(aria-hidden="true")
      h2.header Start a project with us
      p.intro Tell us a little about you and what you are working on, and we will reply within a day or two.
    form.form(novalidate @submit.prevent="sendContact")
      .field
        label(for="cf-name") Name
          span.required *
        input#cf-name(v-model="name" name="name" type="text" placeholder="John Smith" autocomplete="name" :aria-invalid="submitted && !!errors.name")
        .field-error(v-if="submitted && errors.name") {{ errors.name }}
      .field
        label(for="cf-email") Email
          span.required *
        input#cf-email(v-model="email" name="email" type="email" placeholder="name@example.com" autocomplete="email" :aria-invalid="submitted && !!errors.email")
        .field-error(v-if="submitted && errors.email") {{ errors.email }}
      .field
        label(for="cf-company") Company or organization
        input#cf-company(v-model="company" name="company" type="text" placeholder="Regolith Redistributors" autocomplete="organization")
      .field
        label(for="cf-area") What do you need help with?
          span.required *
        select#cf-area(v-model="solutionArea" name="solution_area" :aria-invalid="submitted && !!errors.solutionArea")
          option(value="" disabled) Choose a solution area
          option(v-for="a in areas" :key="a" :value="a") {{ a }}
        .field-error(v-if="submitted && errors.solutionArea") {{ errors.solutionArea }}
      .field
        label(for="cf-needs") Tell us about the project
          span.required *
        textarea#cf-needs(v-model="needs" name="project_description" rows="5" placeholder="What are you trying to get done, and what is in the way?" :aria-invalid="submitted && !!errors.needs")
        .field-error(v-if="submitted && errors.needs") {{ errors.needs }}
      .field
        label(for="cf-timeline") Timeline
        input#cf-timeline(v-model="timeline" name="timeline" type="text" placeholder="e.g. start next month, launch by spring")
      .field
        label(for="cf-budget") Budget
        input#cf-budget(v-model="budget" name="budget" type="text" placeholder="A rough range is fine, or leave blank")
      .field
        label(for="cf-referral") How did you hear about us?
        input#cf-referral(v-model="referral" name="referral_source" type="text" placeholder="Referral, search, social...")
      //- Honeypot: hidden from people, tempting to bots.
      .field.hp(aria-hidden="true")
        label(for="cf-website") Website
        input#cf-website(v-model="website" name="website" type="text" tabindex="-1" autocomplete="off")
      .actions
        button.btn.btn-primary(type="submit" :disabled="sending") {{ sending ? "Sending..." : "Send" }}
        button.btn.btn-ghost(type="button" :disabled="sending || isEmpty" @click="clearForm") Reset
      p.alert(v-if="alert" :class="alertType" role="status") {{ alert }}
  .launch(v-if="launchVisible" :class="flight" aria-hidden="true")
    .env-wrap
      svg.envelope(viewBox="0 0 120 80")
        rect.env-body(x="2" y="2" width="116" height="76" rx="6")
        path.env-flap(d="M4 6 L60 46 L116 6")
        circle.env-seal(cx="60" cy="46" r="9")
    .rocket-wrap
      svg.rocket(viewBox="0 0 60 140")
        path.flame(d="M20 100 Q30 140 40 100 Z")
        path.fin(d="M17 82 L4 112 L20 104 Z")
        path.fin(d="M43 82 L56 112 L40 104 Z")
        path.body(d="M30 4 C44 24 46 60 44 100 L16 100 C14 60 16 24 30 4 Z")
        circle.window(cx="30" cy="56" r="8")
        rect.nozzle(x="20" y="100" width="20" height="6" rx="2")
  .card.confirmation(v-if="sent")
    h2.header Thanks for reaching out!
    p.intro We sent a confirmation to your inbox and will reply within a day or two.
    .actions
      button.btn.btn-ghost(type="button" @click="sent = false") Send another request
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";

const EMAIL_PATTERN = /.+@.+\..+/;
const START_URL = "/.netlify/functions/start";
const AREAS = [
  "AI Harnesses & Agentic Workflows",
  "Business Systems & Automation",
  "Web & Product Builds",
  "Networks & Systems",
  "Other"
];

// Timings (ms) for the send animation. The request runs alongside the fold.
const FOLD_MS = 600;
const SEAL_MS = 900;
const LOAD_MS = 800;
const LAUNCH_MS = 1100;
const UNFOLD_MS = 600;

// idle: nothing playing. folding: card folds up while the request is sent.
// sealed: envelope shown, waiting on the request. loading: envelope drops into
// the rocket. launching: rocket leaves the top of the screen. reversing: the
// request failed, so the card unfolds again.
type Flight = "idle" | "folding" | "sealed" | "loading" | "launching" | "reversing";

const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

@Component({})
export default class StartForm extends Vue {
  name: string = "";
  company: string = "";
  email: string = "";
  solutionArea: string = "";
  needs: string = "";
  timeline: string = "";
  budget: string = "";
  referral: string = "";
  website: string = "";
  areas: string[] = AREAS;
  // Errors are only shown once the visitor has tried to send.
  submitted: boolean = false;
  sending: boolean = false;
  sent: boolean = false;
  alert: string = "";
  alertType: string = "info";
  flight: Flight = "idle";

  // The card stays folded from the moment it starts to fold until it unfolds.
  get folded(): boolean {
    return ["folding", "sealed", "loading", "launching"].indexOf(this.flight) !== -1;
  }

  // The envelope and rocket overlay is only on screen during these phases.
  get launchVisible(): boolean {
    return ["sealed", "loading", "launching"].indexOf(this.flight) !== -1;
  }

  get errors(): { name?: string; email?: string; needs?: string; solutionArea?: string } {
    const errors: { name?: string; email?: string; needs?: string; solutionArea?: string } = {};
    if (!this.name.trim()) errors.name = "Name is required";
    if (!this.email.trim()) {
      errors.email = "Email is required";
    } else if (!EMAIL_PATTERN.test(this.email.trim())) {
      errors.email = "Email must be valid";
    }
    if (!this.solutionArea) errors.solutionArea = "Please choose an area";
    if (!this.needs.trim()) errors.needs = "Please tell us about the project";
    return errors;
  }

  get isEmpty(): boolean {
    return ![this.name, this.company, this.email, this.solutionArea, this.needs, this.timeline, this.budget, this.referral].some(Boolean);
  }

  postContact(): Promise<boolean> {
    return axios
      .post(START_URL, {
        name: this.name,
        email: this.email,
        company: this.company,
        solution_area: this.solutionArea,
        project_description: this.needs,
        timeline: this.timeline,
        budget: this.budget,
        referral_source: this.referral,
        website: this.website
      })
      .then(() => true)
      .catch(error => {
        console.log(error);
        return false;
      });
  }

  showSendError(): void {
    this.alert = "An error occurred while sending. Please try again or email us at webmaster@polytopesolutions.com";
    this.alertType = "error";
  }

  async sendContact(): Promise<void> {
    if (this.sending) return;
    this.submitted = true;
    if (Object.keys(this.errors).length > 0) {
      this.alert = "Please fill in the highlighted fields.";
      this.alertType = "warning";
      return;
    }
    this.sending = true;
    this.alert = "";

    // Reduced motion: no staging, just send and show the confirmation.
    if (prefersReducedMotion()) {
      const ok = await this.postContact();
      if (ok) {
        this.sent = true;
        this.clearForm();
      } else {
        this.showSendError();
      }
      this.sending = false;
      return;
    }

    // Fold the card while the request is in flight.
    this.flight = "folding";
    const request = this.postContact();
    await wait(FOLD_MS);

    // Hold the sealed envelope until both the request and the seal are done.
    this.flight = "sealed";
    const [ok] = await Promise.all([request, wait(SEAL_MS)]);

    if (!ok) {
      // Reverse: unfold the card and show the error.
      this.flight = "reversing";
      await wait(UNFOLD_MS);
      this.flight = "idle";
      this.showSendError();
      this.sending = false;
      return;
    }

    this.flight = "loading";
    await wait(LOAD_MS);
    this.flight = "launching";
    await wait(LAUNCH_MS);

    this.sent = true;
    this.clearForm();
    this.flight = "idle";
    this.sending = false;
  }

  clearForm(): void {
    this.name = "";
    this.company = "";
    this.email = "";
    this.solutionArea = "";
    this.needs = "";
    this.timeline = "";
    this.budget = "";
    this.referral = "";
    this.website = "";
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
  select,
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
  select
    appearance: none
    cursor: pointer
    option
      color: black
  textarea
    resize: vertical
    min-height: 8rem
  .field-error
    color: #ff8a8a
    font-size: 15px

.field.hp
  position: absolute
  left: -10000px
  width: 1px
  height: 1px
  overflow: hidden

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
  animation: confirm-in 0.6s ease-out both
  .actions
    justify-content: center
    margin-top: 1.5rem

@media (max-width: 600px)
  .actions .btn
    flex: 1 1 100%

// ---- Send animation -------------------------------------------------------
// The card folds up toward its top edge, like a letter being folded.
.card
  transform-origin: 50% 0
  transition: transform 0.6s cubic-bezier(0.5, 0, 0.3, 1), opacity 0.45s ease 0.1s
  &.is-folded
    transform: perspective(900px) rotateX(88deg) scale(0.7)
    opacity: 0
    pointer-events: none

// Fixed overlay so the rocket can fly off the top of the viewport.
.launch
  position: fixed
  inset: 0
  z-index: 60
  pointer-events: none
  overflow: hidden

.env-wrap
  position: absolute
  left: 50%
  top: 45%
  width: clamp(110px, 28vw, 150px)
  transform: translate(-50%, -50%)
  transition: transform 0.8s cubic-bezier(0.6, 0, 0.4, 1), opacity 0.5s ease-in 0.3s
  .envelope
    display: block
    width: 100%
    overflow: visible
    filter: drop-shadow(0 8px 20px rgba(0, 0, 0, 0.6))
    animation: env-in 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.25) both, env-bob 1.4s ease-in-out 0.5s infinite
  .env-body
    fill: #f5efe3
    stroke: #ffa000
    stroke-width: 2
  .env-flap
    fill: none
    stroke: rgba(0, 0, 0, 0.35)
    stroke-width: 2
    stroke-linejoin: round
  .env-seal
    fill: #ffa000
    stroke: #b36f00
    stroke-width: 2
    transform-box: fill-box
    transform-origin: center
    animation: seal-in 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.5) 0.35s both

.rocket-wrap
  position: absolute
  left: 50%
  bottom: 6vh
  width: 64px
  transform: translateX(-50%)
  transition: transform 1.1s cubic-bezier(0.55, 0, 0.85, 0.3)
  animation: rocket-in 0.5s ease-out both
  .rocket
    display: block
    width: 100%
    overflow: visible
  .body
    fill: #eef1f6
    stroke: #ffa000
    stroke-width: 2
  .fin
    fill: #ffa000
  .window
    fill: #142040
    stroke: #ffa000
    stroke-width: 2
  .nozzle
    fill: #6b7280
  .flame
    fill: #ffb733
    transform-box: fill-box
    transform-origin: 50% 0
    animation: flame 0.18s ease-in-out infinite alternate
    opacity: 0.35

// Envelope drops into the rocket's hatch.
.launch.loading,
.launch.launching
  .env-wrap
    transform: translate(-50%, calc(-50% + 49vh - 6vh - 80px)) scale(0.12)
    opacity: 0
  .flame
    opacity: 1

.launch.loading .rocket
  animation: rocket-rumble 0.12s linear 0.6s infinite

.launch.launching
  .rocket-wrap
    transform: translate(-50%, -130vh)
  .flame
    animation-duration: 0.07s

@keyframes env-in
  from
    transform: scale(0.4) rotate(-8deg)
    opacity: 0
  to
    transform: none
    opacity: 1

@keyframes env-bob
  0%, 100%
    translate: 0 0
  50%
    translate: 0 -6px

@keyframes seal-in
  from
    transform: scale(0)
  to
    transform: scale(1)

@keyframes rocket-in
  from
    opacity: 0
    translate: 0 30px
  to
    opacity: 1
    translate: 0 0

@keyframes rocket-rumble
  0%, 100%
    translate: 0 0
  25%
    translate: -1px 1px
  75%
    translate: 1px -1px

@keyframes flame
  from
    transform: scaleY(0.75) scaleX(0.9)
  to
    transform: scaleY(1.25) scaleX(1.05)

@keyframes confirm-in
  from
    opacity: 0
    transform: translateY(16px)
  to
    opacity: 1
    transform: none

@media (prefers-reduced-motion: reduce)
  .card,
  .confirmation
    transition: none
    animation: none
</style>
