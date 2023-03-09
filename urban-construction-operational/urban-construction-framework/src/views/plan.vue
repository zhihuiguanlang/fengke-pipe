<template>
  <div class="plan">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addHost">
        <v-icon left v-text="'mdi-plus'" />添加运维计划
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="amendHost">
        <v-icon left v-text="'mdi-pencil'" />编辑
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
        v-model="menu"
        :close-on-content-click="false"
        :nudge-width="200"
        light
        offset-x
      >
        <template v-slot:activator="{ on }">
          <v-btn class="mr-3" outlined color="cyan" v-on="on">
            <v-icon left v-text="'mdi-file-find'" />搜索
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-container>
              <v-form ref="searchForm">
                <v-text-field v-model="searchForm.name" label="计划名称" />
                <v-text-field v-model="searchForm.content" label="计划内容" />
                <v-text-field v-model="searchForm.site" label="地点" />
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
      >运维计划列表</v-alert
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
        :items="host"
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
    <!-- 模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Plan Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="form.name"
                :rules="rule.name"
                label="计划名称*"
                required
              />
              <v-text-field
                v-model="form.content"
                :rules="rule.content"
                label="计划内容*"
                required
              />
              <v-text-field
                v-model="form.site"
                :rules="rule.site"
                label="地点*"
                required
              />
              <v-select
                v-if="!form.id"
                item-text="title"
                item-value="value"
                v-model="form.cyclesType"
                :rules="rule.cyclesType"
                :items="type"
                label="循环类型*"
                required
              />
              <v-text-field
                v-if="!form.id && form.cyclesType"
                v-model="form.cyclesTime"
                :rules="rule.cyclesTime"
                :label="
                  form.cyclesType == '1' ? `循环时间 (单位：天)*` : `循环时间*`
                "
                required
              />
              <v-select
                v-if="!form.id"
                item-text="name"
                item-value="id"
                v-model="form.workorderTemplateId"
                :rules="rule.workorderTemplateId"
                :items="wokerorder"
                @change="filter"
                label="工单类型*"
                required
              />
              <v-text-field
                v-if="!form.id"
                @click="startTimes('start')"
                v-model="form.planStartTime"
                :rules="rule.planStartTime"
                label="计划开始时间*"
                required
              />
              <v-text-field
                v-if="!form.id"
                @click="startTime('end')"
                v-model="form.planEndTime"
                :rules="rule.planEndTime"
                label="计划完成时间*"
                required
              />
              <!-- 时间弹框 -->
              <v-dialog
                ref="dialog"
                v-model="modal"
                :return-value.sync="date"
                persistent
                width="290px"
              >
                <template>
                  <v-date-picker
                    v-model="date"
                    scrollable
                    v-if="yearDisplay"
                    :allowed-dates="allowedDates"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal = false"
                      >Cancel</v-btn
                    >
                    <v-btn text color="primary" @click="years()">OK</v-btn>
                  </v-date-picker>
                  <v-time-picker
                    v-if="minuteDisplay"
                    v-model="times"
                    full-width
                    format="24hr"
                  >
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal = false"
                      >Cancel</v-btn
                    >
                    <v-btn text col or="primary" @click="minute(startEnd)"
                      >OK</v-btn
                    >
                  </v-time-picker>
                </template>
              </v-dialog>
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
  name: "plan",
  data: () => ({
    headers: [
      {
        text: "计划名称",
        align: "center",
        value: "name",
        width: 200,
      },
      {
        text: "计划内容",
        align: "center",
        value: "content",
        width: 200,
      },
      {
        text: "地点",
        align: "center",
        value: "site",
        width: 200,
      },
      {
        text: "计划当前状态",
        align: "center",
        value: "statu",
        width: 200,
      },
      {
        text: "计划类型",
        align: "center",
        value: "types",
        width: 200,
      },
      {
        text: "计划开始时间",
        align: "center",
        value: "planStartTimes",
        width: 200,
      },
      {
        text: "计划完成时间",
        align: "center",
        value: "planEndTimes",
        width: 200,
      },
      {
        text: "制定计划人姓名",
        align: "center",
        value: "formulateName",
        width: 200,
      },
    ],
    state: ["已计划开始", "已完成"],
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    host: [],
    select: [],
    form: {
      name: "",
      content: "",
      site: "",
      cyclesType: "",
      cyclesTime: "",
      workorderTemplateId: "",
      type: "",
      planStartTime: "",
      planEndTime: "",
    },
    date: "",
    times: "",
    modal: false,
    yearDisplay: false,
    minuteDisplay: false,
    startEnd: "",
    searchForm: {
      name: "",
      content: "",
      site: "",
      startTime: "",
      endTime: "",
    },
    rule: {
      name: [(v) => !!v || "必填"],
      content: [(v) => !!v || "必填"],
      site: [(v) => !!v || "必填"],
      cyclesType: [(v) => !!v || "必填"],
      cyclesTime: [(v) => !!v || "必填"],
      workorderTemplateId: [(v) => !!v || "必填"],
      planStartTime: [(v) => !!v || "必填"],
      planEndTime: [(v) => !!v || "必填"],
    },
    type: [
      { title: "按天循环", value: "1" },
      { title: "定时触发", value: "2", disabled: true },
    ],
    plan: ["保洁", "巡检", "维修", "监控"],
    cut: {
      管廊保洁: "1",
      管廊巡检: "2",
      运维监控: "4",
    },
    wokerorder: [],
    valid: true,
    table: false,
    dialog: false,
    loading: false,
    saveloading: false,
    deleteloading: false,
    menu: false,
    resetloading: false,
    searchloading: false,
    load: false,
    startTime: false,
    endTime: false,
    downloading: false,
    resetdownloading: false,
  }),
  mounted() {
    this.myHost();
    this.query();
  },
  methods: {
    startTimes(startEnd) {
      this.startEnd = startEnd;
      this.modal = true;
      this.yearDisplay = true;
      this.minuteDisplay = false;
    },
    years() {
      this.modal = true;
      this.yearDisplay = false;
      this.minuteDisplay = true;
    },
    minute(startEnd) {
      this.modal = false;
      this.yearDisplay = false;
      this.minuteDisplay = false;
      this.$refs.dialog.save(this.date);
      if (startEnd == "start")
        this.form.planStartTime = this.date + " " + this.times + ":00";
      if (startEnd == "end")
        this.form.planEndTime = this.date + " " + this.times + ":00";
    },
    allowedDates(val) {
      return Date.parse(val) > Date.now() - 8.64e7;
    },
    myHost() {
      this.table = true;
      const { page, limit, searchForm } = this;
      const { name, content, site } = searchForm;
      this.$axios
        .post("/ops-center/operationplan/page", {
          page,
          limit,
          name,
          content,
          site,
        })
        .then((res) => {
          if (res) {
            const { total, records, current } = res.data;
            this.total = total;
            const record = records.map((n) => {
              n.statu = this.state[n.status];
              n.planStartTimes = this.formatDateTime(n.planStartTime);
              n.planEndTimes = this.formatDateTime(n.planEndTime);
              n.types = this.plan[Number(n.type) - 1];
              return n;
            });
            this.host = record;
            this.current = current;
          }
          this.menu = false;
          this.table = false;
          this.loading = false;
          this.resetloading = false;
          this.searchloading = false;
        });
    },
    query() {
      this.$axios
        .post("/ops-center/workorderTemplate/list", {
          repair: true,
        })
        .then((res) => {
          if (res) {
            this.wokerorder = res.data;
          }
        });
    },
    filter(value) {
      for (const i of this.wokerorder) {
        if (i.id == value) {
          for (const u in this.cut) {
            if (u == i.name) {
              this.form.type = this.cut[u];
            }
          }
        }
      }
    },
    updatePage(value) {
      this.page = value;
      this.myHost();
    },
    updateItem(value) {
      this.limit = value;
      this.myHost();
    },
    addHost() {
      delete this.form["id"];
      this.dialog = true;
    },
    close() {
      this.form = {};
      this.dialog = false;
      this.$refs.form.reset();
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        if (!this.form.id) {
          const { planStartTime, planEndTime } = this.form;
          if (
            new Date(planStartTime).getTime() >= new Date(planEndTime).getTime()
          ) {
            this.form.planEndTime = null;
            this.$notice.error("完成时间应大于开始时间");
            return;
          }
        }
        delete this.form.statu;
        const { id = null } = this.form;
        this.saveloading = true;
        const planUrl = !this.form.id
          ? "/ops-center/operationplan/save"
          : "/ops-center/operationplan/update";
        this.$axios
          .post(planUrl, {
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.$notice.success("操作成功");
              id || (this.page = 1);
              this.select = [];
              this.form = {};
              this.myHost();
              this.close();
            }
            this.saveloading = false;
          });
      }
    },
    amendHost() {
      if (!this.select[0]) {
        this.$notice.error("请选择编辑项");
        return;
      }
      this.form = {
        ...this.select[0],
      };
      this.dialog = true;
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios
        .get(`/ops-center/operationplan/delete`, {
          params: {
            id: this.select[0].id,
          },
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.myHost();
          }
          this.deleteloading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.myHost();
    },
    reset() {
      this.$refs.searchForm.reset();
      this.resetloading = true;
      this.page = 1;
      this.myHost();
    },
    search() {
      this.searchloading = true;
      this.page = 1;
      this.myHost();
    },
    formatDateTime(inputTime) {
      let date = new Date(inputTime);
      let Y = date.getFullYear();
      let M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    },
    resetDown() {},
    download() {},
  },
};
</script>

<style lang="scss" scoped>
.plan {
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
