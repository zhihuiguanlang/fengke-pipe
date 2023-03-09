"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
import Cookies from "js-cookie";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "all",
  },
  {
    path: "/all",
    component: () => import("@/views/all.vue"),
  },
  {
    path: "/submit",
    component: () => import("@/views/submit.vue"),
  },
  {
    path: "/accept",
    component: () => import("@/views/accept.vue"),
  },
  {
    path: "/finish",
    component: () => import("@/views/finish.vue"),
  },
  {
    path: "/model",
    component: () => import("@/views/model.vue"),
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
