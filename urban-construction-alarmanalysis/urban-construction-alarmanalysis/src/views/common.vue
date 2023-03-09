<template>
  <div class="common">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green">
        <v-icon left v-text="'mdi-plus'" />
        添加
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan">
        <v-icon left v-text="'mdi-pencil'" />
        编辑
      </v-btn>
      <v-btn class="mr-3" color="error">
        <v-icon left v-text="'mdi-delete'" />
        删除
      </v-btn>
      <v-btn class="mr-3" outlined color="teal" :loading="loading" @click="refresh">
        <v-icon left v-text="'mdi-cached'" />
        刷新
      </v-btn>
    </div>
    <v-alert
      tile
      light
      dense
      width=150
      height=18
      color="cyan"
      class="alert"
      border="left"
      elevation="0"
      colored-border
      transition="scale-transition"
    >
      档案管理
    </v-alert>
    <div class="elevation-7">
      <v-data-table
        :items=items
        :light="true"
        :height="500"
        :loading=table
        :headers=headers
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
import { items, headers } from '@/assets/script/mock'
export default {
  name: "common",
  data: () => ({
    items,
    headers,
    table: false,
    loading: false,
  }),
  methods: {
    refresh () {
      // 刷新列表
      this.loading = this.table = true;
      // 全局提示
      this.$notice.normal("正在刷新，请稍等")
      // 异步处理
      setTimeout(() => {this.loading = this.table = false}, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.common {
  height: 100%;
  .handle {
    width: 100%;
    padding-bottom: 12px;
    border-bottom: 1px solid #E0E0E0;
  }
  .alert{
    display: flex;
    margin: 24px 0px;
  }
}
</style>
