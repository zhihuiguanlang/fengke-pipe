<template>
  <div class="navigation">
    <!-- 一级菜单封装 -->
    <v-level :menu="menu" />
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
    "v-level": () => import("@/components/module/level"),
  },
  created() {
    // 默认加载
    this.query();
  },
  methods: {
    query() {
      this.$axios.post("/api-device/DeviceSystemType/list", {}).then(res => {
        if (res) {
          for (const i of res.data) {
            if (i.systemName == "绿色节能") {
              this.create(i.deviceTypes.slice(1, -1));
            }
          }
        }
      });
    },
    create(type) {
      this.$axios
        .post("/api-device/device/listByType", {
          type
        })
        .then(res => {
          if (res) {
            this.menu = res.data;
            // 初始化
            this.saveCurrent(this.menu[0]);
          }
        });
    },
    // 数据仓库
    ...mapActions(["saveCurrent"]),
  }
};
</script>
