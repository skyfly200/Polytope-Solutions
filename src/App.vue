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
  .snap-section
    scroll-snap-align: start
    scroll-snap-stop: normal

// Every top-level section is a full-height, centred block so the page reads as
// a stack of screens at any width.
.snap-section
  min-height: 100vh
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

#app
  font-family: 'Space Grotesk', Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: white
  background-color: black
</style>
