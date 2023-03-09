<template>
  <div class="branch">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addBranch">
        <v-icon left v-text="'mdi-plus'" />
        添加部门
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="amendBranch">
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
      部门列表
    </v-alert>
    <div class="elevation-7">
      <el-table
        :tree-props="{ children: `subDept` }"
        :data="branch"
        row-key="id"
        border
      >
        <el-table-column
          align="center"
          prop="deptName"
          label="部门名称"
          min-width="200"
        />
        <el-table-column
          align="center"
          label="部门编码"
          prop="deptCode"
          min-width="200"
        />
        <el-table-column
          prop="leader"
          label="负责人"
          align="center"
          min-width="200"
        />
        <el-table-column
          align="center"
          min-width="200"
          label="部门描述"
          prop="deptDescribe"
        />
        <el-table-column width="45" align="center">
          <template slot-scope="scope">
            <v-checkbox
              light
              dense
              multiple
              class="my-2"
              v-model="select"
              style="height:30px;"
              @click="choice(scope.row)"
              color="rgba(0, 0, 0, 0.54)"
              :value="JSON.stringify(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加部门模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Branch Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-select
                v-model="form.parentId"
                :rules="rule.parentId"
                item-text="deptName"
                label="上级部门*"
                item-value="id"
                :items="boss"
                required
              />
              <v-text-field
                v-model="form.deptName"
                :rules="rule.deptName"
                label="部门名称*"
                required
              />
              <v-text-field
                v-model="form.leader"
                :rules="rule.leader"
                label="负责人*"
                required
              />
              <v-text-field
                v-model="form.phone"
                :rules="rule.phone"
                label="联系电话*"
                required
              />
              <v-text-field
                v-model="form.email"
                :rules="rule.email"
                label="邮箱*"
                required
              />
              <v-select
                v-model="form.status"
                :rules="rule.status"
                :items="status"
                label="部门状态*"
                required
              />
              <v-text-field
                v-model="form.deptCode"
                :rules="rule.deptCode"
                label="部门编码*"
                required
              />
              <v-textarea
                v-model="form.deptDescribe"
                :rules="rule.deptDescribe"
                label="部门描述*"
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
  name: "branch",
  data: () => ({
    boss: [],
    branch: [],
    status: [
      {
        text: "正常",
        value: 0,
      },
      {
        text: "停用",
        value: 1,
      },
    ],
    form: {
      deptName: "",
      leader: "",
      phone: "",
      email: "",
      status: "",
      parentId: "",
      deptCode: "",
      deptDescribe: "",
    },
    rule: {
      deptName: [(v) => !!v || "必填"],
      leader: [(v) => !!v || "必填"],
      phone: [(v) => !!v || "必填"],
      email: [(v) => !!v || "必填"],
      deptCode: [(v) => !!v || "必填"],
      status: [(v) => v === Number(v) || "必选"],
      parentId: [(v) => v === Number(v) || "必选"],
      deptDescribe: [(v) => (!!v && v.length <= 25) || "Max 25 characters"],
    },
    searchForm: {
      startTime: "",
      endTime: "",
    },
    select: [],
    valid: true,
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
    this.myBranch();
  },
  methods: {
    myBranch() {
      this.$axios.get("/api-user/dept/list").then((res) => {
        if (res) {
          this.branch = res.data;
          // 数据拼接
          this.boss = [
            {
              id: -1,
              deptName: "顶级部门",
            },
            ...this.branch,
          ];
        }
        this.loading = false;
      });
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios
        .delete(`/api-user/dept/removeById`, {
          params: {
            deptId: JSON.parse(this.select[0]).id,
          },
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.myBranch();
          }
          this.deleteloading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.myBranch();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    addBranch() {
      delete this.form["id"];
      this.dialog = true;
    },
    amendBranch() {
      if (!this.select[0]) {
        this.$notice.error("请选择编辑项");
        return;
      }
      this.form = {
        ...JSON.parse(this.select[0]),
      };
      this.dialog = true;
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.saveloading = true;
        this.$axios
          .post("/api-user/dept/saveOrUpdate", {
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.$notice.success("操作成功");
              this.select = [];
              this.myBranch();
              this.close();
            }
            this.saveloading = false;
          });
      }
    },
    choice(value) {
      this.select = [JSON.stringify(value)];
    },
    resetDown() {},
    download() {},
  },
};
</script>

<style lang="scss" scoped>
.branch {
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
