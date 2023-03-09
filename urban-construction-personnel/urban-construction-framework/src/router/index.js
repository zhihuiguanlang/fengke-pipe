"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
import Cookies from "js-cookie";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "user"
  },
  {
    path: "/user",
    component: () => import("@/views/user.vue")
  },
  {
    path: "/role",
    component: () => import("@/views/role.vue")
  },
  {
    path: "/branch",
    component: () => import("@/views/branch.vue")
  },
  {
    path: "/menu",
    component: () => import("@/views/menu.vue")
  },
  {
    path: "/log",
    component: () => import("@/views/log.vue")
  },
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get('token');
  token ? next(): window.open('http://114.55.245.83:4396','_self');
})

export default router;
