<template>
  <div class="keep">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="look">
        <v-icon left v-text="'mdi-code-json'" />
        查看
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
                <v-text-field
                  v-model="searchForm.deviceName"
                  label="设备名称"
                />
                <v-text-field
                  v-model="searchForm.deviceLocation"
                  label="设备位置"
                />
                <v-text-field
                  v-model="searchForm.maintenanceUserName"
                  label="维护人员"
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
    >
      维护记录列表
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
        :items="keep"
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
    <!-- 查看维护模态框 -->
    <v-dialog v-model="dialog" @click:outside="outside" light max-width="600px">
      <v-card>
        <v-card-text>
          <v-container>
            <v-tabs-items light v-if="select[0]" v-model="tab">
              <v-tab-item>
                <div class="mt-4">
                  <span class="_dialog_title">设备名称 : </span>
                  <v-chip class="ml-2" label>
                    {{ select[0].deviceName }}</v-chip
                  >
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">设备所属舱体 : </span>
                  <v-chip class="ml-2" label>
                    {{ select[0].deviceCapsuleName }}</v-chip
                  >
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">设备位置 : </span>
                  <v-chip class="ml-2" label>
                    {{ select[0].deviceLocation }}</v-chip
                  >
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">维护人 : </span>
                  <v-chip class="ml-2" label>
                    {{ select[0].maintenanceUserName }}</v-chip
                  >
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">维护时间 : </span>
                  <v-chip class="ml-2" label>
                    {{ select[0].maintenanceTime }}</v-chip
                  >
                </div>
                <div class="mt-2">
                  <span class="_dialog_title">维护内容 : </span>
                  <v-chip class="ml-2" label>
                    {{ select[0].maintenanceContent }}</v-chip
                  >
                </div>
              </v-tab-item>
            </v-tabs-items>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "keep",
  data: () => ({
    headers: [
      {
        text: "设备名称",
        align: "center",
        value: "deviceName",
        width: 200,
      },
      {
        text: "设备所属舱体",
        align: "center",
        value: "deviceCapsuleName",
        width: 200,
      },
      {
        text: "设备位置",
        align: "center",
        value: "deviceLocation",
        width: 200,
      },
      {
        text: "维护人",
        align: "center",
        value: "maintenanceUserName",
        width: 200,
      },
      {
        text: "维护时间",
        align: "center",
        value: "maintenanceTime",
        width: 200,
      },
      {
        text: "维护内容",
        align: "center",
        value: "maintenanceContent",
        width: 200,
      },
    ],
    searchForm: {
      deviceName: "",
      deviceLocation: "",
      maintenanceUserName: "",
      startTime: "",
      endTime: "",
    },
    tab: 0,
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    keep: [],
    select: [],
    menu: false,
    table: false,
    dialog: false,
    loading: false,
    resetloading: false,
    searchloading: false,
    deleteloading: false,
    load: false,
    startTime: false,
    endTime: false,
    downloading: false,
    resetdownloading: false,
  }),
  mounted() {
    this.myKeep();
  },
  methods: {
    myKeep() {
      this.table = true;
      const { page, limit, searchForm } = this;
      this.$axios
        .post("/device-center/DeviceMaintenanceRecord/page", {
          ...searchForm,
          limit,
          page,
        })
        .then((res) => {
          if (res) {
            const { total, records, current } = res.data;
            this.total = total;
            this.keep = records;
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
      this.myKeep();
    },
    updateItem(value) {
      this.limit = value;
      this.myKeep();
    },
    reset() {
      this.$refs.searchForm.reset();
      this.resetloading = true;
      this.page = 1;
      this.myKeep();
    },
    search() {
      this.searchloading = true;
      this.page = 1;
      this.myKeep();
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios
        .delete(`/device-center/DeviceMaintenanceRecord/delete`, {
          params: {
            id: this.select[0].id,
          },
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.myKeep();
          }
          this.deleteloading = false;
        });
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
      this.myKeep();
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
.keep {
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
