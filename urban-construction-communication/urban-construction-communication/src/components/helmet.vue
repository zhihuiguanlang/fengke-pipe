<template>
  <v-row class="helmet" justify="space-between">
    <v-col cols="auto" class="d-flex align-center">
      <!-- logo -->
      <v-img src="@/assets/images/logo.png" width="40" height="40" aspect-ratio="1" />
      <!-- title -->
      <div class="font-weight-medium ml-4">****</div>
      <v-divider class="ml-4" inset vertical />
      <div class="font-weight-medium ml-4 grey--text text--lighten-1">{{ name }}</div>
    </v-col>
    <v-col cols="auto" class="d-flex align-center">
      <v-btn icon color="grey">
        <v-icon v-text="'mdi-lock'" size="17" />
      </v-btn>
      <v-menu bottom origin="center center" transition="slide-y-transition">
        <template #activator="{ on }">
          <div v-on="on" class="d-flex align-center">
            <v-btn text color="grey">
              <v-icon left size="22" v-text="'mdi-account-circle'" />
              {{roles}}
              <v-icon right size="22" v-text="'mdi-format-list-bulleted-square'" />
            </v-btn>
          </div>
        </template>
        <v-list>
          <v-list-item-group v-model="item">
            <v-list-item :value="i.key" v-for="(i, n) in admin" :key="n" @click="jump(i)">
              <v-list-item-icon>
                <v-icon v-text="i.action" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="i.title" />
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-col>
  </v-row>
</template>

<script>
import Cookies from "js-cookie";  // 引入cookie
import { name, admin } from "@/assets/script/deploy";
export default {
  name: "helmet",
  data: () => ({
    name,
    admin,
    roles: "",
    item: 0
  }),
  created() {
    this.role();
  },
  methods: {
    // 当前用户角色
    role() {
      this.$axios.get("/api-user/users/current").then(res => {
        if (res) {
          this.roles = res.data.nickname;
        }
      });
    },
    jump(v) {
      if (v.key == 4) {
        // 安全退出
        this.$axios.post("/api-uaa/oauth/remove/token", {}).then(res => {
          if (res) {
            // 清除token
            Cookies.remove("token", { expires: 7, path: "/" });
            // 用户提示
            this.$notice.success("退出登录");
            // 跳转页面
            v.router && window.open(v.router, "_self");
          }
        });
      } else {
        // 加载路由
        v.router && this.$router.push(v.router);
      }
    }
  }
};
</script>
