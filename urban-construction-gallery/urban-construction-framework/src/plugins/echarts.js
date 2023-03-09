"use strict";

import Vue from "vue";
// 引入主板模块
const echarts = require("echarts/lib/echarts");
// 引入所需组件
require("echarts/lib/component/tooltip");
// 开始封装图表
Plugin.install = function(Vue) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          // 实例化图表
          demo: id => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            const option = {};
            // 生成图表
            myChart.clear();
            myChart.setOption(option);
          }
        };
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;
