<template>
  <div class="dictionary">
    <div class="navigation">
      <v-tabs
        light
        hide-slider
        color="#009688"
        v-model="current"
        active-class="active"
      >
        <v-tab>字典类型</v-tab>
        <v-tab>字典项</v-tab>
      </v-tabs>
    </div>
    <v-tabs-items 
      light 
      v-model="current"
    >
      <!-- 参数 -->
      <v-tab-item
        transition="fade-transition"
      >
        <div class="handle">
          <v-btn
            class="mr-3"
            outlined
            color="light-green"
            @click="dialog = true"
          >
            <v-icon left v-text="'mdi-plus'" />
            添加分组
          </v-btn>
          <v-btn
            class="mr-3"
            outlined
            color="light-green"
            @click="dialog = true"
          >
            <v-icon left v-text="'mdi-plus'" />
            添加字典
          </v-btn>
          <v-btn class="mr-3" color="error">
            <v-icon left v-text="'mdi-delete'" />
            删除
          </v-btn>
           <v-btn class="mr-3" outlined color="cyan">
            <v-icon left v-text="'mdi-pencil'" />
            同步系统参数
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
          字典类型列表
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
      </v-tab-item>
      <!-- 阈值 -->
      <v-tab-item
        transition="fade-transition"
      >
        <div class="handle">
          <v-btn
            class="mr-3"
            outlined
            color="light-green"
            @click="dialog = true"
          >
            <v-icon left v-text="'mdi-plus'" />
            添加
          </v-btn>
          <v-btn class="mr-3" color="error">
            <v-icon left v-text="'mdi-delete'" />
            删除
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
          字典项列表
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
      </v-tab-item>
    </v-tabs-items>
    <!-- 模态框 -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Dictionary Profile</span>
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
                    'Basejump',
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
  name: "dictionary",
  data: () => ({
    items,
    headers,
    current: 0,
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
    },
  },
};
</script>

<style lang="scss" scoped>
.dictionary {
  height: 100%;
  .navigation {
    margin-bottom: 12px;
    border-bottom: 1px solid #e0e0e0;
    .active {
      background-color: rgba(#009688, 0.07);
    }
  }
  .handle {
    width:100%;
    display:flex;
    align-items:center;
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
