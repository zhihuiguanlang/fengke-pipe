"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
import Cookies from "js-cookie";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "fixation",
  },
  {
    path: "/fixation",
    component: () => import("@/views/fixation.vue"),
  },
  {
    path: "/fluxion",
    component: () => import("@/views/fluxion.vue"),
  },
  {
    path: "/cabin",
    component: () => import("@/views/cabin.vue"),
  },
  {
    path: "/camera",
    component: () => import("@/views/camera.vue"),
  },
  {
    path: "/parameter",
    component: () => import("@/views/parameter.vue"),
  },
  {
    path: "/remark",
    component: () => import("@/views/remark.vue"),
  },
  {
    path: "/host",
    component: () => import("@/views/host.vue"),
  },
  {
    path: "/facturer",
    component: () => import("@/views/facturer.vue"),
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
    path: "/build",
    component: () => import("@/views/build.vue"),
  },
  {
    path: "/check",
    component: () => import("@/views/check.vue"),
  },
  {
    path: "/maintain",
    component: () => import("@/views/maintain.vue"),
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get("token");
  token ? next() : window.open("http://114.55.245.83:4396", "_self");
});

export default router;
