"use strict";

// 原型
const Plugin = {};
// 全局实例对象
import Vue from "vue";
// 引入主板模块
const echarts = require("echarts/lib/echarts");
// 引入柱状图
require("echarts/lib/chart/bar");
// 引入所需组件
require("echarts/lib/component/title");
require("echarts/lib/component/tooltip");
// 开始封装图表
Plugin.install = function(Vue) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          // 实例化图表
          bar: (id, result) => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            const option = {
              grid: {
                left: 0,
                right: 0,
                bottom: 0,
                containLabel: true
              },
              title: {
                text: result.title
              },
              tooltip: {
                trigger: "axis"
              },
              xAxis: [
                {
                  name: "时间",
                  type: "category",
                  data: result.date
                }
              ],
              yAxis: [
                {
                  type: "value"
                }
              ],
              series: [
                {
                  name: result.dataKey,
                  color: "#2f4554",
                  type: "bar",
                  data: result.data
                }
              ]
            };
            // 生成图表
            myChart.resize();
            myChart.setOption(option);
          }
        };
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;
