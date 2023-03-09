// 插件
import "@/plugins/axios";
import "@/plugins/echarts";
import "@/plugins/custom/notice";
import "@/assets/style/global.scss";

// 依赖样式
import "@/assets/style/ol.css";
import "@/assets/style/roboto.css";
import "@/assets/style/supermap.min.css";

// 全家桶
import Vue from "vue";
import App from "@/App.vue";
import store from "@/store";
import router from "@/router";
import vuetify from "@/plugins/vuetify";

Vue.config.productionTip = false;

const config = {
  store,
  router,
  vuetify,
  render: (h) => h(App),
};

new Vue({ ...config }).$mount("#app");
