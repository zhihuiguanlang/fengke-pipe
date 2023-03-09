<template>
  <div class="all">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="look">
        <v-icon left v-text="'mdi-code-json'" />
        查看
      </v-btn>
      <v-btn class="mr-3" outlined color="light-green">
        <v-icon left v-text="'mdi-plus'" />
        添加
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" >
        <v-icon left v-text="'mdi-pencil'" />
        编辑
      </v-btn>
      <v-btn
        class="mr-3"
        color="error"
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
        v-model="menu"
        offset-x
        light
      >
        <template #activator="{ on }">
          <v-btn class="mr-3" outlined color="cyan" v-on="on">
            <v-icon left v-text="'mdi-file-find'" />
            搜索
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-container>
              <v-form ref="searchForm">
                <v-text-field v-model="searchForm.name" label="白名单名称" />
                <v-select
                  :items="list"
                  label="处理人"
                  item-text="nickname"
                  item-value="nickname"
                  v-model="searchForm.acceptUserName"
                />
                <v-menu v-model="picker" transition="scale-transition">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="searchForm.createTime"
                      label="提交时间"
                      v-on="on"
                      readonly
                    />
                  </template>
                  <v-date-picker v-model="searchForm.createTime" />
                </v-menu>
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
      白名单列表
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
        :items="all"
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
    <v-dialog v-model="dialog" @click:outside="outside" light max-width="600px">
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
                  <span class="_dialog_title">处理人 : </span>
                  <v-chip class="ml-2" label>
                    {{ select[0].acceptUserName }}</v-chip
                  >
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">处理时间 : </span>
                  <v-chip class="ml-2" label>
                    {{ select[0].handlingTime }}</v-chip
                  >
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
  name: "all",
  data: () => ({
    http,
    headers: [
      {
        text: "白名单编号",
        align: "center",
        value: "code",
        width: 170,
      },
      {
        text: "白名单名称",
        align: "center",
        value: "title",
        width: 170,
      },
      {
        text: "白名单类型",
        align: "center",
        value: "type",
        width: 170,
      },
      {
        text: "提交人",
        align: "center",
        value: "submitterName",
        width: 170,
      },
      {
        text: "提交时间",
        align: "center",
        value: "createTime",
        width: 170,
      },
      {
        text: "处理人",
        align: "center",
        value: "acceptUserName",
        width: 170,
      },
      {
        text: "处理时间",
        align: "center",
        value: "handlingTime",
        width: 170,
      },
      {
        text: "信息等级",
        align: "center",
        value: "level",
        width: 170,
      },
      {
        text: "白名单状态",
        align: "center",
        value: "status",
        width: 170,
      },
    ],
    status: {
      0: "已提交",
      1: "已审批",
      2: "已复核",
      3: "已挂起",
      4: "被驳回",
    },
    searchForm: {
      name: "",
      createTime: "",
      acceptUserName: "",
    },
    tab: 0,
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    all: [],
    list: [],
    select: [],
    process: [],
    menu: false,
    table: false,
    picker: false,
    dialog: false,
    loading: false,
    resetloading: false,
    searchloading: false,
  }),
  watch: {
    dialog: {
      handler(value) {
        value && this.myProcess();
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.myAll();
    this.myUser();
  },
  methods: {
    myAll() {
      this.table = true;
      const { page, limit, searchForm } = this;
      this.$axios
        .post("/api-ops/worker/findAllByPage", {
          ...searchForm,
          limit,
          page,
        })
        .then((res) => {
          if (res) {
            const { total, records, current } = res.data;
            this.all = records;
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
    myUser() {
      this.$axios.get("/api-user/users/list").then((res) => {
        if (res) {
          this.list = res.data;
        }
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
      this.myAll();
    },
    updateItem(value) {
      this.limit = value;
      this.myAll();
    },
    look() {
      if (!this.select[0]) {
        this.$notice.error("请选择查看项");
        return;
      }
      this.dialog = true;
    },
    refresh() {
      this.loading = true;
      this.myAll();
    },
    reset() {
      this.$refs.searchForm.reset();
      this.resetloading = true;
      this.page = 1;
      this.myAll();
    },
    search() {
      this.searchloading = true;
      this.page = 1;
      this.myAll();
    },
    outside() {
      this.select = [];
    },
  },
};
</script>

<style lang="scss" scoped>
.all {
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
