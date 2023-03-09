const mock = {
  //  type  0 ---> 按钮
  //        1 ---> 文字
  //        2 ---> 自动 手动/开关
  //        3 ---> 开 关/开关   
  list: [
    {
      name: "报警灯1",
      distance: "0m",
      top: "无烟雾",
      icon: "mdi-domain",
      avatar: '',
      common:true,
      position: "[" + Math.ceil(Math.random() * 20) + "]",
      threshold: "[10]",
      value:[],
      mist: {
        type: '2',
        value: ''
      },
      reset: {
        type: '0',
        value: ''
      }
    },
    {
      name: "烟感探测仪1",
      distance: "0m",
      top: "无烟雾",
      icon: "mdi-domain",
      avatar: '', position: "[" + Math.ceil(Math.random() * 20) + "]",
           value:[],
      threshold: "[10]",

      mist: {
        type: '1',
        value: ''
      },
      reset: {
        type: '1',
        value: ''
      }
    },
    {
      name: "烟感探测仪2",
      distance: "0m",
      top: "无烟雾",
      icon: "mdi-domain", position: "[" + Math.ceil(Math.random() * 20) + "]",
      smoke:true,
      threshold: "[10]",
      value:[],

      avatar: '',
      mist: {
        type: '1',
        value: ''
      },
      reset: {
        type: '1',
        value: ''
      }
    },
    // {
    //   name: "电气火灾探测器",
    //   distance: "0m",
    //   top: "无烟雾", position: "[" + Math.ceil(Math.random() * 20) + "]",

    //   threshold: "[10]",

    //   icon: "mdi-domain",
    //   avatar: '',
    //   mist: {
    //     type: '1',
    //     value: ''
    //   },
    //   reset: {
    //     type: '1',
    //     value: ''
    //   }
    // },
    // {
    //   name: "消防电源",
    //   distance: "0m",
    //   top: "无烟雾",
    //   icon: "mdi-domain", position: "[" + Math.ceil(Math.random() * 20) + "]",

    //   threshold: "[10]",

    //   avatar: '',
    //   mist: {
    //     type: '1',
    //     value: ''
    //   },
    //   reset: {
    //     type: '1',
    //     value: ''
    //   }
    // },
    // {
    //   name: "手动报警按钮",
    //   distance: "0m",
    //   top: "无烟雾",
    //   icon: "mdi-domain", position: "[" + Math.ceil(Math.random() * 20) + "]",

    //   threshold: "[10]",

    //   avatar: '',
    //   mist: {
    //     type: '1',
    //     value: ''
    //   },
    //   reset: {
    //     type: '1',
    //     value: ''
    //   }
    // },
    // {
    //   name: "防火门",
    //   distance: "0m",
    //   top: "无烟雾",
    //   icon: "mdi-domain", position: "[" + Math.ceil(Math.random() * 20) + "]",

    //   threshold: "[10]",

    //   avatar: '',
    //   mist: {
    //     type: '3 ',
    //     value: ''
    //   },
    //   reset: {
    //     type: '2',
    //     value: ''
    //   }
    // },
    // {
    //   name: "可燃气体传感器", position: "[" + Math.ceil(Math.random() * 20) + "]",

    //   threshold: "[10]",

    //   distance: "0m",
    //   top: "无烟雾",
    //   icon: "mdi-domain",
    //   avatar: '',
    //   mist: {
    //     type: '1',
    //     value: ''
    //   },
    //   reset: {
    //     type: '1',
    //     value: ''
    //   }
    // }
  ],
  echarts: {
    xAxis: {
      name: '防火分区/m',
      data: [15, 50],
    },
    yAxis: {
      name: '温度值/℃',
    },
    series: [
      {
        name: "温度值",
        itemStyle: {
          color: 'red', //改变折线点的颜色
          linecolor: 'red', //改变折线颜色
        },
        data: [Math.floor(Math.random() * (20 - 14) + 14), Math.floor(Math.random() * (25 - 18) + 18)],
      },
    ]
  },
  echarting: {
    xAxis: {
      name: '防火分区/m',
      data: [0, 3, 6],
    },
    yAxis: {
      name: '温度值/℃',
    },
    series: [
      {
        name: "温度值",
        itemStyle: {
          color: 'red', //改变折线点的颜色
          linecolor: 'red', //改变折线颜色
        },
        data: [],
      },
    ]
  }
};
export const { list } = mock;
export const { echarts } = mock;
export const { echarting } = mock;
