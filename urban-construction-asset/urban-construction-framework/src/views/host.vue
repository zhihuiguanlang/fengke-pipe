<template>
  <div class="host">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="addHost">
        <v-icon left v-text="'mdi-plus'" />
        添加主机
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="amendHost">
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
      主机列表
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
    <!-- 添加主机模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Host Profile</span>
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
                v-model="form.ipAddress"
                :rules="rule.ipAddress"
                label="服务器IP*"
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
  name: "host",
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
        text: "服务器IP",
        align: "center",
        value: "ipAddress",
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
    host: [],
    form: {
      name: "",
      number: "",
      type: "",
      ipAddress: "",
      annotation: "",
    },
    rule: {
      name: [(v) => !!v || "必填"],
      number: [(v) => !!v || "必填"],
      type: [(v) => !!v || "必填"],
      ipAddress: [(v) => !!v || "必填"],
      annotation: [(v) => !!v || "必填"],
    },
    select: [],
    valid: true,
    table: false,
    dialog: false,
    loading: false,
    saveloading: false,
    deleteloading: false,
  }),
  mounted() {
    this.myHost();
  },
  methods: {
    myHost() {
      this.table = true;
      const { page, limit } = this;
      this.$axios
        .post("/api-assets/serverManage/page", {
          page,
          limit,
        })
        .then((res) => {
          if (res) {
            const { total, records, current } = res.data;
            this.total = total;
            this.host = records;
            this.current = current;
          }
          this.table = false;
          this.loading = false;
        });
    },
    updatePage(value) {
      this.page = value;
      this.myHost();
    },
    updateItem(value) {
      this.limit = value;
      this.myHost();
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios
        .delete(`/api-assets/serverManage/delete`, {
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
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    addHost() {
      delete this.form["id"];
      this.dialog = true;
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
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        const { id = null } = this.form;
        this.saveloading = true;
        this.$axios
          .post("/api-assets/serverManage/saveOrUpdate", {
            ...this.form,
          })
          .then((res) => {
            if (res) {
              this.$notice.success("操作成功");
              id || (this.page = 1);
              this.select = [];
              this.myHost();
              this.close();
            }
            this.saveloading = false;
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.host {
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
