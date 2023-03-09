<template>
  <div class="indoor">
    <div class="handle">
      <v-btn class="mr-3" outlined color="rgb(0,191,255)" @click="bind">
        <v-icon left v-text="'mdi-cards'" />绑定标签
      </v-btn>
      <v-btn class="mr-3" outlined color="light-green" @click="look">
        <v-icon left v-text="'mdi-code-json'" />查看
      </v-btn>
      <v-btn class="mr-3" outlined color="light-green" @click="addIndoor">
        <v-icon left v-text="'mdi-plus'" />添加
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="amendIndoor">
        <v-icon left v-text="'mdi-pencil'" />编辑
      </v-btn>
      <v-btn class="mr-3" outlined color="teal" @click="inspecting">
        <v-icon left v-text="'mdi-calendar-search '" />审批
      </v-btn>
      <v-btn
        class="mr-3"
        color="error"
        @click="deleted"
        :loading="deleteloading"
      >
        <v-icon left v-text="'mdi-delete'" />删除
      </v-btn>
      <v-btn
        outlined
        class="mr-3"
        color="teal"
        @click="refresh"
        :loading="loading"
      >
        <v-icon left v-text="'mdi-cached'" />刷新
      </v-btn>
      <v-menu
        :close-on-content-click="false"
        :nudge-width="250"
        v-model="menu"
        offset-x
        light
      >
        <template #activator="{ on }">
          <v-btn class="mr-3" outlined color="cyan" v-on="on">
            <v-icon left v-text="'mdi-file-find'" />搜索
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-container>
              <v-form ref="searchForm">
                <v-select
                  v-model="searchForm.submitterUserId"
                  item-text="nickname"
                  item-value="id"
                  label="申请人"
                  :items="list"
                />
                <v-text-field
                  v-model="searchForm.pipeUserName"
                  label="入廊人员"
                />
                <v-select
                  v-model="searchForm.acceptUserId"
                  item-text="nickname"
                  item-value="nickname"
                  label="审批人"
                  :items="inspect"
                />
                <v-select
                  v-model="searchForm.status"
                  label="审批状态"
                  :items="term"
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
      >入廊申请列表</v-alert
    >
    <div class="elevation-7">
      <v-data-table
        light
        show-select
        fixed-header
        single-select
        calculate-width
        height="500"
        item-key="id"
        :items="indoor"
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
        <template #item.ruleDepartureTime="{ item }">
          {{ new Date(item.ruleDepartureTime).toLocaleDateString() }}
        </template>
        <template #item.status="{ item }">
          <v-chip label :class="`${item.status != 4 || 'error'}`">{{
            status[item["status"]]
          }}</v-chip>
        </template>
      </v-data-table>
    </div>
    <!-- 查看工单模态框 -->
    <v-dialog v-model="dialog" @click:outside="outside" light max-width="600px">
      <v-card>
        <v-card-text>
          <v-container>
            <v-tabs light v-model="tab">
              <v-tab>详情资料</v-tab>
              <v-tab>流程图</v-tab>
            </v-tabs>
            <v-tabs-items light v-if="select[0]" v-model="tab">
              <v-tab-item>
                <div class="mt-4">
                  <span class="_dialog_title">申请人 :</span>
                  <v-chip class="ml-2" label>{{
                    select[0].submitterName
                  }}</v-chip>
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">申请时间 :</span>
                  <v-chip class="ml-2" label>
                    {{
                      new Date(select[0].createTime + 60 * 60 * 24 * 1000)
                        .toISOString()
                        .slice(0, 10)
                    }}
                  </v-chip>
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">入廊人员 :</span>
                  <v-chip class="ml-2" label>{{
                    select[0].pipeUserName
                  }}</v-chip>
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">规定离开时间 :</span>
                  <v-chip class="ml-2" label>
                    {{
                      new Date(
                        select[0].ruleDepartureTime + 60 * 60 * 24 * 1000
                      )
                        .toISOString()
                        .slice(0, 10)
                    }}
                  </v-chip>
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">实际离开时间 :</span>
                  <v-chip class="ml-2" label>
                    {{
                      select[0].actualDepartureTime &&
                        new Date(
                          select[0].actualDepartureTime + 60 * 60 * 24 * 1000
                        )
                          .toISOString()
                          .slice(0, 10)
                    }}
                  </v-chip>
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">审批人 :</span>
                  <v-chip class="ml-2" label>{{
                    select[0].acceptUserName
                  }}</v-chip>
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">审批状态 :</span>
                  <v-chip class="ml-2" label>{{
                    status[select[0]["status"]]
                  }}</v-chip>
                </div>
              </v-tab-item>
              <v-tab-item>
                <v-img
                  contain
                  height="352"
                  class="mt-4"
                  max-width="528"
                  :src="`${http.system}/api-ops/staffpipe/getImage`"
                  :lazy-src="`${http.system}/api-ops/staffpipe/getImage`"
                >
                  <template v-slot:placeholder>
                    <v-row
                      align="center"
                      justify="center"
                      class="fill-height ma-0"
                    >
                      <v-progress-circular indeterminate color="grey" />
                    </v-row>
                  </template>
                </v-img>
              </v-tab-item>
            </v-tabs-items>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- 添加入廊模态框 -->
    <v-dialog v-model="gallery" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Gallery Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="form.pipeUserName"
                :rules="rule.pipeUserName"
                label="入廊人员*"
                required
              />
              <v-menu
                offset-y
                v-model="date"
                min-width="290px"
                :nudge-right="40"
                transition="scale-transition"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :disabled="form.inspect"
                    v-model="form.ruleDepartureTime"
                    :rules="rule.ruleDepartureTime"
                    label="规定离开时间*"
                    v-on="on"
                    readonly
                    required
                  />
                </template>
                <v-date-picker
                  @input="picker"
                  v-model="form.ruleDepartureTime"
                />
              </v-menu>
              <v-select
                :disabled="form.inspect"
                v-model="form.acceptUserId"
                :rules="rule.acceptUserId"
                item-text="nickname"
                item-value="id"
                label="审批人*"
                :items="inspect"
                required
              />
              <v-select
                v-if="form.inspect"
                v-model="form.fruit"
                :rules="rule.fruit"
                item-text="text"
                item-value="value"
                label="审核结果*"
                :items="examine"
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
    <!-- 绑定标签模态框 -->
    <v-dialog v-model="pag" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Gallery Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="label" v-model="mark">
              <v-text-field
                v-model="label.pipeUserName"
                label="入廊人员*"
                required
                disabled
              />
              <v-select
                v-model="label.lableId"
                :rules="rules.lableId"
                item-text="name"
                label="选择标签*"
                item-value="id"
                :items="labelData"
                required
              />
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closelabel">关闭</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="savelabel"
            :loading="savelabelloading"
            >保存</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import http from "@/assets/script/http";
