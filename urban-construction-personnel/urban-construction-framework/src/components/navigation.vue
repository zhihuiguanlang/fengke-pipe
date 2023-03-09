<template>
  <div class="navigation">
    <!-- 一级菜单封装 -->
    <v-level :menu="menu" v-if="level" />
    <!-- 二级菜单封装 -->
    <v-unfold :menu="menu" v-else-if="!unfold" />
    <!-- 三级菜单封装 -->
    <v-deep :menu="menu" v-else />
    <!-- 多级菜单--暂无 -->
  </div>
</template>

<script>
import { menu } from "@/assets/script/deploy";
export default {
  name: "navigation",
  data: () => ({
    menu
  }),
  computed: {
    // 平铺菜单
    level() {
      return this.menu.some(res => !res.children);
    },
    // 延展菜单
    unfold() {
      return this.level || this.menu.some(res => res.children[0].children);
    }
  },
  components: {
    "v-deep": () => import("@/components/module/deep"),
    "v-level": () => import("@/components/module/level"),
    "v-unfold": () => import("@/components/module/unfold")
  }
};
</script>
