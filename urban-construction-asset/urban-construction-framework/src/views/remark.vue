<template>
  <div class="remark">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addRemark">
        <v-icon left v-text="'mdi-plus'" />
        添加标签
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
      <v-btn class="mr-3" outlined color="cyan" @click="lead">
        <v-icon left v-text="'mdi-arrow-up-bold-box-outline'" />
        导入
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="download">
        <v-icon left v-text="'mdi-email'" />
        下载模板
      </v-btn>
      <v-menu
        :close-on-content-click="false"
        :nudge-width="250"
        v-model="menu"
        light
        offset-x
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
                <v-text-field v-model="searchForm.name" label="标签名称" />
                <v-text-field v-model="searchForm.number" label="标签编号" />
                <v-select
                  v-model="searchForm.type"
                  label="标签类型"
                  :items="type"
                />
                <v-select
                  v-model="searchForm.lendState"
                  :items="lendState"
                  label="借出状态"
                />
                <v-select
                  v-model="searchForm.lableState"
                  :items="lableState"
                  label="标签状态"
                />
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
      标签列表
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
        :items="remark"
        :loading="table"
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
    <!-- 添加标签模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Remark Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="form.name"
                :rules="rule.name"
                label="标签名称*"
                required
              />
              <v-text-field
                v-model="form.number"
                :rules="rule.number"
                label="标签编号*"
                required
              />
              <v-select
                v-model="form.type"
                :rules="rule.type"
                :items="type"
                label="标签类型*"
                required
              />
              <v-select
                v-model="form.lendState"
                :rules="rule.lendState"
                :items="lendState"
                label="借出状态*"
                required
              />
              <v-select
                v-model="form.lableState"
                :rules="rule.lableState"
                :items="lableState"
                label="标签状态*"
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
    <!-- 上传文件模态框 -->
    <v-dialog v-model="upload" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Upload Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-file-input
              light
              counter
              show-size
              label="文件"
              accept=".xlsx"
              @change="choose"
            />
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel">关闭</v-btn>
          <v-btn color="blue darken-1" text @click="submit">上传</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 加载提示框 -->
    <v-dialog v-model="wait" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text class="pt-2">
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import http from "@/assets/script/http";
export default {
  name: "remark",
  data: () => ({
    http,
    headers: [
      {
        text: "标签名称",
        align: "center",
        value: "name",
        width: 200,
      },
      {
        text: "标签编号",
        align: "center",
        value: "number",
        width: 200,
      },
      {
        text: "标签类型",
        align: "center",
        value: "type",
        width: 200,
      },
      {
        text: "录入时间",
        align: "center",
        value: "createTime",
        width: 200,
      },
      {
        text: "借出状态",
        align: "center",
        value: "lendState",
        width: 200,
      },
      {
        text: "标签状态",
        align: "center",
        value: "lableState",
        width: 200,
      },
    ],
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    remark: [],
    form: {
      name: "",
      number: "",
      type: "",
      lendState: "",
      lableState: "",
    },
    searchForm: {
      name: "",
      number: "",
      type: "",
      lendState: "",
      lableState: "",
    },
    rule: {
      name: [(v) => !!v || "必填"],
      number: [(v) => !!v || "必填"],
      type: [(v) => !!v || "必填"],
      lendState: [(v) => !!v || "必填"],
      lableState: [(v) => !!v || "必填"],
    },
    type: ["机器", "人员"],
    lendState: ["借出", "可用"],
    lableState: ["损坏", "正常"],
    select: [],
    file: "",
    wait: false,
    menu: false,
    valid: true,
    table: false,
    dialog: false,
    upload: false,
    loading: false,
    saveloading: false,
    resetloading: false,
    searchloading: false,
    deleteloading: false,
  }),
  mounted() {
    this.myRemark();
  },
  methods: {
    myRemark() {
      this.table = true;
      const { page, limit, searchForm } = this;
      const { name, number, type, lendState, lableState } = searchForm;
      this.$axios
        .post("/api-assets/LableManage/page", {
          page,
          limit,
          name,
          type,
          number,
          lendState,
          lableState,
        })
        .then((res) => {
          if (res) {
            const { total, records, current } = res.data;
            this.total = total;
            this.remark = records;
            this.current = current;
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
      this.myRemark();
    },
    updateItem(value) {
      this.limit = value;
      this.myRemark();
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios
        .delete(`/api-assets/LableManage/delete`, {
          params: {
            id: this.select[0].id,
          },
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.myRemark();
          }
          this.deleteloading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.myRemark();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    cancel() {
      this.upload = false;
    },
    addRemark() {
      this.dialog = true;
    },
    reset() {
      this.$refs.searchForm.reset();
      this.resetloading = true;
      this.page = 1;
      this.myRemark();
    },
    search() {
      this.searchloading = true;
      this.page = 1;
      this.myRemark();
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.saveloading = true;
        this.$axios
          .post("/api-assets/LableManage/saveOrUpdate", {
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.close();
              this.page = 1;
              this.myRemark();
              this.$notice.success("添加成功");
            }
            this.saveloading = false;
          });
      }
    },
    lead() {
      this.upload = true;
    },
    choose(value) {
      this.file = value;
    },
    submit() {
      if (!this.file) {
        this.$notice.error("请选择上传文件");
        return;
      }
      this.wait = true;
      const formData = new FormData();
      formData.append("file", this.file);
      this.$axios
        .post("/api-assets/LableManage/import", formData)
        .then((res) => {
          if (res) {
            this.cancel();
            this.myRemark();
            this.$notice.success(res.msg);
          }
          this.wait = false;
        });
    },
    download() {
      this.wait = true;
      this.$notice.normal("正在下载");
      window.open(`${http.system}/api-assets/LableManage/export`, "_self");
      setTimeout(() => {
        this.wait = false;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.remark {
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
