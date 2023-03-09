"use strict";

import Vue from "vue";
import VueRouter from "vue-router";
import Cookies from "js-cookie";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "vessel"
  },
  {
    path: "/login",
    component: () => import(/* webpackChunkName: "vessel" */ "@/views/login.vue")
  },
  {
    path: "/vessel",
    component: () => import(/* webpackChunkName: "vessel" */ "@/views/vessel.vue")
  },
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get('token');
  token || (to.path == '/login') ? next() : next('/login');
})

export default router;

