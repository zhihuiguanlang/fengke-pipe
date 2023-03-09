<template>
  <div class="information">
    <div class="statistics">
      <div class="graph_name">
        <span>事故统计</span>
        <v-select
          light
          dense
          outlined
          class="select"
          label="事故统计类型"
          item-value="value"
          item-text="title"
          background-color="#fff"
          :loading="deviceTypeloading"
          v-model="deviceType"
          :items="list"
          @input='filter'
        />
      </div>
    </div>
    <div class="analysis" ref="analysis" :style="{height:ElE.analysis+'px'}">
      <div
        class="graphical"
        ref="graphical"
        v-resize.quiet="onResize"
        :style="{height:ElE.graphical+'px'}"
      >
        <div class="ai">
          <div class="name">
            <span v-show="deviceType == 'oxygen'">火灾事故统计</span>
            <span v-show="deviceType == 'gauge'">雨水倒灌事故统计</span>
            <span v-show="deviceType == 'structural'">管廊沉降事故统计</span> 
            <v-btn-toggle v-model="future" mandatory group dense @change="tabs">
              <v-btn text color='#333' >
                按月
              </v-btn>
              <v-btn text color='#333'>
                按年
              </v-btn>
            </v-btn-toggle>
          </div>
          <div class="content" ref="common">
            <v-tabs-items class="_tabs" v-model="future">
              <!-- 图表---月 -->
              <v-tab-item class="_item" color='#333'>
                <div class="echarts" id="myEchart-Bar" />
              </v-tab-item>
              <!-- 图表---年 -->
              <v-tab-item class="_item" color='#333'>
                <div class="echarts" id="myEchart-yearBar"/>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </div>
        <div class="pie">
          <div class="myChart" :id="`myChart-pie`" />
          <div class="list">
            <p v-for="(value, key, index) in baseData" :key='index'>
              {{ key }}级 
              <span v-show="deviceType == 'oxygen'">火灾</span>
              <span v-show="deviceType == 'gauge'">积水</span>
              <span v-show="deviceType == 'structural'">沉降</span> 
              {{ value }}%
            </p>
          </div>
        </div>
      </div>
      <div class="sheet">
        <div class="sheet_name">数据列表</div>
          <div class="edit">
            <v-btn class="mb-3" outlined small color="cyan" @click="amendHost">
              <v-icon left v-text="'mdi-pencil'" />编辑
            </v-btn>
            <v-btn outlined class="ml-3 mb-3" small color="teal" @click="refresh" :loading="loading">
              <v-icon left v-text="'mdi-cached'" />刷新
            </v-btn>
          </div>
          <div class="table elevation-7">
            <v-data-table
              light
              show-select
              fixed-header
              single-select
              calculate-width
              item-key="id"
              height="340"
              :items="host"
              :loading="table"
              :headers="headers"
              :page.sync="pageNum"
              :items-per-page="pageSize"
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
      </div>
    </div>
    <!-- 模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Plan Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form ref="form" v-model="valid">
              <v-text-field v-model="form.hurt" :rules="rule.hurt" label="伤害统计*" required />
              <v-text-field v-model="form.accidentReason" :rules="rule.accidentReason" label="事故原因*" required />
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
  </div>
</template>

