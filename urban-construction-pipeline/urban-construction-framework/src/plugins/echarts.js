"use strict";

// 原型
const Plugin = {};
// 全局实例对象
import Vue from "vue";
// 引入主板模块
const echarts = require("echarts/lib/echarts");
// 引入折线
require("echarts/lib/chart/line");
require("echarts/lib/component/tooltip");
// 开始封装图表
Plugin.install = function(Vue) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          // 实例化图表
          line: (id) => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            const option = {
              grid: {
                top: 20,
                left: 45,
                right: 0,
                bottom: 20,
                containLabel: false,
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                },
              },
              toolbox: {
                show: true,
                feature: {
                  saveAsImage: {},
                },
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                data: [
                  "00:00",
                  "01:15",
                  "02:30",
                  "03:45",
                  "05:00",
                  "06:15",
                  "07:30",
                  "08:45",
                  "10:00",
                  "11:15",
                  "12:30",
                  "13:45",
                  "15:00",
                  "16:15",
                  "17:30",
                  "18:45",
                  "20:00",
                  "21:15",
                  "22:30",
                  "23:45",
                ],
              },
              yAxis: {
                type: "value",
                axisLabel: {
                  formatter: "{value} W",
                },
                axisPointer: {
                  snap: true,
                },
              },
              series: [
                {
                  name: "用电量",
                  type: "line",
                  smooth: true,
                  data: [
                    300,
                    280,
                    250,
                    260,
                    270,
                    300,
                    550,
                    500,
                    400,
                    390,
                    380,
                    390,
                    400,
                    500,
                    600,
                    750,
                    800,
                    700,
                    600,
                    400,
                  ],
                },
              ],
            };
            // 生成图表
            myChart.clear();
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
