<template>
  <div class="facturer">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addFacturer">
        <v-icon left v-text="'mdi-plus'" />
        添加生产厂商
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="amendFacturer">
        <v-icon left v-text="'mdi-pencil'" />
        编辑
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
      生产厂商列表
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
        :loading="table"
        :items="facturer"
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
    <!-- 添加厂商模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Facturer Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="form.name"
                :rules="rule.name"
                label="生产厂商名称*"
                required
              />
              <v-text-field
                v-model="form.address"
                :rules="rule.address"
                label="生产厂商地址*"
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
  </div>
</template>

<script>
export default {
  name: "facturer",
  data: () => ({
    headers: [
      {
        text: "生产厂商名称",
        align: "center",
        value: "name",
        width: 200,
      },
      {
        text: "生产厂商地址",
        align: "center",
        value: "address",
        width: 200,
      },
    ],
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    facturer: [],
    form: {
      name: "",
      address: "",
    },
    rule: {
      name: [(v) => !!v || "必填"],
      address: [(v) => !!v || "必填"],
    },
    searchForm: {
      startTime: "",
      endTime: "",
    },
    select: [],
    valid: true,
    table: false,
    dialog: false,
    loading: false,
    saveloading: false,
    deleteloading: false,
    load: false,
    startTime: false,
    endTime: false,
    downloading: false,
    resetdownloading: false,
  }),
  mounted() {
    this.myFacturer();
  },
  methods: {
    myFacturer() {
      this.table = true;
      const { page, limit } = this;
      this.$axios
        .post("/api-assets/VendorMmanage/page", {
          page,
          limit,
        })
        .then((res) => {
          if (res) {
            const { total, records, current } = res.data;
            this.total = total;
            this.current = current;
            this.facturer = records;
          }
          this.table = false;
          this.loading = false;
        });
    },
    updatePage(value) {
      this.page = value;
      this.myFacturer();
    },
    updateItem(value) {
      this.limit = value;
      this.myFacturer();
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios
        .delete(`/api-assets/VendorMmanage/delete`, {
          params: {
            id: this.select[0].id,
          },
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.myFacturer();
            this.select = [];
          }
          this.deleteloading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.myFacturer();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    addFacturer() {
      delete this.form["id"];
      this.dialog = true;
    },
    amendFacturer() {
      if (!this.select[0]) {
        this.$notice.error("请选择编辑项");
        return;
      }
      this.form = {
        ...this.select[0],
      };
      this.dialog = true;
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        const { id = null } = this.form;
        this.saveloading = true;
        this.$axios
          .post("/api-assets/VendorMmanage/saveOrUpdate", {
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.$notice.success("操作成功");
              id || (this.page = 1);
              this.myFacturer();
              this.select = [];
              this.close();
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
.facturer {
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
