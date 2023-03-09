<template>
  <div class="facility" v-resize="onResize">
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
    >管廊环境设备状态汇总</v-alert>
    <div class="report elevation-7">
      <h3 class="mb-4">
        1. 温度：今日管廊温度为
        <code class="code" />℃ ~
        <code class="code" />℃，符合要求，各舱段的温度曲线图如图表 1~图表 4
      </h3>
      <!-- 综合舱 -->
      <div id="synthesize-temperature" class="echart" />
      <!-- 电力舱 -->
      <div id="electric-temperature" class="echart" />
      <!-- 热力舱 -->
      <div id="heat-temperature" class="echart" />
      <!-- 燃气舱 -->
      <div id="fuel-temperature" class="echart" />
      <h3 class="mb-4">
        2. 湿度：今日管廊湿度为
        <code class="code" />%RH ~
        <code class="code" />%RH，符合要求，各舱段的湿度曲线图如图表 5~图表 8。
      </h3>
      <!-- 综合舱 -->
      <div id="synthesize-humidity" class="echart" />
      <!-- 电力舱 -->
      <div id="electric-humidity" class="echart" />
      <!-- 热力舱 -->
      <div id="heat-humidity" class="echart" />
      <!-- 燃气舱 -->
      <div id="fuel-humidity" class="echart" />
      <h3 class="mb-4">
        3. 氧气浓度：今日管廊氧气浓度为
        <code class="code" />% Vol ~
        <code class="code" />%
        Vol，符合要求，各舱段的氧气浓度曲线图如图表 9~图表 12。
      </h3>
      <!-- 综合舱 -->
      <div id="synthesize-oxygen" class="echart" />
      <!-- 电力舱 -->
      <div id="electric-oxygen" class="echart" />
      <!-- 热力舱 -->
      <div id="heat-oxygen" class="echart" />
      <!-- 燃气舱 -->
      <div id="fuel-oxygen" class="echart" />
      <h3 class="mb-4">
        4. 甲烷浓度：今日燃气舱甲烷浓度为
        <code class="code" />% Vol ~
        <code class="code" />%
        Vol，符合要求，甲烷浓度曲线图如图表 13。
      </h3>
      <!-- 燃气舱 -->
      <div id="fuel-methane" class="echart" />
      <h3 class="mb-4">
        5. 液位：今日管廊集水坑液位为
        <code class="code" />mm ~
        <code class="code" />mm，符合要求，液位曲线如图表 14。
      </h3>
      <!-- 综合舱 -->
      <div id="synthesize-liquid" class="echart" />
      <h3 class="mb-4">6. 风机状态：</h3>
      <p>
        今日风机共有
        <code class="code" />台正常工作，
        <code class="code" />台异常，
        <code class="code" />台损坏，正常工作风机占总数的
        <code class="code" />%。异常/损坏问题已申请设备维修工单。
      </p>
      <p>各舱段按照既定通风策略进行通风，具体情况如下：</p>
      <p>
        （1）
        <code class="code" />舱通风标准为
        <code class="code" />次/h，今日共通风
        <code class="code" />次，合计
        <code class="code" />h；
      </p>
      <p>
        （2）
        <code class="code" />舱通风标准为
        <code class="code" />次/h，今日共通风
        <code class="code" />次，合计
        <code class="code" />h；
      </p>
      <p>
        （3）
        <code class="code" />舱通风标准为
        <code class="code" />次/h，今日共通风
        <code class="code" />次，合计
        <code class="code" />h；
      </p>
      <p>
        （4）
        <code class="code" />舱通风标准为
        <code class="code" />次/h，今日共通风
        <code class="code" />次，合计
        <code class="code" />h；
      </p>
      <p>报警或预警后临时通风信息如下：</p>
      <p>
        （1）
        <code class="code" />舱
        <code class="code" />防火段湿度报警临时通风，通风开始时间为
        <code class="code" />，通风结束时间为
        <code class="code" />，风机运行时间合计
        <code class="code" />；
      </p>
      <p>
        （2）
        <code class="code" />舱
        <code class="code" />防火段氧气浓度预警临时通风，通风开始时间为
        <code class="code" />，通风结束时间为
        <code class="code" />，风机运行时间合计
        <code class="code" />。
      </p>
      <h3 class="mb-4">7. 水泵状态：</h3>
      <p>
        今日水泵共有
        <code class="code" />台正常工作，
        <code class="code" />台异常，
        <code class="code" />台损坏，正常工作风机占总数的
        <code class="code" />%。异常/损坏问题已申请设备维修工单。
      </p>
      <p>各舱段按照既定集水坑液位高度进行排水，具体情况如下：</p>
      <p>
        （1）
        <code class="code" />舱液位高度为
        <code class="code" />m~
        <code class="code" />m，今日共排水
        <code class="code" />次；
      </p>
      <p>
        （2）
        <code class="code" />舱液位高度为
        <code class="code" />m~
        <code class="code" />m，今日共排水
        <code class="code" />次；
      </p>
      <p>
        （3）
        <code class="code" />舱液位高度为
        <code class="code" />m~
        <code class="code" />m，今日共排水
        <code class="code" />次；
      </p>
      <p>
        （4）
        <code class="code" />舱液位高度为
        <code class="code" />m~
        <code class="code" />m，今日共排水
        <code class="code" />次；
      </p>
      <p>报警或预警后临时排水信息如下：</p>
      <p>
        （1）
        <code class="code" />舱
        <code class="code" />防火段液位报警临时排水，排水开始时间为
        <code class="code" />，排水结束时间为
        <code class="code" />，水泵运行时间合计
        <code class="code" />；
      </p>
      <p>
        （2）
        <code class="code" />舱
        <code class="code" />防火段集水坑液位预警临时排水，排水开始时间为
        <code class="code" />，排水结束时间为
        <code class="code" />，水泵运行时间合计
        <code class="code" />。
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
  name: "facility",
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
    onResize() {
      // 综合舱
      this.$chart.bar("synthesize-temperature", {
        name: "图表 1 综合舱温度曲线图"
      });
      this.$chart.bar("synthesize-humidity", {
        name: "图表 5 综合舱湿度曲线图"
      });
      this.$chart.bar("synthesize-oxygen", {
        name: "图表 9 综合舱氧气浓度曲线图"
      });
      this.$chart.bar("synthesize-liquid", {
        name: "图表 14 综合舱液位曲线图"
      });
      // 电力舱
      this.$chart.bar("electric-temperature", {
        name: "图表 2 电力舱温度曲线图"
      });
      this.$chart.bar("electric-humidity", { name: "图表 6 电力舱湿度曲线图" });
      this.$chart.bar("electric-oxygen", {
        name: "图表 10 电力舱氧气浓度曲线图"
      });
      // 热力舱
      this.$chart.bar("heat-temperature", { name: "图表 3 热力舱温度曲线图" });
      this.$chart.bar("heat-humidity", { name: "图表 7 热力舱湿度曲线图" });
      this.$chart.bar("heat-oxygen", { name: "图表 11 热力舱氧气浓度曲线图" });
      // 燃气舱
      this.$chart.bar("fuel-temperature", { name: "图表 4 燃气舱温度曲线图" });
      this.$chart.bar("fuel-humidity", { name: "图表 8 燃气舱湿度曲线图" });
      this.$chart.bar("fuel-oxygen", { name: "图表 12 燃气舱氧气浓度曲线图" });
      this.$chart.bar("fuel-methane", { name: "图表 13 燃气舱甲烷浓度曲线图" });
    },
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
.facility {
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
    .echart {
      height: 500px;
      margin-top: 35px;
    }
  }
}
</style>
