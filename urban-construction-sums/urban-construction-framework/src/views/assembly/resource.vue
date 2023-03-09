<template>
  <div class="resource" v-resize.quiet="onResize">
    <!-- 自动报表 -->
    <div class="report">
      <!-- 表单 -->
      <div class="table">
        <div class="work">
          <div class="name">历史报警</div>
          <div class="content" ref="common">
            <div class="sheet">
              <v-simple-table class="simple" fixed-header :height="ElE.common">
                <template #default>
                  <thead>
                    <tr class="item">
                      <th>报警设备</th>
                      <th>所属舱体</th>
                      <th>报警类型</th>
                      <th>报警原因</th>
                      <th>报警级别</th>
                      <th>报警时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="item" v-for="item in alarm" :key="item.id">
                      <td>{{ item.deviceName }}</td>
                      <td>{{ item.capsuleName }}</td>
                      <td>{{ item.typeName }}</td>
                      <td>{{ item.reason }}</td>
                      <td>{{ item.level }}</td>
                      <td>{{ item.alarmTime }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </div>
          </div>
        </div>
      </div>
      <!-- 预警 -->
      <div class="ability">
        <!-- 图表 -->
        <div class="ai">
          <div class="name">
            <div class="ai-info">
              <span>预警信息</span>
              <v-select
                v-show="!future"
                :loading="coploading"
                :items="warning"
                item-text="coping"
                item-value="id"
                v-model="cop"
                class="select"
                open-on-clear
                outlined
                dark
                dense
                @input="filtrate"
              />
            </div>
            <v-btn-toggle v-model="future" color="#fff" mandatory group dense>
              <v-btn text>
                <v-icon>mdi-chart-bar-stacked</v-icon>
              </v-btn>
              <v-btn text>
                <v-icon>mdi-format-float-left</v-icon>
              </v-btn>
            </v-btn-toggle>
          </div>
          <div class="content" ref="ai">
            <v-tabs-items class="_tabs" v-model="future">
              <!-- 图表 -->
              <v-tab-item class="_item">
                <div class="caution" id="resource-ai" />
              </v-tab-item>
              <!-- 表格 -->
              <v-tab-item class="_item">
                <div class="sheet">
                  <v-simple-table class="simple" fixed-header :height="ElE.ai">
                    <template #default>
                      <thead>
                        <tr class="item">
                          <th>名称</th>
                          <th>所属舱体</th>
                          <th>所属防火段</th>
                          <th>健康值</th>
                          <th>位置</th>
                          <th>类型</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="item" v-for="(item, index) in warning" :key="index">
                          <td>{{ item["deviceInfo"].name }}</td>
                          <td>{{ item["deviceInfo"].spaceName }}</td>
                          <td>{{ item["deviceInfo"].capsuleName }}</td>
                          <td>{{ item["deviceInfo"].healthIndex }}</td>
                          <td>{{ item["deviceInfo"].capsuleLocation }}</td>
                          <td>{{ item["deviceInfo"].type }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                  <div v-if="!warning.length" class="grey--text text-center ma-5">暂无数据</div>
                </div>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </div>
        <!-- 警示 -->
        <div class="hint">
          <!-- 系统视图 -->
          <v-icon size="45" color="#12bed1">mdi-robot</v-icon>
          <!-- 系统名称 -->
          <div class="name">预警辅助分析决策系统</div>
        </div>
      </div>
    </div>
    <!-- 数据图表 -->
    <div class="echarts">
      <!-- 遍历数据 -->
      <!-- 四份 -->
      <div class="upper">
        <div class="echart">
          <div class="name">
            液位曲线
            <v-btn-toggle v-model="level" color="#fff" mandatory group dense>
              <v-btn
                :key="index"
                :text="true"
                :value="i.id"
                v-for="(i, index) in cabin"
              >{{ i.name }}</v-btn>
            </v-btn-toggle>
          </div>
          <div class="myChart" id="resource-lev" />
        </div>
        <div class="echart">
          <div class="name">
            氧气曲线
            <v-btn-toggle v-model="oxygen" color="#fff" mandatory group dense>
              <v-btn
                :key="index"
                :text="true"
                :value="i.id"
                v-for="(i, index) in cabin"
              >{{ i.name }}</v-btn>
            </v-btn-toggle>
          </div>
          <div class="myChart" id="resource-oxy" />
        </div>
        <div class="echart">
          <div class="name">
            甲烷曲线
            <v-btn-toggle v-model="methane" color="#fff" mandatory group dense>
              <v-btn
                :key="index"
                :text="true"
                :value="i.id"
                v-for="(i, index) in cabin"
              >{{ i.name }}</v-btn>
            </v-btn-toggle>
          </div>
          <div class="myChart" id="resource-met" />
        </div>
      </div>
      <!-- 四份 -->
      <div class="lower">
        <div class="echart">
          <div class="name">
            沉降曲线
            <v-btn-toggle v-model="vertical" color="#fff" mandatory group dense>
              <v-btn
                :key="index"
                :text="true"
                :value="i.id"
                v-for="(i, index) in cabin"
              >{{ i.name }}</v-btn>
            </v-btn-toggle>
          </div>
          <div class="myChart" id="resource-ver" />
        </div>
        <div class="echart">
          <div class="name">
            湿度曲线
            <v-btn-toggle v-model="humidity" color="#fff" mandatory group dense>
              <v-btn
                :key="index"
                :text="true"
                :value="i.id"
                v-for="(i, index) in cabin"
              >{{ i.name }}</v-btn>
            </v-btn-toggle>
          </div>
          <div class="myChart" id="resource-hum" />
        </div>
        <div class="echart">
          <div class="name">
            温度曲线
            <v-btn-toggle v-model="temperature" color="#fff" mandatory group dense>
              <v-btn
                :key="index"
                :text="true"
                :value="i.id"
                v-for="(i, index) in cabin"
              >{{ i.name }}</v-btn>
            </v-btn-toggle>
          </div>
          <div class="myChart" id="resource-tem" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入主板模块
const echarts = require("echarts/lib/echarts");
import { mapGetters } from "vuex";
export default {
  name: "resource",
  data() {
    return {
      work: 0,
      future: 0,
      level: 0,
      oxygen: 0,
      methane: 0,
      vertical: 0,
      humidity:0,
      temperature: 0,
      timer: "",
      ai: {
        deviceInfo: {}
      },
      warning: [],
      cabin: [],
      alarm: [],
      levelResult: [],
      oxygenResult: [],
      methaneResult: [],
      verticalResult: [],
      humidityResult: [],
      temperatureResult: [],
      cop: '',
      coploading: false,
      ElE: {
        ai: 0,
        common: 0
      }
    };
  },
  computed: {
    // 数据仓库
    ...mapGetters(["mySource"]),
  },
  watch: {
    mySource: {
      handler(n) {
        if (n =='resource') {
          this.myAi();
        } else {
          // 清除定时器
          clearInterval(this.timer);
        }
      },
      immediate: true,
      deep: true
    },
    level: {
      handler() {
        this.mylevel();
      },
      immediate: true,
      deep: true
    },
    oxygen: {
      handler() {
        this.myOxygen();
      },
      immediate: true,
      deep: true
    },
    methane: {
      handler() {
        this.myMethane();
      },
      immediate: true,
      deep: true
    },
    vertical: {
      handler() {
        this.myVertical();
      },
      immediate: true,
      deep: true
    },
    humidity: {
      handler() {
        this.myHumidity();
      },
      immediate: true,
      deep: true
    },
    temperature: {
      handler() {
        this.myTemperature();
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    this.reset();
    this.myCabin();
    this.myAlarm();
  },
  created(){
    this.onResize();
  },
  methods: {
    myAlarm() {

      this.alarm = [
        { deviceName: "位移控制仪1",
            capsuleName: "位移控制仪",
            segmentName: "控制仪",
            alarmValue: "800",
            typeName: "控制仪类型",
            reason: "原因",
            name: "位移控制仪",
            id: 1,
            spaceName: "控制仪",
            alarmTime: '2022-03-01',
            healthIndex: 800,
            level: 2,
            type: "控制"}, { deviceName: "位移控制仪2",
            capsuleName: "位移控制仪",
            segmentName: "控制仪",
            alarmValue: "800",
            typeName: "控制仪类型",
            reason: "原因",
            name: "位移控制仪",
            id: 1,
            spaceName: "控制仪",
            alarmTime: '2022-03-01',
            healthIndex: 800,
            level: 2,
            type: "控制"}, { deviceName: "位移控制仪3",
            capsuleName: "位移控制仪",
            segmentName: "控制仪",
            alarmValue: "800",
            typeName: "控制仪类型",
            reason: "原因",
            name: "位移控制仪",
            id: 1,
            spaceName: "控制仪",
            alarmTime: '2022-03-01',
            healthIndex: 800,
            level: 2,
            type: "控制"}
      ]


      this.$axios
        .post("/dataManage/alarm/getAllAlarm", {
          pageNum: 1,
          pageSize: 100
        })
        .then(res => {
          if (res) {
            this.alarm = res.result.list.map(res => {
              return {
                ...res,
                alarmTime: new Date(res.alarmTime).toLocaleString()
              };
            });
          }
        });
    },
    myCabin() {
      this.$axios.post("/device-center/SpaceManage/list").then(res => {
        if (res) {
          this.cabin = res.data;
        }
      });
    },
    mylevel() {
      this.$chart.week("resource-lev", this.levelResult);
      this.$axios
        .post("/dataManage/dataAnalysis/getDateByWeek", {
          id: this.level,
          dataKey: "level"
        })
        .then(res => {
          if (res) {
            // 赋值
            this.levelResult = res.result;
            // 绘制
            this.$chart.week("resource-lev", this.levelResult);
          }
        });
    },
    myOxygen() {
                  this.$chart.week("resource-oxy", this.oxygenResult);

      this.$axios
        .post("/dataManage/dataAnalysis/getDateByWeek", {
          id: this.oxygen,
          dataKey: "oxygen"
        })
        .then(res => {
          if (res) {
            // 赋值
            this.oxygenResult = res.result;
            // 绘制
            this.$chart.week("resource-oxy", this.oxygenResult);
          }
        });
    },
    myMethane() {
                  this.$chart.week("resource-met", this.methaneResult);

      this.$axios
        .post("/dataManage/dataAnalysis/getDateByWeek", {
          id: this.methane,
          dataKey: "methane"
        })
        .then(res => {
          if (res) {
            // 赋值
            this.methaneResult = res.result;
            // 绘制
            this.$chart.week("resource-met", this.methaneResult);
          }
        });
    },
    myVertical() {
                  this.$chart.week("resource-ver", this.verticalResult);

      this.$axios
        .post("/dataManage/dataAnalysis/getDateByWeek", {
          id: this.vertical,
          dataKey: "vertical"
        })
        .then(res => {
          if (res) {
            // 赋值
            this.verticalResult = res.result;
            // 绘制
            this.$chart.week("resource-ver", this.verticalResult);
          }
        });
    },
    myHumidity() {
                  this.$chart.week("resource-hum", this.humidityResult);

      this.$axios
        .post("/dataManage/dataAnalysis/getDateByWeek", {
          id: this.humidity,
          dataKey: "humidity"
        })
        .then(res => {
          if (res) {
            // 赋值
            this.humidityResult = res.result;
            // 绘制
            this.$chart.week("resource-hum", this.humidityResult);
          }
        });
    },
    myTemperature() {
                  this.$chart.week("resource-tem", this.temperatureResult);

      this.$axios
        .post("/dataManage/dataAnalysis/getDateByWeek", {
          id: this.temperature,
          dataKey: "temperature"
        })
        .then(res => {
          if (res) {
            // 赋值
            this.temperatureResult = res.result;
            // 绘制
            this.$chart.week("resource-tem", this.temperatureResult);
          }
        });
    },
    myAi(value) {
      value = 99;
      this.warning = [
        {
          deviceInfo: {
            deviceName: "位移控制仪1",
            capsuleName: "位移控制仪",
            segmentName: "控制仪", 
            alarmValue: "800",
            typeName: "控制仪类型",
            reason: "reson",
            name: "位移控制仪",
            spaceName: "控制仪",
            times: new Date(),
            healthIndex: 800,
            id:99,
            capsuleLocation: "上海",
            type: "控制",
          },
          data: [800],
        },
      ];
      this.warning = this.warning.map((n) => {
        return {
          ...n,
          id: `${n.deviceInfo.id}`,
          coping: `${n.deviceInfo.spaceName}/${n.deviceInfo.capsuleName}/${n.deviceInfo.name}`,
        };
      });

      this.myEarly(this.warning, value);
      this.$axios.post("/dataManage/alarm/earlyWarn", {}).then(res => {
        if (res) {
          // 预警信息列表
          this.warning = res.result.map(n => {
            return {
              ...n,
              id: `${n.deviceInfo.id}`,
              coping: `${n.deviceInfo.spaceName}/${n.deviceInfo.capsuleName}/${n.deviceInfo.name}`
            }; 
          });
          this.myEarly(res.result, value);
        }
      });
    },
    myEarly(result, value) {
      if (result.length) {
        // 用户选择报警设备
        const v = this.warning.findIndex((e) => e.id == value);
        // 随机选取报警设备
        const n = !value ? Math.random() * (result.length - 1) : v;
        const ai = [result[parseInt(n)]];
        // 数据整合
        this.ai = {
          source: [],
          ...ai[0],
          // time: ai[0].times.concat(ai[0].earlyTimes),
        };
        this.cop = this.ai.deviceInfo.id.toString();
        for (const i in this.ai.data) {
          this.ai.source.push({
            type: "line",
            name: `当前数值(${i})`,
            smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(18,190,209,.3)",
                },
                {
                  offset: 1,
                  color: "rgba(32,94,101,.2)",
                },
              ]),
            },
            itemStyle: {
              normal: {
                color: "coral",
                lineStyle: {
                  color: "#12bed1",
                },
              },
            },
            markArea: {
              data: [
                [
                  {
                    name: "预测",
                    itemStyle: {
                      color: this.ai.isAlarm
                        ? "rgba(198,40,40)"
                        : "rgba(50,205,50)",
                    },
                    label: {
                      show: true,
                      color: "white",
                      offset: [0, 0],
                    },
                  },
                  {
                    xAxis: "0",
                  },
                ],
              ],
            },
            data:
                [
                    ["2022-03-02", "950"],
                    ["2022-03-03", "990"],
                    ["2022-03-04", "1200"],
                    ["2022-03-05", "1050"],
                    ["2022-03-06", "1000"],
                  ]
                ,
          });
        }
        this.coploading = false;
        // 渲染图表
        this.$chart.ai("resource-ai", this.ai);
      }
    },
    filtrate(value) {
      // 赋值
      this.cop = value;
      this.coploading = true;
      // 清除定时器
      clearInterval(this.timer);
      // 图表
      this.myAi(value);
    },
    myChart() {
      // 类型图表
      this.levelResult = [
        {
          date: ['2022-03-01','2022-03-02','2022-03-03','2022-03-04','2022-03-05','2022-03-06'],
          value:[1,57,3,30,30,45]
        }
      ]
       this.oxygenResult = [
        {
          date: ['2022-03-01','2022-03-02','2022-03-03','2022-03-04','2022-03-05','2022-03-06'],
          value:[2,40,3,30,30,25]
        }
      ]
       this.methaneResult = [
        {
          date: ['2022-03-01','2022-03-02','2022-03-03','2022-03-04','2022-03-05','2022-03-06'],
          value:[20,9,3,50,30,40]
        }
      ]
       this.verticalResult = [
        {
          date: ['2022-03-01','2022-03-02','2022-03-03','2022-03-04','2022-03-05','2022-03-06'],
          value:[1,68,3,30,54,30]
        }
      ]
       this.humidityResult = [
        {
          date: ['2022-03-01','2022-03-02','2022-03-03','2022-03-04','2022-03-05','2022-03-06'],
          value:[60,23,3,30,30,0]
        }
      ]
       this.temperatureResult = [
        {
          date: ['2022-03-01','2022-03-02','2022-03-03','2022-03-04','2022-03-05','2022-03-06'],
          value:[5,46,3,32,30,7]
        }
      ]
      this.$chart.week("resource-lev", this.levelResult);
      this.$chart.week("resource-oxy", this.oxygenResult);
      this.$chart.week("resource-met", this.methaneResult);
      this.$chart.week("resource-ver", this.verticalResult);
      this.$chart.week("resource-hum", this.humidityResult);
      this.$chart.week("resource-tem", this.temperatureResult);
      // 预警图表
      this.$chart.ai("resource-ai", this.ai);
      this.filtrate(99);
    },
    onResize() {
      this.reset();
      this.myChart();
    },
    reset() {
      this.$nextTick(() => {
        this.ElE = {
          ai: this.$refs.ai.offsetHeight,
          common: this.$refs.common.offsetHeight
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.resource {
  flex: 1;
  display: flex;
  flex-direction: column;
  .report {
    flex: 1;
    display: flex;
    .table {
      flex: 4;
      display: flex;
      margin-right: 20px;
      .work {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: rgba(12, 34, 59, 0.81);
        padding: 0px 10px;
        .name {
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(20, 56, 101, 0.5);
          font-size: 12px;
          padding: 0px 10px;
        }
        .content {
          flex: 1;
          display: flex;
          .sheet {
            flex: 1;
            .simple {
              background-color: transparent;
              .item {
                td {
                  text-align: center;
                  background-color: transparent;
                  font-size: 12px;
                }
                th {
                  text-align: center;
                  background-color: rgba(12, 34, 59, 0.81);
                }
              }
            }
          }
        }
      }
    }
    .ability {
      flex: 3;
      display: flex;
      margin-right: 20px;
      background-color: rgba(12, 34, 59, 0.81);
      .ai {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0px 10px;
        .name {
          height: 45px;
          line-height: 45px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(20, 56, 101, 0.5);
          font-size: 12px;
          padding: 0px 10px;
          .ai-info {
            display: flex;
            .select {
              flex: none;
              width: 300px;
              height: 40px;
              margin-left: 12px;
            }
          }
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
              .caution {
                flex: 1;
              }
              .sheet {
                flex: 1;
                .simple {
                  background-color: transparent;
                  .item {
                    td {
                      text-align: center;
                      background-color: transparent;
                      font-size: 12px;
                    }
                    th {
                      text-align: center;
                      background-color: rgba(12, 34, 59, 0.81);
                    }
                  }
                }
              }
            }
          }
        }
      }
      .hint {
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 1px solid rgba(20, 56, 101, 0.5);
        flex-direction: column;
        padding: 0px 15px;
        font-size: 12px;
        color: #fff;
        .name {
          width: 50px;
          margin-top: 15px;
          line-height: 25px;
          text-align: center;
        }
      }
    }
  }
  .echarts {
    flex: 2;
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
