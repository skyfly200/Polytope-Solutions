<template lang="pug">
#testimonials
  v-layout(justify-center)
    v-flex(xs12 md10 lg8)
      h2.section-title What clients say
      v-layout(wrap justify-center)
        v-flex.testimonial(xs12 md4 v-for="(t, i) in testimonials" :key="i")
          v-card.testimonial-card(data-aos="fade-up" :data-aos-delay="i * 120")
            v-card-text
              span.placeholder-badge(v-if="t.placeholder") Sample
              i.fas.fa-quote-left.quote-icon
              p.quote {{ t.quote }}
              .attribution
                .name {{ t.name }}
                .role {{ t.title }}, {{ t.company }}
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { testimonials } from "@/data/portfolio";

@Component({})
export default class Testimonials extends Vue {
  testimonials = testimonials;
}
</script>

<style lang="sass" scoped>
#testimonials
  min-height: 100vh
  padding: 10vh 0
  scroll-snap-align: start
  display: flex
  align-items: center
  .section-title
    font-size: 2.4rem
    margin-bottom: 4vh
  .testimonial
    padding: 0.75em
  .testimonial-card
    height: 100%
    text-align: left
    position: relative
    .v-card__text
      display: flex
      flex-direction: column
      height: 100%
    .quote-icon
      font-size: 1.6rem
      color: #ffa000
      margin-bottom: 0.5rem
    .quote
      font-size: 1.15rem
      flex-grow: 1
    .attribution
      margin-top: 1rem
      .name
        font-weight: bold
      .role
        opacity: 0.75
        font-size: 0.95rem
  .placeholder-badge
    position: absolute
    top: 0.5rem
    right: 0.5rem
    font-size: 0.75rem
    text-transform: uppercase
    letter-spacing: 0.1em
    padding: 0.15rem 0.5rem
    border: 1px dashed #ffa000
    color: #ffa000
    border-radius: 4px
</style>
