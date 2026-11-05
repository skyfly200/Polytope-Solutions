<template lang="pug">
v-app(dark)#app
  router-view
</template>

<style lang="sass">
*
  box-sizing: border-box

body
  background-color: black

// Scroll snapping for top-level page sections. Add the `snap-section` class
// to any top-level block (hero, blurbs, solutions, testimonials, ...) and it
// will snap into view. Mandatory so a short scroll always lands on a section;
// blocks taller than the viewport get their own snap points (see `.blurb`
// in Home.vue) so they can still be scrolled through.
@media (prefers-reduced-motion: no-preference)
  html
    scroll-snap-type: y mandatory
    // Pages with no snap sections (form pages, 404) would otherwise have only
    // the footer as a snap point and get pulled to the bottom, so they opt out.
    &.no-snap
      scroll-snap-type: none
  .snap-section
    scroll-snap-align: start
    scroll-snap-stop: normal

// Every top-level section is a full-height, centred block so the page reads as
// a stack of screens at any width.
.snap-section
  min-height: 100vh
  min-height: 100svh
  width: 100%
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  padding: 8vh 16px
  margin: 0
  > *
    width: 100%
    max-width: 1100px

// Shared type scale and surfaces for inner pages, matching the homepage:
// large light-weight type, thin white lines, no filled cards.
#app
  h1
    font-size: clamp(40px, 6vw, 72px)
    font-weight: 500
    line-height: 1.05
    margin: 0 0 1.25rem
  h2
    font-size: clamp(22px, 2.4vw, 30px)
    font-weight: 500
    line-height: 1.2
  h3
    font-size: clamp(18px, 1.6vw, 22px)
    font-weight: 500
    margin-bottom: 0.4em
  p, li
    font-size: clamp(16px, 1.3vw, 18px)
    line-height: 1.6
  .eyebrow
    text-transform: uppercase
    letter-spacing: 0.15em
    font-size: 13px
    color: rgba(255,255,255,0.6)
    margin-bottom: 1rem
  .lead
    font-size: clamp(18px, 1.8vw, 22px)
    line-height: 1.5
    color: rgba(255,255,255,0.78)
  .v-card
    background: transparent !important
    box-shadow: none !important
    border: 1px solid rgba(255,255,255,0.18)
    border-radius: 4px
    text-align: left
  .v-chip
    background: transparent !important
    border: 1px solid rgba(255,255,255,0.35)
    color: rgba(255,255,255,0.85)
    &.orange
      border-color: #ffa000
      .v-chip__content
        color: #ffa000 !important
  .v-alert
    background: transparent !important
    border-radius: 4px
  .v-btn
    text-transform: none
    letter-spacing: 0.04em
    font-weight: 600

  // Gem-cut buttons. An irregular octagon (two big facets, two small) via
  // clip-path, with a light facet across the top-left corner. Ghost/outline
  // variants use a faint fill because a border would be cut at the corners.
  // Keyboard focus swaps to a solid white fill so it is clear without an
  // outline (which clip-path would hide).
  .v-btn, .btn, .cta-btn
    --facet: polygon(14px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 6px 100%, 0 calc(100% - 6px), 0 14px)
    clip-path: var(--facet)
    border: 0 !important
    border-radius: 0 !important
    box-shadow: none !important
    background-image: linear-gradient(135deg, rgba(255,255,255,0.28) 0, rgba(255,255,255,0.28) 22%, rgba(255,255,255,0) 22%, rgba(255,255,255,0) 100%)
    transition: filter 0.2s, background-color 0.2s
    &:hover:not(:disabled):not(.v-btn--disabled)
      filter: brightness(1.2)
    &:focus-visible
      background-color: #fff !important
      background-image: none
      color: #000 !important
      text-decoration: underline
      outline: none
  .v-btn.v-btn--flat:not(.primary):not(.secondary), .v-btn.v-btn--outline, .btn-ghost
    background-color: rgba(255,255,255,0.1) !important
    color: #fff !important
  .v-btn.v-btn--outline, .v-btn.v-btn--flat
    background-color: rgba(255,255,255,0.1) !important
  .v-expansion-panel__container
    background: transparent !important
    border-top: 1px solid rgba(255,255,255,0.18) !important

#app
  font-family: 'Space Grotesk', Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: white
  background-color: black
</style>
