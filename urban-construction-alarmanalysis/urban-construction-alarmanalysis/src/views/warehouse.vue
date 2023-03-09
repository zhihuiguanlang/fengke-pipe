<template>
  <div class="warehouse">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addRole">
        <v-icon left v-text="'mdi-plus'" />添加
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="amendRole">
        <v-icon left v-text="'mdi-pencil'" />编辑
      </v-btn>
      <v-btn
        class="mr-3"
        color="error"
        @click="deleted"
        :loading="deleteloading"
      >
        <v-icon left v-text="'mdi-delete'" />删除
      </v-btn>
      <v-btn
        outlined
        class="mr-3"
        color="teal"
        @click="refresh"
        :loading="loading"
      >
        <v-icon left v-text="'mdi-cached'" />刷新
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
      >物资库管理</v-alert
    >
    <div class="elevation-7">
      <v-card-text>
        <v-container>
          <el-table
            border
            row-key="id"
            :data="limit"
            ref="theTable"
            highlight-current-row
            :tree-props="{ children: 'goodsLibraryList' }"
          >
            <el-table-column
              prop="name"
              align="center"
              min-width="200"
              label="物资库名称"
            />
            <el-table-column width="45" align="center">
              <template slot-scope="scope">
                <v-checkbox
                  light
                  dense
                  multiple
                  class="my-2"
                  v-model="tree"
                  v-if="scope.row.id"
                  style="height:30px;"
                  @click="choice(scope.row)"
                  color="rgba(0, 0, 0, 0.54)"
                  :value="JSON.stringify(scope.row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </v-container>
      </v-card-text>
    </div>
    <!-- 模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">添加物资库</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="form.name"
                :rules="rule.name"
                label="物资库名称*"
                required
              />
              <v-text-field
                v-model="form.address"
                :rules="rule.address"
                label="物资库地址*"
                required
              />
              <v-select
                item-text="nickname"
                item-value="nickname"
                v-model="form.supervisor"
                :rules="rule.supervisor"
                :items="supervisor"
                label="负责人*"
                required
              />
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">关闭</v-btn>
          <v-btn color="blue darken-1" text @click="save" :loading="saveloading"
            >保存</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "warehouse",
  data: () => ({
    dialog: false,
    valid: true,
    loading: false,
    saveloading: false,
    deleteloading: false,
    tree: [],
    limit: [],
    form: {
      name: "",
      address: "",
      supervisor: "",
      parentId: -1,
    },
    rule: {
      name: [(v) => !!v || "必填"],
      address: [(v) => !!v || "必填"],
      supervisor: [(v) => !!v || "必填"],
    },
    supervisor: [],
  }),
  mounted() {
    this.query();
    this.create();
  },
  methods: {
    query() {
      this.$axios
        .post("/dataManage/goods/getAllGoodsLibrary", {})
        .then((res) => {
          if (res) {
            const limit = res.result;
            this.limit = limit;
          }
          this.loading = false;
          this.deleteloading = false;
          this.saveloading = false;
        });
    },
    create() {
      this.$axios.get("/api-user/users/list", {}).then(res => {
        if (res) {
          this.supervisor = res.data;
        }
      });
    },
    addRole() {
      if (this.tree[0]) {
        this.form.parentId = JSON.parse(this.tree[0]).id;
      }
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.tree = [];
      this.form.parentId = -1;
      this.$refs.form.reset();
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.saveloading = true;
        this.$axios
          .post("/dataManage/goods/insertOrUpdateGoodsLibrary", {
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.close();
              this.query();
              this.tree = [];
              this.form.parentId = -1;
              this.$notice.success("操作成功");
            }
            this.saveloading = false;
          });
      }
    },
    amendRole() {
      if (!this.tree[0]) {
        this.$notice.error("请选择编辑项");
        return;
      }
      this.form = {
        ...JSON.parse(this.tree[0]),
      };
      this.dialog = true;
    },
    deleted() {
      if (!this.tree[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      const { id } = JSON.parse(this.tree[0]);
      this.deleteloading = true;
      this.$axios
        .post(`/dataManage/goods/deleteGoodsLibrary`, {
          id,
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.tree = [];
            this.form.parentId = -1;
            this.query();
          }
          this.deleteloading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.tree = [];
      this.form.parentId = -1;
      this.query();
    },
    choice(value) {
      this.tree = [JSON.stringify(value)];
    },
  },
};
</script>

<style lang="scss" scoped>
.warehouse {
  height: 100%;
  .handle {
    width: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #e0e0e0;
  }
  .alert {
    display: flex;
    margin: 24px 0px;
  }
}
</style>
