<template>
  <div class="accept">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="look">
        <v-icon left v-text="'mdi-code-json'" />
        查看
      </v-btn>
      <v-btn class="mr-3" outlined color="#00FF00">
        <v-icon left v-text="'mdi-calendar-search'" />
        审批
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
      白名单审核列表
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
        <template #item.status="{ item }">
          <v-chip label :class="`${item.status != 4 || 'error'}`">
            {{ status[item["status"]] }}
          </v-chip>
        </template>
      </v-data-table>
    </div>
    <!-- 查看白名单模态框 -->
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
              <v-tab>流程图</v-tab>
            </v-tabs>
            <v-tabs-items light v-if="select[0]" v-model="tab">
              <v-tab-item>
                <div class="mt-4">
                  <span class="_dialog_title">白名单编号 : </span>
                  <v-chip class="ml-2" label> {{ select[0].code }}</v-chip>
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">白名单名称 : </span>
                  <v-chip class="ml-2" label> {{ select[0].title }}</v-chip>
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">白名单类型 : </span>
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
                    {{ select[0].createTime }}</v-chip
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
                  <span class="_dialog_title">白名单状态 : </span>
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
                    :color="`${i.startTime ? 'green' : 'grey'}`"
                  >
                    <template v-slot:opposite>
                      <span
                        v-text="i.startTime"
                        class="font-weight-bold green--text"
                      />
                    </template>
                    <div>
                      <h3 class="font-weight-light mb-1 cyan--text">
                        {{ i.userName }}
                      </h3>
                      <div>{{ i.activityName }}</div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-tab-item>
              <v-tab-item>
                <v-img
                  contain
                  height="352"
                  class="mt-4"
                  max-width="528"
                  :src="
                    `${http.system}/api-ops/worker/getImage?processInstanceId=${select[0].processInstanceId}`
                  "
                  :lazy-src="
                    `${http.system}/api-ops/worker/getImage?processInstanceId=${select[0].processInstanceId}`
                  "
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
        text: "白名单编号",
        align: "center",
        value: "code",
        width: 200,
      },
      {
        text: "白名单名称",
        align: "center",
        value: "title",
        width: 200,
      },
      {
        text: "白名单类型",
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
        text: "白名单状态",
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
    tab: 0,
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    accept: [],
    list: [],
    select: [],
    process: [],
    table: false,
    dialog: false,
    loading: false,
    lookDialog: false,
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
  },
  methods: {
    myAccept() {
      this.table = true;
      const { page, limit } = this;
      this.$axios
        .post("/api-ops/worker/findTaskByAssignee", {
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
      const { processInstanceId } = this.select[0];
      this.$axios
        .post("/api-ops/worker/findHistoryProcessInstance", {
          processInstanceId,
        })
        .then((res) => {
          if (res) {
            this.process = res.data;
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
    refresh() {
      this.loading = true;
      this.myAccept();
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
