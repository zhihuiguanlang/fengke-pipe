<template>
  <div class="score">
    <div class="handle">
      <v-select
        light
        dense
        outlined
        class="select"
        :items="branch"
        label="选择部门"
        item-value="id"
        v-model="deptId"
        item-text="deptName"
        @input="branchFilter"
        :loading="branchloading"
      />
      <v-select
        light
        dense
        outlined
        :items="user"
        class="select"
        label="选择人员"
        item-value="id"
        v-model="userId"
        item-text="nickname"
        :loading="userloading"
      />
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
      <v-btn
        light
        @click="submit"
        color="blue-grey"
        class="white--text"
        :disabled="!disable"
        :loading="submitloading"
      >
        <v-icon left dark v-text="`mdi-cloud-upload`" />
        提交绩效考核评分
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
      绩效评分列表
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
        <el-table-column label="评分" width="150" align="center">
          <template slot-scope="scope">
            <v-text-field
              id="field"
              light
              dense
              v-model="scope.row.actualScore"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "score",
  data: () => ({
    user: [],
    norm: [],
    userId: "",
    deptId: "",
    branch: [],
    loading: false,
    disable: false,
    userloading: false,
    branchloading: false,
    submitloading: false,
  }),
  watch: {
    norm: {
      handler(value) {
        this.disable = Boolean(value[0]);
      },
      immediate: true,
      deep: true,
    },
    user: {
      handler(value) {
        value[0] || (this.userId = "");
      },
      immediate: true,
      deep: true,
    },
    deptId: {
      handler(value) {
        value && this.myUser();
      },
    },
    userId: {
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
      this.branchloading = true;
      this.$axios.get("/api-user/dept/list").then((res) => {
        if (res) {
          this.branch = res.data;
          // 异步更新
          this.$nextTick(() => {
            this.branch[0] && (this.deptId = this.branch[0].id);
          });
        }
        this.branchloading = false;
      });
    },
    myUser() {
      this.userloading = true;
      this.$axios
        .get("/api-user/userBydeptId", {
          params: {
            deptId: this.deptId,
          },
        })
        .then((res) => {
          if (res) {
            this.user = res.data;
            // 异步更新
            this.$nextTick(() => {
              this.user[0] && (this.userId = this.user[0].id);
            });
          }
          this.userloading = false;
        });
    },
    myNorm() {
      this.userloading = true;
      this.$axios
        .post("/api-ops/EvaluationScore/list", {
          userId: this.userId,
          deptId: this.deptId,
        })
        .then((res) => {
          if (res) {
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
                      actualScore:'',
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
                    actualScore:'',
                    assess,
                    gather: 0,
                    allscore: i.score,
                  },
                ];
              }
            }
          }
          this.loading = false;
          this.userloading = false;
        });
    },
    refresh() {
      this.loading = true;
      this.myNorm();
    },
    branchFilter() {
      this.norm = [];
      this.userloading = true;
    },
    submit() {
      this.submitloading = true;
      // 查找用户
      const find = this.user.filter((res) => res.id == this.userId);
      // 数据整合
      const source = this.norm.map((res) => {
        return {
          ...res,
          userId: this.userId,
          userName: find[0].nickname,
          evaluationStandardId: res.id,
        };
      });
      // 发送请求
      this.$axios
        .post("/api-ops/EvaluationScore/saveOrUpdateBatch", source)
        .then((res) => {
          if (res) {
            this.myNorm();
            this.$notice.success("提交成功");
          }
          this.submitloading = false;
        });
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
.score {
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
