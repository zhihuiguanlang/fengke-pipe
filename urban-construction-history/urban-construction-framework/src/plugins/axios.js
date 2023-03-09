"use strict";

import Vue from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import http from "@/assets/script/http";

// 请求全局配置参数
let config = {
  timeout: 10000,
  responseType: "JSON",
  baseURL: http.system,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function (config) {
    // header code
    config.headers.Authorization = Cookies.get("token");
    // Do something before request is sent
    if (
      config.data
      &&
      config.method === "post"
      &&
      !config.data.__proto__.has
    ) {
      config.data = JSON.stringify(config.data)
    }
    // return config
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function (response) {
    // status
    if (response.data.code == 0) {
      // success
      return Promise.resolve(response.data);
    }
    else {
      // Do something with response data
      Vue.prototype.$notice.error(response.data.msg);
    }
  },
  function (error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Plugin.install = function (Vue) {
  Object.defineProperties(Vue.prototype, {
    $axios: {
      get() {
        return _axios;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
