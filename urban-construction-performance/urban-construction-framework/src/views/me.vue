<template>
  <div class="me">
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
      我的绩效列表
    </v-alert>
    <div class="elevation-7">
      <el-table :data="me" row-key="id" border>
        <el-table-column
          min-width="200"
          prop="userName"
          align="center"
          label="姓名"
        />
        <el-table-column
          min-width="200"
          align="center"
          prop="score"
          label="总分"
        />
        <el-table-column
          prop="actualScore"
          min-width="200"
          label="绩效评分"
          align="center"
        />
        <el-table-column
          prop="createTime"
          min-width="200"
          label="评分时间"
          align="center"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "me",
  data: () => ({
    me: [],
  }),
  mounted() {
    this.myMe();
  },
  methods: {
    myMe() {
      this.$axios.post("/api-ops/EvaluationHistory/list").then((res) => {
        if (res) {
          res.data.forEach(a => a.createTime = new Date(a.createTime).toLocaleString());
          this.me = res.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.me {
  height: 100%;
  .alert {
    display: flex;
    margin: 10px 0px 15px 0px;
  }
}
</style>
