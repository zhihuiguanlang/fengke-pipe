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
  name: "员工通讯系统" || "城建通用模板--项目名称",
  // 菜单参数
  menu: [
    {
      key: 1,
      title: "导航分组一",
      action: "mdi-dialpad",
      children: [
        {
          key: 1.1,
          parentKey: 1,
          title: "分组标题 1.1",
          action: "mdi-domain",
          router: "",
        },
        {
          key: 1.2,
          parentKey: 1,
          title: "分组标题 1.2",
          action: "mdi-message-text",
          router: "",
        },
      ],
    },
    {
      key: 2,
      title: "导航分组二",
      action: "mdi-school",
      children: [
        {
          key: 2.1,
          parentKey: 2,
          title: "分组标题 2.1",
          action: "mdi-domain",
          router: "",
        },
        {
          key: 2.2,
          parentKey: 2,
          title: "分组标题 2.2",
          action: "mdi-message-text",
          router: "",
        },
      ],
    },
    {
      key: 3,
      title: "导航分组三",
      action: "mdi-dialpad",
      children: [
        {
          key: 3.1,
          parentKey: 3,
          title: "分组标题 3.1",
          action: "mdi-email",
          router: "",
        },
        {
          key: 3.2,
          parentKey: 3,
          title: "分组标题 3.2",
          action: "mdi-call-split",
          router: "",
        },
      ],
    },
    {
      key: 4,
      title: "导航分组四",
      action: "mdi-school",
      children: [
        {
          key: 4.1,
          parentKey: 4,
          title: "分组标题 4.1",
          action: "mdi-email",
          router: "",
        },
        {
          key: 4.2,
          parentKey: 4,
          title: "分组标题 4.2",
          action: "mdi-call-split",
          router: "",
        },
      ],
    },
    {
      key: 5,
      title: "导航分组五",
      action: "mdi-arrow-up-bold-box-outline",
      children: [
        {
          key: 5.1,
          parentKey: 5,
          title: "分组标题 5.1",
          action: "mdi-dialpad",
          router: "",
        },
        {
          key: 5.2,
          parentKey: 5,
          title: "分组标题 5.2",
          action: "mdi-email",
          router: "",
        },
      ],
    },
  ],
  // 默认菜单激活项
  init: {
    key: 1.1,
    parentKey: 1,
    title: "分组标题 1.1",
    action: "mdi-domain",
    router: "",
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

export const { name } = deploy
export const { menu } = deploy
export const { init } = deploy
export const { admin } = deploy
