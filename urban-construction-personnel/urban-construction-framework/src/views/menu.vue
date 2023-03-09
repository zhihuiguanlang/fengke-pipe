<template>
  <div class="menus">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addMenu">
        <v-icon left v-text="'mdi-plus'" />
        添加菜单
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="amendMenu">
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
      菜单列表
    </v-alert>
    <div class="elevation-7">
      <el-table
        :tree-props="{ children: `subMenus` }"
        :data="menu"
        row-key="id"
        border
      >
        <el-table-column
          prop="name"
          align="center"
          label="菜单名称"
          min-width="200"
        />
        <el-table-column
          prop="url"
          align="center"
          label="菜单URL"
          min-width="200"
        />
        <el-table-column
          prop="path"
          align="center"
          label="菜单PATH"
          min-width="200"
        />
        <el-table-column
          prop="css"
          label="样式"
          align="center"
          min-width="200"
        />
        <el-table-column
          label="方法"
          align="center"
          min-width="200"
          prop="pathMethod"
        />
        <el-table-column label="类型" align="center" min-width="200">
          <template slot-scope="scope">
            <v-chip light label>
              {{ status[scope.row.type] }}
            </v-chip>
          </template>
        </el-table-column>
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
    <!-- 添加菜单模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Menu Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="form.name"
                :rules="rule.name"
                label="菜单名称*"
                required
              />
              <v-text-field
                v-model="form.url"
                :rules="rule.url"
                label="菜单URL*"
                required
              />
              <v-text-field
                v-model="form.path"
                :rules="rule.path"
                label="菜单PATH*"
                required
              />
              <v-text-field
                v-model="form.pathMethod"
                :rules="rule.pathMethod"
                label="请求方法*"
                required
              />
              <v-select
                v-model="form.type"
                :rules="rule.type"
                :items="type"
                label="类型*"
                required
              />
              <v-select
                v-model="form.parentId"
                :rules="rule.parentId"
                label="上级菜单*"
                item-text="name"
                item-value="id"
                :items="boss"
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
  name: "menus",
  data: () => ({
    menu: [],
    boss: [],
    status: {
      1: "菜单路径",
      2: "接口资源",
    },
    type: [
      {
        text: "菜单路径",
        value: 1,
      },
      {
        text: "接口资源",
        value: 2,
      },
    ],
    form: {
      name: "",
      url: "",
      type: "",
      path: "",
      parentId: "",
      pathMethod: "",
    },
    rule: {
      name: [(v) => !!v || "必填"],
      url: [(v) => !!v || "必填"],
      type: [(v) => !!v || "必填"],
      path: [(v) => !!v || "必填"],
      parentId: [(v) => !!v || "必选"],
      pathMethod: [(v) => !!v || "必填"],
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
    this.myMenu();
  },
  methods: {
    myMenu() {
      this.$axios.get("/api-user/menus/findAlls").then((res) => {
        if (res) {
          this.menu = res.data;
          // 数据拼接
          this.boss = [
            {
              id: -1,
              name: "顶级目录",
            },
            ...this.menu,
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
        .delete(`/api-user/menus/delete`, {
          params: {
            id: JSON.parse(this.select[0]).id,
          },
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.myMenu();
          }
          this.deleteloading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.myMenu();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    addMenu() {
      delete this.form["id"];
      this.dialog = true;
    },
    amendMenu() {
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
          .post("/api-user/menus/saveOrUpdate", {
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.$notice.success("操作成功");
              this.select = [];
              this.myMenu();
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
.menus {
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
