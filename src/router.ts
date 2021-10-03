import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/about",
      name: "about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/rng",
      name: "rng",
      component: () =>
        import(/* webpackChunkName: "rng" */ "./views/RNG.vue")
    },
    {
      path: "/consulting",
      name: "consulting",
      component: () =>
        import(/* webpackChunkName: "consulting" */ "./views/Consulting.vue")
    },
    {
      path: "/form/:topic",
      name: "form",
      component: () =>
        import(/* webpackChunkName: "form" */ "./views/Form.vue"),
      props: true 
    },
    {
      path: "/*",
      name: "404",
      component: () =>
        import(/* webpackChunkName: "404" */ "./views/404.vue")
    }
  ]
});
