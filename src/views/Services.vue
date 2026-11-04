<template lang="pug">
Base.services
  v-container.services-page(fluid)
    section.hero(data-aos="fade-up")
      h1 Services
      p.lead Practical blockchain and generative-art engineering for teams that want to ship something that holds up.

    section.offerings
      h2.section-title What we do
      v-layout(wrap justify-center)
        v-flex.offering(xs12 md6 lg4 v-for="(s, i) in services" :key="s.id")
          v-card.offering-card(data-aos="fade-up" :data-aos-delay="i * 80" data-aos-anchor-placement="top-bottom")
            v-card-text
              i.fas.offering-icon(:class="s.icon")
              h3 {{ s.title }}
              .tagline {{ s.tagline }}
              p.description {{ s.description }}
              ul.deliverables
                li(v-for="d in s.deliverables" :key="d") {{ d }}
            v-card-actions(v-if="s.path")
              v-spacer
              v-btn(:to="s.path" color="primary" depressed) Learn more

    section.process
      h2.section-title How we work
      v-layout(wrap justify-center)
        v-flex.step(xs12 sm6 md3 v-for="(p, i) in process" :key="p.title")
          .step-card(data-aos="fade-up" :data-aos-delay="i * 120")
            .step-number {{ i + 1 }}
            i.fas(:class="p.icon")
            h3 {{ p.title }}
            p {{ p.text }}

    section.engagements
      h2.section-title Ways to work together
      v-layout(wrap justify-center)
        v-flex.engagement(xs12 md4 v-for="(m, i) in engagementModels" :key="m.title")
          v-card.engagement-card(data-aos="zoom-in" :data-aos-delay="i * 100")
            v-card-text
              i.fas.engagement-icon(:class="m.icon")
              h3 {{ m.title }}
              .best-for {{ m.bestFor }}
              ul.points
                li(v-for="pt in m.points" :key="pt") {{ pt }}
            v-card-actions
              v-spacer
              v-btn(to="/start" color="secondary" depressed) {{ m.cta }}

    section.faq
      h2.section-title Common questions
      v-layout(justify-center)
        v-flex(xs12 md8 lg6)
          v-expansion-panel(expand)
            v-expansion-panel-content(v-for="f in faqs" :key="f.q")
              div(slot="header") {{ f.q }}
              v-card
                v-card-text.faq-answer {{ f.a }}

    section.cta(data-aos="fade-up")
      h2 Have a project in mind?
      p Tell us what you are building and we will suggest the right engagement.
      v-btn(to="/start" color="secondary" large depressed) Start a conversation
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Base from "@/components/Base.vue";
import {
  services,
  process,
  engagementModels,
  faqs
} from "@/data/portfolio";

@Component({
  components: { Base }
})
export default class Services extends Vue {
  services = services;
  process = process;
  engagementModels = engagementModels;
  faqs = faqs;
}
</script>

<style lang="sass" scoped>
.services-page
  padding-top: 12vh
  padding-bottom: 8vh
  max-width: 1200px

.hero
  margin-bottom: 6vh
  h1
    font-family: "Sirin Stencil", cursive
    font-size: 5rem
    line-height: 1.1
  .lead
    font-size: 1.6rem
    max-width: 40em
    margin: 1rem auto 0

.section-title
  font-size: 2.4rem
  margin: 6vh 0 3vh

.offering
  padding: 0.75em
  .offering-card
    height: 100%
    text-align: left
    .v-card__text
      display: flex
      flex-direction: column
      height: 100%
    .offering-icon
      font-size: 2.2rem
      color: #ffa000
      margin-bottom: 0.5rem
    h3
      font-size: 1.5rem
      margin-bottom: 0.25rem
    .tagline
      font-style: italic
      opacity: 0.8
      margin-bottom: 0.75rem
    .description
      flex-grow: 1
    .deliverables
      padding-left: 1.2em
      margin-top: 0.75rem
      li
        margin: 0.25rem 0

.process
  .step
    padding: 0.75em
  .step-card
    position: relative
    padding: 1.5rem 1rem
    border: 1px solid rgba(255, 255, 255, 0.15)
    border-radius: 6px
    height: 100%
    .step-number
      font-size: 0.9rem
      letter-spacing: 0.2em
      opacity: 0.6
    i
      font-size: 2rem
      color: #ffa000
      margin: 0.75rem 0
    h3
      font-size: 1.3rem
    p
      font-size: 1rem
      opacity: 0.85

.engagements
  .engagement
    padding: 0.75em
  .engagement-card
    height: 100%
    text-align: left
    .engagement-icon
      font-size: 2rem
      color: #ffa000
    h3
      font-size: 1.5rem
      margin: 0.5rem 0 0.25rem
    .best-for
      opacity: 0.8
      margin-bottom: 0.75rem
    .points
      padding-left: 1.2em
      li
        margin: 0.25rem 0

.faq
  .v-expansion-panel
    background: transparent
  .faq-answer
    text-align: left
    font-size: 1.1rem

.cta
  margin: 8vh 0 4vh
  h2
    font-size: 2.4rem
  p
    font-size: 1.2rem
    margin: 1rem 0 2rem
</style>
