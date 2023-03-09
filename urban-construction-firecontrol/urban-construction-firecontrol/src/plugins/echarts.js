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
          line: (id , data) => {
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById(id));
            // 设置配置项
            const option = {
              grid: {
                top: 40,
                left: 35,
                right: 80,
                bottom: 25,
                containLabel: false,
              },
              tooltip: {
                trigger: "axis",
                axisPointer: {
                  type: "cross",
                },
                formatter(params){
                  return  "防火分区 " + params[0].name + '米' +  '<br/>' + '温度值 ' +params[0].value + "℃"
                }
              },
              toolbox: {
                show: true,
                feature: {
                  saveAsImage: {},
                },
              },
              xAxis: {
                name: data.xAxis.name,
                type: "category",
                boundaryGap: false,
                data: data.xAxis.data,
              },
              yAxis: {
                name: data.yAxis.name,
                type: "value",
                min: data.yAxis.min,
                max: data.yAxis.max,
              },
              series: [
                {
                  name: data.series[0].name,
                  type: "line",
                  smooth: true,
                  symbolSize: 6,
                  itemStyle: {
                    normal: {
                      color: data.series[0].itemStyle.color, //改变折线点的颜色
                      lineStyle: {
                        color: data.series[0].itemStyle.linecolor, //改变折线颜色
                      },
                    },
                  },
                  data: data.series[0].data,
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
