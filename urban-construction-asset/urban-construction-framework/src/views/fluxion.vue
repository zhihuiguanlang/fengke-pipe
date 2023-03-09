<template>
  <div class="fluxion">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addFluxion">
        <v-icon left v-text="'mdi-plus'" />
        添加
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
        light
        offset-x
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
                <v-text-field v-model="searchForm.name" label="设备名称" />
                <v-text-field v-model="searchForm.number" label="设备编号" />
                <v-text-field v-model="searchForm.type" label="设备型号" />
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
      流动资产列表
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
        :items="fluxion"
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
    <!-- 添加资产模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Fluxion Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="form.name"
                :rules="rule.name"
                label="设备名称*"
                required
              />
              <v-text-field
                v-model="form.number"
                :rules="rule.number"
                label="设备编号*"
                required
              />
              <v-text-field
                v-model="form.type"
                :rules="rule.type"
                label="设备型号*"
                required
              />
              <v-text-field
                v-model="form.importUserName"
                :rules="rule.importUserName"
                label="导入人员*"
                required
              />
              <v-text-field
                v-model="form.quantity"
                :rules="rule.quantity"
                label="数量*"
                required
              />
              <v-text-field
                v-model="form.changePeriod"
                :rules="rule.changePeriod"
                label="保修期 (天)*"
                required
              />
              <v-textarea
                v-model="form.annotation"
                :rules="rule.annotation"
                label="备注*"
                required
                counter
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
export default {
  name: "fluxion",
  data: () => ({
    headers: [
      {
        text: "设备名称",
        align: "center",
        value: "name",
        width: 200,
      },
      {
        text: "设备编号",
        align: "center",
        value: "number",
        width: 200,
      },
      {
        text: "设备型号",
        align: "center",
        value: "type",
        width: 200,
      },
      {
        text: "导入人员",
        align: "center",
        value: "importUserName",
        width: 200,
      },
      {
        text: "数量",
        align: "center",
        value: "quantity",
        width: 200,
      },
      {
        text: "保修期 (天)",
        align: "center",
        value: "changePeriod",
        width: 200,
      },
      {
        text: "备注",
        align: "center",
        value: "annotation",
        width: 200,
      },
    ],
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    fluxion: [],
    form: {
      name: "",
      number: "",
      type: "",
      importUserName: "",
      quantity: "",
      changePeriod: "",
      annotation: "",
    },
    searchForm: {
      name: "",
      type: "",
      number: "",
      startTime: "",
      endTime: "",
    },
    rule: {
      name: [(v) => !!v || "必填"],
      number: [(v) => !!v || "必填"],
      type: [(v) => !!v || "必填"],
      importUserName: [(v) => !!v || "必填"],
      quantity: [(v) => !!v || "必填"],
      changePeriod: [(v) => !!v || "必填"],
      annotation: [(v) => !!v || "必填"],
    },
    select: [],
    menu: false,
    valid: true,
    table: false,
    dialog: false,
    loading: false,
    saveloading: false,
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
    this.myFluxion();
  },
  methods: {
    myFluxion() {
      this.table = true;
      const { page, limit, searchForm } = this;
      const { name, number, type } = searchForm;
      this.$axios
        .post("/api-assets/liquid/page", {
          page,
          limit,
          name,
          type,
          number,
        })
        .then((res) => {
          if (res) {
            const { total, records, current } = res.data;
            this.total = total;
            this.fluxion = records;
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
      this.myFluxion();
    },
    updateItem(value) {
      this.limit = value;
      this.myFluxion();
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios
        .delete(`/api-assets/liquid/delete`, {
          params: {
            id: this.select[0].id,
          },
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.myFluxion();
          }
          this.deleteloading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.myFluxion();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    addFluxion() {
      this.dialog = true;
    },
    reset() {
      this.$refs.searchForm.reset();
      this.resetloading = true;
      this.page = 1;
      this.myFluxion();
    },
    search() {
      this.searchloading = true;
      this.page = 1;
      this.myFluxion();
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.saveloading = true;
        this.$axios
          .post("/api-assets/liquid/saveOrUpdate", {
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.close();
              this.page = 1;
              this.myFluxion();
              this.$notice.success("添加成功");
            }
            this.saveloading = false;
          });
      }
    },
    resetDown() {},
    download() {},
  },
};
</script>

<style lang="scss" scoped>
.fluxion {
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
