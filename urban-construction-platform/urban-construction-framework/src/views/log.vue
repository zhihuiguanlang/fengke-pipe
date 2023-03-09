<template>
  <div class="log">
    <div class="handle">
      <v-btn class="mr-3" color="error">
        <v-icon left v-text="'mdi-delete'" />
        删除
      </v-btn>
      <v-btn
        outlined
        class="mr-3"
        color="teal"
        @click="refresh"
        :loading="loading"
      >
        <v-icon left v-text="'mdi-cached'" />
        刷新
      </v-btn>
    </div>
    <v-alert
      tile
      light
      dense
      width="150"
      height="18"
      color="cyan"
      class="alert"
      border="left"
      elevation="0"
      colored-border
      transition="scale-transition"
    >
      系统日志
    </v-alert>
    <div class="elevation-7">
      <v-data-table
        :items="items"
        :light="true"
        :height="500"
        :loading="table"
        :headers="headers"
        :item-key="'key'"
        :show-select="true"
        :fixed-header="true"
        :items-per-page="10"
        :calculate-widths="true"
        :loading-text="'loading...'"
      />
    </div>
  </div>
</template>

<script>
import { items, headers } from "@/assets/script/mock";
export default {
  name: "log",
  data: () => ({
    items,
    headers,
    table: false,
    loading: false,
  }),
  methods: {
    refresh() {
      // 刷新列表
      this.loading = this.table = true;
      // 全局提示
      this.$notice.normal("正在刷新，请稍等");
      // 异步处理
      setTimeout(() => {
        this.loading = this.table = false;
      }, 1000);
    }
  }
};
</script>

<style lang="scss" scoped>
.log {
  height: 100%;
  .handle {
    width: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #e0e0e0;
    .select {
      flex: none;
      width: 280px;
      height: 40px;
      margin-right: 12px;
    }
  }
  .alert {
    display: flex;
    margin: 24px 0px;
  }
}
</style>
