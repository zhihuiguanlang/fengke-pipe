<template>
  <div class="material">
    <div class="handle justify-space-between">
      <div class="out">
        <v-btn class="mr-3" outlined color="light-green" @click="addHost">
          <v-icon left v-text="'mdi-plus'" />添加
        </v-btn>
        <v-btn class="mr-3" outlined color="cyan" @click="amendHost">
          <v-icon left v-text="'mdi-pencil'" />编辑
        </v-btn>
        <v-btn class="mr-3" color="error" @click="deleted" :loading="deleteloading">
          <v-icon left v-text="'mdi-delete'" />删除
        </v-btn>
        <v-btn outlined class="mr-3" color="teal" @click="refresh" :loading="loading">
          <v-icon left v-text="'mdi-cached'" />刷新
        </v-btn>
      </div>
      <v-btn class="mr-3" outlined color="light-green" @click="addHouse">
        <v-icon left v-text="'mdi-plus'" />添加物资库
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
    >物资出入库列表</v-alert>
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
    <!-- 模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">添加物资出入库</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field v-model="form.name" :rules="rule.name" label="物资名称*" required />
              <v-select
                item-text="name"
                item-value="id"
                v-model="form.libraryId"
                :rules="rule.libraryId"
                :items="libraryId"
                label="出入库*"
                required
              />
              <v-text-field v-model="form.num" :rules="rule.num" label="出入库数量*" required />
              <v-text-field v-model="form.unit" :rules="rule.unit" label="物资单位*" required />
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="form.InOutTime"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="form.InOutTime"
                    append-icon="mdi-calendar-month-outline"
                    readonly
                    v-bind="attrs"
                    label="出入库日期*"
                    :rules="rule.InOutTime"
                    v-on="on"
                    required
                  ></v-text-field>
                </template>
                <v-date-picker v-model="form.InOutTime" no-title scrollable light>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(form.InOutTime)">OK</v-btn>
                </v-date-picker>
              </v-menu>
              <v-text-field v-model="form.type" :rules="rule.type" label="物资类型*" required />
              <v-select
                item-text="nickname"
                item-value="nickname"
                v-model="form.operator"
                :rules="rule.operator"
                :items="operator"
                label="操作人员*"
                required
              />
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">关闭</v-btn>
          <v-btn color="blue darken-1" text @click="save" :loading="saveloading">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 加载提示框 -->
    <v-dialog v-model="wait" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text class="pt-2">
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- 物资库框 -->
    <!-- 模态框 -->
    <v-dialog v-model="house" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">物资库管理</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <warehouse/>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeHouse">关闭</v-btn>
          <v-btn color="blue darken-1" text @click="saveHouse" :loading="houseloading">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import warehouse from './warehouse';
export default {
  name: "material",
  components: { warehouse },
  data: () => ({
    headers: [
      {
        text: "物资名称",
        align: "center",
        value: "name",
        width: 200
      },
      {
        text: "出入库",
        align: "center",
        value: "library",
        width: 200
      },
      {
        text: "出入库数量",
        align: "center",
        value: "num",
        width: 200
      },
      {
        text: "物资类型",
        align: "center",
        value: "type",
        width: 200
      },
      {
        text: "出入库日期",
        align: "center",
        value: "createTimes",
        width: 200
      },
      {
        text: "单位",
        align: "center",
        value: "unit",
        width: 200
      },
      {
        text: "操作人员",
        align: "center",
        value: "operator",
        width: 200
      }
    ],
    form: {
      name: "",
      libraryId: "",
      num: "",
      unit: "",
      InOutTime: "",
      type: "",
      operator: ""
    },
    rule: {
      name: [v => !!v || "必填"],
      libraryId: [v => !!v || "必填"],
      num: [v => !!v || "必填"],
      unit: [v => !!v || "必填"],
      InOutTime: [v => !!v || "必填"],
      type: [v => !!v || "必填"],
      operator: [v => !!v || "必填"]
    },
    libraryId: [],
    operator: [],
    page: 1,
    total: 0,
    limit: 10,
    current: 1,
    plan: [],
    select: [],
    wait: false,
    deleteloading: false,
    loading: false,
    table: false,
    resetloading: false,
    searchloading: false,
    dialog: false,
    valid: true,
    saveloading: false,
    menu: false,
    house: false,
    houseloading: false
  }),
  mounted() {
    this.query();
    this.myList();
    this.create();
  },
  methods: {
    query() {
      this.table = true;
      const { page, limit } = this;
      this.$axios
        .post("/dataManage/goods/getAllGoods", {
          page,
          limit
        })
        .then(res => {
          if (res) {
            const { total, list, pageNum } = res.result;
            this.total = total;
            this.plan = list.map(n => {
              n.createTimes = this.formatDateTime(n.createTime);
              n.library = n.goodsLibrary.name;
              return n;
            });
            this.current = pageNum;
          }
          this.table = false;
          this.loading = false;
          this.resetloading = false;
          this.searchloading = false;
        });
    },
    create() {
      this.$axios.get("/api-user/users/list", {}).then(res => {
        if (res) {
          this.operator = res.data;
        }
      });
    },
    myList() {
      this.$axios.post("/dataManage/goods/getAllGoodsLibrary", {}).then(res => {
        if (res) {
          this.libraryId = res.result;
        }
      });
    },
    amendHost() {
      if (!this.select[0]) {
        this.$notice.error("请选择编辑项");
        return;
      }
      this.form = {
        ...this.select[0]
      };
      this.form.InOutTime = this.select[0].createTimes;
      this.dialog = true;
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
    addHost() {
      delete this.form["id"];
      this.dialog = true;
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        delete this.form.grade;
        const { id = null } = this.form;
        this.saveloading = true;
        this.$axios
          .post("/dataManage/goods/insertOrUpdateGoods", {
            ...this.form
          })
          .then(res => {
            if (res) {
              this.$notice.success("操作成功");
              id || (this.page = 1);
              this.select = [];
              this.query();
              this.close();
            }
            this.saveloading = false;
          });
      }
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      this.$axios
        .post(`/dataManage/goods/deleteGoods`, {
          id: this.select[0].id
        })
        .then(res => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.query();
          }
          this.deleteloading = false;
        });
    },
    formatDateTime(inputTime) {
      let date = new Date(inputTime);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return `${y}-${m}-${d}`; //
    },
    addHouse() {
      this.house = true;
    },
    closeHouse() {
      this.house = false;
    },
    saveHouse() {
      this.house = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.material {
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