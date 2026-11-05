import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: import.meta.env.BASE_URL,
  // The window (html) is the scroll container, including with scroll-snap.
  // Back/forward restores the saved offset, hash links scroll to their
  // anchor, and every other navigation starts at the top. Instant (not
  // smooth) so snap points can't intercept an animated scroll.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { selector: to.hash };
    if (to.path === from.path) return false;
    return { x: 0, y: 0 };
  },
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
      path: "/solutions",
      name: "solutions",
      component: () => import("./views/Solutions.vue")
    },
    {
      path: "/solutions/:slug",
      name: "solution",
      component: () => import("./views/Solution.vue")
    },
    {
      path: "/work",
      name: "work",
      component: () => import("./views/Work.vue")
    },
    {
      path: "/work/:slug",
      name: "case-study",
      component: () => import("./views/CaseStudy.vue")
    },
    {
      path: "/services",
      name: "services",
      component: () =>
        import(/* webpackChunkName: "services" */ "./views/Services.vue")
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
      path: "/start",
      name: "start",
      component: () =>
        import(/* webpackChunkName: "start" */ "./views/Start.vue")
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
