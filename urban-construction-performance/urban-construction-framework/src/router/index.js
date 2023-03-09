"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
import Cookies from "js-cookie";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "norm",
  },
  {
    path: "/norm",
    component: () => import("@/views/norm.vue"),
  },
  {
    path: "/score",
    component: () => import("@/views/score.vue"),
  },
  {
    path: "/me",
    component: () => import("@/views/me.vue"),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get('token');
  token ? next(): window.open('http://114.55.245.83:4396','_self');
})

export default router;
