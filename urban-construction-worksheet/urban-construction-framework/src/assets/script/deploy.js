// 一级菜单规格
// {
//   key: String || Number, 唯一标识
//   title: String, 标题
//   action: String, 图标
//   router: String, 路由配置
// }
// 二级菜单规格
// {
//   key: String || Number, 唯一标识
//   title: String, 标题
//   action: String, 图标
//   children: Array, 二级菜单配置集合
//   [
//     {
//       key: String || Number, 唯一标识
//       title: String, 标题
//       action: String, 图标
//       router: String, 路由配置
//       parentKey: String || Number, 一级菜单的Key
//     },
//     ...
//   ]
// }
// 三级菜单规格
// {
//   key: String || Number, 唯一标识
//   title: String, 标题
//   action: String, 图标
//   children: Array, 二级菜单配置集合
//   [
//     {
//       key: String || Number, 唯一标识
//       title: String, 标题
//       action: String, 图标
//       children: Array, 三级菜单配置集合
//       [
//         {
//           key: String || Number, 唯一标识
//           title: String, 标题
//           action: String, 图标
//           router: String, 路由配置
//           parentKey: String || Number, 一级菜单的Key
//           grandparentKey: String || Number, 二级菜单的Key
//         },
//         ...
//       ]
//     },
//     ...
//   ]
// }
const deploy = {
  // 项目名称
  name: "工单管理系统" || "城建通用模板--项目名称",
  // 菜单参数
  menu: [
    {
      key: 1,
      title: "工单中心",
      action: "mdi-dialpad",
      children: [
        {
          key: 1.1,
          router: "all",
          title: "全部工单",
          action: "mdi-dialpad",
        },
        {
          key: 1.2,
          title: "我提交的",
          router: "submit",
          action: "mdi-dialpad",
        },
        {
          key: 1.3,
          title: "我受理的",
          router: "accept",
          action: "mdi-dialpad",
        },
        {
          key: 1.4,
          title: "我完结的",
          router: "finish",
          action: "mdi-dialpad",
        },
      ],
    },
    {
      key: 2,
      title: "模板中心",
      action: "mdi-dialpad",
      children: [
        {
          key: 2.1,
          router: "model",
          title: "工单模板",
          action: "mdi-dialpad",
        },
      ],
    },
  ],
  // 默认菜单激活项
  init: {
    key: 1.1,
    router: "all",
    title: "全部工单",
    action: "mdi-dialpad",
  },
  // 用户菜单
  admin: [
    {
      key: 1,
      router: "",
      title: "个人中心",
      action: "mdi-widgets",
    },
    {
      key: 2,
      router: "",
      title: "财富广场",
      action: "mdi-gavel",
    },
    {
      key: 3,
      router: "",
      title: "回归首页",
      action: "mdi-home",
    },
    {
      key: 4,
      router: "http://192.168.0.110:8080/#/login",
      title: "安全退出",
      action: "mdi-logout",
    },
  ],
};

export const { name } = deploy;
export const { menu } = deploy;
export const { init } = deploy;
export const { admin } = deploy;
