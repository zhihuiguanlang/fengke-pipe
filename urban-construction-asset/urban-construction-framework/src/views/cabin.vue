<template>
  <div class="cabin">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addCabin">
        <v-icon left v-text="'mdi-plus'" />
        添加舱体
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="amendCabin">
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
      舱体列表
    </v-alert>
    <div class="elevation-7">
      <el-table
        :data="cabin"
        row-key="id"
        border
        :tree-props="{ children: 'subSpaceManage' }"
      >
        <el-table-column
          prop="name"
          label="名称"
          align="center"
          min-width="200"
        />
        <el-table-column
          label="位置"
          align="center"
          prop="location"
          min-width="200"
        />
        <el-table-column
          label="长度"
          align="center"
          min-width="200"
          prop="spaceLength"
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
    <!-- 添加舱体模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Cabin Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="form.name"
                :rules="rule.name"
                label="名称*"
                required
              />
              <v-text-field
                v-model="form.location"
                :rules="rule.location"
                label="位置*"
                required
              />
              <v-text-field
                v-model="form.spaceLength"
                :rules="rule.spaceLength"
                label="长度*"
                required
              />
              <v-select
                v-model="form.parentId"
                :rules="rule.parentId"
                item-text="name"
                label="所属舱体*"
                item-value="id"
                :items="list"
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
  name: "cabin",
  data: () => ({
    form: {
      name: "",
      location: "",
      parentId: "",
      spaceLength: "",
    },
    rule: {
      name: [(v) => !!v || "必填"],
      location: [(v) => !!v || "必填"],
      parentId: [(v) => !!v || "必填"],
      spaceLength: [(v) => !!v || "必填"],
    },
    searchForm: {
      startTime: "",
      endTime: "",
    },
    list: [],
    cabin: [],
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
    this.mylist();
    this.myCabin();
  },
  methods: {
    myCabin() {
      this.$axios.post("/device-center/SpaceManage/list").then((res) => {
        if (res) {
          this.cabin = res.data;
        }
        this.loading = false;
      });
    },
    mylist() {
      this.$axios.post("/device-center/SpaceManage/parentList").then((res) => {
        if (res) {
          this.list = [
            {
              id: -1,
              name: "顶级舱体",
            },
            ...res.data,
          ];
        }
      });
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios
        .get(`/device-center/SpaceManage/delete`, {
          params: {
            id: JSON.parse(this.select[0]).id,
          },
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.myCabin();
          }
          this.deleteloading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.myCabin();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    addCabin() {
      delete this.form["id"];
      this.dialog = true;
    },
    amendCabin() {
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
          .post("/device-center/SpaceManage/saveOrUpdate", {
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.$notice.success("操作成功");
              this.select = [];
              this.myCabin();
              this.mylist();
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
.cabin {
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
  ::v-deep .el-table td,
  .el-table th {
    padding: 6px 0 !important;
  }
}
</style>
