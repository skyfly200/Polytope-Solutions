import Vue from 'vue'
import Vuetify from 'vuetify'
// Full Vuetify component CSS. app.styl only pulls in base/generic styles, so
// components (text fields, buttons, cards) rendered unstyled after the Vite move.
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify, {
  iconfont: 'fa',
  theme: {
    primary: '#4527a0',
    secondary: '#ffa000'
  }
})