<script>
export default {
  name: "information",
  data: () => ({
    headers: [
      {
        text: "舱体名称",
        align: "center",
        value: "capsuleName",
        width: 200
      },
      {
        text: "防火段名称",
        align: "center",
        value: "segmentName",
        width: 200
      },
      {
        text: "",
        align: "center",
        value: "level",
        width: 200
      },
      {
        text: "伤害统计",
        align: "center",
        value: "hurt",
        width: 200
      },
      {
        text: "事故原因",
        align: "center",
        value: "accidentReason",
        width: 200
      },
      {
        text: "时间",
        align: "center",
        value: "alarmTime",
        width: 200
      },
    ],
    list: [
      { title: "火灾", value: "oxygen" },
      { title: "雨水倒灌", value: "gauge" },
      { title: "管廊沉降", value: "structural" }
    ],
    plan: [],
    host: [],
    select: [],
    form: {
      hurt: "",
      accidentReason: "",
    },
    rule: {
      hurt: [v => !!v || "必填"],
      accidentReason: [v => !!v || "必填"],
    },
    ElE: {
      graphical: 0,
      analysis: 0
    },
    baseData: {},
    census: {},
    timeType: 'month',  // 按月
    deviceType: 'oxygen',  // 火灾
    future: 0,
    total: 0,
    pageNum: 1,
    pageSize: 10,
    valid: true,
    table: false,
    dialog: false,
    saveloading: false,
    deviceTypeloading: false,
    loading: false,
  }),
  mounted() {
    this.create();
    this.query();
    this.myHost();
  },
  methods: {
    create() {
      const { deviceType, timeType } = this;      
      this.$axios
        .post("/dataManage/alarm/historyAlarmCountData", {
          deviceType,
          timeType,
        })
        .then(res => {
          if (res) {
            res.result.name = this.list.filter(e=>e.value == deviceType)[0].title;
            this.census = res.result;
            this.$nextTick(() => {
              this.$chart.Bar(timeType == 'month' ? 'myEchart-Bar' : 'myEchart-yearBar', this.census);
            });
          }
        });
    },
    query() {
      const { deviceType, timeType } = this;      
      this.$axios
        .post("/dataManage/alarm/historyCountByLevel", {
          deviceType,
          timeType,
        })
        .then(res => {
          if (res) {
            const plan = [];
            for(const key in res.result){
              plan.push({value:res.result[key]})
            }
            this.plan = plan.map(n=>{
              n.name = this.list.filter(e=>e.value == deviceType)[0].title;
              return n
            })
            this.$nextTick(() => {
              this.$chart.Pie("myChart-pie", this.plan);
            });
            this.baseData = res.result;
          }
        });
    },
    myHost() {
      this.table = true;
      const { pageNum, pageSize, deviceType, timeType } = this;
      this.$axios
        .post("/dataManage/alarm/historyAlarmData", {
          pageNum,
          pageSize,
          deviceType,
          timeType,
        })
        .then(res => {
          if (res) {
            this.headers[2].text = this.list.filter(e=>e.value == deviceType)[0].title +'等级';// 动态绑定table第2列标题
            const { total, list, pageNum } = res.result;
            this.total = total;
            this.host = list.map(n=>{
              n.alarmTime = this.formatDateTime(n.alarmTime)
              return n
            });
            this.pageNum = pageNum;
          }
          this.loading = false;
          this.table = false;
          this.deviceTypeloading = false;
        });
    },
    filter(value) {
      this.pageNum = 1;
      this.deviceType = value;
      this.timeType = 'month';
      this.table = true;
      this.deviceTypeloading = true;
      this.create();
      this.myHost();
    },
    tabs(value) {
      this.pageNum = 1;
      this.timeType = value == 1 ? 'year' : 'month';
      this.table = true;
      this.create();
      this.myHost();
    },
    amendHost() {
      if (!this.select[0]) {
        this.$notice.error("请选择编辑项");
        return;
      }
      this.form = {
        ...this.select[0]
      };
      this.dialog = true;
    },
    refresh() {
      this.loading = true;
      this.myHost();
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    save() {
      this.$refs.form.validate();
      if (this.valid) { 
        const { id, hurt, accidentReason } = this.form;
        this.saveloading = true;
        this.$axios
          .post("/dataManage/alarm/updateAlarm", {
            id,
            hurt,
            accidentReason
          })
          .then(res => {
            if (res) {
              this.$notice.success("操作成功");
              id || (this.page = 1);
              this.select = [];
              this.close();
              this.myHost();
            }
            this.saveloading = false;
          });
      }
    },
    updatePage(value) {
      this.pageNum = value;
      this.myHost();
    },
    updateItem(value) {
      this.pageSize = value;
      this.myHost();
    },
    onResize() {
      this.reset();
    },
    reset() {
      this.$nextTick(() => {
        this.ElE = {
          graphical: this.$refs.graphical.offsetHeight,
          analysis: this.$refs.analysis.offsetHeight
        };
      });
      this.$chart.Bar(this.timeType == 'month' ? 'myEchart-Bar' : 'myEchart-yearBar', this.census);
      this.$chart.Pie("myChart-pie", this.plan);
    },
    // 年-月-日-时-分-秒
    formatDateTime(inputTime) {
      let date = new Date(inputTime);
      let Y = date.getFullYear();
      let M = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
      let D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    },
  }
};
</script>

<style lang="scss" scoped>
.information {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .statistics {
    display: flex;
    .graph_name {
      height: 20px;
      display: flex;
      color: #333333;
      line-height: 20px;
      padding-left: 15px;
      align-items: center;
      margin: 12px 0px 10px 0px;
      align-content: flex-start;
      border-left: 5px solid #00bcd4;
      .select {
        flex: none;
        width: 240px;
        height: 40px;
        margin-left: 10px;
      }
    }
  }
  .analysis {
    flex: 1;
    display: flex;
    flex-direction: column;
    .graphical {
      flex: 1;
      display: flex;
      .ai {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 20px 10px 0;
        .name {
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(20, 56, 101, 0.5);
          font-size: 16px;
          padding: 0px 10px;
          color: #333;
        }
        .content {
          flex: 1;
          display: flex;
          ._tabs {
            flex: 1;
            display: flex;
            background-color: transparent;
            ._item {
              flex: 1;
              display: flex;
              .echarts {
                flex: 1;
              }
            }
          }
        }
      }
      .pie {
        flex: 1;
        display: flex;
        .myChart {
          flex: 1;
          background-color: white;
        }
        .list {
          width: 200px;
          color: #333;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      }
    }
    .sheet {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .sheet_name {
        height: 20px;
        margin: 15px 0px;
        color: #333333;
        line-height: 20px;
        padding-left: 15px;
        border-left: 5px solid #00bcd4;
      }
      .table {
        flex: 1;
        overflow-y: auto;
      }
    }
  }
}
</style>