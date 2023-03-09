const mock = {
  headers: [
    {
      text: "计划名称",
      align: "center",
      value: "1",
      width: 200
    },
    {
      text: "计划内容",
      align: "center",
      value: "2",
      width: 200
    },
    {
      text: "地点",
      align: "center",
      value: "3",
      width: 200
    },
    {
      text: "计划当前状态",
      align: "center",
      value: "4",
      width: 200
    },
    {
      text: "计划类型",
      align: "center",
      value: "5",
      width: 200
    },
    {
      text: "计划开始时间",
      align: "center",
      value: "6",
      width: 200
    },
    {
      text: "计划完成时间",
      align: "center",
      value: "7",
      width: 200
    },
    {
      text: "实际开始时间",
      align: "center",
      value: "8",
      width: 200
    },
    {
      text: "实际完成时间",
      align: "center",
      value: "9",
      width: 200
    },
    {
      text: "制定计划人姓名",
      align: "center",
      value: "10",
      width: 200
    },
  ],
  items: [
    {
      "1": "安检设备",
      "2": "检查热度传感器",
      "3": "电力舱",
      "4": "关闭",
      "5": "临时",
      "6": "2020-04-13",
      "7": "2020-04-14",
      "8": "2020-04-14",
      "9": "2020-04-15",
      "10": "纪成",
      key: (Math.random() * 1024).toFixed(2)
    }
  ],
};

export const { items } = mock;
export const { headers } = mock;
