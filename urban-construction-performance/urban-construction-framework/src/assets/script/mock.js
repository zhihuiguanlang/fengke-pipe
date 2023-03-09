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
  items: [
    {
      "1": "技术部",
      "2": "",
      "3": "",
      "4": "",
      key: (Math.random() * 1024).toFixed(2)
    },
  ]
};

export const { items } = mock;
export const { headers } = mock;
