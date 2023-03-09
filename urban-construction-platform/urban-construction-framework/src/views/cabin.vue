<template>
  <div class="cabin">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="dialog = true">
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
      舱体区域列表
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
    <!-- 模态框 -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Cabin Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="Legal first name*" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Legal middle name"
                  hint="example of helper text only on focus"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Legal last name*"
                  hint="example of persistent helper text"
                  persistent-hint
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Email*" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Password*"
                  type="password"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Age*"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  :items="[
                    'Skiing',
                    'Ice hockey',
                    'Soccer',
                    'Basketball',
                    'Hockey',
                    'Reading',
                    'Writing',
                    'Coding',
                    'Basejump'
                  ]"
                  label="Interests"
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false"
            >Close</v-btn
          >
          <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { items, headers } from "@/assets/script/mock";
export default {
  name: "cabin",
  data: () => ({
    items,
    headers,
    table: false,
    dialog: false,
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
.cabin {
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
