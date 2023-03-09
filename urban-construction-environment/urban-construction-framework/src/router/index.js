"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
import Cookies from "js-cookie";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "realtime"
  },
  {
    path: "/realtime",
    component: () => import("@/views/realtime.vue")
  },
  {
    path: "/alarm",
    component: () => import("@/views/alarm.vue")
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get('token');
  token ? next(): window.open('http://114.55.245.83:4396','_self');
})

export default router;
