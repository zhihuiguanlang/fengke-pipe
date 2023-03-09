<template>
  <div class="expert">
    <div class="handle">
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
    >应急专家库列表</v-alert>
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
          <span class="headline">添加应急专家</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field v-model="form.number" :rules="rule.number" label="专家编号*" required />
              <v-text-field v-model="form.name" :rules="rule.name" label="专家姓名*" required />
              <v-select
                light
                :items="sex"
                item-text="title"
                item-value="value"
                label="性别"
                v-model="form.sex"
                :rules="rule.sex"
              />
              <v-text-field
                v-model="form.department"
                :rules="rule.department"
                label="所在单位*"
                required
              />
              <v-text-field
                v-model="form.profession"
                :rules="rule.profession"
                label="从事专业*"
                required
              />
              <v-text-field v-model="form.phoneNum" :rules="rule.phoneNum" label="手机*" required />
              <v-text-field
                v-model="form.specialty"
                :rules="rule.specialty"
                label="应急处置特长*"
                required
              />
              <v-text-field
                v-model="form.achievement"
                :rules="rule.achievement"
                label="应急处置成果*"
                required
              />
              <v-text-field
                disabled
                v-if="form.id"
                label="原始图片*"
                v-model="form.photos"
                prepend-icon
              />
              <v-file-input
                light
                counter
                required
                show-size
                v-if="form.edit"
                accept="image/*"
                @change="choose"
                :label="form.id ? `更换图片*` : `上传图片`"
                prepend-icon
              />
              <v-file-input
                light
                counter
                required
                show-size
                v-if="dialog && !form.edit"
                accept="image/*"
                @change="choose"
                :rules="rule.file"
                :label="form.id ? `更换图片*` : `上传图片`"
                prepend-icon
              />
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
  name: "expert",
  data: () => ({
    headers: [
      {
        text: "专家编号",
        align: "center",
        value: "number",
        width: 200
      },
      {
        text: "专家姓名",
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
        text: "所在单位",
        align: "center",
        value: "department",
        width: 200
      },
      {
        text: "从事专业",
        align: "center",
        value: "profession",
        width: 200
      },
      {
        text: "手机",
        align: "center",
        value: "phoneNum",
        width: 200
      },
      {
        text: "应急处置特长",
        align: "center",
        value: "specialty",
        width: 200
      },
      {
        text: "应急处置成果",
        align: "center",
        value: "achievement",
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
    sex: [
      {
        title: "男",
        value: 1
      },
      {
        title: "女",
        value: 2
      }
    ],
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    plan: [],
    select: [],
    wait: false,
    deleteloading: false,
    loading: false,
    table: false,
    resetloading: false,
    searchloading: false,
    dialog: false,
    valid: true,
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
        ...this.select[0],
        edit: true
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
      this.form.edit = false;
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
    }
  }
};
</script>

<style lang="scss" scoped>
.expert {
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