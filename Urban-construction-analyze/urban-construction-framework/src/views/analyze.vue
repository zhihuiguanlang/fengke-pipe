<template>
  <div class="analyze">
    <div class="handle">
      <v-btn class="mr-3" outlined color="#3F51B5">
        <v-icon left v-text="'mdi-code-json'" />查看
      </v-btn>
      <v-btn class="mr-3" outlined color="light-green" @click="addHost">
        <v-icon left v-text="'mdi-plus'" />添加
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="amendHost">
        <v-icon left v-text="'mdi-pencil'" />编辑
      </v-btn>
      <v-btn class="mr-3" color="error" @click="deleted" :loading="deleteloading">
        <v-icon left v-text="'mdi-delete'" />删除
      </v-btn>
      <v-btn outlined class="mr-3" color="teal" @click="refresh" :loading="loading">
        <v-icon left v-text="'mdi-cached'" />刷新
      </v-btn>
      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" light offset-x>
        <template v-slot:activator="{ on }">
          <v-btn class="mr-3" outlined color="cyan" v-on="on">
            <v-icon left v-text="'mdi-file-find'" />搜索
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-container>
              <v-form ref="searchForm">
                <v-text-field v-model="searchForm.name" label="视频分析时间段" />
                <v-text-field v-model="searchForm.content" label="姓名" />
                <v-text-field v-model="searchForm.site" label="手机" />
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="reset" :loading="resetloading">Reset</v-btn>
            <v-btn text @click="search" color="primary" :loading="searchloading">Search</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </div>
    <v-alert
      tile
      light
      dense
      width="200"
      height="18"
      color="cyan"
      class="alert"
      border="left"
      elevation="0"
      colored-border
      transition="scale-transition"
    >入侵记录</v-alert>
    <div class="elevation-7">
      <v-data-table
        light
        show-select
        fixed-header
        single-select
        calculate-width
        height="500"
        item-key="id"
        :items="plan"
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
    <!-- 模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">添加列表</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field v-model="form.name" :rules="rule.name" label="视频分析时间段*" required />
              <v-file-input
                light
                counter
                required
                show-size
                v-if="dialog"
                accept="image/*"
                @change="choose"
                :rules="rule.file"
                :label="form.id ? `更换图片*` : `上传图片`"
                prepend-icon
              />
              <v-text-field v-model="form.name" :rules="rule.name" label="姓名*" required />
              <v-select
                light
                :items="sex"
                item-text="title"
                item-value="value"
                label="性别"
                v-model="form.sex"
                :rules="rule.sex"
              />
              <v-text-field v-model="form.phoneNum" :rules="rule.phoneNum" label="手机*" required />
              <v-text-field v-model="form.phoneNum" :rules="rule.phoneNum" label="关联人账户*" required />
              <v-text-field v-model="form.phoneNum" :rules="rule.phoneNum" label="提交时间*" required />
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">关闭</v-btn>
          <v-btn color="blue darken-1" text @click="save" :loading="saveloading">保存</v-btn>
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
export default {
  name: "analyze",
  data: () => ({
    headers: [
      {
        text: "视频分析时间段",
        align: "center",
        value: "name",
        width: 200
      },
      {
        text: "姓名",
        align: "center",
        value: "name",
        width: 200
      },
      {
        text: "性别",
        align: "center",
        value: "gender",
        width: 200
      },
      {
        text: "手机",
        align: "center",
        value: "phoneNum",
        width: 200
      },
      {
        text: "关联人账户",
        align: "center",
        value: "specialty",
        width: 200
      },
      {
        text: "提交人",
        align: "center",
        value: "specialty",
        width: 200
      },
      {
        text: "提交时间",
        align: "center",
        value: "specialty",
        width: 200
      },
      {
        text: "审核结果",
        align: "center",
        value: "",
        width: 200
      }
    ],
    form: {
      number: "",
      name: "",
      sex: "",
      department: "",
      profession: "",
      phoneNum: "",
      specialty: "",
      achievement: "",
      file: ""
    },
    rule: {
      number: [v => !!v || "必填"],
      name: [v => !!v || "必填"],
      sex: [v => !!v || "必填"],
      department: [v => !!v || "必填"],
      profession: [v => !!v || "必填"],
      phoneNum: [v => !!v || "必填"],
      specialty: [v => !!v || "必填"],
      achievement: [v => !!v || "必填"],
      file: [v => !!v || "必填"]
    },
    searchForm: {
      name: "",
      content: "",
      site: ""
    },
    sex: [{ title: "男", value: 1 }, { title: "女", value: 2 }],
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    plan: [],
    select: [],
    menu: false,
    wait: false,
    valid: true,
    table: false,
    dialog: false,
    loading: false,
    resetloading: false,
    searchloading: false,
    deleteloading: false,
    saveloading: false
  }),
  mounted() {
    this.query();
  },
  methods: {
    query() {
      this.table = true;
      const { page, limit } = this;
      this.$axios
        .post("/dataManage/expert/selectAllExpert", {
          page,
          limit
        })
        .then(res => {
          if (res) {
            const { total, list, pageNum } = res.result;
            this.total = total;
            this.plan = list.map(n => {
              n.gender = n.sex == 2 ? "女" : "男";
              return n;
            });
            this.current = pageNum;
          }
          this.table = false;
          this.loading = false;
          this.resetloading = false;
          this.searchloading = false;
        });
    },
    amendHost() {
      if (!this.select[0]) {
        this.$notice.error("请选择编辑项");
        return;
      }
      const index = this.select[0].picture.lastIndexOf("/");
      this.select[0].photos = this.select[0].picture.substr(index + 1);
      this.form = {
        ...this.select[0]
      };
      this.dialog = true;
    },
    refresh() {
      this.loading = true;
      this.query();
    },
    updatePage(value) {
      this.page = value;
      this.query();
    },
    updateItem(value) {
      this.limit = value;
      this.query();
    },
    choose(value) {
      this.form.file = value;
    },
    addHost() {
      delete this.form["id"];
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.wait = true;
        this.saveloading = true;
        const { form } = this;
        const {
          id = null,
          number,
          name,
          sex,
          department,
          profession,
          phoneNum,
          specialty,
          achievement,
          file
        } = form;
        const formData = new FormData();
        formData.append("number", number);
        formData.append("name", name);
        formData.append("sex", sex);
        formData.append("department", department);
        formData.append("profession", profession);
        formData.append("phoneNum", phoneNum);
        formData.append("specialty", specialty);
        formData.append("achievement", achievement);
        formData.append("file", file);
        id && formData.append("id", id);
        this.$axios
          .post("/dataManage/expert/insertOrUpdateExpert", formData)
          .then(res => {
            if (res) {
              this.$notice.success("操作成功");
              id || (this.page = 1);
              this.select = [];
              this.query();
              this.close();
            }
            this.wait = false;
            this.saveloading = false;
          });
      }
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      const { id } = this.select[0];
      this.deleteloading = true;
      this.$axios
        .post(`/dataManage/expert/deleteExpert`, {
          id
        })
        .then(res => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.query();
          }
          this.deleteloading = false;
        });
    },
    reset() { },
    search() { },
  }
};
</script>

<style lang="scss" scoped>
.analyze {
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