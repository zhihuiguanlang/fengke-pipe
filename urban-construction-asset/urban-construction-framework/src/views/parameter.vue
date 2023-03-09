<template>
  <div class="parameter">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addParameter">
        <v-icon left v-text="'mdi-plus'" />
        添加参数
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="amendParameter">
        <v-icon left v-text="'mdi-pencil'" />
        编辑
      </v-btn>
      <v-btn
        class="mr-3"
        color="error"
        @click="deleted"
        :loading="deleteloading"
      >
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
      <v-menu
        :close-on-content-click="false"
        :nudge-width="250"
        v-model="menu"
        offset-x
        light
      >
        <template #activator="{ on }">
          <v-btn class="mr-3" outlined color="cyan" v-on="on">
            <v-icon left v-text="'mdi-file-find'" />
            搜索
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-container>
              <v-form ref="searchForm">
                <v-text-field v-model="searchForm.name" label="参数名称" />
                <v-text-field v-model="searchForm.unit" label="单位" />
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="reset" :loading="resetloading">Reset</v-btn>
            <v-btn text @click="search" color="primary" :loading="searchloading"
              >Search</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-menu>
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
      系统参数列表
    </v-alert>
    <div class="elevation-7">
      <v-data-table
        light
        show-select
        fixed-header
        single-select
        calculate-width
        height="500"
        item-key="id"
        :loading="table"
        :items="parameter"
        :headers="headers"
        :page.sync="current"
        :items-per-page="limit"
        :loading-text="'loading...'"
        :server-items-length="total"
        :footer-props="{
          itemsPerPageOptions: [5, 10, 15, 20],
        }"
        v-model="select"
        @update:page="updatePage"
        @update:items-per-page="updateItem"
      />
    </div>
    <!-- 添加参数模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Parameter Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="form.name"
                :rules="rule.name"
                label="参数名称*"
                required
              />
              <v-text-field
                v-model="form.unit"
                :rules="rule.unit"
                label="单位*"
                required
              />
              <v-textarea
                v-model="form.notes"
                :rules="rule.notes"
                label="备注*"
                required
                counter
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
  name: "parameter",
  data: () => ({
    headers: [
      {
        text: "参数名称",
        align: "center",
        value: "name",
        width: 200,
      },
      {
        text: "单位",
        align: "center",
        value: "unit",
        width: 200,
      },
      {
        text: "备注",
        align: "center",
        value: "notes",
        width: 200,
      },
    ],
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    parameter: [],
    form: {
      name: "",
      unit: "",
      notes: "",
    },
    rule: {
      name: [(v) => !!v || "必填"],
      unit: [(v) => !!v || "必填"],
      notes: [(v) => !!v || "必填"],
    },
    searchForm: {
      name: "",
      unit: "",
    },
    select: [],
    menu: false,
    valid: true,
    table: false,
    dialog: false,
    loading: false,
    resetloading: false,
    searchloading: false,
    saveloading: false,
    deleteloading: false,
  }),
  mounted() {
    this.myParameter();
  },
  methods: {
    myParameter() {
      this.table = true;
      const { page, limit, searchForm } = this;
      this.$axios
        .post("/api-assets/Paramter/page", {
          ...searchForm,
          limit,
          page,
        })
        .then((res) => {
          if (res) {
            const { total, records, current } = res.data;
            this.total = total;
            this.current = current;
            this.parameter = records;
          }
          this.menu = false;
          this.table = false;
          this.loading = false;
          this.resetloading = false;
          this.searchloading = false;
        });
    },
    updatePage(value) {
      this.page = value;
      this.myParameter();
    },
    updateItem(value) {
      this.limit = value;
      this.myParameter();
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios
        .delete(`/api-assets/Paramter/delete`, {
          params: {
            id: this.select[0].id,
          },
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.myParameter();
            this.select = [];
          }
          this.deleteloading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.myParameter();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    addParameter() {
      delete this.form["id"];
      this.dialog = true;
    },
    amendParameter() {
      if (!this.select[0]) {
        this.$notice.error("请选择编辑项");
        return;
      }
      this.form = {
        ...this.select[0],
      };
      this.dialog = true;
    },
    reset() {
      this.$refs.searchForm.reset();
      this.resetloading = true;
      this.page = 1;
      this.myParameter();
    },
    search() {
      this.searchloading = true;
      this.page = 1;
      this.myParameter();
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        const { id = null } = this.form;
        this.saveloading = true;
        this.$axios
          .post("/api-assets/Paramter/saveOrUpdate", {
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.$notice.success("操作成功");
              id || (this.page = 1);
              this.myParameter();
              this.select = [];
              this.close();
            }
            this.saveloading = false;
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.parameter {
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
