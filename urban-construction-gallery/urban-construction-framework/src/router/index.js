"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
import Cookies from "js-cookie";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "indoor"
  },
  {
    path: "/indoor",
    component: () => import("@/views/indoor.vue")
  },
  {
    path: "/sans",
    component: () => import("@/views/sans.vue")
  },
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get('token');
  token ? next(): window.open('http://192.168.0.110:8080/#/login','_self');
})

export default router;
