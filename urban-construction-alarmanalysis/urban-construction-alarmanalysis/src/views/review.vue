<template>
  <div class="review">
    <div class="handle">
      <v-btn outlined class="mr-3" color="teal" @click="refresh" :loading="loading">
        <v-icon left v-text="'mdi-cached'" />刷新
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="download">
        <v-icon left v-text="'mdi-email'" />下载
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
    >应急预案审核</v-alert>
    <div class="elevation-7">
      <v-data-table
        light
        show-select
        fixed-header
        single-select
        calculate-width
        height="500"
        item-key="id"
        :items="plan"
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
    <!-- 加载提示框 -->
    <v-dialog v-model="wait" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text class="pt-2">
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "review",
  data: () => ({
    headers: [
      {
        text: "预案名称",
        align: "center",
        value: "planName",
        width: 200
      },
      {
        text: "提交时间",
        align: "center",
        value: "createTime",
        width: 200
      },
      {
        text: "提交人",
        align: "center",
        value: "uploader",
        width: 200
      },
      {
        text: "文档大小",
        align: "center",
        value: "fileSize",
        width: 200
      },
      {
        text: "审核结果",
        align: "center",
        value: "auditResult",
        width: 200
      }
    ],
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    plan: [],
    select: [],
    wait: false,
    loading: false,
    table: false,
  }),
  mounted() {
    this.query();
  },
  methods: {
    query() {
      this.table = true;
      const { page, limit } = this;
      this.$axios
        .post("/dataManage/analysisHelp/selectFile", {
          page,
          limit
        })
        .then(res => {
          if (res) {
            const { total, list, pageNum } = res.result;
            this.total = total;
            const plan = list.map(n => {
              n.createTime = this.formatDateTime(n.createTime);
              return n;
            });
            this.plan = plan.filter(n=>n.auditResult == '通过');
            this.current = pageNum;
          }
          this.table = false;
          this.loading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.query();
    },
    updatePage(value) {
      this.page = value;
      this.query();
    },
    updateItem(value) {
      this.limit = value;
      this.query();
    },
    download() {
      if (!this.select[0]) {
        this.$notice.error("请选择下载项");
        return;
      }
      this.$notice.normal("正在下载");
      window.open(`${this.select[0].filePath}`, "_self");
    },
    formatDateTime(inputTime) {
      let date = new Date(inputTime);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return `${y}-${m}-${d}`; //
    }
  }
};
</script>

<style lang="scss" scoped>
.review {
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
}
</style>