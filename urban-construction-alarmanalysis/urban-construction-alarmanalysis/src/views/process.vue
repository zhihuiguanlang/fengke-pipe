<template>
  <div class="process" v-resize="onResize">
    <div class="auxiliary">
      <!-- 报警信息 -->
      <div class="police">
        <div class="graph_name">
          <span>报警信息</span>
          <v-select
            light
            dense
            outlined
            class="select"
            label="报警舱体"
            item-value="id"
            item-text="capName"
            background-color="#fff"
            :loading="deviceIdloading"
            v-model="deviceId"
            :items="list"
            @input="filter"
          />
          <v-select
            light
            dense
            outlined
            class="select"
            item-value="deviceType"
            item-text="disaster"
            label="报警类型"
            background-color="#fff"
            :loading="deviceTypeloading"
            v-model="deviceType"
            :items="type"
          />
        </div>
        <div class="infor">
          <div :class="[ baseData.gauge ? 'space':'', baseData.oxygen ? 'Heat':'', baseData.structural ? 'power':'' ]">
            <p
              class="interval inter"
            >{{ rule.capsuleName }}8{{ rule.segmentName }}发生{{ rule.disaster }}。</p>
            <p class="interval">现场传感器数据：</p>
            <p class="interval">
              温度：{{ baseData.temperature }}{{baseUnit.Temperature }}，湿度：{{ baseData.humidity }}{{baseUnit.Humidity }}，
              <span v-show="baseData.oxygen">氧气浓度{{ baseData.oxygen }}{{baseUnit.Oxygen }}。</span>
              <span v-show="baseData.gauge">集水坑液位{{ baseData.gauge }}{{baseUnit.Gauge }}。</span>
              <span v-show="baseData.structural">沉降{{ baseData.structural }}{{baseUnit.Structural }}。</span>
            </p>
            <p class="interval">现场人员数量：{{ baseData.personValue }}。</p>
          </div>
          <div class="echarts" ref="echarts">
            <div class="chart" :style="{maxHeight:ElE.echarts+'px'}">
              <div
                class="echart"
                v-for="(i, index) in plan"
                :key="index"
                :style="{minHeight:ElE.echarts/3.2+'px',maxHeight:ElE.echarts/3.2+'px'}"
              >
                <div class="myChart" :id="`myChart${index}`" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="monitor">
        <!-- 监控 -->
        <div class="video">
          <div class="video_name">
            <span>现场视频监控</span>
          </div>
          <div class="video_frame">
            <div class="video_frame1"></div>
            <div class="video_frame1"></div>
          </div>
        </div>
        <!-- 策略 -->
        <div class="strategy">
          <div class="strategy_name">
            <span>控制策略</span>
            <v-btn class="pa-2" light outlined color="cyan">
              <span v-show="baseData.oxygen">火灾</span>
              <span v-show="baseData.gauge">积水</span>
              <span v-show="baseData.structural">沉降</span>
              应急预案
            </v-btn>
          </div>
          <div class="settlement">
            <v-img
              v-show="baseData.oxygen"
              :src="imgUrl[0].oxygen"
              width="100%"
              height="100%"
              light
              alt
            />
            <v-img
              v-show="baseData.gauge"
              :src="imgUrl[1].gauge"
              width="100%"
              height="100%"
              light
              alt
            />
            <v-img
              v-show="baseData.structural"
              :src="imgUrl[2].structural"
              width="100%"
              height="100%"
              light
              alt
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "process",
  data: () => ({
    list: [],
    type: [],
    plan: [],
    imgUrl: [
      { oxygen: require("@/assets/images/police.png") },
      { gauge: require("@/assets/images/water.png") },
      { structural: require("@/assets/images/settlement.png") }
    ],
    rule: {
      capsuleId: "",
      segmentId: "",
      deviceType: ""
    },
    ElE: {
      echarts: 0,
    },
    baseData: {},
    baseUnit: {},
    disaster: [
      { title: "structural", value: "沉降" },
      { title: "oxygen", value: "火灾" },
      { title: "gauge", value: "积水" }
    ],
    deviceId: "",
    deviceType: "",
    timer: '',
    deviceIdloading: false,
    deviceTypeloading: false,
  }),
  mounted() {
    this.$nextTick(() => {
      this.ElE = {
        echarts: this.$refs.echarts.offsetHeight - 48 
      };
    });
    this.query();
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    query() {
      this.$axios.post("/dataManage/alarm/currentAlarm", {}).then(res => {
        if (res) {
          const list = res.result.filter(n =>
            n.deviceType == "oxygen" || n.deviceType == "structural" || n.deviceType == "gauge"
          );
          this.list = list.map(n => {
            for (const e of this.disaster) {
              if (n.deviceType == e.title) {
                n.disaster = e.value;
              }
            }
            return {
              ...n,
              capName: n.capsuleName + "/" + n.segmentName
            };
          });
          this.deviceId = this.list[0].id;
          this.type = this.list.filter(n => n.id == this.deviceId);
          this.deviceType = this.type[0].deviceType;
          this.rule = this.type[0];
          this.deviceIdloading = false;
          this.deviceTypeloading = false;
          this.create();
        }
      });
    },
    create() {
      const { capsuleId, segmentId, deviceType } = this.rule;
      this.$axios
        .post("/dataManage/alarm/currentAlarmBaseData", {
          capsuleId,
          segmentId,
          deviceType
        })
        .then(res => {
          if (res) {
            this.baseData = res.result;
            this.unit();
          }
        });
    },
    unit() {
      this.$axios
        .post("/api-assets/Paramter/list", {})
        .then(res => {
          if (res) {
            const baseUnit = {};
            const unit = this.deviceType.replace(this.deviceType[0],this.deviceType[0].toUpperCase()); // 首字母转换为大写
            for (const e of res.data) {
              if (e.name == 'Temperature') {  // 温度
                baseUnit.Temperature = e.unit;
              }
              if (e.name == 'Humidity') {  // 湿度
                baseUnit.Humidity = e.unit;
              }
              if (e.name == unit) {
                baseUnit[unit] = e.unit;
              }
            }
            this.baseUnit = baseUnit;
            this.metting();
          }
        });
    },
    metting() {
      const { capsuleId, segmentId, deviceType } = this.rule;
      this.$axios
        .post("/dataManage/alarm/currentAlarmDeviceData", {
          capsuleId,
          segmentId,
          deviceType
        })
        .then(res => {
          if (res) {
            const plan = [];
            const gatherTime = [];
            const duty = [];     
            const dutys = [];
            for (const key in res.result) {
              plan.push({ [key]: res.result[key]})
            }
            this.plan = plan.map(n=>{
              for (const key in res.result) {
                if(res.result[key] == n[key]){
                  for (const u of n[key]) {
                    n.parameters = u.parameters.slice(1, -1).split(",");
                    n.name = u.name.slice(0, -1);
                    gatherTime.push(this.formatDateTime(u.gatherTime));
                    if (n.parameters.length == 1) {
                      duty.push(u.value[n.parameters]);
                    }
                    if (n.parameters.length == 2) {
                      duty.push(u.value[n.parameters[0]]);    
                      dutys.push(u.value[n.parameters[1]]);
                    }       
                  }
                }
              }
              return {
                ...n,
                gatherTime,
                duty,
                dutys,
                unitType: this.deviceType.replace(this.deviceType[0],this.deviceType[0].toUpperCase()),
                baseUnit: this.baseUnit,
              }
            })
            this.$nextTick(() => {
              this.plan.forEach((n, v) => {
                this.$chart.line(`myChart${v}`, n);
              });
            });
            this.deviceIdloading = false;
            this.deviceTypeloading = false;
            // 轮询
            this.timer = setTimeout(() => {
              this.metting();
            }, 2000);
          }
        });
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
    filter(value) {
      this.deviceId = value;
      this.type = this.list.filter(n => n.id == this.deviceId);
      this.deviceType = this.type[0].deviceType;
      this.rule = this.type[0];
      this.deviceIdloading = true;
      this.deviceTypeloading = true;
      clearInterval(this.timer);
      this.create();
    },
    onResize() {
      this.reset();
    },
    reset() {
      // 重置
      this.$nextTick(() => {
        this.plan.forEach((n, v) => {
          this.$chart.line(`myChart${v}`, n);
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.process {
  height: 100%;
  .auxiliary {
    display: flex;
    height: 100%;
    .police {
      flex: 1;
      display: flex;
      flex-direction: column;
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
          width: 230px;
          height: 40px;
          margin-left: 10px;
        }
      }
      .infor {
        flex: 1;
        display: flex;
        flex-direction: column;
        .space {
          box-sizing: border-box;
          font-size: 20px;
          word-wrap: break-word;
          color: #02a7f0;
          padding: 30px 0 20px;
        }
        .Heat {
          box-sizing: border-box;
          font-size: 20px;
          word-wrap: break-word;
          padding: 30px 0 20px;
          color: #f59a23;
        }
        .power {
          box-sizing: border-box;
          font-size: 20px;
          word-wrap: break-word;
          padding: 30px 0 20px;
          color: #d9001b;
        }
        .inter {
          font-weight: 700;
        }
        .interval {
          margin-bottom: 0;
        }
        .echarts {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          .chart {
            display: flex;
            width: 100%;
            flex: 1;
            flex-direction: column;
            background-color: #ffffff;
            .echart {
              display: flex;
              width: 100%;
              flex: 1;
              margin: 10px 10px 0px 0px;
              flex-direction: column;
              background-color: #ffffff;
              .myChart {
                flex: 1;
                background-color: #ffffff;
              }
            }
          }
        }
      }
    }
    .monitor {
      flex: 2;
      display: flex;
      flex-direction: column;
      padding-left: 40px;
      .video {
        flex: 1;
        display: flex;
        flex-direction: column;
        .video_name {
          height: 20px;
          display: flex;
          color: #333333;
          line-height: 20px;
          padding-left: 15px;
          align-items: center;
          margin: 12px 0px 10px 0px;
          align-content: flex-start;
          border-left: 5px solid #00bcd4;
        }
        .video_frame {
          display: flex;
          flex: 1;
          flex-direction: row;
          .video_frame1 {
            flex: 1;
            padding: 20px;
            border: 1px solid red;
          }
        }
      }
      .strategy {
        flex: 1;
        display: flex;
        flex-direction: column;
        .strategy_name {
          height: 20px;
          display: flex;
          color: #333333;
          line-height: 20px;
          padding-left: 15px;
          margin: 12px 0px 10px 0px;
          align-content: flex-start;
          justify-content: space-between;
          border-left: 5px solid #00bcd4;
        }
        .settlement {
          flex: 1;
          width: 80%;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>