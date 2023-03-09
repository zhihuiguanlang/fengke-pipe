<template>
  <div class="alarm" v-resize="onResize">
    <div class="handle">
      <v-select
        light
        dense
        outlined
        class="select"
        v-model="type"
        label="报表类型"
        @input="filter"
        :items="report"
        :loading="loading"
      />
      <!-- 日报 -->
      <v-menu
        v-if="type == 'day'"
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            light
            v-model="date"
            class="starttime"
            label="选择日期"
            prepend-icon="mdi-calendar-range "
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker light v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
          <v-btn text color="primary" @click="datelyer">OK</v-btn>
        </v-date-picker>
      </v-menu>
      <!-- 月报 -->
      <v-menu
        v-if="type == 'month' || type == 'week'"
        ref="round"
        v-model="round"
        :close-on-content-click="false"
        :return-value.sync="monthly"
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            light
            v-model="monthly"
            class="starttime"
            label="选择年份、月份"
            prepend-icon="mdi-calendar-range "
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker light v-model="monthly" no-title scrollable type="month">
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="round = false">Cancel</v-btn>
          <v-btn text color="primary" @click="monthlyer">OK</v-btn>
        </v-date-picker>
      </v-menu>
      <!-- 周报 -->
      <v-select
        v-if="type == 'week'"
        light
        dense
        outlined
        class="select ml-4"
        v-model="weekly"
        label="选择周"
        @input="weeklyer"
        :items="week"
        :loading="weekloading"
      />
      <!-- 年报 -->
      <v-select
        v-if="type == 'quarter' || type == 'half' || type == 'year'"
        light
        dense
        outlined
        class="select ml-4"
        v-model="yearly"
        label="选择年份"
        @input="yearlyer"
        :items="year"
        :loading="yearloading"
      />
      <!-- 半年报 -->
      <v-select
        v-if="type == 'half'"
        light
        dense
        outlined
        class="select ml-4"
        v-model="halfly"
        label="选择半年"
        @input="halflyer"
        :items="half"
        :loading="halfloading"
      />
      <!-- 季报 -->
      <v-select
        v-if="type == 'quarter'"
        light
        dense
        outlined
        class="select ml-4"
        v-model="quarterly"
        label="选择季度"
        @input="quarterlyer"
        :items="quarter"
        :loading="quarterloading"
      />
      <button class="btn mr-4 ml-4 colour" type="button" @click="lookup">
        查询
      </button>
      <button class="btn" type="button" @click="inquiry">下载</button>
    </div>
    <div class="summary">
      <v-alert
        tile
        light
        dense
        width="180"
        height="18"
        color="cyan"
        class="alert"
        border="left"
        elevation="0"
        colored-border
        transition="scale-transition"
        >管廊报警信息汇总
      </v-alert>
      <v-select
        :loading="alarmloading"
        label="当前报警设备"
        v-model="alarmId"
        item-text="name"
        item-value="id"
        :items="alarm"
        class="select"
        @input="find"
        outlined
        light
        dense
      />
    </div>
    <div ref="alarm" class="report elevation-7">
      <p>今日报警信息：</p>
      <p>
        {{ plan.length ? plan[0].capsuleName : "" }}
        {{ plan.length ? plan[0].segmentName : "" }}
        {{ plan.length ? plan[0].reason : "" }}。
      </p>
      <p>
        {{
          new Date(plan.length ? plan[0].alarmTime : "").toLocaleString()
        }}，系统报警显示{{ plan.length ? plan[0].capsuleName : "" }}
        {{ plan.length ? plan[0].segmentName : ""
        }}{{ plan.length ? plan[0].reason : "" }}，监控中心第一
        时间查看了现场传感器数据。
      </p>
      <!-- 异常图表 -->
      <div id="abnormal" class="abnormal" />
      <!-- 正常图表 -->
      <div id="normal" class="normal" />
    </div>
    <!-- 加载提示框 -->
    <v-dialog v-model="wait" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text class="pt-2">
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { report, week, quarter, half } from "@/assets/script/mock";
export default {
  name: "alarm",
  data: () => ({
    report,
    week,
    quarter,
    half,
    year: [],
    type: "day",
    menu: false,
    date: new Date().toISOString().substr(0, 10),
    round: false,
    loading: false,
    monthly: "",
    weekly: "",
    weekloading: false,
    yearly: "",
    yearloading: false,
    halfly: "",
    halfloading: false,
    quarterly: "",
    quarterloading: false,
    startTime: "",
    endTime: "",
    wait: false,
    alarmloading: false,
    alarm: [],
    plan: [],
    alarmId: "",
    chart: {},
    deal: {},
  }),
  created() {
    this.query();
  },
  methods: {
    onResize() {
      // 异常图表
      this.$chart.bar("abnormal", this.chart);
      // 正常图表
      this.$chart.bar("normal", this.deal);
    },
    query() {
      const myDate = new Date().getFullYear();
      let num = 0;
      while (num < 5) {
        this.year.push(myDate - num);
        num++;
      }
      this.endTime = this.date;
      this.startTime = this.date;
      this.create();
    },
    lookup() {
      if (!this.endTime && !this.startTime) {
        this.$notice.info("请选择查询范围");
        return;
      }
      this.create();
    },
    create() {
      const { startTime, endTime } = this;
      this.$axios
        .post("/dataManage/autoReport/getAlarmToday", {
          startTime,
          endTime,
        })
        .then((res) => {
          if (res) {
            this.alarm = res.result.map((res) => {
              return {
                ...res,
                name: `${res.deviceName}（ ${res.segmentName} / ${res.capsuleName} ）`,
              };
            });
            // 初始化默认数据
            this.alarmId = this.alarm[0].id;
            this.plan = this.alarm.filter((res) => res.id == this.alarmId);
            this.myData();
          }
        });
    },
    myData() {
      this.$axios
        .post("/dataManage/alarm/getAlarmMinuteData", {
          id: this.plan[0].id,
          isRealTime: false,
        })
        .then((res) => {
          if (res) {
            const date = [];
            const data = [];
            for (const i of res.result.data) {
              // 分类
              data.push(i.value[res.result.dataKey]);
              date.push(new Date(i.gatherTime).toLocaleString());
            }
            // 整合
            this.chart = {
              date,
              data,
              dataKey: res.result.dataKey,
              title: `图表 1 ${this.plan[0].reason}报警时刻数据`,
            };
            // 异常图表
            this.$chart.bar("abnormal", this.chart);
            this.myAlarm(res.result.dataKey);
          }
        });
    },
    myAlarm(dataKey) {
      this.alarmloading = true;
      this.$axios
        .post("/dataManage/autoReport/getDeviceData", {
          deviceId: this.plan[0].deviceId,
          alarmId: this.plan[0].id,
        })
        .then((res) => {
          if (res) {
            const date = [];
            const data = [];
            for (const i of res.result) {
              // 分类
              data.push(i.value[dataKey]);
              date.push(new Date(i.gatherTime).toLocaleString());
            }
            // 整合
            this.deal = {
              date,
              data,
              dataKey: dataKey,
              title: `图表 2 ${this.plan[0].reason}报警处理前后数据`,
            };
            // 异常图表
            this.$chart.bar("normal", this.deal);
          }
          this.alarmloading = false;
        });
    },
    filter() {
      this.loading = false;
      this.monthly = null;
      this.weekly = null;
      this.weekloading = false;
      this.yearly = null;
      this.yearloading = false;
      this.halfly = null;
      this.halfloading = false;
      this.quarterly = null;
      this.quarterloading = false;
      if (this.type == "day") {
        this.endTime = this.date;
        this.startTime = this.date;
        return;
      }
      this.startTime = null;
      this.endTime = null;
    },
    // 年报
    yearlyer() {
      if (this.type == "quarter") {
        this.quarterly = null;
        this.quarterloading = false;
        return;
      }
      if (this.type == "half") {
        this.halfly = null;
        this.halfloading = false;
        return;
      }
      this.endTime = `${this.yearly}-12-30`;
      this.startTime = `${this.yearly}-01-01`;
    },
    // 半年报
    halflyer(value) {
      const end = 6 * Number(value);
      const start = end - 6 + 1;
      this.endTime = `${this.yearly}-${end < 10 ? "0" + end : end}-30`;
      this.startTime = `${this.yearly}-${start < 10 ? "0" + start : start}-01`;
    },
    // 季度报
    quarterlyer(value) {
      const end = 3 * Number(value);
      const start = end - 3 + 1;
      this.endTime = `${this.yearly}-${end < 10 ? "0" + end : end}-30`;
      this.startTime = `${this.yearly}-${start < 10 ? "0" + start : start}-01`;
    },
    // 月报
    monthlyer() {
      this.$refs.round.save(this.monthly);
      if (this.type == "month") {
        this.endTime = `${this.monthly}-30`;
        this.startTime = `${this.monthly}-01`;
        return;
      }
      this.weekly = null;
      this.weekloading = false;
    },
    // 周报
    weeklyer(value) {
      const end = 7 * Number(value);
      const start = end - 7 + 1;
      this.endTime = `${this.monthly}-${end < 10 ? "0" + end : end}`;
      this.startTime = `${this.monthly}-${start < 10 ? "0" + start : start}`;
    },
    // 日报
    datelyer() {
      this.$refs.menu.save(this.date);
      this.endTime = this.date;
      this.startTime = this.date;
    },
    inquiry() {
      //下载
      this.$PDFSave(this.$refs.alarm, `${this.startTime} - ${this.endTime}`);
    },
    find(value) {
      this.plan = this.alarm.filter((res) => res.id == value);
      this.myData();
    },
  },
};
</script>

<style lang="scss" scoped>
.alarm {
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
    .starttime {
      width: 280px;
      flex: none;
      height: 40px;
      line-height: 40px;
      margin-top: -10px;
    }
    .btn {
      height: 36px;
      font-size: 14px;
      min-width: 64px;
      padding: 0 16px;
      color: #00bcd4;
      border: 1px solid #00bcd4;
      border-radius: 5px;
    }
    .colour {
      color: #009688 !important;
      border: 1px solid #009688 !important;
    }
  }
  .summary {
    display: flex;
    align-items: center;
    .alert {
      display: flex;
      margin: 24px 0px;
    }
    .select {
      flex: none;
      width: 280px;
      height: 40px;
      margin-right: 12px;
    }
  }
  .report {
    padding: 15px;
    font-size: 15px;
    text-indent: 2em;
    color: rgba(0, 0, 0, 0.7);
    .code {
      font-size: 14px;
      text-indent: 0em;
    }
    .normal,
    .abnormal {
      height: 500px;
      margin-top: 35px;
    }
  }
}
</style>