export default {
  name: "indoor",
  data: () => ({
    http,
    headers: [
      {
        text: "申请人",
        align: "center",
        value: "submitterName",
        width: 200,
      },
      {
        text: "申请时间",
        align: "center",
        value: "createTime",
        width: 200,
      },
      {
        text: "入廊人员",
        align: "center",
        value: "pipeUserName",
        width: 200,
      },
      {
        text: "规定离开时间",
        align: "center",
        value: "ruleDepartureTime",
        width: 200,
      },
      {
        text: "审批人",
        align: "center",
        value: "acceptUserName",
        width: 200,
      },
      {
        text: "标签编号",
        align: "center",
        value: "lableId",
        width: 200,
      },
      {
        text: "审批状态",
        align: "center",
        value: "status",
        width: 200,
      },
    ],
    status: {
      0: "已提交",
      1: "已审批",
      2: "已复核",
      3: "已挂起",
      4: "已驳回",
    },
    term: [
      {
        text: "已提交",
        value: 0,
      },
      {
        text: "已审批",
        value: 1,
      },
      {
        text: "已复核",
        value: 2,
      },
      {
        text: "已挂起",
        value: 3,
      },
      {
        text: "已驳回",
        value: 4,
      },
    ],
    examine: [
      {
        text: "通过",
        value: "1",
      },
      {
        text: "未通过",
        value: "0",
      },
    ],
    form: {
      pipeUserName: "", //入廊人员
      acceptUserId: "", //审批人
      ruleDepartureTime: "", //规定离开时间
      fruit: "",
    },
    label: {
      pipeUserName: "",
      lableId: "",
    },
    searchForm: {
      status: "",
      pipeUserName: "",
      acceptUserId: "",
      submitterUserId: "",
      startTime: "",
      endTime: "",
    },
    rule: {
      pipeUserName: [(v) => !!v || "必填"],
      acceptUserId: [(v) => !!v || "必填"],
      ruleDepartureTime: [(v) => !!v || "必填"],
      status: [(v) => !!v || "必填"],
    },
    rules: {
      lableId: [(v) => !!v || "必填"],
    },
    tab: 0,
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    list: [],
    indoor: [],
    select: [],
    inspect: [],
    labelData: [],
    pag: false,
    date: false,
    menu: false,
    valid: true,
    mark: true,
    table: false,
    dialog: false,
    gallery: false,
    loading: false,
    saveloading: false,
    resetloading: false,
    deleteloading: false,
    searchloading: false,
    savelabelloading: false,
    load: false,
    startTime: false,
    endTime: false,
    downloading: false,
    resetdownloading: false,
    roles: "", // 当前登录用户
  }),
  mounted() {
    this.myUser();
    this.myIndoor();
    this.query();
    this.myLable();
    this.role();
  },
  methods: {
    query() {
      this.$axios.get("/api-user/dept/deptUser").then((res) => {
        if (res) {
          const child = res.data.filter((n) => n.deptName == "运维部")[0]
            .leader;
          const children = [];
          for (const e of res.data) {
            if (e.deptName == "总部" && e.subDept) {
              for (const u of e.subDept) {
                if (u.userInfo) {
                  children.push(...u.userInfo);
                }
              }
            }
          }
          this.inspect = children.filter((n) => n.nickname == child);
        }
      });
    },
    myIndoor() {
      this.table = true;
      const { page, limit, searchForm } = this;
      this.$axios
        .post("/api-ops/staffpipe/findAllByPage", {
          ...searchForm,
          page,
          limit,
        })
        .then((res) => {
          if (res) {
            const { total, records, current } = res.data;
            this.total = total;
            this.indoor = records;
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
          this.list = res.data;
        }
      });
    },
    myLable() {
      this.$axios.post("/api-assets/LableManage/list").then((res) => {
        if (res) {
          this.labelData = res.data;
        }
      });
    },
    inspecting() {
      if (!this.select[0]) {
        this.$notice.error("请选择审批项");
        return;
      }
      const { acceptUserName } = this.select[0];
      if (this.roles == acceptUserName) {
        if (this.select[0].status == (1 || 4)) {
          this.$notice.error("已完成审核");
          return;
        }
        this.form = {
          ...this.select[0],
          inspect: true,
        };
        this.gallery = true;
        return;
      }
      this.$notice.error("无权限审批入廊申请列表");
      return;
    },
    role() {
      this.$axios.get("/api-user/users/current").then((res) => {
        if (res) {
          this.roles = res.data.nickname;
        }
      });
    },
    bind() {
      if (!this.select[0]) {
        this.$notice.error("请选择绑定项");
        return;
      }
      this.label = {
        ...this.select[0],
      };
      this.pag = true;
    },
    updatePage(value) {
      this.page = value;
      this.myIndoor();
    },
    updateItem(value) {
      this.limit = value;
      this.myIndoor();
    },
    look() {
      if (!this.select[0]) {
        this.$notice.error("请选择查看项");
        return;
      }
      this.dialog = true;
    },
    outside() {
      this.select = [];
    },
    addIndoor() {
      delete this.form["id"];
      this.gallery = true;
    },
    amendIndoor() {
      if (!this.select[0]) {
        this.$notice.error("请选择编辑项");
        return;
      }
      this.form = {
        ...this.select[0],
        ruleDepartureTime: new Date(
          this.select[0].ruleDepartureTime + 60 * 60 * 24 * 1000
        )
          .toISOString()
          .slice(0, 10),
      };
      this.gallery = true;
    },
    close() {
      delete this.form.inspect;
      this.gallery = false;
      this.$refs.form.reset();
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.saveloading = true;
        const {
          id = null,
          pipeUserName,
          acceptUserId,
          ruleDepartureTime,
        } = this.form;
        const acceptUserName = this.inspect.filter(
          (res) => res.id == this.form.acceptUserId
        )[0].nickname;
        const http = id ? "/api-ops/staffpipe/edit" : "/api-ops/staffpipe/add";
        const https = this.form.inspect ? "/api-ops/staffpipe/audit" : http;
        const form = {
          id,
          pipeUserName,
          acceptUserId,
          ruleDepartureTime,
          acceptUserName,
        };
        const forms = this.form.inspect
          ? {
              id: this.form.id,
              verify: Number(this.form.fruit) ? true : false,
            }
          : form;
        this.$axios.post(https, forms).then((res) => {
          if (res) {
            this.$notice.success("操作成功");
            id || (this.page = 1);
            this.select = [];
            delete this.form.inspect;
            this.myIndoor();
            this.close();
          }
          this.saveloading = false;
        });
      }
    },
    closelabel() {
      this.pag = false;
      this.$refs.label.reset();
    },
    savelabel() {
      this.$refs.label.validate();
      if (this.mark) {
        this.savelabelloading = true;
        const { id = null, lableId } = this.label;
        this.$axios
          .post("/api-ops/staffpipe/edit", {
            id,
            lableId,
          })
          .then((res) => {
            if (res) {
              this.$notice.success("操作成功");
              id || (this.page = 1);
              this.select = [];
              this.myIndoor();
              this.closelabel();
            }
            this.savelabelloading = false;
          });
      }
    },
    refresh() {
      this.loading = true;
      this.myIndoor();
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      const { id } = this.select[0];
      this.deleteloading = true;
      this.$axios
        .post(`/api-ops/staffpipe/delete`, {
          id,
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.myIndoor();
          }
          this.deleteloading = false;
        });
    },
    reset() {
      this.$refs.searchForm.reset();
      this.resetloading = true;
      this.page = 1;
      this.myIndoor();
    },
    search() {
      this.searchloading = true;
      this.page = 1;
      this.myIndoor();
    },
    picker() {
      this.date = false;
    },
    resetDown() {},
    download() {},
  },
};
</script>

<style lang="scss" scoped>
.indoor {
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
._dialog_title {
  width: 100px;
  text-align: right;
  display: inline-block;
}
</style>
