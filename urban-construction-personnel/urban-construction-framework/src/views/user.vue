<template>
  <div class="user">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addUser">
        <v-icon left v-text="'mdi-plus'" />
        添加用户
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
      <v-btn class="mr-3" outlined color="cyan" @click="amendPassword">
        <v-icon left v-text="'mdi-lock'" />
        修改密码
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
                  v-model="searchForm.deptId"
                  :item-text="'deptName'"
                  :item-value="'id'"
                  :items="branch"
                  label="部门"
                />
                <v-text-field v-model="searchForm.username" label="用户名" />
                <v-text-field v-model="searchForm.nickname" label="昵称" />
                <v-text-field v-model="searchForm.mobile" label="手机号" />
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
      用户列表
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
        :items="users"
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
        <template #item.roles="{ item }">
          <v-chip label v-for="(i, index) in item.roles" :key="index">
            {{ i.name }}
          </v-chip>
        </template>
        <template #item.deptInfo="{ item }">
          <v-chip v-if="!item.deptInfo" label>
            暂无分配
          </v-chip>
          <span v-else>{{ item.deptInfo.deptName }}</span>
        </template>
      </v-data-table>
    </div>
    <!-- 添加用户模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="form.username"
                :rules="rule.username"
                label="用户名*"
                required
              />
              <v-text-field
                v-model="form.password"
                :rules="rule.password"
                type="password"
                label="密码*"
                required
              />
              <v-text-field
                v-model="form.nickname"
                :rules="rule.nickname"
                label="昵称*"
                required
              />
              <v-text-field
                v-model="form.mobile"
                :rules="rule.mobile"
                label="手机号*"
                required
              />
              <v-select
                v-model="form.sex"
                :rules="rule.sex"
                :items="sex"
                label="性别*"
                required
              />
              <v-select
                v-model="form.enabled"
                :rules="rule.enabled"
                :items="enabled"
                label="状态*"
                required
              />
              <v-select
                v-model="form.type"
                :rules="rule.type"
                :items="type"
                label="应用类型*"
                required
              />
              <v-select
                v-model="form.deptId"
                :item-text="'deptName'"
                :rules="rule.deptId"
                :item-value="'id'"
                :items="branch"
                label="部门*"
                required
              />
              <v-select
                v-model="form.roleId"
                :rules="rule.roleId"
                :item-text="'name'"
                :item-value="'id'"
                :items="roles"
                label="角色*"
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
    <!-- 修改密码模态框 -->
    <v-dialog v-model="amend" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Amend Password</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="amendForm" v-model="amendValid">
              <v-text-field
                v-model="amendForm.oldPassword"
                :rules="amendRule.oldPassword"
                type="password"
                label="原密码*"
                required
              />
              <v-text-field
                v-model="amendForm.newPassword"
                :rules="amendRule.newPassword"
                type="password"
                label="新密码*"
                required
              />
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="amendClose">关闭</v-btn>
          <v-btn
            text
            @click="amendSave"
            color="blue darken-1"
            :loading="amendloading"
          >
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "user",
  data: () => ({
    headers: [
      {
        text: "用户名",
        align: "center",
        value: "username",
        width: 200,
      },
      {
        text: "昵称",
        align: "center",
        value: "nickname",
        width: 200,
      },
      {
        text: "手机",
        align: "center",
        value: "mobile",
        width: 200,
      },
      {
        text: "性别",
        align: "center",
        value: "sex",
        width: 200,
      },
      {
        text: "应用类型",
        align: "center",
        value: "type",
        width: 200,
      },
      {
        text: "部门",
        align: "center",
        value: "deptInfo",
        width: 200,
      },
      {
        text: "角色",
        align: "center",
        value: "roles",
        width: 200,
      },
    ],
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    users: [],
    roles: [],
    branch: [],
    sex: [
      {
        text: "女",
        value: 0,
      },
      {
        text: "男",
        value: 1,
      },
    ],
    type: ["APP"],
    enabled: [
      {
        text: "禁用",
        value: 0,
      },
      {
        text: "正常",
        value: 1,
      },
    ],
    form: {
      roleId: "",
      deptId: "",
      username: "",
      nickname: "",
      password: "",
      mobile: "",
      sex: "",
      type: "",
      enabled: "",
    },
    searchForm: {
      deptId: "",
      username: "",
      nickname: "",
      mobile: "",
      startTime: "",
      endTime: "",
    },
    amendForm: {
      oldPassword: "",
      newPassword: "",
    },
    rule: {
      username: [(v) => !!v || "必填"],
      nickname: [(v) => !!v || "必填"],
      deptId: [(v) => !!v || "必选"],
      roleId: [(v) => !!v || "必选"],
      password: [(v) => !!v || "必选"],
      mobile: [(v) => !!v || "必选"],
      sex: [(v) => v === Number(v) || "必选"],
      type: [(v) => !!v || "必选"],
      enabled: [(v) => v === Number(v) || "必选"],
    },
    amendRule: {
      oldPassword: [(v) => !!v || "必填"],
      newPassword: [(v) => !!v || "必填"],
    },
    select: [],
    menu: false,
    valid: true,
    table: false,
    amend: false,
    dialog: false,
    loading: false,
    amendValid: true,
    saveloading: false,
    amendloading: false,
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
    this.myRole();
    this.myBranch();
  },
  methods: {
    myUser() {
      this.table = true;
      const { page, limit, searchForm } = this;
      const { deptId, username, nickname, mobile } = searchForm;
      this.$axios
        .get("/api-user/users", {
          params: {
            page,
            limit,
            deptId,
            mobile,
            username,
            nickname,
          },
        })
        .then((res) => {
          if (res) {
            const { count, data } = res;
            this.total = count;
            this.users = data;
          }
          this.menu = false;
          this.table = false;
          this.loading = false;
          this.resetloading = false;
          this.searchloading = false;
        });
    },
    myRole() {
      this.$axios.get("/api-user/allRoles").then((res) => {
        if (res) {
          const { data } = res;
          this.roles = data;
        }
      });
    },
    myBranch() {
      this.$axios.get("/api-user/dept/list").then((res) => {
        if (res) {
          for (const i of res.data) {
            if (i.subDept == false) {
              this.branch.push(i);
            } else {
              this.branch.push(...i.subDept);
            }
          }
        }
      });
    },
    updatePage(value) {
      this.page = value;
      this.myUser();
    },
    updateItem(value) {
      this.limit = value;
      this.myUser();
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios.delete(`/api-user/users/${this.select[0].id}`).then((res) => {
        if (res) {
          this.$notice.success("删除成功");
          this.select = [];
          this.myUser();
        }
        this.deleteloading = false;
      });
    },
    refresh() {
      this.loading = true;
      this.myUser();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    amendClose() {
      this.amend = false;
      this.$refs.amendForm.reset();
    },
    addUser() {
      this.dialog = true;
    },
    amendPassword() {
      if (!this.select[0]) {
        this.$notice.error("请选择修改项");
        return;
      }
      this.amend = true;
      const { id } = this.select[0];
      this.amendForm = {
        ...this.amendForm,
        id,
      };
    },
    reset() {
      this.$refs.searchForm.reset();
      this.resetloading = true;
      this.page = 1;
      this.myUser();
    },
    search() {
      this.searchloading = true;
      this.page = 1;
      this.myUser();
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.saveloading = true;
        this.$axios
          .post("/api-user/users/saveOrUpdate", {
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.close();
              this.page = 1;
              this.myUser();
              this.$notice.success("添加成功");
            }
            this.saveloading = false;
          });
      }
    },
    amendSave() {
      this.$refs.amendForm.validate();
      if (this.amendValid) {
        this.amendloading = true;
        this.$axios
          .put("/api-user/users/password", {
            ...this.amendForm,
          })
          .then((res) => {
            if (res) {
              this.$notice.success("修改成功");
              this.amendClose();
              this.myUser();
            }
            this.amendloading = false;
          });
      }
    },
    resetDown() {},
    download() {},
  },
};
</script>

<style lang="scss" scoped>
.user {
  height: 100%;
  .handle {
    width: 100%;
    padding-bottom: 12px;
    border-bottom: 1px solid #e0e0e0;
  }
  .alert {
    display: flex;
    margin: 24px 0px;
  }
}
</style>
