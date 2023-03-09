"use strict";

// 原型
const Plugin = {};
// 全局实例对象
import Vue from "vue";
// 引入主板模块
const echarts = require("echarts/lib/echarts");
// 引入折线
require("echarts/lib/chart/line");
// 引入饼图
require("echarts/lib/chart/pie");
// 引入柱状图
require("echarts/lib/chart/bar");
// 引入仪表盘
require("echarts/lib/chart/gauge");
require("echarts/lib/component/legend");
require("echarts/lib/component/tooltip");
require("echarts/lib/component/markPoint");
require("echarts/lib/component/markLine");
// 开始封装图表
Plugin.install = function(Vue) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          // 实例化图表 --- 折线图
          line: (id, data) => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            const option = {
              grid: {
                top: 60,
                left: 45,
                right: 100,
                bottom: 45,
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
              legend: {
                y: "20",
                data: data.legend.data,
              },
              xAxis: {
                type: "category",
                boundaryGap: false,
                name: data.xAxis.name,
                data: data.xAxis.data,
              },
              yAxis: {
                name: data.yAxis.name,
                type: "value",
                axisPointer: {
                  snap: true,
                },
              },
              series: [
                {
                  name: data.series[0].name,
                  type: "line",
                  data: data.series[0].data,
                  markPoint: data.series[0].markPoint,
                  markLine: data.series[0].markLine,
                  smooth: true,
                },
                {
                  name: data.series[1].name,
                  type: "line",
                  data: data.series[1].data,
                  markPoint: data.series[1].markPoint,
                  markLine: data.series[1].markLine,
                  smooth: true,
                },
              ],
            };
            // 生成图表
            myChart.resize();
            myChart.setOption(option);
          },
          // 实例化图表 --- 饼图
          Pie: (id, data) => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            const option = {
              tooltip: {
                trigger: "item",
                formatter: "{b} : {c} ({d}%)",
              },
              series: [
                {
                  type: "pie",
                  radius: "55%",
                  center: ["50%", "50%"],
                  label: {
                    formatter: "{b} {d}%",
                  },
                  data: data.series.data,
                  emphasis: {
                    itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: "rgba(0, 0, 0, 0.5)",
                    },
                  },
                },
              ],
            };
            // 生成图表
            myChart.resize();
            myChart.setOption(option);
          },
          // 实例化图表 --- 柱状图
          Bar: (id, data) => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            const option = {
              legend: {
                y: "20",
                data: data.legend.data,
              },
              grid: {
                top: data.grid.top,
                left: data.grid.left,
                right: data.grid.right,
                bottom: data.grid.bottom,
                containLabel: false,
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                },
              },
              xAxis: [
                {
                  type: "category",
                  data: data.xAxis.data,
                  name: data.xAxis.name,
                },
              ],
              yAxis: data.yAxis,
              series: data.series,
            };
            // 生成图表
            myChart.resize();
            myChart.setOption(option);
          },
          // 实例化图表 --- 仪表盘
          Gauge: (id, data) => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            const option = {
              tooltip: {
                formatter: "{a} <br/>{b} : {c}%",
              },
              toolbox: {
                feature: {
                  restore: {},
                  saveAsImage: {},
                },
              },
              series: [
                {
                  name: "业务指标",
                  type: "gauge",
                  detail: { formatter: "{value}" },
                  axisLine: {
                    // 坐标轴线
                    lineStyle: {
                      // 属性lineStyle控制线条样式
                      width: 10,
                    },
                  },
                  max: data.series.max,
                  data:data.series.data,
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
