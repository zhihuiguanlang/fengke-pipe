<template>
  <div class="share">
    <div class="handle">
      <v-select
        light
        dense
        outlined
        class="select"
        v-model="type"
        label="报表类型"
        @input='filter'
        :items="report"
        :loading="loading"
      />
      <!-- 日报 -->
      <v-menu
        v-if='type == "day"'
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
        v-if='type == "month" || type == "week"'
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
        <v-date-picker light v-model="monthly" no-title scrollable type='month'>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="round = false">Cancel</v-btn>
          <v-btn text color="primary" @click="monthlyer">OK</v-btn>
        </v-date-picker>
      </v-menu>
      <!-- 周报 -->
      <v-select
        v-if='type == "week"'
        light
        dense
        outlined
        class="select ml-4"
        v-model="weekly"
        label="选择周"
        @input='weeklyer'
        :items="week"
        :loading="weekloading"
      />
      <!-- 年报 -->
      <v-select
        v-if='type == "quarter" || type == "half" || type == "year"'
        light
        dense
        outlined
        class="select ml-4"
        v-model="yearly"
        label="选择年份"
        @input='yearlyer'
        :items="year"
        :loading="yearloading"
      />
      <!-- 半年报 -->
      <v-select
        v-if='type == "half"'
        light
        dense
        outlined
        class="select ml-4"
        v-model="halfly"
        label="选择半年"
        @input='halflyer'
        :items="half"
        :loading="halfloading"
      />
      <!-- 季报 -->
      <v-select
        v-if='type == "quarter"'
        light
        dense
        outlined
        class="select ml-4"
        v-model="quarterly"
        label="选择季度"
        @input='quarterlyer'
        :items="quarter"
        :loading="quarterloading"
      />
      <v-btn class="ml-4" outlined color="cyan" @click="inquiry">下载</v-btn>
    </div>
    <v-alert
      tile
      light
      dense
      width="200"
      height="18"
      color="cyan"
      class="alert"
      border="left"
      elevation="0"
      colored-border
      transition="scale-transition"
    >信息共享平台信息汇总</v-alert>
    <div class="report elevation-7">
      <h3 class="mb-4">1. 接收到管理部门信息</h3>
      <p>
        <code class="code" />，在共享信息平台收到 管理部门信息：
      </p>
      <p>
        （1）针对
        <code class="code" />情况，经领导研究决定，建议参照
        <code class="code" />标准执行；
      </p>
      <p>
        （2）针对
        <code class="code" />问题，请与
        <code class="code" />部门协调处理。
      </p>
      <h3 class="mb-4">2. 接收到管线公司信息</h3>
      <p>
        <code class="code" />，在共享信息平台收到
        <code class="code" />管线公司信息：
      </p>
      <p>
        我公司位于
        <code class="code" />舱
        <code class="code" />防火段的
        <code class="code" />管线，于
        <code class="code" />发生报警，具体信 息为
        <code class="code" />，我公司已完成
        <code class="code" />操作，请贵公司启动
        <code class="code" />设
        备，配合我公司维修人员完成管线抢修。
      </p>
      <h3 class="mb-4">3. 推送信息</h3>
      <p>
        <code class="code" />，在共享信息平台推送给
        <code class="code" />管理部门、
        <code class="code" />管线公 司信息：
      </p>
      <p>
        （1）我公司位于
        <code class="code" />舱
        <code class="code" />防火段的
        <code class="code" />设备，于
        <code class="code" />发生报警， 具体信息为
        <code class="code" />，我公司已启动
        <code class="code" />设备，完成
        <code class="code" />操 作，请贵公司确认相关管线监测数据是否收到影响。
      </p>
      <p>
        （2）
        <code class="code" />，我公司位于
        <code class="code" />舱
        <code class="code" />防火段的
        <code class="code" />设备报警信息已经
        消除，环境参数恢复正常。
      </p>
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
  name: "share",
  data: () => ({
    report,
    week,
    quarter,
    half,
    year: [],
    type: 'day',
    menu: false,
    date: new Date().toISOString().substr(0, 10),
    round: false,
    loading: false,
    monthly: '',
    weekly: '',
    weekloading: false,
    yearly: '',
    yearloading: false,
    halfly: '',
    halfloading: false,
    quarterly: '',
    quarterloading: false,
    startTime: '',
    endTime: '',
    wait: false,
  }),
  created() {
    this.query();
  },
  methods: {
    query() {
      const myDate = new Date().getFullYear();
      let num = 0;
      while( num < 5 ){
        this.year.push(myDate-num)
        num++;
      }
      this.endTime = this.date;
      this.startTime = this.date;
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
      if (this.type == 'day') {
        this.endTime = this.date;
        this.startTime = this.date;
        return
      }
      this.startTime = null;
      this.endTime = null;
    },
    // 年报
    yearlyer() {
      if(this.type == 'quarter'){
        this.quarterly = null;
        this.quarterloading = false;
        return
      }
      if(this.type == 'half'){
        this.halfly = null;
        this.halfloading = false;
        return
      }
      this.endTime = `${this.yearly}-12-30`;
      this.startTime = `${this.yearly}-01-01`;
    },
    // 半年报
    halflyer(value) {
      const end = 6 * Number(value);
      const start =  end - 6 + 1;
      this.endTime = `${this.yearly}-${end < 10 ? "0" + end : end}-30`;
      this.startTime = `${this.yearly}-${start < 10 ? "0" + start : start}-01`;
    },
    // 季度报
    quarterlyer(value) {
      const end = 3 * Number(value);
      const start =  end - 3 + 1;
      this.endTime = `${this.yearly}-${end < 10 ? "0" + end : end}-30`;
      this.startTime = `${this.yearly}-${start < 10 ? "0" + start : start}-01`;
    },
    // 月报
    monthlyer() {
      this.$refs.round.save(this.monthly);
      if(this.type == 'month'){
        this.endTime = `${this.monthly}-30`;
        this.startTime = `${this.monthly}-01`;
        return
      }
      this.weekly = null;
      this.weekloading = false;
    },
    // 周报
    weeklyer(value) {
      const end = 7 * Number(value);
      const start =  end - 7 + 1;
      this.endTime = `${this.monthly}-${end < 10 ? "0" + end : end}`;
      this.startTime = `${this.monthly}-${start < 10 ? "0" + start : start}`;
    },
    // 日报
    datelyer() {
      this.$refs.menu.save(this.date);
      this.endTime = this.date;
      this.startTime = this.date;
    },
    inquiry() {  //下载
      console.log(this.startTime,this.endTime)
    }
  }
};
</script>

<style lang="scss" scoped>
.share {
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
  }
  .alert {
    display: flex;
    margin: 24px 0px;
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
  }
}
</style>
