"use strict";

// 原型
const Plugin = {};
// 全局实例对象
import Vue from "vue";
// 引入主板模块
const echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/line");
// 引入所需组件
require("echarts/lib/component/tooltip");
// 开始封装图表
Plugin.install = function (Vue) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          // 实例化图表
          line: (id, chart) => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            chart.data = [Math.round(Math.random() * (30 - 10)) + 10,Math.round(Math.random() * (30 - 10)) + 10,[Math.round(Math.random() * (30 - 10)) + 10,Math.round(Math.random() * (30 - 10)) + 10]]
            chart.dats = [Math.round(Math.random() * (30 - 10)) + 10,Math.round(Math.random() * (30 - 10)) + 10,[Math.round(Math.random() * (30 - 10)) + 10,Math.round(Math.random() * (30 - 10)) + 10]]
            chart.datc = [Math.round(Math.random() * (30 - 10)) + 10,Math.round(Math.random() * (30 - 10)) + 10,[Math.round(Math.random() * (30 - 10)) + 10,Math.round(Math.random() * (30 - 10)) + 10]]
            chart.daty = [Math.round(Math.random() * (30 - 10)) + 10,Math.round(Math.random() * (30 - 10)) + 10,[Math.round(Math.random() * (30 - 10)) + 10,Math.round(Math.random() * (30 - 10)) + 10]]

            const option = {
              grid: {
                top: 10,
                left: 0,
                right: 0,
                bottom: 0,
                containLabel: true,
              },
              tooltip: {
                trigger: "axis",
              },
              xAxis: [
                {
                  type: "category",
                  data: chart.date,
                },
              ],
              yAxis: [
                {
                  type: "value",
                },
              ],
              series: [
                {
                  type: "line",
                  data: chart.data,
                },
                {
                  type: "line",
                  data: chart.dats,
                },
                {
                  type: "line",
                  data: chart.datc,
                },
                {
                  type: "line",
                  data: chart.daty,
                },
              ],
            };
            // 生成图表
            myChart.resize();
            myChart.setOption(option);
          },
        };
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
