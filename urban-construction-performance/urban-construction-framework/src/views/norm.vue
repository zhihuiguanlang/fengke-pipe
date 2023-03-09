<template>
  <div class="norm">
    <div class="handle">
      <v-select
        light
        dense
        outlined
        class="select"
        :items="branch"
        @input="filter"
        label="选择部门"
        item-value="id"
        v-model="deptId"
        item-text="deptName"
        :loading="filterloading"
      />
      <v-btn class="mr-3" outlined color="light-green" @click="addNorm">
        <v-icon left v-text="'mdi-plus'" />
        添加考核项目
      </v-btn>
      <v-btn class="mr-3" outlined color="cyan" @click="amendNorm">
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
      考核项目列表
    </v-alert>
    <div class="elevation-7">
      <el-table
        :span-method="concordance"
        :data="norm"
        show-summary
        row-key="id"
        border
      >
        <el-table-column width="100" align="center" label="考核项目">
          <template slot-scope="scope">
            <span class="assess">
              {{ scope.row.assess }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          min-width="200"
          label="评分标准"
        />
        <el-table-column
          prop="score"
          align="center"
          min-width="200"
          label="标准分"
        />
        <el-table-column width="45" align="center">
          <template slot-scope="scope">
            <v-checkbox
              light
              dense
              multiple
              class="my-2"
              v-model="select"
              style="height:30px;"
              @click="choice(scope.row)"
              color="rgba(0, 0, 0, 0.54)"
              :value="JSON.stringify(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加考核项目模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Norm Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-select
                v-model="form.parentId"
                :rules="rule.parentId"
                label="上级考核项目*"
                item-text="name"
                item-value="id"
                :items="boss"
                required
              />
              <v-text-field
                label="项目名称/评分标准*"
                v-model="form.name"
                :rules="rule.name"
                required
              />
              <v-text-field
                v-model="form.score"
                :rules="rule.score"
                label="标准分*"
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
  name: "norm",
  data: () => ({
    boss: [],
    norm: [],
    form: {
      name: "",
      score: "",
      parentId: "",
    },
    rule: {
      name: [(v) => !!v || "必填"],
      score: [(v) => !!v || "必填"],
      parentId: [(v) => !!v || "必填"],
    },
    deptId: "",
    branch: [],
    select: [],
    valid: true,
    dialog: false,
    loading: false,
    saveloading: false,
    filterloading: false,
    deleteloading: false,
  }),
  watch: {
    deptId: {
      handler(value) {
        value && this.myNorm();
      },
    },
  },
  mounted() {
    this.myBranch();
  },
  methods: {
    myBranch() {
      this.$axios.get("/api-user/dept/list").then((res) => {
        if (res) {
          this.branch = res.data;
          // 异步更新
          this.$nextTick(() => {
            this.branch[0] && (this.deptId = this.branch[0].id);
          });
        }
      });
    },
    myNorm() {
      this.$axios
        .post("/api-ops/EvaluationStandard/list", {
          deptId: this.deptId,
        })
        .then((res) => {
          if (res) {
            // 数据拼接
            this.boss = [
              {
                id: -1,
                name: "顶级考核项目",
              },
              ...JSON.parse(JSON.stringify(res.data)),
            ];
            this.norm = [];
            // 数据整合
            for (const i of res.data) {
              // 子项长度
              const gather = i.subEvaluationStandards.length;
              // 数据解构
              if (gather) {
                i.subEvaluationStandards.forEach((n, index) => {
                  this.norm = [
                    ...this.norm,
                    {
                      ...n,
                      assess: i.name,
                      allscore: i.score,
                      gather: index == 0 && gather,
                    },
                  ];
                });
              } else {
                const { name: assess } = i;
                delete i["name"];
                this.norm = [
                  ...this.norm,
                  {
                    ...i,
                    assess,
                    gather: 0,
                    allscore: i.score,
                  },
                ];
              }
            }
          }
          this.loading = false;
          this.filterloading = false;
        });
    },
    deleted() {
      if (!this.select[0]) {
        this.$notice.error("请选择删除项");
        return;
      }
      this.deleteloading = true;
      const { deptId } = this;
      const { id } = JSON.parse(this.select[0]);
      this.$axios
        .post(`/api-ops/EvaluationStandard/delete`, {
          id,
          deptId,
        })
        .then((res) => {
          if (res) {
            this.$notice.success("删除成功");
            this.select = [];
            this.myNorm();
          }
          this.deleteloading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.myNorm();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    addNorm() {
      delete this.form["id"];
      this.dialog = true;
    },
    amendNorm() {
      if (!this.select[0]) {
        this.$notice.error("请选择编辑项");
        return;
      }
      const source = JSON.parse(this.select[0]);
      this.form = {
        ...source,
        name: source.parentId === -1 ? source.assess : source.name,
      };
      this.dialog = true;
    },
    filter() {
      this.filterloading = true;
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) {
        this.saveloading = true;
        this.form["deptId"] = this.deptId;
        this.$axios
          .post("/ops-center/EvaluationStandard/saveOrUpdate", this.form)
          .then((res) => {
            if (res) {
              this.$notice.success("操作成功");
              this.select = [];
              this.myNorm();
              this.close();
            }
            this.saveloading = false;
          });
      }
    },
    choice(value) {
      this.select = [JSON.stringify(value)];
    },
    concordance({ row, columnIndex }) {
      if (columnIndex === 0) {
        // 解构合并列
        const { gather: rowspan = null } = row;
        // 判断是否合并
        if (rowspan) {
          return {
            rowspan,
            colspan: 1,
          };
        } else if (!rowspan && rowspan !== 0) {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.norm {
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
  .assess {
    letter-spacing: 4px;
    writing-mode: vertical-rl;
  }
}
</style>
