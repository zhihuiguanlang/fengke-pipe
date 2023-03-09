// 插件
import "@/plugins/axios";
import "@/plugins/echarts";
import "@/plugins/custom/notice";
import "@/assets/style/global.scss";

// 全家桶
import Vue from "vue";
import App from "@/App.vue";
import store from "@/store";
import router from "@/router";
import vuetify from "@/plugins/vuetify";
import {
  Table,
  TableColumn,
} from "element-ui";

Vue.use(Table);
Vue.use(TableColumn);
Vue.config.productionTip = false;

const config = {
  store,
  router,
  vuetify,
  render: h => h(App)
}

new Vue({ ...config, }).$mount("#app");
