<template>
  <div class="sewage">
    <div class="screen">
      <v-dialog persistent ref="dialog" width="300px" v-model="modal" :return-value.sync="date">
        <template v-slot:activator="{ on }">
          <v-text-field
            prepend-icon="mdi-credit-card-clock"
            v-model="dateRangeText"
            label="选择日期范围"
            v-on="on"
            readonly
            light
          />
        </template>
        <v-date-picker v-model="date" scrollable range>
          <v-spacer />
          <v-btn text color="primary" @click="modal = false">Cancel</v-btn>
          <v-btn text color="primary" @click="sure()">OK</v-btn>
        </v-date-picker>
      </v-dialog>
    </div>
    <div v-resize.quiet="onResize" class="main">
      <v-row dense>
        <v-col md="4" cols="12">
          <div class="nape white">
            <div class="header">
              <v-alert
                tile
                light
                dense
                height="18"
                color="cyan"
                class="alert"
                border="left"
                elevation="0"
                colored-border
                transition="scale-transition"
              >火警报警次数</v-alert>
            </div>
            <div class="echart" id="myChart-fire" />
          </div>
        </v-col>
        <v-col md="4" cols="12">
          <div class="nape white">
            <div class="header">
              <v-alert
                tile
                light
                dense
                height="18"
                color="cyan"
                class="alert"
                border="left"
                elevation="0"
                colored-border
                transition="scale-transition"
              >总入侵次数</v-alert>
            </div>
            <div class="echart" id="myChart-all" />
          </div>
        </v-col>
        <v-col md="4" cols="12">
          <div class="nape white">
            <div class="header">
              <v-alert
                tile
                light
                dense
                height="18"
                color="cyan"
                class="alert"
                border="left"
                elevation="0"
                colored-border
                transition="scale-transition"
              >排水次数和水位关系</v-alert>
            </div>
            <div class="echart" id="myChart-drain" />
          </div>
        </v-col>
        <v-col md="6" cols="12">
          <div class="nape white">
            <div class="header">
              <v-alert
                tile
                light
                dense
                height="18"
                color="cyan"
                class="alert"
                border="left"
                elevation="0"
                colored-border
                transition="scale-transition"
              >可燃气体排风次数</v-alert>
            </div>
            <div class="echart" id="myChart-gas" />
          </div>
        </v-col>
        <v-col md="6" cols="12">
          <div class="nape white">
            <div class="header">
              <v-alert
                tile
                light
                dense
                height="18"
                color="cyan"
                class="alert"
                border="left"
                elevation="0"
                colored-border
                transition="scale-transition"
              >气体的平均值</v-alert>
            </div>
            <div class="echart" id="myChart-mean" />
          </div>
        </v-col>
      </v-row>
    </div>
    <!-- 加载提示框 -->
    <v-dialog v-model="waiting" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <!-- <v-card-text class="pt-2">
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text> -->
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  fire,
  intrusion,
  drainage,
  combustible,
  gas,
  fires,
  intrusions,
  drainages,
  combustibles,
  gass
} from "@/assets/script/mock";
export default {
  name: "sewage",
  data: () => ({
    startTime: "",
    endTime: new Date().toISOString().substr(0, 10),
    date: [],
    modal: false,
    wait: false,
    fire,
    intrusion,
    drainage,
    combustible,
    gas,
    fires,
    intrusions,
    drainages,
    combustibles,
    gass,
    waiting: false,
  }),
  computed: {
    dateRangeText() {
      return this.date.join(" ~ ");
    },
    // 数据仓库
    ...mapGetters(["myCurrent"])
  },
  watch: {
    myCurrent: {
      handler(value) {
        const { id } = value;
        if (id) {
          this.startTime = this.GetDateStr(-7);
          this.date = [this.startTime, this.endTime];
          this.create(id);
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    create(id) {
      this.waiting = true;
      const { startTime, endTime } = this;
      this.onResize();
      this.$axios
        .post("/dataManage/dataAnalysis/getDataById", {
          id,
          startTime,
          endTime
        })
        .then(res => {
          if (res) {
            if (!(JSON.stringify(res.result) == "{}")) {
              this.query(res.result);
              this.$chart.Pie("myChart-fire", fire);
              this.$chart.Gauge("myChart-all", intrusion);
              this.$chart.Bar("myChart-drain", drainage);
              this.$chart.Bar("myChart-gas", combustible);
              this.$chart.line("myChart-mean", gas);
              this.wait = true;
            } else {
              this.$chart.Pie("myChart-fire", fires);
              this.$chart.Gauge("myChart-all", intrusions);
              this.$chart.Bar("myChart-drain", drainages);
              this.$chart.Bar("myChart-gas", combustibles);
              this.$chart.line("myChart-mean", gass);
              this.$notice.normal("暂无数据");
              this.wait = false;
            }
            this.waiting = false;
          }
        });
    },
    onResize() {
      // 重置
      if (this.wait) {
        this.$chart.Pie("myChart-fire", fire);
        this.$chart.Gauge("myChart-all", intrusion);
        this.$chart.Bar("myChart-drain", drainage);
        this.$chart.Bar("myChart-gas", combustible);
        this.$chart.line("myChart-mean", gas);
      } else {
        this.$chart.Pie("myChart-fire", fires);
        this.$chart.Gauge("myChart-all", intrusions);
        this.$chart.Bar("myChart-drain", drainages);
        this.$chart.Bar("myChart-gas", combustibles);
        this.$chart.line("myChart-mean", gass);
      }
    },
    sure() {
      // 日期
      if (this.date.length == 2) {
        this.$refs.dialog.save(this.date);
        this.date = new Date(this.date[0]).getTime() >= new Date(this.date[1]).getTime() ? this.date.reverse() : this.date;
        this.startTime = this.date[0];
        this.endTime = this.date[1];
        this.create(this.myCurrent.id);
      }
    },
    query(data) {
      // 参数
      if (data) {
        const {
          date,
          alarm,
          irruptTimes,
          drainTimes,
          waterLevel,
          windTimes,
          O2,
          CH4,
          average_O2,
          average_CH4,
          irruptTimesAll
        } = data;
        const piechart = alarm.map((n, v) => {
          return {
            value: n,
            name: date[v]
          };
        });
        fire.series.data = piechart;
        intrusion.series.max = irruptTimesAll;
        intrusion.series.data[0].value = irruptTimes;
        drainage.xAxis.data = date;
        drainage.series[0].data = drainTimes;
        drainage.series[1].data = waterLevel;
        combustible.xAxis.data = date;
        combustible.series[0].data = windTimes;
        combustible.series[1].data = O2;
        combustible.series[2].data = CH4;
        gas.xAxis.data = date;
        gas.series[0].data = average_O2;
        gas.series[1].data = average_CH4;
      }
    },
    GetDateStr(AddDayCount) {
      // 计算时间差天数
      var dd = new Date();
      dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
      var y = dd.getFullYear(); 
      var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
      var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
      return y + "-" + m + "-" + d;
    },
  }
};
</script>

<style lang="scss" scoped>
.sewage {
  height: 100%;
  .screen {
    width: 250px;
    margin: 0 auto;
  }
  .main {
    width: 100%;
    .nape {
      width: 100%;
      .header {
        padding: 16px 16px 0px 16px;
        border-bottom: 1px solid #e6e6e6;
        .alert {
          display: flex;
        }
      }
      .echart {
        height: 500px;
      }
    }
  }
}
</style>
