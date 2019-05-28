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
      path: "/solution/:topic",
      name: "solution",
      component: () =>
        import(/* webpackChunkName: "web" */ "./views/Solutions.vue"),
      props: true 
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
