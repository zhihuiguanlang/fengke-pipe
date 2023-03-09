<template>
  <div class="dangerous">
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
      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="200" light offset-x>
        <template v-slot:activator="{ on }">
          <v-btn class="mr-3" outlined color="cyan" v-on="on">
            <v-icon left v-text="'mdi-file-find'" />搜索
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-container>
              <v-form ref="searchForm">
                <v-text-field v-model="searchForm.riskObject" label="危险对象" />
                <v-select
                  item-text="nickname"
                  item-value="nickname"
                  v-model="searchForm.responsible"
                  :items="responsible"
                  label="责任人*"
                />
                <v-select
                  item-text="name"
                  item-value="id"
                  v-model="searchForm.spaceId"
                  :items="capsuleSpace"
                  @input="comeUp"
                  label="设备所在舱体*"
                />
                <v-select
                  item-text="type"
                  item-value="type"
                  v-model="searchForm.deviceType"
                  :items="deviceType"
                  @input="infocu"
                  label="设备类型*"
                />
                <v-select
                  item-text="plcName"
                  item-value="plcName"
                  v-model="searchForm.plc"
                  :items="plc"
                  label="设备所属PLC*"
                />
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="reset" :loading="resetloading">Reset</v-btn>
            <v-btn text @click="search" color="primary" :loading="searchloading">Search</v-btn>
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
    >危险源管理列表</v-alert>
    <div class="elevation-7">
      <el-table
        lazy
        border
        row-key="id"
        ref="theTable"
        highlight-current-row
        :load="load"
        :data="fixation"
        :tree-props="{ children: 'subSpaceManage', hasChildren: 'hasChildren' }"
      >
        <el-table-column width="45" align="center">
          <template slot-scope="scope">
            <v-checkbox
              light
              dense
              multiple
              class="my-2"
              v-model="select"
              @click="choice(scope.row)"
              color="rgba(0, 0, 0, 0.54)"
              v-if="`threshold` in scope.row"
              :value="JSON.stringify(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="所在舱体" align="center" min-width="200" />
        <el-table-column prop="responsible" label="责任人" align="center" min-width="200" />
        <el-table-column prop="reportTime" label="上报时间" align="center" min-width="200" />
        <el-table-column prop="riskLevel" label="危险等级" align="center" min-width="200" />
        <el-table-column prop="deviceType" label="设备类型" align="center" min-width="200" />
        <el-table-column prop="capsuleSpaces" label="设备所在舱体" align="center" min-width="200" />
        <el-table-column prop="plc" label="设备所属PLC" align="center" min-width="200" />
        <el-table-column prop="riskDescription" label="危险因素" align="center" min-width="200" />
        <el-table-column prop="riskObject" label="危险对象" align="center" min-width="200" />
      </el-table>
    </div>
    <!-- 模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">添加危险源</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="form.riskObject"
                :rules="rule.riskObject"
                label="危险对象*"
                required
              />
              <v-select
                item-text="name"
                item-value="id"
                v-model="form.capsuleSpace"
                :rules="rule.capsuleSpace"
                :items="capsuleSpace"
                label="所在舱体*"
                @input="filter"
                required
              />
              <v-select
                item-text="name"
                item-value="id"
                v-model="form.capsuleId"
                :rules="rule.capsuleId"
                :items="capsuleId"
                label="所在舱体区域*"
                @input="region"
                required
              />
              <v-select
                item-text="type"
                item-value="type"
                v-model="form.deviceType"
                :rules="rule.deviceType"
                :items="deviceType"
                label="设备类型*"
                @input="retype"
                required
              />
              <v-select
                item-text="plcName"
                item-value="plcName"
                v-model="form.plc"
                :rules="rule.plc"
                :items="plc"
                label="所属PLC设备*"
                required
              />
              <v-select
                item-text="title"
                item-value="value"
                v-model="form.riskLevel"
                :rules="rule.riskLevel"
                :items="riskLevel"
                label="危险等级*"
                required
              />
              <v-select
                item-text="nickname"
                item-value="nickname"
                v-model="form.responsible"
                :rules="rule.responsible"
                :items="responsible"
                label="责任人*"
                required
              />
              <v-text-field
                v-model="form.riskDescription"
                :rules="rule.riskDescription"
                label="危险描述*"
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
  </div>
