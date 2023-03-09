"use strict";

import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "common"
  },
  {
    path: "/common",
    component: () => import("@/views/common.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
