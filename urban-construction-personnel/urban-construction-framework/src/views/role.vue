<template>
  <div class="role">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addRole">
        <v-icon left v-text="'mdi-plus'" />
        添加角色
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
      <v-btn class="mr-3" outlined color="cyan" @click="amendlimits">
        <v-icon left v-text="'mdi-lock'" />
        权限配置
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
      角色列表
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
        :items="roles"
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
    <!-- 添加角色模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Role Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="form.name"
                :rules="rule.name"
                label="角色名*"
                required
              />
              <v-textarea
                v-model="form.code"
                :rules="rule.code"
                label="角色备注*"
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
    <!-- 配置权限模态框 -->
    <v-dialog v-model="amend" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Amend limits</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-treeview
              light
              rounded
              hoverable
              selectable
              transition
              activatable
              item-key="id"
              open-on-click
              return-object
              v-model="tree"
              :items="limits"
              multiple-active
              item-text="name"
              :active.sync="tree"
              @update:active="active"
              item-children="subMenuRole"
            />
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="amendClose">关闭</v-btn>
          <v-btn
            text
            @click="amendSave"
            color="green darken-1"
            :loading="amendloading"
          >
            保存
          </v-btn>
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
  name: "role",
  data: () => ({
    headers: [
      {
        text: "角色名",
        align: "center",
        value: "name",
        width: 200,
      },
      {
        text: "角色备注",
        align: "center",
        value: "code",
        width: 400,
      },
    ],
    tree: [],
    limits: [],
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    roles: [],
    form: {
      name: "",
      code: "",
    },
    rule: {
      name: [(v) => !!v || "必填"],
      code: [(v) => (!!v && v.length <= 25) || "Max 25 characters"],
    },
    searchForm: {
      startTime: "",
      endTime: "",
    },
    select: [],
    wait: false,
    valid: true,
    amend: false,
    table: false,
    dialog: false,
    loading: false,
    saveloading: false,
    amendloading: false,
    deleteloading: false,
    load: false,
    startTime: false,
    endTime: false,
    downloading: false,
    resetdownloading: false,
  }),
  mounted() {
    this.myRole();
  },
  methods: {
    myRole() {
      this.table = true;
      const { page, limit } = this;
      this.$axios
        .get("/api-user/roles", {
          params: {
            page,
            limit,
          },
        })
        .then((res) => {
          if (res) {
            const { count, data } = res;
            this.total = count;
            this.roles = data;
          }
          this.table = false;
          this.loading = false;
        });
    },
    updatePage(value) {
      this.page = value;
      this.myRole();
    },
    updateItem(value) {
      this.limit = value;
      this.myRole();
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios.delete(`/api-user/roles/${this.select[0].id}`).then((res) => {
        if (res) {
          this.$notice.success("删除成功");
          this.select = [];
          this.myRole();
        }
        this.deleteloading = false;
      });
    },
    refresh() {
      this.loading = true;
      this.myRole();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    addRole() {
      this.dialog = true;
    },
    amendlimits() {
      if (!this.select[0]) {
        this.$notice.error("请选择配置项");
        return;
      }
      this.wait = true;
      const { id } = this.select[0];
      this.$axios.get(`/api-user/menus/${id}/menus`).then((res) => {
        if (res) {
          const { data } = res;
          this.limits = data;
          this.tree = [];
          const call = (res) => {
            for (const i of res) {
              if (i.subMenuRole[0]) {
                call(i.subMenuRole);
              } else {
                if (i.checked) {
                  this.tree.push(i);
                }
              }
            }
          };
          call(data);
          this.amend = true;
        }
        this.wait = false;
      });
    },
    amendClose() {
      this.amend = false;
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.saveloading = true;
        this.$axios
          .post("/api-user/roles/saveOrUpdate", {
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.close();
              this.page = 1;
              this.myRole();
              this.$notice.success("添加成功");
            }
            this.saveloading = false;
          });
      }
    },
    active(value) {
      this.tree = [...value];
    },
    amendSave() {
      this.amendloading = true;
      const { tree, select } = this;
      const { id: roleId } = select[0];
      const menuIds = tree.map((res) => {
        return res.id;
      });
      this.$axios
        .post("/api-user/menus/granted", {
          roleId,
          menuIds,
        })
        .then((res) => {
          if (res) {
            this.$notice.success("配置成功");
            this.amendClose();
          }
          this.amendloading = false;
        });
    },
    resetDown() {},
    download() {},
  },
};
</script>

<style lang="scss" scoped>
.role {
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
