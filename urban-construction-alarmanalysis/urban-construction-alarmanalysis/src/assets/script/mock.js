const mock = {
  headers: [
    {
      text: "预案名称",
      align: "center",
      value: "1",
      width: 100,
    },
    {
      text: "提交时间",
      align: "center",
      value: "2",
      width: 100,
    },
    {
      text: "提交人",
      align: "center",
      value: "3",
      width: 100,
    },
    {
      text: "文档大小",
      align: "center",
      value: "4",
      width: 100,
    },
    {
      text: "操作",
      align: "center",
      value: "5",
      width: 100,
    },
  ],
  items: [
    {
      "2": "Frozen Yogurt",
      "3": "Frozen Yogurt",
      "4": "Frozen Yogurt",
      "5": "Frozen Yogurt",
      "1": "Frozen Yogurt",
      key: (Math.random() * 1024).toFixed(2),
    }
  ],
  reviewHeaders: [
    {
      text: "预案名称",
      align: "center",
      value: "1",
      width: 100,
    },
    {
      text: "提交时间",
      align: "center",
      value: "2",
      width: 100,
    },
    {
      text: "提交人",
      align: "center",
      value: "3",
      width: 100,
    },
    {
      text: "文档大小",
      align: "center",
      value: "4",
      width: 100,
    },
    {
      text: "审核结果",
      align: "center",
      value: "4",
      width: 100,
    },
    {
      text: "操作",
      align: "center",
      value: "5",
      width: 100,
    },
  ],
  reviewItems: [
    {
      "2": "Frozen Yogurt",
      "3": "Frozen Yogurt",
      "4": "Frozen Yogurt",
      "5": "Frozen Yogurt",
      "1": "Frozen Yogurt",
      "6": "Frozen Yogurt",
      key: (Math.random() * 1024).toFixed(2),
    }
  ],
  expertHeaders: [
    {
      text: "专家编号",
      align: "center",
      value: "1",
      width: 100,
    },
    {
      text: "专家姓名",
      align: "center",
      value: "2",
      width: 100,
    },
    {
      text: "性别",
      align: "center",
      value: "3",
      width: 100,
    },
    {
      text: "所在单位",
      align: "center",
      value: "4",
      width: 100,
    },
    {
      text: "从事专业",
      align: "center",
      value: "5",
      width: 100,
    },
    {
      text: "手机",
      align: "center",
      value: "5",
      width: 100,
    },
    {
      text: "应急处理",
      align: "center",
      value: "5",
      width: 100,
    },
    {
      text: "应急处理成果",
      align: "center",
      value: "5",
      width: 100,
    },
  ],
  expertItems: [
    {
      "2": "Frozen Yogurt",
      "3": "Frozen Yogurt",
      "4": "Frozen Yogurt",
      "5": "Frozen Yogurt",
      "1": "Frozen Yogurt",
      "6": "Frozen Yogurt",
      "7": "Frozen Yogurt",
      "8": "Frozen Yogurt",
      key: (Math.random() * 1024).toFixed(2),
    }
  ],
  materialHeaders: [
    {
      text: "物资名称",
      align: "center",
      value: "1",
      width: 100,
    },
    {
      text: "出入库",
      align: "center",
      value: "2",
      width: 100,
    },
    {
      text: "出入库数量",
      align: "center",
      value: "3",
      width: 100,
    },
    {
      text: "物资类型",
      align: "center",
      value: "4",
      width: 100,
    },
    {
      text: "出入库日期",
      align: "center",
      value: "5",
      width: 100,
    },
    {
      text: "单位",
      align: "center",
      value: "6",
      width: 100,
    },
    {
      text: "操作人员",
      align: "center",
      value: "7",
      width: 100,
    },
  ],
  materialItems: [
    {
      "2": "Frozen Yogurt",
      "3": "Frozen Yogurt",
      "4": "Frozen Yogurt",
      "5": "Frozen Yogurt",
      "1": "Frozen Yogurt",
      "6": "Frozen Yogurt",
      "7": "Frozen Yogurt",
      key: (Math.random() * 1024).toFixed(2),
    }
  ],
};

export const {  headers, items } = mock;
export const {  reviewHeaders, reviewItems } = mock;
export const {  expertHeaders, expertItems } = mock;
export const {  materialHeaders, materialItems } = mock;
