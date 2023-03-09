<template>
  <div class="scenarios">
    <div class="handle">
      <v-btn class="mr-3" outlined color="#00FF00" @click="inspecting">
        <v-icon left v-text="'mdi-calendar-search '" />审批
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
      <v-btn class="mr-3" outlined color="cyan" @click="download">
        <v-icon left v-text="'mdi-email'" />
        下载
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
    >应急预案列表</v-alert>
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
          <span class="headline">{{ form.id ? '编辑档案' : '添加档案' }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field :disabled="form.examine" v-model="form.planName" :rules="rule.planName" label="预案名称*" required />
              <v-text-field
                disabled
                v-if="form.id"
                label="原始文档*"
                v-model="form.fileName"
                prepend-icon="mdi-clipboard-check"
              />
              <v-file-input
                light
                counter
                required
                show-size
                v-if="form.edit"
                accept=".xlsx"
                @change="choose"
                :label="form.id ? `更换文档1*` : `添加文档1`"
                :prepend-icon="
                  form.id ? `mdi-clipboard-flow` : `mdi-clipboard-plus`
                "
              />
              <v-file-input
                light
                counter
                required
                show-size
                v-if="dialog && !form.examine && !form.edit"
                accept=".xlsx"
                @change="choose"
                :rules="rule.file"
                :label="form.id ? `更换文档2*` : `添加文档2`"
                :prepend-icon="
                  form.id ? `mdi-clipboard-flow` : `mdi-clipboard-plus`
                "
              />
              <v-select
                :disabled="form.examine"
                item-text="username"
                item-value="username"
                v-model="form.reviewer"
                :rules="rule.reviewer"
                :items="reviewer"
                label="审核人*"
                required
              />
              <v-select
                v-if="form.examine"
                item-text="title"
                item-value="value"
                v-model="form.auditResult"
                :rules="rule.auditResult"
                :items="auditResult"
                label="审核结果*"
                required
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
  name: "scenarios",
  data: () => ({
    headers: [
      {
        text: "预案名称",
        align: "center",
        value: "planName",
        width: 200
      },
      {
        text: "提交时间",
        align: "center",
        value: "createTime",
        width: 200
      },
      {
        text: "提交人",
        align: "center",
        value: "uploader",
        width: 200
      },
      {
        text: "文档大小",
        align: "center",
        value: "fileSize",
        width: 200
      },
      {
        text: "审核结果",
        align: "center",
        value: "auditResult",
        width: 200
      }
    ],
    form: {
      uploader: "",// 上传人
      file: "",
      planName: "",
      reviewer: "",
      auditResult: ""
    },
    rule: {
      planName: [v => !!v || "必填"],
      file: [v => !!v || "必填"],
      reviewer: [v => !!v || "必填"],
      auditResult: [v => !!v || "必填"]
    },
    auditResult: [{ title: "通过", value: "通过" }, { title: "未通过", value: "未通过" }],
    reviewer: [],
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
    this.role();
    this.query();
    this.create();
  },
  methods: {
    // 当前用户角色
    role() {
      this.$axios.get("/api-user/users/current").then(res => {
        if (res) {
          this.form.uploader = res.data.nickname;
        }
      });
    },
    query() {
      this.table = true;
      const { page, limit } = this;
      this.$axios
        .post("/dataManage/analysisHelp/selectFile", {
          page,
          limit
        })
        .then(res => {
          if (res) {
            const { total, list, pageNum } = res.result;
            this.total = total;
            this.plan = list.map(n=>{
              n.createTime = this.formatDateTime(n.createTime);
              return n
            });
            this.current = pageNum;
          }
          this.table = false;
          this.loading = false;
          this.resetloading = false;
          this.searchloading = false;
        });
    },
    create() {
      this.$axios.get("/api-user/dept/deptUser", {}).then(res => {
        if (res) {
          for (const i of res.data) {
            if (i.deptName == "总部") {
              for(const e of i.subDept){
                if(e.deptName == '审核部'){
                  this.reviewer = e.userInfo;
                }
              }
            }
          }
        }
      });
    },
    inspecting() {
      if (!this.select[0]) {
        this.$notice.error("请选择审核项");
        return;
      }
      if (this.select[0].reviewer == this.form.uploader) {
        this.form = {
          ...this.select[0],
          examine: true
        };
        this.dialog = true;
        return;
      }
      this.$notice.error("无权限审核预案列表");
      return;
    },
    amendHost() {
      if (!this.select[0]) {
        this.$notice.error("请选择编辑项");
        return;
      }
      this.form = {
        ...this.select[0],
        edit: true,
        examine: false
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
      this.form.examine = false;
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.form.examine = false;
      this.form.edit = false;
      this.$refs.form.reset();
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.wait = true;
        this.saveloading = true;
        const { id = null, uploader, planName, reviewer, file = null, auditResult = null } = this.form;
        const formData = new FormData();
        formData.append("uploader", uploader);
        formData.append("planName", planName);
        formData.append("reviewer", reviewer);
        file && formData.append("file", file);
        auditResult && formData.append("auditResult", auditResult);
        id && formData.append("id", id);
        this.$axios
          .post("/dataManage/analysisHelp/uploadOrUpdateFile", formData)
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
        .post(`/dataManage/analysisHelp/deleteFile`, {
          id
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.query();
          }
          this.deleteloading = false;
        });
    },
    download() {
      if (!this.select[0]) {
        this.$notice.error("请选择下载项");
        return;
      }
      this.$notice.normal("正在下载");
      window.open(`${this.select[0].filePath}`, "_self");
    },
    formatDateTime(inputTime) {
      let date = new Date(inputTime);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return `${y}-${m}-${d}`; //   
    }
  }
};
</script>

<style lang="scss" scoped>
.scenarios {
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