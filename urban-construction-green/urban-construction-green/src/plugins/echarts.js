"use strict";

// 原型
const Plugin = {};
import Vue from "vue";
// 引入主板模块
const echarts = require("echarts/lib/echarts");
// 引入所需组件
require("echarts/lib/chart/line");
require("echarts/lib/component/tooltip");
require('echarts/lib/component/dataZoom')
// 开始封装图表
Plugin.install = function(Vue) {
  Object.defineProperties(Vue.prototype, {
    $chart: {
      get() {
        return {
          // 实例化图表
          line: ( id, data ) => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            const option = {
              tooltip: {
                trigger: "axis",
                axisPointer: {  
                  type: "cross",
                  animation: false,
                },
              },
              dataZoom: [
                {
                  type: 'inside',//图表下方的伸缩条
                  show : true, //是否显示
                },
              ],
              toolbox: {
                show: true,
                feature: {
                  saveAsImage: {},
                },
              },
              axisPointer: {
                link: { xAxisIndex: "all" },
              },
              grid: [
                {
                  top: 30,
                  left: 20,
                  right: 20,
                  bottom: 10,
                  height: "45%",
                  containLabel: true
                },
                {
                  top: "60%",
                  left: 20,
                  right: 20,
                  bottom: 10,
                  height: "40%",
                  containLabel: true
                },
              ],
              xAxis: [
                {
                  type: "category",
                  boundaryGap: false,
                  axisLine: { onZero: true },
                  data: data.xAxis.power
                },
                {
                  gridIndex: 1,
                  type: "category",
                  boundaryGap: false,
                  axisLine: { onZero: true },
                  data: data.xAxis.factor,
                  position: "bottom",
                },
              ],
              yAxis: [
                {
                  name: data.yAxis[0].name,
                  type: "value",
                },
                {
                  gridIndex: 1,
                  name: data.yAxis[1].name,
                  type: "value",
                  inverse: false,
                },
              ],
              series: [
                {
                  name: data.series[0].name,
                  type: "line",
                  smooth: true,
                  data: data.series[0].data,
                },
                {
                  name: data.series[1].name,
                  type: "line",
                  smooth: true,
                  xAxisIndex: 1,
                  yAxisIndex: 1,
                  data: data.series[1].data,
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
