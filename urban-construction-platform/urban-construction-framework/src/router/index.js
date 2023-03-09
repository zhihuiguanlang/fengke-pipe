"use strict";

import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "instrument"
  },
  {
    path: "/instrument",
    component: () => import("@/views/instrument.vue")
  },
  {
    path: "/parameter",
    component: () => import("@/views/parameter.vue")
  },
  {
    path: "/cabin",
    component: () => import("@/views/cabin.vue")
  },
  {
    path: "/gallery",
    component: () => import("@/views/gallery.vue")
  },
  {
    path: "/directive",
    component: () => import("@/views/directive.vue")
  },
  {
    path: "/menu",
    component: () => import("@/views/menu.vue")
  },
  {
    path: "/dictionary",
    component: () => import("@/views/dictionary.vue")
  },
  {
    path: "/log",
    component: () => import("@/views/log.vue")
  },
  {
    path: "/argument",
    component: () => import("@/views/argument.vue")
  },
  {
    path: "/custom",
    component: () => import("@/views/custom.vue")
  },
];

const router = new VueRouter({
  routes
});

export default router;
