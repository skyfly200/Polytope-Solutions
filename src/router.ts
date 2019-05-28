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
      path: "/web",
      name: "web",
      component: () =>
        import(/* webpackChunkName: "web" */ "./views/Web.vue")
    },
    {
      path: "/brand",
      name: "brand",
      component: () =>
        import(/* webpackChunkName: "brand" */ "./views/Brand.vue")
    },
    {
      path: "/data",
      name: "data",
      component: () =>
        import(/* webpackChunkName: "data" */ "./views/Data.vue")
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
