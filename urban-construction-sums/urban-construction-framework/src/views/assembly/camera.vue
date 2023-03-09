<template>
  <div class="camera">
    <!-- 廊内状态 -->
    <div class="state">
      <!-- 遍历数据 -->
      <!-- 五份 -->
      <div class="upper">
        <div class="card" v-for="(i, index) in genre.slice(0, 5)" :key="index">
          <!-- 五分之二 -->
          <div class="matter">
            <v-icon color="#4eecfe" light size="50">
              mdi-crosshairs-gps
            </v-icon>
            <span class="name">{{ i.type }}</span>
          </div>
          <!-- 五分之三 -->
          <div class="source">
            <div class="all">
              <span class="name">总数</span>
              <span class="value">{{ i.AllCount }}</span>
            </div>
            <div class="work">
              <span class="name">运行中</span>
              <span class="value">{{ i.startCount }}</span>
            </div>
            <div class="breakdown">
              <span class="name">故障</span>
              <span class="value">{{ i.badCount }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 五份 -->
      <div class="lower">
        <div class="card" v-for="(i, index) in genre.slice(5, 10)" :key="index">
          <!-- 五分之二 -->
          <div class="matter">
            <v-icon color="#4eecfe" light size="50">
              mdi-crosshairs-gps
            </v-icon>
            <span class="name">{{ i.type }}</span>
          </div>
          <!-- 五分之三 -->
          <div class="source">
            <div class="all">
              <span class="name">总数</span>
              <span class="value">{{ i.AllCount }}</span>
            </div>
            <div class="work">
              <span class="name">运行中</span>
              <span class="value">{{ i.startCount }}</span>
            </div>
            <div class="breakdown">
              <span class="name">故障</span>
              <span class="value">{{ i.badCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 环境监控 -->
    <div class="echarts" v-resize.quiet="onResize">
      <!-- 遍历数据 -->
      <!-- 四份 -->
      <div class="upper">
        <div class="echart">
          <div class="name">
            液位曲线
          </div>
          <div class="myChart" id="camera-lev" />
        </div>
        <div class="echart">
          <div class="name">
            氧气曲线
          </div>
          <div class="myChart" id="camera-oxy" />
        </div>
        <div class="echart">
          <div class="name">
            甲烷曲线
          </div>
          <div class="myChart" id="camera-met" />
        </div>
      </div>
      <!-- 四份 -->
      <div class="lower">
        <div class="echart">
          <div class="name">
            沉降曲线
          </div>
          <div class="myChart" id="camera-ver" />
        </div>
        <div class="echart">
          <div class="name">
            湿度曲线
          </div>
          <div class="myChart" id="camera-hum" />
        </div>
        <div class="echart">
          <div class="name">
            温度曲线
          </div>
          <div class="myChart" id="camera-tem" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "camera",
  data() {
    return {
      genre: [],
      level: [],
      oxygen: [],
      methane: [],
      vertical: [],
      humidity: [],
      temperature: [],
    };
  },
  mounted() {
    this.myGenre();
    this.mylevel();
    this.myOxygen();
    this.myMethane();
    this.myVertical();
    this.myHumidity();
    this.myTemperature();
  },
  created(){

    this.onResize();
  },
  methods: {
    myGenre() {
      this.$axios.post("/api-device/device/listByStatus").then((res) => {
        if (res) {
          this.genre = res.data;
        }
      });
    },
    mylevel() {
      this.$chart.cabin("camera-lev", this.level);
      this.$axios
        .post("/dataManage/dataAnalysis/getDateByReal", {
          dataKey: "level",
        })
        .then((res) => {
          if (res) {
            // 赋值
            this.level = res.result;
            // 绘制
            this.$chart.cabin("camera-lev", this.level);
            // 轮询
            setTimeout(() => this.mylevel(), 2000);
          }
        });
    },
    myOxygen() {
                  this.$chart.cabin("camera-oxy", this.oxygen);
      this.$axios
        .post("/dataManage/dataAnalysis/getDateByReal", {
          dataKey: "oxygen",
        })
        .then((res) => {
          if (res) {
            // 赋值
            this.oxygen = res.result;
            // 绘制
            this.$chart.cabin("camera-oxy", this.oxygen);
            // 轮询
            setTimeout(() => this.myOxygen(), 2000);
          }
        });
    },
    myMethane() {
                  this.$chart.cabin("camera-met", this.methane);
      this.$axios
        .post("/dataManage/dataAnalysis/getDateByReal", {
          dataKey: "methane",
        })
        .then((res) => {
          if (res) {
            // 赋值
            this.methane = res.result;
            // 绘制
            this.$chart.cabin("camera-met", this.methane);
            // 轮询
            setTimeout(() => this.myMethane(), 2000);
          }
        });
    },
    myVertical() {
                  this.$chart.cabin("camera-ver", this.vertical);
      this.$axios
        .post("/dataManage/dataAnalysis/getDateByReal", {
          dataKey: "vertical",
        })
        .then((res) => {
          if (res) {
            // 赋值
            this.vertical = res.result;
            // 绘制
            this.$chart.cabin("camera-ver", this.vertical);
            // 轮询
            setTimeout(() => this.myVertical(), 2000);
          }
        });
    },
    myHumidity() {
                  this.$chart.cabin("camera-hum", this.humidity);
      this.$axios
        .post("/dataManage/dataAnalysis/getDateByReal", {
          dataKey: "humidity",
        })
        .then((res) => {
          if (res) {
            // 赋值
            this.humidity = res.result;
            // 绘制
            this.$chart.cabin("camera-hum", this.humidity);
            // 轮询
            setTimeout(() => this.myHumidity(), 2000);
          }
        });
    },
    myTemperature() {
                  this.$chart.cabin("camera-tem", this.temperature);
      this.$axios
        .post("/dataManage/dataAnalysis/getDateByReal", {
          dataKey: "temperature",
        })
        .then((res) => {
          if (res) {
            // 赋值
            this.temperature = res.result;
            // 绘制
            this.$chart.cabin("camera-tem", this.temperature);
            // 轮询
            setTimeout(() => this.myTemperature(), 2000);
          }
        });
    },
    myChart() {
      // 类型图表
      this.level = [
        {
          spaceName:"主干廊综合舱",
          capsuleValue:[1,20,3,30,30,45],
          capsuleList:['2022-03-01','2022-03-02','2022-03-03','2022-03-04','2022-03-05','2022-03-06']
        },
        {
          spaceName:"主干廊污水舱",
          capsuleValue:[10,25,35,45,55,65],
        },  {
          spaceName:"主干廊燃气舱",
          capsuleValue:[11,12,13,48,15,56],
        },  {
          spaceName:"主干廊电力舱",
          capsuleValue:[0,5,20,40,35,0],
        }
      ]
       this.oxygen = [
        {
          spaceName:"主干廊综合舱",
          capsuleValue:[30,30,23,30,30,30],
          capsuleList:['2022-03-01','2022-03-02','2022-03-03','2022-03-04','2022-03-05','2022-03-06']
        },
        {
          spaceName:"主干廊污水舱",
          capsuleValue:[30,30,30,30,30,30],
        },  {
          spaceName:"主干廊燃气舱",
          capsuleValue:[30,30,30,50,30,30],
        },  {
          spaceName:"主干廊电力舱",
          capsuleValue:[30,30,40,30,30,30],
        }
      ]
             this.methane = [
        {
          spaceName:"主干廊综合舱",
          capsuleValue:[1,57,3,30,30,45],
          capsuleList:['2022-03-01','2022-03-02','2022-03-03','2022-03-04','2022-03-05','2022-03-06']
        },
        {
          spaceName:"主干廊污水舱",
          capsuleValue:[10,21,35,45,55,65],
        },  {
          spaceName:"主干廊燃气舱",
          capsuleValue:[11,43,13,48,15,56],
        },  {
          spaceName:"主干廊电力舱",
          capsuleValue:[0,5,20,40,35,0],
        }
      ]
              this.vertical = [
        {
          spaceName:"主干廊综合舱",
          capsuleValue:[30,30,60,30,30,30],
          capsuleList:['2022-03-01','2022-03-02','2022-03-03','2022-03-04','2022-03-05','2022-03-06']
        },
        {
          spaceName:"主干廊污水舱",
          capsuleValue:[30,22,30,30,30,30],
        },  {
          spaceName:"主干廊燃气舱",
          capsuleValue:[50,30,30,43,30,30],
        },  {
          spaceName:"主干廊电力舱",
          capsuleValue:[30,30,70,30,30,30],
        }
      ]
             this.humidity = [
        {
          spaceName:"主干廊综合舱",
          capsuleValue:[40,20,3,50,30,45],
          capsuleList:['2022-03-01','2022-03-02','2022-03-03','2022-03-04','2022-03-05','2022-03-06']
        },
        {
          spaceName:"主干廊污水舱",
          capsuleValue:[10,48,35,45,55,65],
        },  {
          spaceName:"主干廊燃气舱",
          capsuleValue:[50,12,13,45,15,56],
        },  {
          spaceName:"主干廊电力舱",
          capsuleValue:[4,5,20,40,35,0],
        }
      ]
            this.temperature = [
        {
          spaceName:"主干廊综合舱",
          capsuleValue:[10,20,3,30,30,45],
          capsuleList:['2022-03-01','2022-03-02','2022-03-03','2022-03-04','2022-03-05','2022-03-06']
        },
        {
          spaceName:"主干廊污水舱",
          capsuleValue:[10,25,35,45,45,65],
        },  {
          spaceName:"主干廊燃气舱",
          capsuleValue:[11,50,13,48,15,40],
        },  {
          spaceName:"主干廊电力舱",
          capsuleValue:[0,5,45,40,35,0],
        }
      ]
      this.$chart.cabin("camera-lev", this.level);
      this.$chart.cabin("camera-oxy", this.oxygen);
      this.$chart.cabin("camera-met", this.methane);
      this.$chart.cabin("camera-ver", this.vertical);
      this.$chart.cabin("camera-hum", this.humidity);
      this.$chart.cabin("camera-tem", this.temperature);
    },
    onResize() {
      this.myChart();
    },
  },
};
</script>

<style lang="scss" scoped>
.camera {
  flex: 1;
  display: flex;
  flex-direction: column;
  .state {
    flex: 2;
    display: flex;
    flex-direction: column;
    .upper,
    .lower {
      flex: 1;
      display: flex;
      .card {
        flex: 1;
        display: flex;
        min-width: 280px;
        margin-right: 20px;
        padding: 20px 0px;
        .matter {
          flex: 5;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          .name {
            color: #fff;
            font-size: 14px;
            margin-top: 10px;
            letter-spacing: 1px;
            text-align: center;
          }
        }
        .source {
          flex: 6;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-left: 1px solid rgba(255, 255, 255, 0.17);
          padding-left: 35px;
          .all {
            display: flex;
            align-items: center;
            .name {
              width: 70px;
              font-size: 13px;
              color: #a7b3c2;
            }
            .value {
              color: #fff;
              font-size: 15px;
              font-weight: bold;
            }
          }
          .work {
            display: flex;
            margin: 10px 0px;
            align-items: center;
            .name {
              width: 70px;
              font-size: 13px;
              color: #a7b3c2;
            }
            .value {
              color: #fff;
              font-size: 15px;
              font-weight: bold;
            }
          }
          .breakdown {
            display: flex;
            align-items: center;
            .name {
              width: 70px;
              font-size: 13px;
              color: #f8818f;
            }
            .value {
              font-size: 15px;
              color: #a7b3c2;
              font-weight: bold;
            }
          }
        }
      }
    }
    .upper {
      .card {
        &:nth-child(5) {
          background-color: rgba(69, 128, 193, 0.7);
        }
        &:nth-child(4) {
          background-color: rgba(57, 110, 199, 0.7);
        }
        &:nth-child(3) {
          background-color: rgba(9, 158, 185, 0.7);
        }
        &:nth-child(2) {
          background-color: rgba(63, 142, 240, 0.7);
        }
        &:nth-child(1) {
          background-color: rgba(50, 174, 239, 0.7);
        }
      }
    }
    .lower {
      margin-top: 20px;
      .card {
        &:nth-child(1) {
          background-color: rgba(69, 128, 193, 0.7);
        }
        &:nth-child(2) {
          background-color: rgba(57, 110, 199, 0.7);
        }
        &:nth-child(3) {
          background-color: rgba(9, 158, 185, 0.7);
        }
        &:nth-child(4) {
          background-color: rgba(63, 142, 240, 0.7);
        }
        &:nth-child(5) {
          background-color: rgba(50, 174, 239, 0.7);
        }
      }
    }
  }
  .echarts {
    flex: 3;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    .upper,
    .lower {
      flex: 1;
      display: flex;
      margin-bottom: 20px;
      .echart {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: rgba(12, 34, 59, 0.81);
        margin-right: 20px;
        padding: 0px 10px;
        .name {
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(20, 56, 101, 0.5);
          padding: 0px 10px;
          font-size: 12px;
        }
        .myChart {
          flex: 1;
          padding: 10px 0px;
        }
      }
    }
  }
}
</style>
