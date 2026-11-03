import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@fortawesome/fontawesome-free/js/all.js";
import AOS from "aos";
import tilt from "./directives/tilt";

// initialize animate on scroll library
AOS.init();

// 3D perspective tilt on text that follows the cursor
Vue.directive("tilt", tilt);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
