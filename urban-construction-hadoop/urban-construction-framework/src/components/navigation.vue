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
import { mapActions } from "vuex";
import { menu, init } from "@/assets/script/deploy";
export default {
  name: "navigation",
  data: () => ({
    menu,
    init,
    page:1,
    limit:10
  }),
  created() {
    this.query();
  },
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
  },
  methods: {
    // 数据仓库
    ...mapActions(["saveCurrent"]),
    query() {
      const { page, limit } = this;
      this.$axios
        .post("/device-center/SpaceManage/parentList", {
          page,
          limit
        })
        .then(res => {
          if (res) {
            this.menu = res.data.map((v, n) => {
              v.key = n + 1;
              v.title = v.name;
              v.action = "mdi-domain";
              return v;
            });
            this.$set(init, `title`, res.data[0].name);
            this.$set(init, `id`, res.data[0].id);
            this.saveCurrent(init);
          }
        });
    }
  }
};
</script>
