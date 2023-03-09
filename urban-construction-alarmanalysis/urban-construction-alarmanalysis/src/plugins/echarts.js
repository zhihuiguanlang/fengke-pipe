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
require("echarts/lib/component/legend");
require("echarts/lib/component/tooltip");
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
                top: 30,
                left: 60,
                right: 50,
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
                name: "时间",
                data: data.gatherTime,
              },
              yAxis: {
                name: `单位/${data.baseUnit[data.unitType]}`,
                type: "value",
                axisPointer: {
                  snap: true,
                },
              },
              series: [
                {
                  name: data.name + data.parameters[0],
                  type: "line",
                  data: data.duty,
                  smooth: true,
                },
                {
                  name: data.name + data.parameters[1],
                  type: "line",
                  data: data.dutys,
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
            console.log(data)
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
                  data: [{name:"2022-03-03",value:10},{name:"2022-03-04",value:20},{name:"2022-03-05",value:15}],
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
            data = {
              times:['2022-03-03','2022-03-04','2022-03-05'],
              name:'',
              values:[10,20,15]
            }
            // 设置配置项
            const option = {
              grid: {
                top: 40,
                left: 55,
                right: 45,
                bottom: 20,
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
                  data: data.times,
                  name: "日期"
                },
              ],
              yAxis: [
                {
                  type: "value",
                  show: true,
                  name: "次数",
                }
              ],
              series: [
                {
                  name: `${data.name}次数`,
                  type: "bar",
                  stack: "广告",
                  data: data.values,
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
