"use strict";

import Vue from "vue";
import Cookies from "js-cookie";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "gis",
  },
  {
    path: "/gis",
    component: () => import("@/views/gis.vue"),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get("token");
  token ? next(): window.open('http://114.55.245.83:4396','_self');
});

export default router;
