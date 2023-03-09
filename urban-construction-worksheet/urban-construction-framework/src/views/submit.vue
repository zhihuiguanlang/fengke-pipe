<template>
  <div class="submit">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addSubmit">
        <v-icon left v-text="'mdi-plus'" />
        添加
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="amendSubmit">
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
        v-model="load"
        light
        offset-x
      >
        <template #activator="{ on }">
          <v-btn class="mr-3" outlined color="#FF3D00" v-on="on">
            <v-icon left v-text="'mdi-file-find'" />下载
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-container>
              <v-form ref="searchForm">
                <v-menu v-model="startTime" transition="scale-transition">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="searchForm.startTime"
                      label="开始时间"
                      v-on="on"
                      readonly
                    />
                  </template>
                  <v-date-picker v-model="searchForm.startTime" />
                </v-menu>
                <v-menu v-model="endTime" transition="scale-transition">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="searchForm.endTime"
                      label="结束时间"
                      v-on="on"
                      readonly
                    />
                  </template>
                  <v-date-picker v-model="searchForm.endTime" />
                </v-menu>
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="resetDown" :loading="resetdownloading"
              >Reset</v-btn
            >
            <v-btn text @click="download" color="primary" :loading="downloading"
              >Download</v-btn
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
      工单信息列表
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
        :items="submit"
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
      >
        <template #item.createTime="{ item }">
          {{ new Date(item.createTime).toLocaleString() }}
        </template>
        <template #item.status="{ item }">
          <v-chip label :class="`${item.status != 4 || 'error'}`">
            {{ status[item["status"]] }}
          </v-chip>
        </template>
      </v-data-table>
    </div>
    <!-- 添加主机模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Submit Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="form.title"
                :rules="rule.title"
                label="工单名称*"
                required
              />
              <v-select
                v-model="form.type"
                :rules="rule.type"
                label="工单类型*"
                :items="model"
                required
              />
              <v-select
                v-model="form.acceptUserId"
                :rules="rule.acceptUserId"
                item-text="nickname"
                item-value="id"
                label="处理人*"
                :items="list"
                required
              />
              <v-text-field
                v-model="form.level"
                :rules="rule.level"
                label="信息等级*"
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
  name: "submit",
  data: () => ({
    headers: [
      {
        text: "工单编号",
        align: "center",
        value: "code",
        width: 200,
      },
      {
        text: "工单名称",
        align: "center",
        value: "title",
        width: 200,
      },
      {
        text: "工单类型",
        align: "center",
        value: "type",
        width: 200,
      },
      {
        text: "提交人",
        align: "center",
        value: "submitterName",
        width: 200,
      },
      {
        text: "提交时间",
        align: "center",
        value: "createTime",
        width: 200,
      },
      {
        text: "处理人",
        align: "center",
        value: "acceptUserName",
        width: 200,
      },
      {
        text: "信息等级",
        align: "center",
        value: "level",
        width: 200,
      },
      {
        text: "工单状态",
        align: "center",
        value: "status",
        width: 200,
      },
    ],
    status: {
      0: "已提交",
      1: "已发起",
      2: "已接受",
      4: "已确认",
      5: "已驳回",
    },
    model: [],
    list: [],
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    submit: [],
    form: {
      type: "",
      title: "",
      level: "",
      acceptUserId: "",
    },
    rule: {
      type: [(v) => !!v || "必填"],
      title: [(v) => !!v || "必填"],
      level: [(v) => !!v || "必填"],
      acceptUserId: [(v) => !!v || "必填"],
    },
    searchForm: {
      startTime: "",
      endTime: "",
    },
    select: [],
    valid: true,
    table: false,
    dialog: false,
    loading: false,
    saveloading: false,
    deleteloading: false,
    load: false,
    startTime: false,
    endTime: false,
    downloading: false,
    resetdownloading: false,
  }),
  mounted() {
    this.mySubmit();
    this.myModel();
    this.allUser();
  },
  methods: {
    mySubmit() {
      this.table = true;
      const { page, limit } = this;
      this.$axios
        .post("/api-ops/workorder/started", {
          page,
          limit,
        })
        .then((res) => {
          if (res) {
            const { total, records, current } = res.data;
            this.total = total;
            this.submit = records;
            this.current = current;
          }
          this.table = false;
          this.loading = false;
        });
    },
    myModel() {
      this.$axios.post("/api-ops/workorderTemplate/list", {}).then((res) => {
        if (res) {
          this.model = res.data.map((res) => {
            return res.name;
          });
        }
      });
    },
    allUser() {
      this.$axios.get("/api-user/users/list").then((res) => {
        if (res) {
          this.list = res.data;
        }
      });
    },
    updatePage(value) {
      this.page = value;
      this.mySubmit();
    },
    updateItem(value) {
      this.limit = value;
      this.mySubmit();
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      const { id } = this.select[0];
      this.deleteloading = true;
      this.$axios
        .delete(`/api-ops/workorder/delete?id=${id}`, {})
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.mySubmit();
          }
          this.deleteloading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.mySubmit();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    addSubmit() {
      delete this.form["id"];
      this.dialog = true;
    },
    amendSubmit() {
      if (!this.select[0]) {
        this.$notice.error("请选择编辑项");
        return;
      }
      this.form = {
        ...this.select[0],
      };
      this.dialog = true;
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        const name = this.list.filter((res) => {
          return res.id == this.form.acceptUserId;
        });
        this.form.acceptUserName = name[0].nickname;
        const { id = null } = this.form;
        for (let key in this.form) {
          if (this.form[key] === null || this.form[key] == "") {
            delete this.form[key];
          }
        }
        const http = id
          ? "/api-ops/workorder/saveOrUpdate"
          : "/api-ops/workorder/add";
        this.saveloading = true;
        this.$axios.post(http, this.form).then((res) => {
          if (res) {
            this.$notice.success("操作成功");
            id || (this.page = 1);
            this.select = [];
            this.mySubmit();
            this.close();
          }
          this.saveloading = false;
        });
      }
    },
    resetDown() {},
    download() {},
  },
};
</script>

<style lang="scss" scoped>
.submit {
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
