"use strict";

import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "pipeline",
  },
  {
    path: "/pipeline",
    component: () => import("@/views/pipeline.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
