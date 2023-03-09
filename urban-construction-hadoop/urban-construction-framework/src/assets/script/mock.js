const mock = {
  fire: {
    series: {
      data: [],
    },
  },
  intrusion: {
    series: {
      max: 10,
      data: [{ value: 1, name: "总入侵次数" }],
    },
  },
  drainage: {
    legend: {
      data: ["排水次数", "水位高度"],
    },
    grid: {
      top: 70,
      left: 55,
      right: 45,
      bottom: 45,
    },
    xAxis: {
      data: [],
      name: "日期",
    },
    yAxis: [
      {
        type: "value",
        show: true,
        name: "排水次数",
      },
    ],
    series: [
      {
        name: "排水次数",
        type: "bar",
        stack: "广告",
        data: [],
      },
      {
        name: "水位高度",
        type: "bar",
        stack: "广告",
        data: [],
      },
    ],
  },
  combustible: {
    legend: {
      data: ["排风次数", "氧气", "甲烷"],
    },
    grid: {
      top: 70,
      left: 55,
      right: 45,
      bottom: 45,
    },
    xAxis: {
      data: [],
      name: "日期",
    },
    yAxis: [
      {
        type: "value",
        name: "排风次数",
      },
      {
        type: "value",
        name: "氧气",
      },
    ],
    series: [
      {
        name: "排风次数",
        type: "bar",
        data: [],
        itemStyle: {
          normal: {
            color: "#1E90FF", //改变折线点的颜色
            lineStyle: {
              color: "#1E90FF", //改变折线颜色
            },
          },
        },
      },
      {
        name: "氧气",
        type: "line",
        data: [],
        smooth: true,
        itemStyle: {
          normal: {
            color: "blue", //改变折线点的颜色
            lineStyle: {
              color: "blue", //改变折线颜色
            },
          },
        },
      },
      {
        name: "甲烷",
        type: "line",
        yAxisIndex: 1,
        data: [],
        smooth: true,
        itemStyle: {
          normal: {
            color: "#FFD700", //改变折线点的颜色
            lineStyle: {
              color: "#FFD700", //改变折线颜色
            },
          },
        },
      },
    ],
  },
  gas: {
    legend: {
      data: ["氧气", "甲烷"],
    },
    xAxis: {
      data: [],
      name: "日期",
    },
    yAxis: {
      name: "氧气",
    },
    series: [
      {
        name: "氧气",
        data: [],
        markPoint: {
          data: [
            { type: "max", name: "最大值" },
            {
              type: "min",
              name: "最小值",
              itemStyle: {
                color: "#4587E7",
                borderColor: "#000",
                borderWidth: 0,
                borderType: "solid",
              },
            },
          ],
        },
        markLine: {
          data: [{ type: "average", name: "平均值" }],
        },
      },
      {
        name: "甲烷",
        data: [],
        markPoint: {
          data: [
            {
              type: "max",
              name: "最大值",
              itemStyle: {
                color: "#C23531",
                borderColor: "#000",
                borderWidth: 0,
                borderType: "solid",
              },
            },
            {
              type: "min",
              name: "最小值",
              itemStyle: {
                color: "#4587E7",
                borderColor: "#000",
                borderWidth: 0,
                borderType: "solid",
              },
            },
          ],
        },
        markLine: {
          data: [{ type: "average", name: "平均值" }],
        },
      },
    ],
  },
  // 没有数据echarts
  fires: {
    series: {
      data: [{name:"一号报警",value:5},{name:"二号报警",value:3},{name:"三号报警",value:1}],
    },
  },
  intrusions: {
    series: {
      max: 10,
      data: [{ value: 1, name: "总入侵次数" }],
    },
  },
  drainages: {
    legend: {
      data: ["排水次数", "水位高度"],
    },
    grid: {
      top: 70,
      left: 55,
      right: 45,
      bottom: 45,
    },
    xAxis: {
      data: ["2022-02-03","2022-02-04","2022-02-05"],
      name: "日期",
    },
    yAxis: [
      {
        type: "value",
        show: true,
        name: "排水次数",
      },
    ],
    series: [
      {
        name: "排水次数",
        type: "bar",
        stack: "广告",
        data: [3,3,7],
      },
      {
        name: "水位高度",
        type: "bar",
        stack: "广告",
        data: [1.5,1.2,2],
      },
    ],
  },
  combustibles: {
    legend: {
      data: ["排风次数", "氧气", "甲烷"],
    },
    grid: {
      top: 70,
      left: 55,
      right: 45,
      bottom: 45,
    },
    xAxis: {
      data: ["2022-02-03","2022-02-04","2022-02-05"],
      name: "日期",
    },
    yAxis: [
      {
        type: "value",
        name: "排风次数",
      },
      {
        type: "value",
        name: "氧气",
      },
    ],
    series: [
      {
        name: "排风次数",
        type: "bar",
        data: [10,8,12],
        itemStyle: {
          normal: {
            color: "#1E90FF", //改变折线点的颜色
            lineStyle: {
              color: "#1E90FF", //改变折线颜色
            },
          },
        },
      },
      {
        name: "氧气",
        type: "line",
        data: [20,21,20.5],
        smooth: true,
        itemStyle: {
          normal: {
            color: "blue", //改变折线点的颜色
            lineStyle: {
              color: "blue", //改变折线颜色
            },
          },
        },
      },
      {
        name: "甲烷",
        type: "line",
        yAxisIndex: 1,
        data: [5.1,5.2,5.1],
        smooth: true,
        itemStyle: {
          normal: {
            color: "#FFD700", //改变折线点的颜色
            lineStyle: {
              color: "#FFD700", //改变折线颜色
            },
          },
        },
      },
    ],
  },
  gass: {
    legend: {
      data: ["氧气", "甲烷"],
    },
    xAxis: {
      data: ["2022-02-03","2022-02-04","2022-02-05"],
      name: "日期",
    },
    yAxis: {
      name: "氧气",
    },
    series: [
      {
        name: "氧气",
        data: [20,21,21],
        markPoint: {
          data: [
            { type: "max", name: "最大值" },
            {
              type: "min",
              name: "最小值",
              itemStyle: {
                color: "#4587E7",
                borderColor: "#000",
                borderWidth: 0,
                borderType: "solid",
              },
            },
          ],
        },
        markLine: {
          data: [{ type: "average", name: "平均值" }],
        },
      },
      {
        name: "甲烷",
        data: [6.5,5.9,5.5],
        markPoint: {
          data: [
            {
              type: "max",
              name: "最大值",
              itemStyle: {
                color: "#C23531",
                borderColor: "#000",
                borderWidth: 0,
                borderType: "solid",
              },
            },
            {
              type: "min",
              name: "最小值",
              itemStyle: {
                color: "#4587E7",
                borderColor: "#000",
                borderWidth: 0,
                borderType: "solid",
              },
            },
          ],
        },
        markLine: {
          data: [{ type: "average", name: "平均值" }],
        },
      },
    ],
  },
};

export const { fire, intrusion, drainage, combustible, gas } = mock;
export const { fires, intrusions, drainages, combustibles, gass } = mock;