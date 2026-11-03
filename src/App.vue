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
// will snap into view. Proximity rather than mandatory so tall sections that
// are taller than the viewport can still be scrolled through freely.
@media (prefers-reduced-motion: no-preference)
  html
    scroll-snap-type: y proximity
  .snap-section
    scroll-snap-align: start
    scroll-snap-stop: normal

#app
  font-family: 'Rajdhani', Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: white
  background-color: black
</style>
