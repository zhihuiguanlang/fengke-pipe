"use strict";

// 原型
const Plugin = {};
// 全局实例对象
import Vue from "vue";
// 引入主板模块
const echarts = require("echarts/lib/echarts");
// 引入折线图
require("echarts/lib/chart/line");
// 引入所需组件
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/markArea");
require("echarts/lib/component/visualMap");
// 开始封装图表
Plugin.install = function (Vue) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          // 实例化图表
          ai: (id, result) => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            const option = {
              grid: {
                top: 40,
                left: 0,
                right: 0,
                bottom: 0,
                containLabel: true,
              },
              title: {
                subtext: result.deviceName,
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                },
              },
              toolbox: {
                feature: {
                  saveAsImage: {},
                },
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                splitLine: {
                  show: false,
                },
                axisLabel: {
                  textStyle: {
                    color: "#fff",
                  },
                },
                data: result.time,
              },
              yAxis: {
                type: "value",
                splitLine: {
                  show: false,
                },
                axisLabel: {
                  textStyle: {
                    color: "#fff",
                  },
                },
              },
              visualMap: {
                show: false,
                dimension: 0,
              },
              series: result.source,
            };
            // 生成图表
            myChart.resize();
            myChart.setOption(option);
          },
          line: (id, chart) => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            const option = {
              grid: {
                top: 40,
                left: 0,
                right: 0,
                bottom: 0,
                containLabel: true,
              },
              title: {
                subtext: chart.name,
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                },
              },
              xAxis: [
                {
                  splitLine: {
                    show: false,
                  },
                  axisLabel: {
                    textStyle: {
                      color: "#fff",
                    },
                  },
                  boundaryGap: false,
                  type: "category",
                  data: chart.date,
                },
              ],
              yAxis: [
                {
                  type: "value",
                  splitLine: {
                    show: false,
                  },
                  axisLabel: {
                    textStyle: {
                      color: "#fff",
                    },
                  },
                },
              ],
              series: [
                {
                  type: "line",
                  name: `当前数值`,
                  data: chart.data,
                },
              ],
            };
            // 生成图表
            myChart.resize();
            myChart.setOption(option);
          },
          multi: (id) => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            const option = {
              grid: {
                top: 25,
                left: 0,
                right: 0,
                bottom: 0,
                containLabel: true,
              },
              legend: {
                data: ["综合舱", "污水舱", "燃气舱", "电力舱"],
                textStyle: {
                  color: "#fff",
                },
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                },
              },
              toolbox: {
                feature: {
                  saveAsImage: {},
                },
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                splitLine: {
                  show: false,
                },
                axisLabel: {
                  textStyle: {
                    color: "#fff",
                  },
                },
                data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
              },
              yAxis: {
                type: "value",
                min: 50,
                max: 200,
                interval: 50,
                splitLine: {
                  show: false,
                },
                axisLabel: {
                  textStyle: {
                    color: "#fff",
                  },
                },
              },
              series: [
                {
                  type: "line",
                  name: "综合舱",
                  data: [120, 132, 120, 132, 120, 132, 120],
                },
                {
                  type: "line",
                  name: "污水舱",
                  data: [132, 120, 132, 120, 132, 120, 132],
                },
                {
                  type: "line",
                  name: "燃气舱",
                  data: [148, 120, 120, 148, 190, 120, 148],
                },
                {
                  type: "line",
                  name: "电力舱",
                  data: [132, 148, 132, 120, 132, 148, 116],
                },
              ],
            };
            // 生成图表
            myChart.resize();
            myChart.setOption(option);
          },
          cabin: (id, result) => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            const option = {
              grid: {
                top: 20,
                left: 0,
                right: 0,
                bottom: 0,
                containLabel: true,
              },
              legend: {
                data: [
                  result[0].spaceName,
                  result[1].spaceName,
                  result[2].spaceName,
                  result[3].spaceName,
                ],
                textStyle: {
                  color: "#fff",
                },
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                },
              },
              toolbox: {
                feature: {
                  saveAsImage: {},
                },
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                splitLine: {
                  show: false,
                },
                axisLabel: {
                  textStyle: {
                    color: "#fff",
                  },
                },
                data: result[0].capsuleList,
              },
              yAxis: {
                type: "value",
                splitLine: {
                  show: false,
                },
                axisLabel: {
                  textStyle: {
                    color: "#fff",
                  },
                },
              },
              series: [
                {
                  type: "line",
                  name: result[0].spaceName,
                  data: result[0].capsuleValue,
                },
                {
                  type: "line",
                  name: result[1].spaceName,
                  data: result[1].capsuleValue,
                },
                {
                  type: "line",
                  name: result[2].spaceName,
                  data: result[2].capsuleValue,
                },
                {
                  type: "line",
                  name: result[3].spaceName,
                  data: result[3].capsuleValue,
                },
              ],
            };
            // 生成图表
            myChart.resize();
            myChart.setOption(option);
          },
          week: (id, result) => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            const option = {
              grid: {
                top: 20,
                left: 0,
                right: 0,
                bottom: 0,
                containLabel: true,
              },
              legend: {
                data: ["最近两周"],
                textStyle: {
                  color: "#fff",
                },
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                },
              },
              toolbox: {
                feature: {
                  saveAsImage: {},
                },
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                splitLine: {
                  show: false,
                },
                axisLabel: {
                  textStyle: {
                    color: "#fff",
                  },
                },
                data:result[0].date
              },
              yAxis: {
                type: "value",
                splitLine: {
                  show: false,
                },
                axisLabel: {
                  textStyle: {
                    color: "#fff",
                  },
                },
              },
              series: [
                {
                  type: "line",
                  name: "最近两周",
                  data: result[0].value,
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
