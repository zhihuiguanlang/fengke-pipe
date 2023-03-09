"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
import Cookies from "js-cookie";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "survey",
  },
  {
    path: "/survey",
    component: () => import("@/views/survey.vue"),
  },
  {
    path: "/plan",
    component: () => import("@/views/plan.vue"),
  },
  {
    path: "/work",
    component: () => import("@/views/work.vue"),
  },
  {
    path: "/alarm",
    component: () => import("@/views/alarm.vue"),
  },
  // {
  //   path: "/early",
  //   component: () => import("@/views/early.vue"),
  // },
  // {
  //   path: "/share",
  //   component: () => import("@/views/share.vue"),
  // },
  {
    path: "/facility",
    component: () => import("@/views/facility.vue"),
  },
  {
    path: "/clean",
    component: () => import("@/views/clean.vue"),
  },
  {
    path: "/inspect",
    component: () => import("@/views/inspect.vue"),
  },
  {
    path: "/maintain",
    component: () => import("@/views/maintain.vue"),
  },
  {
    path: "/monitor",
    component: () => import("@/views/monitor.vue"),
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
