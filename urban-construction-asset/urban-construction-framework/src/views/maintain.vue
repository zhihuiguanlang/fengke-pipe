<template>
  <div class="maintain">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addMaintain">
        <v-icon left v-text="'mdi-plus'" />
        添加运维档案
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="amendMaintain">
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
    >
      档案列表
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
        :items="maintain"
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
    <!-- 添加档案模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Maintain Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
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
                v-if="dialog"
                accept=".xlsx"
                @change="choose"
                :rules="rule.file"
                :label="form.id ? `更换文档*` : `添加文档`"
                :prepend-icon="
                  form.id ? `mdi-clipboard-flow` : `mdi-clipboard-plus`
                "
              />
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">关闭</v-btn>
          <v-btn color="blue darken-1" text @click="save">保存</v-btn>
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
  name: "maintain",
  data: () => ({
    http,
    headers: [
      {
        text: "文档名称",
        align: "center",
        value: "fileName",
        width: 200,
      },
      {
        text: "上传时间",
        align: "center",
        value: "createTime",
        width: 200,
      },
      {
        text: "上传人",
        align: "center",
        value: "uploader",
        width: 200,
      },
      {
        text: "文档大小",
        align: "center",
        value: "size",
        width: 200,
      },
    ],
    page: 1,
    type: 5,
    total: 0,
    limit: 10,
    current: 1,
    maintain: [],
    form: {
      file: "",
    },
    rule: {
      file: [(v) => !!v || "必填"],
    },
    select: [],
    wait: false,
    valid: true,
    table: false,
    dialog: false,
    loading: false,
    deleteloading: false,
  }),
  mounted() {
    this.myMaintain();
  },
  methods: {
    myMaintain() {
      this.table = true;
      const { page, limit, type } = this;
      this.$axios
        .post("/dataManage/document/selectFile", {
          page,
          type,
          limit,
        })
        .then((res) => {
          if (res) {
            const { total, list, pageNum } = res.result;
            this.total = total;
            this.maintain = list;
            this.current = pageNum;
          }
          this.table = false;
          this.loading = false;
        });
    },
    updatePage(value) {
      this.page = value;
      this.myMaintain();
    },
    updateItem(value) {
      this.limit = value;
      this.myMaintain();
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      const { id, filePath } = this.select[0];
      this.deleteloading = true;
      this.$axios
        .post(`/dataManage/document/deleteFile`, {
          id,
          filePath,
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.myMaintain();
          }
          this.deleteloading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.myMaintain();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    addMaintain() {
      delete this.form["id"];
      this.dialog = true;
    },
    amendMaintain() {
      if (!this.select[0]) {
        this.$notice.error("请选择编辑项");
        return;
      }
      this.form = {
        ...this.select[0],
      };
      this.dialog = true;
    },
    choose(value) {
      this.form.file = value;
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.wait = true;
        const { type, form } = this;
        const { id = null, file } = form;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        formData.append("uploader", "ADMIN");
        id && formData.append("id", id);
        this.$axios
          .post("/dataManage/document/uploadOrUpdateFile", formData)
          .then((res) => {
            if (res) {
              this.$notice.success("操作成功");
              id || (this.page = 1);
              this.myMaintain();
              this.select = [];
              this.close();
            }
            this.wait = false;
          });
      }
    },
    download() {
      if (!this.select[0]) {
        this.$notice.error("请选择下载项");
        return;
      }
      this.wait = true;
      const { id } = this.select[0];
      this.$notice.normal("正在下载");
      window.open(`${http.system}/dataManage/document/downloadFile?id=${id}`, "_self");
      setTimeout(() => {
        this.wait = false;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.maintain {
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
