const mock = {
  headers: [
    {
      text: "部门",
      align: "center",
      value: "1",
      width: 200
    },
    {
      text: "用户名",
      align: "center",
      value: "2",
      width: 200
    },
    {
      text: "真实姓名",
      align: "center",
      value: "3",
      width: 200
    },
    {
      text: "角色",
      align: "center",
      value: "4",
      width: 200
    }
  ],
  report: [
    {
      text: "日报",
      value: "day",
    },
    {
      text: "周报",
      value: "week",
    },
    {
      text: "月报",
      value: "month",
    },
    {
      text: "季报",
      value: "quarter",
    },
    {
      text: "半年报",
      value: "half",
    },
    {
      text: "年报",
      value: "year",
    },
  ],
  source: [
    {
      key: 1,
      number: "123",
      outline: "巡检视察",
      deadline: "24小时之内",
      text: "日报",
      value: "day",
    },
    {
      key: 2,
      number: "54",
      outline: "巡检视察",
      deadline: "24小时之内",
      text: "周报",
      value: "week",
      disabled: true,
    },
    {
      key: 3,
      number: "64",
      outline: "巡检视察",
      deadline: "24小时之内",
      text: "月报",
      value: "month",
      disabled: true,
    },
    {
      key: 4,
      number: "687",
      outline: "巡检视察",
      deadline: "24小时之内",
      text: "季报",
      value: "season",
      disabled: true,
    },
    {
      key: 5,
      number: "789",
      outline: "巡检视察",
      deadline: "24小时之内",
      text: "半年报",
      value: "half",
      disabled: true,
    },
    {
      key: 6,
      number: "09",
      outline: "巡检视察",
      deadline: "24小时之内",
      text: "年报",
      value: "year",
      disabled: true,
    },
    {
      key: 7,
      number: "890",
      outline: "巡检视察",
      deadline: "24小时之内"
    }
  ],
  week: [
    {
      text: "第一周",
      value: "1",
    },
    {
      text: "第二周",
      value: "2",
    },
    {
      text: "第三周",
      value: "3",
    },
    {
      text: "第四周",
      value: "4",
    },
  ],
  quarter: [
    {
      text: "第一季度",
      value: "1",
    },
    {
      text: "第二季度",
      value: "2",
    },
    {
      text: "第三季度",
      value: "3",
    },
    {
      text: "第四季度",
      value: "4",
    },
  ],
  half: [
    {
      text: "上半年",
      value: "1",
    },
    {
      text: "下半年",
      value: "2",
    },
  ]
};
export const { source } = mock;
export const { report } = mock;
export const { headers } = mock;
export const { week, quarter, half } = mock;
