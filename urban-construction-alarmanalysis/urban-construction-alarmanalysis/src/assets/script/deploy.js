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
  name: "运维报警分析决策辅助系统" || "城建通用模板--项目名称",
  // 菜单参数
  menu: [
    {
      key: 1,
      title: "应急预案管理",
      action: "mdi-school",
      router: "review"
    },
    {
      key: 2,
      title: "应急预案审核",
      action: "mdi-school",
      router: "scenarios"
    },
    {
      key: 3,
      title: "应急专家库管理",
      action: "mdi-dialpad",
      router: "expert"
    },
    {
      key: 4,
      title: "应用物资管理",
      action: "mdi-school",
      router: "material"
    },
    {
      key: 5,
      title: "危险源管理",
      action: "mdi-arrow-up-bold-box-outline",
      router: "dangerous"
    },
    {
      key: 6,
      title: "应急流程报警",
      action: "mdi-arrow-up-bold-box-outline",
      router: "process"
    },
    {
      key: 7,
      title: "大数据统计分析",
      action: "mdi-arrow-up-bold-box-outline",
      router: "information"
    },
  ],
  // 默认菜单激活项
  init: {
    key: 1,
    title: "应急预案管理",
    action: "mdi-domain",
    router: "/review",
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
