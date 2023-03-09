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
  name: "自动报表系统" || "城建通用模板--项目名称",
  // 菜单参数
  menu: [
    {
      key: 1,
      router: "survey",
      action: "mdi-dialpad",
      title: "管廊运维情况概览"
    },
    {
      key: 2,
      router: "plan",
      action: "mdi-dialpad",
      title: "管廊运维计划完成情况"
    },
    {
      key: 3,
      router: "work",
      title: "管廊工单情况",
      action: "mdi-dialpad"
    },
    {
      key: 4,
      router: "alarm",
      action: "mdi-dialpad",
      title: "管廊报警信息汇总"
    },
    // {
    //   key: 5,
    //   router: "early",
    //   action: "mdi-dialpad",
    //   title: "管廊预警信息汇总"
    // },
    // {
    //   key: 6,
    //   router: "share",
    //   action: "mdi-dialpad",
    //   title: "信息共享平台信息汇总"
    // },
    {
      key: 7,
      router: "facility",
      action: "mdi-dialpad",
      title: "管廊环境设备状态汇总"
    },
    {
      key: 8,
      router: "clean",
      action: "mdi-dialpad",
      title: "管廊保洁工作汇总"
    },
    {
      key: 9,
      router: "inspect",
      action: "mdi-dialpad",
      title: "管廊巡检工作汇总"
    },
    {
      key: 10,
      router: "maintain",
      action: "mdi-dialpad",
      title: "管廊维修工作汇总"
    },
    {
      key: 11,
      router: "monitor",
      action: "mdi-dialpad",
      title: "管廊监控工作汇总"
    }
  ],
  // 默认菜单激活项
  init: {
    key: 1,
    router: "survey",
    action: "mdi-dialpad",
    title: "管廊运维情况概览"
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
