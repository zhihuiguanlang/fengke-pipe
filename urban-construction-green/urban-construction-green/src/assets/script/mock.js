const mock = {
  echarts: {
    xAxis: {
      power: ['2022-03-01', '2022-03-02', '2022-03-03', '2022-03-04', 
      '2022-03-05', '2022-03-06', '2022-03-07', '2022-03-08',
       '2022-03-09', '2022-03-10',],
      factor: ['2022-03-01', '2022-03-02', '2022-03-03', '2022-03-04', 
      '2022-03-05', '2022-03-06', '2022-03-07', '2022-03-08',
       '2022-03-09', '2022-03-10',],
    },
    yAxis: [
      {
        name: "功率",
      },
      {
        name: "电量",
      },
    ],
    series: [
      {
        name: "功率",
        itemStyle: {
          color: "#2196F3", //改变折线点的颜色
          lineStyleColor: "#2196F3", //改变折线颜色
        },
        data: [0,1,4,Math.ceil(Math.random()*10),20,68,28,Math.ceil(Math.random()*10),32,28]
      },
      {
        name: "电量",
        itemStyle: {
          color: "#C0CA33", //改变折线点的颜色
          lineStyleColor: "#C0CA33", //改变折线颜色
        },
        data: [1,1,Math.ceil(Math.random()*10),2,8,5,Math.ceil(Math.random()*10),1,Math.ceil(Math.random()*10),9]
      },
    ]
  },
};

export const { echarts } = mock;