</template>

<script>
import { items, headers } from "@/assets/script/mock";
export default {
  name: "dangerous",
  data: () => ({
    fixation: [],
    plan: [],
    items,
    headers,
    deleteloading: false,
    loading: false,
    table: false,
    saveloading: false,
    dialog: false,
    valid: true,
    menu: false,
    resetloading: false,
    searchloading: false,
    expanded: [],
    singleExpand: false,
    wait: false,
    page: 1,
    limit: 10,
    searchForm: {
      riskObject: "",
      responsible: "",
      capsuleId: "",
      deviceType: "",
      plc: ""
    },
    form: {
      riskObject: "",
      deviceType: "",
      capsuleId: "",
      capsuleSpace: "",
      plc: "",
      riskLevel: "",
      responsible: "",
      riskDescription: ""
    },
    rule: {
      riskObject: [v => !!v || "必填"],
      deviceType: [v => !!v || "必填"],
      capsuleId: [v => !!v || "必填"],
      capsuleSpace: [v => !!v || "必填"],
      plc: [v => !!v || "必填"],
      riskLevel: [v => !!v || "必填"],
      responsible: [v => !!v || "必填"],
      riskDescription: [v => !!v || "必填"]
    },
    deviceType: [],
    capsuleId: [],
    capsuleSpace: [],
    plc: [],
    responsible: [],
    riskLevel: [
      { title: "一级", value: 1 },
      { title: "二级", value: 2 },
      { title: "三级", value: 3 },
      { title: "四级", value: 4 },
      { title: "五级", value: 5 }
    ],
    select: []
  }),
  mounted() {
    this.searchForm = {};
    this.myChild();
    this.device();
    this.create();
  },
  methods: {
    query() {
      this.table = true;
      const { page, limit } = this;
      this.$axios
        .post("/dataManage/riskSource/getRiskSource", {
          page,
          limit,
          ...this.searchForm
        })
        .then(res => {
          if (res) {
            if (res.result.list) {
              for (const i of this.capsuleSpace) {
                for (const e of res.result.list) {
                  if (i.id == e.capsuleSpace) {
                    e.capsuleSpaces = i.name;
                    e.threshold = true;
                  }
                }
              }
              this.fixation = res.result.list;
            }
          }
          this.table = false;
          this.loading = false;
          this.resetloading = false;
          this.searchloading = false;
          this.wait = true;
        });
    },
    myChild() {
      this.table = true;
      this.$axios.post("/dataManage/riskSource/getCapsule", {}).then(res => {
        if (res) {
          for (const i of res.result) {
            if (i.subSpaceManage) {
              for (const e of i.subSpaceManage) {
                e.hasChildren = true;
              }
            }
          }
          this.fixation = res.result;
          this.table = false;
          this.loading = false;
          this.resetloading = false;
          this.searchloading = false;
        }
      });
    },
    create() {
      this.$axios.get("/api-user/users/list", {}).then(res => {
        if (res) {
          this.responsible = res.data;
        }
      });
    },
    device() {
      this.table = true;
      this.loading = true;
      this.resetloading = true;
      this.searchloading = true;
      this.$axios.post("/device-center/device/list", {}).then(res => {
        if (res) {
          this.capsuleSpace = res.data;
        }
        this.table = false;
        this.loading = false;
        this.resetloading = false;
        this.searchloading = false;
      });
    },
    filter(e) {
      this.capsuleId = [];
      this.form.capsuleId = null;
      this.deviceType = [];
      this.form.deviceType = null;
      this.plc = [];
      this.form.plc = null;
      for (const i of this.capsuleSpace) {
        if (e == i.id && i.subSpaceManage) {
          this.capsuleId = i.subSpaceManage;
        }
      }
    },
    region(e) {
      this.deviceType = [];
      this.form.deviceType = null;
      this.plc = [];
      this.form.plc = null;
      for (const i of this.capsuleId) {
        if (e == i.id && i.children) {
          this.deviceType = i.children;
        }
      }
    },
    retype() {
      this.plc = [];
      this.form.plc = null;
      if (this.deviceType.length) {
        for(const e of this.deviceType){
          if(e.plcName){
            this.plc.push(e)
          }
        }
      }
    },
    comeUp(e) {
      this.deviceType = [];
      this.searchForm.deviceType = null;
      this.plc = [];
      this.searchForm.plc = null;
      const children = [];
      for (const i of this.capsuleSpace) {
        if (e == i.id && i.subSpaceManage) {
          for (const e of i.subSpaceManage) {
            if (e.children) {
              children.push(...e.children);
            }
          }
        }
      }
      this.deviceType = children;
    },
    infocu() {
      const plc = [];
      if (this.deviceType.length) {
        for(const e of this.deviceType){
          if(e.plcName){
            plc.push(e)
          }
        }
      }
      this.plc = plc;
      this.searchForm.plc = null;
    },
    choice(value) {
      this.select = [JSON.stringify(value)];
    },
    addHost() {
      delete this.form["id"];
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.saveloading = true;
        this.$axios
          .post("/dataManage/riskSource/addOrUpdateRiskSource", {
            ...this.form
          })
          .then(res => {
            if (res) {
              this.close();
              if (this.wait) {
                this.query();
              } else {
                this.myChild();
              }
              this.select = [];
              this.$notice.success("操作成功");
            }
            this.saveloading = false;
          });
      }
    },
    amendHost() {
      if (!this.select[0]) {
        this.$notice.error("请先选择设备");
        return;
      }
      this.filter(JSON.parse(this.select[0]).capsuleSpace);
      this.region(JSON.parse(this.select[0]).capsuleId);
      this.retype();
      delete JSON.parse(this.select[0]).subSpaceManage;
      this.form = {
        ...JSON.parse(this.select[0])
      };
      this.form.capsuleSpace = Number(this.form.capsuleSpace);
      this.dialog = true;
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios
        .post(`/dataManage/riskSource/deleteRiskSource`, {
          id: JSON.parse(this.select[0]).id
        })
        .then(res => {
          if (res) {
            for (const [idx, i] of this.fixation.entries()) {
              if (i.subSpaceManage) {
                for (const e of i.subSpaceManage) {
                  if (e.subSpaceManage) {
                    for (const [index, u] of e.subSpaceManage.entries()) {
                      if (JSON.parse(this.select[0]).id == u.id) {
                        e.subSpaceManage.splice(index, 1);
                        e.hasChildren = true;
                        if (!e.subSpaceManage.length) {
                          e.subSpaceManage = null;
                          e.hasChildren = false;
                        }
                      }
                    }
                  }
                }
              }
              if (JSON.parse(this.select[0]).id == i.id) {
                this.fixation.splice(idx, 1);
              }
            }
            this.$notice.success("删除成功");
            this.select = [];
          }
          this.deleteloading = false;
        });
    },
    refresh() {
      this.loading = true;
      if (this.wait) {
        this.query();
        return;
      }
      this.myChild();
    },
    reset() {
      this.$refs.searchForm.reset();
      this.resetloading = true;
      this.page = 1;
      this.wait = false;
      this.myChild();
    },
    search() {
      this.searchloading = true;
      this.page = 1;
      this.query();
    },
    load(tree, treeNode, resolve) {
      const { page, limit } = this;
      const capsuleId = tree.id;
      this.$axios
        .post("/dataManage/riskSource/getRiskSource", {
          page,
          limit,
          capsuleId
        })
        .then(res => {
          if (res) {
            for (const i of this.fixation) {
              if (i.subSpaceManage) {
                for (const e of i.subSpaceManage) {
                  if (capsuleId == e.id) {
                    e.hasChildren = false;
                    if (res.result.list.length) {
                      e.subSpaceManage = res.result.list.map(n => {
                        for (const e of this.capsuleSpace) {
                          if (e.id == n.capsuleSpace) {
                            n.capsuleSpaces = e.name;
                            n.threshold = true;
                          }
                        }
                        n.hasChildren = false;
                        return n;
                      });
                    } else {
                      e.subSpaceManage = [];
                      this.$notice.normal("没有更多内容了");
                    }
                    resolve([]);
                  }
                }
              }
            }
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.dangerous {
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
  ::v-deep .el-table__row .cell{
    height: 20px!important;
  }
  ::v-deep .el-table__expand-icon {
    position: absolute!important;
    left: 25%!important;
  }
}
body .dangerous .v-input--checkbox{
  margin-top: -24px!important;
}
</style>
