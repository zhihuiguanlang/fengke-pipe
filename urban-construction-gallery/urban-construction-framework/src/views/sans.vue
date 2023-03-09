<template>
  <div class="sans">
    <div class="handle">
      <v-btn class="mr-3" outlined color="rgb(0,191,255)" @click="bind">
        <v-icon left v-text="'mdi-cards'" />绑定标签
      </v-btn>
      <v-btn class="mr-3" outlined color="light-green" @click="addInside">
        <v-icon left v-text="'mdi-plus'" />添加
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="edit">
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
                <v-text-field v-model="searchForm.name" label="姓名" />
                <v-text-field v-model="searchForm.phone" label="电话" />
                <v-text-field v-model="searchForm.location" label="目的地点" />
                <v-select
                  v-model="searchForm.status"
                  :items="term"
                  label="状态"
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
      width="178"
      height="18"
      color="cyan"
      class="alert"
      border="left"
      elevation="0"
      colored-border
      transition="scale-transition"
      >外部人员入廊记录</v-alert
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
        :items="sans"
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
        <template #item.visitStartTime="{ item }">
          {{ new Date(item.visitStartTime).toLocaleDateString() }}
        </template>
        <template #item.scheduleEndTime="{ item }">
          {{ new Date(item.scheduleEndTime).toLocaleDateString() }}
        </template>
        <template #item.groupApprovalTime="{ item }">
          {{ new Date(item.groupApprovalTime).toLocaleDateString() }}
        </template>
        <template #item.leaderApprovalTime="{ item }">
          {{ new Date(item.leaderApprovalTime).toLocaleDateString() }}
        </template>
        <template #item.status="{ item }">
          <v-chip
            :class="`${item.status != 0 || 'green lighten-1 white--text'}`"
            label
            >{{ status[item["status"]] }}</v-chip
          >
        </template>
      </v-data-table>
    </div>
    <!-- 绑定标签模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Gallery Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="form.name"
                label="入廊人员*"
                required
                disabled
              />
              <v-select
                v-model="form.lableId"
                :rules="rule.lableId"
                item-text="name"
                label="选择标签*"
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
    <!-- 添加入廊模态框 -->
    <v-dialog v-model="inside" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Gallery Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="sheet" v-model="check">
              <v-text-field
                :disabled="sheet.inspect"
                v-model="sheet.name"
                :rules="sheetRule.name"
                label="姓名*"
                required
              />
              <v-select
                :disabled="sheet.inspect"
                v-model="sheet.cardType"
                :rules="sheetRule.cardType"
                item-text="type"
                item-value="type"
                :items="cardType"
                label="证件类型*"
                required
              />
              <v-text-field
                :disabled="sheet.inspect"
                v-model="sheet.cardNumber"
                :rules="sheetRule.cardNumber"
                label="证件号*"
                required
              />
              <v-text-field
                :disabled="sheet.inspect"
                v-model="sheet.phone"
                :rules="sheetRule.phone"
                label="电话*"
                required
              />
              <v-text-field
                :disabled="sheet.inspect"
                v-model="sheet.location"
                :rules="sheetRule.location"
                label="目的地点*"
                required
              />
              <v-select
                :disabled="sheet.inspect"
                v-model="sheet.accompanyingPersonName"
                :rules="sheetRule.accompanyingPersonName"
                item-text="nickname"
                item-value="nickname"
                :items="accompanyingPersonName"
                @input="filter"
                label="陪同人*"
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
                    :disabled="sheet.inspect"
                    v-model="sheet.visitStartTime"
                    :rules="sheetRule.visitStartTime"
                    label="来访开始时间*"
                    v-on="on"
                    readonly
                    required
                  />
                </template>
                <v-date-picker @input="picker" v-model="sheet.visitStartTime" />
              </v-menu>
              <v-menu
                offset-y
                v-model="dating"
                min-width="290px"
                :nudge-right="40"
                transition="scale-transition"
                :close-on-content-click="false"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    :disabled="sheet.inspect"
                    v-model="sheet.scheduleEndTime"
                    :rules="sheetRule.scheduleEndTime"
                    label="规定结束时间*"
                    v-on="on"
                    readonly
                    required
                  />
                </template>
                <v-date-picker
                  @input="machine"
                  v-model="sheet.scheduleEndTime"
                />
              </v-menu>
              <v-select
                v-if="sheet.inspect"
                v-model="sheet.verify"
                :rules="sheetRule.verify"
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
          <v-btn color="blue darken-1" text @click="shut">关闭</v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="hold"
            :loading="insideloading"
            >保存</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "sans",
  data: () => ({
    headers: [
      {
        text: "姓名",
        align: "center",
        value: "name",
        width: 200,
      },
      {
        text: "证件类型",
        align: "center",
        value: "cardType",
        width: 200,
      },
      {
        text: "证件号",
        align: "center",
        value: "cardNumber",
        width: 200,
      },
      {
        text: "电话",
        align: "center",
        value: "phone",
        width: 200,
      },
      {
        text: "目的地点",
        align: "center",
        value: "location",
        width: 200,
      },
      {
        text: "来访开始时间",
        align: "center",
        value: "visitStartTime",
        width: 200,
      },
      {
        text: "规定结束时间",
        align: "center",
        value: "scheduleEndTime",
        width: 200,
      },
      {
        text: "陪同人",
        align: "center",
        value: "accompanyingPersonName",
        width: 200,
      },
      {
        text: "组长审批",
        align: "center",
        value: "groupApprovalName",
        width: 200,
      },
      {
        text: "组长审批时间",
        align: "center",
        value: "groupApprovalTime",
        width: 200,
      },
      {
        text: "部门领导审批",
        align: "center",
        value: "leaderApprovalName",
        width: 200,
      },
      {
        text: "部门领导审批时间",
        align: "center",
        value: "leaderApprovalTime",
        width: 200,
      },
      {
        text: "标签编号",
        align: "center",
        value: "lableId",
        width: 200,
      },
      {
        text: "状态",
        align: "center",
        value: "status",
        width: 200,
      },
    ],
    status: {
      0: "已提交申请",
      1: "组长已审批",
      2: "部门领导已审批",
      3: "人员离开",
      4: "驳回",
    },
    form: {
      name: "",
      lableId: "",
    },
    searchForm: {
      name: "",
      phone: "",
      status: "",
      location: "",
      startTime: "",
      endTime: "",
    },
    rule: {
      lableId: [(v) => !!v || "必填"],
    },
    sheet: {
      name: "",
      cardType: "",
      cardNumber: "",
      phone: "",
      location: "",
      accompanyingPersonName: "",
      accompanyingPersonId: "",
      visitStartTime: "",
      scheduleEndTime: "",
      verify: "",
    },
    sheetRule: {
      name: [(v) => !!v || "必填"],
      cardType: [(v) => !!v || "必填"],
      cardNumber: [(v) => !!v || "必填"],
      phone: [(v) => !!v || "必填"],
      location: [(v) => !!v || "必填"],
      accompanyingPersonName: [(v) => !!v || "必填"],
      scheduleEndTime: [(v) => !!v || "必填"],
      visitStartTime: [(v) => !!v || "必填"],
      verify: [(v) => !!v || "必填"],
    },
    term: [
      {
        text: "已提交申请",
        value: 0,
      },
      {
        text: "组长已审批",
        value: 1,
      },
      {
        text: "部门领导已审批",
        value: 2,
      },
      {
        text: "人员离开",
        value: 3,
      },
      {
        text: "驳回",
        value: 4,
      },
    ],
    cardType: [{ type: "身份证" }],
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
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    sans: [],
    list: [],
    select: [],
    accompanyingPersonName: [],
    date: false,
    dating: false,
    inside: false,
    check: true,
    menu: false,
    valid: true,
    table: false,
    dialog: false,
    loading: false,
    saveloading: false,
    resetloading: false,
    leaveloading: false,
    searchloading: false,
    deleteloading: false,
    insideloading: false,
    load: false,
    startTime: false,
    endTime: false,
    downloading: false,
    resetdownloading: false,
    leader: "", // 组长/领导权限
    roles: "", // 当前登录用户
  }),
  mounted() {
    this.mySans();
    this.myLable();
    this.query();
    this.personnel();
    this.role();
  },
  methods: {
    mySans() {
      this.table = true;
      const { page, limit, searchForm } = this;
      this.$axios
        .post("/api-ops/ExternalStaffPipe/page", {
          ...searchForm,
          page,
          limit,
        })
        .then((res) => {
          if (res) {
            const { total, records, current } = res.data;
            this.sans = records;
            this.total = total;
            this.current = current;
          }
          this.menu = false;
          this.table = false;
          this.loading = false;
          this.resetloading = false;
          this.searchloading = false;
        });
    },
    myLable() {
      this.$axios.post("/api-assets/LableManage/list").then((res) => {
        if (res) {
          this.list = res.data;
        }
      });
    },
    query() {
      this.$axios.get("/api-user/users/list").then((res) => {
        if (res) {
          this.accompanyingPersonName = res.data;
        }
      });
    },
    personnel() {
      this.$axios.get("/api-user/dept/deptUser").then((res) => {
        if (res) {
          this.leader = res.data.filter((n) => n.deptName == "运维部");
        }
      });
    },
    role() {
      this.$axios.get("/api-user/users/current").then((res) => {
        if (res) {
          this.roles = res.data.nickname;
        }
      });
    },
    inspecting() {
      if (!this.select[0]) {
        this.$notice.error("请选择审批项");
        return;
      }
      const group = this.leader[0].subDept[0].leader; // 组长
      const leader = this.leader[0].leader; // 领导
      if (this.roles == group && !this.select[0].leaderApprovalName) {
        if (this.select[0].status == (1 || 4)) {
          this.$notice.error("已完成审核");
          return;
        }
        this.sheet = {
          ...this.select[0],
          inspect: true,
        };
        this.inside = true;
        return;
      }
      if (this.roles == leader && this.select[0].groupApprovalName) {
        if (this.select[0].status == (2 || 4)) {
          this.$notice.error("已完成审核");
          return;
        }
        this.sheet = {
          ...this.select[0],
          inspect: true,
        };
        this.inside = true;
        return;
      }
      this.$notice.error("无权限审批入廊申请列表");
      return;
    },
    addInside() {
      delete this.sheet["id"];
      this.inside = true;
    },
    filter(value) {
      if (value)
        this.sheet.accompanyingPersonId = this.accompanyingPersonName.filter(
          (res) => res.nickname == value
        )[0].id;
    },
    edit() {
      if (!this.select[0]) {
        this.$notice.error("请选择编辑项");
        return;
      }
      this.sheet = {
        ...this.select[0],
        visitStartTime: new Date(
          this.select[0].visitStartTime + 60 * 60 * 24 * 1000
        )
          .toISOString()
          .slice(0, 10),
        scheduleEndTime: new Date(
          this.select[0].scheduleEndTime + 60 * 60 * 24 * 1000
        )
          .toISOString()
          .slice(0, 10),
      };
      this.inside = true;
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios
        .get(`/api-ops/ExternalStaffPipe/delete`, {
          params: {
            id: this.select[0].id,
          },
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.sheet = {};
            this.mySans();
          }
          this.deleteloading = false;
        });
    },
    shut() {
      delete this.sheet.inspect;
      this.inside = false;
      this.$refs.sheet.reset();
    },
    hold() {
      this.$refs.sheet.validate();
      if (this.check) {
        this.insideloading = true;
        const { id = null } = this.sheet;
        const http = id
          ? "/api-ops/ExternalStaffPipe/saveOrUpdate"
          : "/api-ops/ExternalStaffPipe/saveOrUpdate";
        const https = this.sheet.inspect
          ? "/api-ops/ExternalStaffPipe/audit"
          : http;
        const sheet = {
          ...this.sheet,
        };
        const sheets = this.sheet.inspect
          ? {
              id: this.sheet.id,
              verify: Number(this.sheet.verify) ? true : false,
            }
          : sheet;
        this.$axios.post(https, sheets).then((res) => {
          if (res) {
            this.$notice.success("操作成功");
            id || (this.page = 1);
            this.select = [];
            this.sheet = {};
            delete this.form.inspect;
            this.mySans();
            this.shut();
          }
          this.insideloading = false;
        });
      }
    },
    updatePage(value) {
      this.page = value;
      this.mySans();
    },
    updateItem(value) {
      this.limit = value;
      this.mySans();
    },
    bind() {
      if (!this.select[0]) {
        this.$notice.error("请选择绑定项");
        return;
      }
      this.form = {
        ...this.select[0],
      };
      this.dialog = true;
    },
    leave() {
      if (!this.select[0]) {
        this.$notice.error("请选择入廊人员");
        return;
      }
      this.leaveloading = true;
      this.$axios
        .get(`/api-ops/ExternalStaffPipe/theyLeft`, {
          params: {
            id: this.select[0].id,
          },
        })
        .then((res) => {
          if (res) {
            this.$notice.success("人员已离开");
            this.select = [];
            this.mySans();
          }
          this.leaveloading = false;
        });
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
          .post("/api-ops/ExternalStaffPipe/saveOrUpdate", {
            ...this.select[0],
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.$notice.success("绑定成功");
              this.select = [];
              this.form = {};
              this.mySans();
              this.close();
            }
            this.saveloading = false;
          });
      }
    },
    refresh() {
      this.loading = true;
      this.mySans();
    },
    reset() {
      this.$refs.searchForm.reset();
      this.resetloading = true;
      this.page = 1;
      this.mySans();
    },
    search() {
      this.searchloading = true;
      this.page = 1;
      this.mySans();
    },
    picker() {
      this.date = false;
    },
    machine() {
      this.dating = false;
    },
    resetDown() {},
    download() {},
  },
};
</script>

<style lang="scss" scoped>
.sans {
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
