<template>
  <div class="accept">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="look">
        <v-icon left v-text="'mdi-code-json'" />
        查看
      </v-btn>
      <v-btn
        class="mr-3"
        outlined
        color="cyan"
        @click="resolve"
        :loading="resolveloading"
      >
        <v-icon left v-text="'mdi-marker'" />
        完结
      </v-btn>
      <v-btn
        class="mr-3"
        color="error"
        @click="reject"
        :loading="rejectloading"
      >
        <v-icon left v-text="'mdi-marker-cancel'" />
        驳回
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="deliver">
        <v-icon left v-text="'mdi-account-convert'" />
        转交
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
      工单信息列表
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
        :items="accept"
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
        <template #item.status="{ item }">
          <v-chip label :class="`${item.status != 4 || 'error'}`">
            {{ status[item["status"]] }}
          </v-chip>
        </template>
      </v-data-table>
    </div>
    <!-- 查看工单模态框 -->
    <v-dialog
      light
      max-width="600px"
      v-model="lookDialog"
      @click:outside="outside"
    >
      <v-card>
        <v-card-text>
          <v-container>
            <v-tabs light v-model="tab">
              <v-tab>详情资料</v-tab>
              <v-tab>流程进度</v-tab>
            </v-tabs>
            <v-tabs-items light v-if="select[0]" v-model="tab">
              <v-tab-item>
                <div class="mt-4">
                  <span class="_dialog_title">工单编号 : </span>
                  <v-chip class="ml-2" label> {{ select[0].code }}</v-chip>
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">工单名称 : </span>
                  <v-chip class="ml-2" label> {{ select[0].title }}</v-chip>
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">工单类型 : </span>
                  <v-chip class="ml-2" label> {{ select[0].type }}</v-chip>
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">提交人 : </span>
                  <v-chip class="ml-2" label>
                    {{ select[0].submitterName }}</v-chip
                  >
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">提交时间 : </span>
                  <v-chip class="ml-2" label>
                    {{
                      new Date(select[0].createTime).toLocaleString()
                    }}</v-chip
                  >
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">提交人电话 : </span>
                  <v-chip class="ml-2" label> {{ select[0].mobile }}</v-chip>
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">信息等级 : </span>
                  <v-chip class="ml-2" label> {{ select[0].level }}</v-chip>
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">工单状态 : </span>
                  <v-chip class="ml-2" label>
                    {{ status[select[0]["status"]] }}</v-chip
                  >
                </div>
              </v-tab-item>
              <v-tab-item>
                <v-timeline class="mt-4">
                  <v-timeline-item
                    small
                    right
                    :key="index"
                    v-for="(i, index) in process"
                    :color="`${i.createTime ? 'green' : 'grey'}`"
                  >
                    <template v-slot:opposite>
                      <span
                        v-text="new Date(i.createTime).toLocaleString()"
                        class="font-weight-bold green--text"
                      />
                    </template>
                    <div>
                      <h3 class="font-weight-light mb-1 cyan--text">
                        {{ i.userName }}
                      </h3>
                      <div>{{ status[i.type] }}</div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-tab-item>
            </v-tabs-items>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- 转交工单模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Accept Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-select
                required
                :items="list"
                item-value="id"
                label="转交人员*"
                item-text="nickname"
                :rules="rule.deliverId"
                v-model="form.deliverId"
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
import http from "@/assets/script/http";
export default {
  name: "accept",
  data: () => ({
    http,
    headers: [
      {
        text: "工单编号",
        align: "center",
        value: "code",
        width: 200,
      },
      {
        text: "工单名称",
        align: "center",
        value: "title",
        width: 200,
      },
      {
        text: "工单类型",
        align: "center",
        value: "type",
        width: 200,
      },
      {
        text: "提交人",
        align: "center",
        value: "submitterName",
        width: 200,
      },
      {
        text: "提交时间",
        align: "center",
        value: "createTime",
        width: 200,
      },
      {
        text: "提交人电话",
        align: "center",
        value: "mobile",
        width: 200,
      },
      {
        text: "信息等级",
        align: "center",
        value: "level",
        width: 200,
      },
      {
        text: "工单状态",
        align: "center",
        value: "status",
        width: 200,
      },
    ],
    status: {
      0: "已提交",
      1: "已发起",
      2: "已接受",
      4: "已确认",
      5: "已驳回",
    },
    tab: 0,
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    accept: [],
    form: {
      deliverId: "",
    },
    rule: {
      deliverId: [(v) => !!v || "必填"],
    },
    searchForm: {
      startTime: "",
      endTime: "",
    },
    list: [],
    select: [],
    process: [],
    valid: true,
    table: false,
    dialog: false,
    loading: false,
    lookDialog: false,
    saveloading: false,
    rejectloading: false,
    resolveloading: false,
    load: false,
    startTime: false,
    endTime: false,
    downloading: false,
    resetdownloading: false,
  }),
  watch: {
    lookDialog: {
      handler(value) {
        value && this.myProcess();
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.myAccept();
    this.allUser();
  },
  methods: {
    myAccept() {
      this.table = true;
      const { page, limit } = this;
      this.$axios
        .post("/api-ops/workorder/accept", {
          page,
          limit,
        })
        .then((res) => {
          if (res) {
            const { total, records, current } = res.data;
            this.total = total;
            this.accept = records;
            this.current = current;
          }
          this.table = false;
          this.loading = false;
        });
    },
    myProcess() {
      const { id } = this.select[0];
      this.$axios
        .post("/api-ops/workorder/activiti", {
          id,
        })
        .then((res) => {
          if (res) {
            this.process = res.data;
          }
        });
    },
    allUser() {
      this.$axios.get("/api-user/users/list").then((res) => {
        if (res) {
          this.list = res.data;
        }
      });
    },
    updatePage(value) {
      this.page = value;
      this.myAccept();
    },
    updateItem(value) {
      this.limit = value;
      this.myAccept();
    },
    resolve() {
      if (!this.select[0]) {
        this.$notice.error("请选择受理项");
        return;
      }
      const { id, acceptReply } = this.select[0];
      this.resolveloading = true;
      this.$axios
        .post(`/api-ops/workorder/approval`, {
          id,
          acceptReply,
          status: 4,
        })
        .then((res) => {
          if (res) {
            this.$notice.success("工单已完结");
            this.select = [];
            this.myAccept();
          }
          this.resolveloading = false;
        });
    },
    reject() {
      if (!this.select[0]) {
        this.$notice.error("请选择驳回项");
        return;
      }
      const { id, acceptReply } = this.select[0];
      this.rejectloading = true;
      this.$axios
        .post(`/api-ops/workorder/approval`, {
          id,
          acceptReply,
          status: 5,
        })
        .then((res) => {
          if (res) {
            this.$notice.success("驳回成功");
            this.select = [];
            this.myAccept();
          }
          this.rejectloading = false;
        });
    },
    deliver() {
      if (!this.select[0]) {
        this.$notice.error("请选择转交项");
        return;
      }
      this.dialog = true;
    },
    refresh() {
      this.loading = true;
      this.myAccept();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.saveloading = true;
        const name = this.list.filter((res) => {
          return res.id == this.form.deliverId;
        });
        const deliverName = name[0].nickname;
        const { id, processInstanceId } = this.select[0];
        this.form = {
          id,
          deliverName,
          processInstanceId,
          ...this.form,
        };
        for (let key in this.form) {
          if (this.form[key] === null || this.form[key] == "") {
            delete this.form[key];
          }
        }
        this.$axios
          .post("/api-ops/workorder/deliver", {
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.$notice.success("转交成功");
              this.select = [];
              this.myAccept();
              this.close();
            }
            this.saveloading = false;
          });
      }
    },
    look() {
      if (!this.select[0]) {
        this.$notice.error("请选择查看项");
        return;
      }
      this.lookDialog = true;
    },
    outside() {
      this.select = [];
    },
    resetDown() {}, 
    download() {},
  },
};
</script>

<style lang="scss" scoped>
.accept {
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
  width: 80px;
  text-align: right;
  display: inline-block;
}
</style>
