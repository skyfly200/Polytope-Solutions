<template lang="pug">
v-app(dark)#app
  router-view
  footer#footer &copy;Copyright Skyler Fly-Wilson 2018
</template>

<style lang="sass">
*
  box-sizing: border-box

body
  background-color: black

#app
  font-family: 'Rajdhani', Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: white
  background-color: black
  #footer
    width: 100%
    text-align: center
    font-size: 1rem
</style>
