const mock = {
  headers: [
    {
      text: "设备名称",
      align: "center",
      value: "1",
      width: 200
    },
    {
      text: "设备编号",
      align: "center",
      value: "2",
      width: 200
    },
    {
      text: "设备型号",
      align: "center",
      value: "3",
      width: 200
    },
    {
      text: "生产日期",
      align: "center",
      value: "4",
      width: 200
    },
    {
      text: "保修期 (天)",
      align: "center",
      value: "5",
      width: 200
    },
    {
      text: "检修期 (天)",
      align: "center",
      value: "6",
      width: 200
    },
    {
      text: "理论寿命 (天)",
      align: "center",
      value: "7",
      width: 200
    },
    {
      text: "设备类型",
      align: "center",
      value: "8",
      width: 200
    },
    {
      text: "设备所在舱体",
      align: "center",
      value: "9",
      width: 200
    },
    {
      text: "设备所属PLC",
      align: "center",
      value: "10",
      width: 200
    },
    {
      text: "设备生产厂商",
      align: "center",
      value: "11",
      width: 200
    },
    {
      text: "设备所在舱体区域",
      align: "center",
      value: "12",
      width: 200
    },
    {
      text: "备注",
      align: "center",
      value: "13",
      width: 200
    },
    {
      text: "健康值",
      align: "center",
      value: "14",
      width: 200
    },
    {
      text: "状态",
      align: "center",
      value: "15",
      width: 200
    }
  ],
  items: [
    {
      "1": "电力舱",
      "2": "DFHJ0009",
      "3": "DFJK_JJ_78789",
      "4": "2020-4-14",
      "5": "90",
      "6": "90",
      "7": "10",
      "8": "温度传感器",
      "9": "电力舱",
      "10": "电力舱PLC",
      "11": "北京电力有限公司",
      "12": "电力舱001",
      "13": "正常运行",
      "14": "99",
      "15": "优",
      key: (Math.random() * 1024).toFixed(2)
    }
  ]
};

export const { items } = mock;
export const { headers } = mock;
