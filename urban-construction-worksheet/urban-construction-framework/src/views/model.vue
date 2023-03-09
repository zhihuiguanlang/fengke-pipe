<template>
  <div class="model">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addModel">
        <v-icon left v-text="'mdi-plus'" />
        添加模板
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="amendModel">
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
                <v-select
                  :items="name"
                  label="模板名称*"
                  v-model="searchForm.name"
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
      工单模板列表
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
        :items="model"
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
      </v-data-table>
    </div>
    <!-- 添加主机模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Model Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-select
                v-model="form.name"
                :rules="rule.name"
                label="模板名称*"
                :items="name"
                required
              />
              <v-select
                v-model="form.acceptUserId"
                :rules="rule.acceptUserId"
                item-text="nickname"
                item-value="id"
                label="审批人*"
                :items="user"
                required
              />
              <v-text-field
                v-model="form.level"
                :rules="rule.level"
                label="工单等级*"
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
  name: "model",
  data: () => ({
    headers: [
      {
        text: "模板名称",
        align: "center",
        value: "name",
        width: 200,
      },
      {
        width: 200,
        text: "审批人",
        align: "center",
        value: "acceptUserName",
      },
      {
        text: "工单等级",
        align: "center",
        value: "level",
        width: 200,
      },
      {
        text: "提交时间",
        align: "center",
        value: "createTime",
        width: 200,
      },
    ],
    name: ["管廊保洁", "管廊巡检", "设备维修", "运维监控"],
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    user: [],
    model: [],
    form: {
      name: "",
      level: "",
      acceptUserId: "",
    },
    rule: {
      name: [(v) => !!v || "必填"],
      level: [(v) => !!v || "必填"],
      acceptUserId: [(v) => !!v || "必填"],
    },
    searchForm: {
      name: "",
      startTime: "",
      endTime: "",
    },
    select: [],
    menu: false,
    valid: true,
    table: false,
    dialog: false,
    loading: false,
    saveloading: false,
    resetloading: false,
    searchloading: false,
    deleteloading: false,
    load: false,
    startTime: false,
    endTime: false,
    downloading: false,
    resetdownloading: false,
  }),
  mounted() {
    this.myUser();
    this.myModel();
  },
  methods: {
    myModel() {
      this.table = true;
      const { page, limit, searchForm } = this;
      this.$axios
        .post("/api-ops/workorderTemplate/page", {
          ...searchForm,
          limit,
          page,
        })
        .then((res) => {
          if (res) {
            const { total, records, current } = res.data;
            this.total = total;
            this.model = records;
            this.current = current;
          }
          this.menu = false;
          this.table = false;
          this.loading = false;
          this.resetloading = false;
          this.searchloading = false;
        });
    },
    myUser() {
      this.$axios.get("/api-user/users/list").then((res) => {
        if (res) {
          this.user = res.data;
        }
      });
    },
    updatePage(value) {
      this.page = value;
      this.myModel();
    },
    updateItem(value) {
      this.limit = value;
      this.myModel();
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios
        .delete(`/api-ops/workorderTemplate/delete`, {
          params: {
            id: this.select[0].id,
          },
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.myModel();
          }
          this.deleteloading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.myModel();
    },
    reset() {
      this.$refs.searchForm.reset();
      this.resetloading = true;
      this.myModel();
    },
    search() {
      this.searchloading = true;
      this.myModel();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    addModel() {
      delete this.form["id"];
      this.dialog = true;
    },
    amendModel() {
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
        const name = this.user.filter((res) => {
          return res.id == this.form.acceptUserId;
        });
        const { id = null } = this.form;
        this.form["flowDiagram"] = "worker";
        this.form["acceptUserName"] = name[0]["nickname"];
        this.saveloading = true;
        this.$axios
          .post("/api-ops/workorderTemplate/saveOrUpdate", {
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.$notice.success("操作成功");
              id || (this.page = 1);
              this.select = [];
              this.myModel();
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
.model {
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
