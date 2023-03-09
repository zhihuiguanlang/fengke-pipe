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
  name: "平台配置系统" || "城建通用模板--项目名称",
  // 菜单参数
  menu: [
    {
      key: 1,
      title: "资源管理",
      action: "mdi-dialpad",
      children: [
        {
          key: 1.1,
          parentKey: 1,
          title: "仪器设备管理",
          router: "instrument",
          action: "mdi-dialpad",
        },
        {
          key: 1.2,
          parentKey: 1,
          title: "参数管理",
          router: "parameter",
          action: "mdi-dialpad",
        },
        {
          key: 1.3,
          parentKey: 1,
          router: "cabin",
          title: "舱体区域管理",
          action: "mdi-dialpad",
        },
        {
          key: 1.4,
          parentKey: 1,
          title: "管廊管理",
          router: "gallery",
          action: "mdi-dialpad",
        },
        {
          key: 1.5,
          parentKey: 1,
          title: "指令管理",
          router: "directive",
          action: "mdi-dialpad",
        },
      ],
    },
    {
      key: 2,
      title: "系统管理",
      action: "mdi-dialpad",
      children: [
        {
          key: 2.1,
          parentKey: 2,
          router: "menu",
          title: "菜单管理",
          action: "mdi-dialpad",
        },
        {
          key: 2.2,
          parentKey: 2,
          title: "数据字典",
          router: "dictionary",
          action: "mdi-dialpad",
        },
        {
          key: 2.3,
          parentKey: 2,
          router: "log",
          title: "系统日志",
          action: "mdi-dialpad",
        },
        {
          key: 2.4,
          parentKey: 2,
          title: "系统参数",
          router: "argument",
          action: "mdi-dialpad",
        },
        {
          key: 2.5,
          parentKey: 2,
          title: "系统定制",
          router: "custom",
          action: "mdi-dialpad",
        },
      ],
    },
  ],
  // 默认菜单激活项
  init: {
    key: 1.1,
    parentKey: 1,
    title: "仪器设备管理",
    router: "instrument",
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
      title: "安全退出",
      action: "mdi-logout",
    },
  ],
};

export const { name } = deploy;
export const { menu } = deploy;
export const { init } = deploy;
export const { admin } = deploy;
