<template>
  <div class="navigation">
    <!-- 二级菜单封装 -->
    <v-unfold :menu="menu" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "navigation",
  data: () => ({
    menu: [],
  }),
  components: {
    "v-unfold": () => import("@/components/module/unfold"),
  },
  mounted() {
    // 默认加载
    this.myMenu();
  },
  methods: {
    myMenu() {
      this.$axios.post("/device-center/SpaceManage/list").then((res) => {
        if (res) {
          this.menu = res.data;
          // 初始化
          this.saveCurrent(this.menu[0]["subSpaceManage"][0]);
        }
      });
    },
    // 数据仓库
    ...mapActions(["saveCurrent"]),
  },
};
</script>
