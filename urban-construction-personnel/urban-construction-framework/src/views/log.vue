<template>
  <div class="log">
    <div class="handle">
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
                <v-text-field v-model="searchForm.userName" label="用户名" />
                <v-text-field v-model="searchForm.ipAddress" label="IP地址" />
                <v-text-field v-model="searchForm.operation" label="操作信息" />
                <v-menu v-model="picker" transition="scale-transition">
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="searchForm.timestamp"
                      label="创建时间"
                      v-on="on"
                      readonly
                    />
                  </template>
                  <v-date-picker v-model="searchForm.timestamp" />
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
      日志列表
    </v-alert>
    <div class="elevation-7">
      <v-data-table
        light
        fixed-header
        calculate-width
        height="500"
        item-key="id"
        :items="log"
        :loading="table"
        :headers="headers"
        :page.sync="current"
        :items-per-page="limit"
        :loading-text="'loading...'"
        :server-items-length="total"
        :footer-props="{
          itemsPerPageOptions: [5, 10, 15, 20],
        }"
        @update:page="updatePage"
        @update:items-per-page="updateItem"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "log",
  data: () => ({
    headers: [
      {
        text: "用户名",
        align: "center",
        value: "userName",
        width: 200,
      },
      {
        text: "操作信息",
        align: "center",
        value: "operation",
        width: 200,
      },
      {
        text: "IP地址",
        align: "center",
        value: "ipAddress",
        width: 200,
      },
      {
        text: "创建时间",
        align: "center",
        value: "timestamp",
        width: 200,
      },
    ],
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    log: [],
    searchForm: {
      userName: "",
      operation: "",
      ipAddress: "",
      timestamp: "",
      startTime: "",
      endTime: "",
    },
    menu: false,
    table: false,
    picker: false,
    loading: false,
    resetloading: false,
    searchloading: false,
    load: false,
    startTime: false,
    endTime: false,
    downloading: false,
    resetdownloading: false,
  }),
  mounted() {
    this.mylog();
  },
  methods: {
    mylog() {
      this.table = true;
      const { page, limit, searchForm } = this;
      this.$axios
        .post("/ops-center/SysLogger/page", {
          ...searchForm,
          limit,
          page,
        })
        .then((res) => {
          if (res) {
            const { total, current, records } = res.data;
            this.log = records;
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
    updatePage(value) {
      this.page = value;
      this.mylog();
    },
    updateItem(value) {
      this.limit = value;
      this.mylog();
    },
    refresh() {
      this.loading = true;
      this.mylog();
    },
    reset() {
      this.$refs.searchForm.reset();
      this.resetloading = true;
      this.page = 1;
      this.mylog();
    },
    search() {
      this.searchloading = true;
      this.page = 1;
      this.mylog();
    },
    resetDown() {},
    download() {},
  },
};
</script>

<style lang="scss" scoped>
.log {
  height: 100%;
  .handle {
    width: 100%;
    padding-bottom: 12px;
    border-bottom: 1px solid #e0e0e0;
  }
  .alert {
    display: flex;
    margin: 24px 0px;
  }
}
</style>
