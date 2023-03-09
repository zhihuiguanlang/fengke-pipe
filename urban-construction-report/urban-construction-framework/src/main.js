// 插件
import "@/plugins/axios";
import "@/plugins/echarts";
import "@/plugins/custom/notice";

// 全家桶
import Vue from "vue";
import App from "@/App.vue";
import store from "@/store";
import router from "@/router";
import vuetify from "@/plugins/vuetify";
import vuepdf from "@/plugins/vuepdf";

Vue.config.productionTip = false;

const config = {
  store,
  router,
  vuetify,
  vuepdf,
  render: h => h(App)
}

new Vue({ ...config, }).$mount("#app");
