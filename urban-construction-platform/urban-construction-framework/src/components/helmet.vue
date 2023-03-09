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
              <v-icon left size="22" v-text="'mdi-account-circle'" />admin
              <v-icon right size="22" v-text="'mdi-format-list-bulleted-square'" />
            </v-btn>
          </div>
        </template>
        <v-list>
          <v-list-item-group v-model="item">
            <v-list-item :value=i.key v-for="(i, n) in admin" :key="n" @click="jump(i)">
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
import { name, admin } from "@/assets/script/deploy";
export default {
  name: "helmet",
  data: () => ({
    name,
    admin,
    item:0
  }),
  methods: {
    jump(v) {
      // 加载路由
      v.router && this.$router.push(v.router)
    },
  }
};
</script>
