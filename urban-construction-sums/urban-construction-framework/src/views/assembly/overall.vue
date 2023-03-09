<template>
  <div class="overall" v-resize="onResize">
    <!-- 五分之三 -->
    <div class="gis">
      <!-- 状态 -->
      <div class="state">
        <!-- 仪表盘 -->
        <div class="plate">
          <div class="matter">
            <v-progress-circular
              :color="`green`"
              :rotate="-90"
              :size="size"
              :width="10"
              :value="96"
            >
              <span class="circular">96%</span>
            </v-progress-circular>
            <div class="details">
              <div class="source">
                <v-icon size="17" color="#64acb7"
                  >mdi-account-cowboy-hat</v-icon
                >
                <span class="name">入廊人员：</span>
                <span class="value">
                  {{ indoor.length + sans.length }}
                  人
                </span>
              </div>
              <div class="source">
                <v-icon size="17" color="#77d1ff">mdi-update</v-icon>
                <span class="name">运行时间：</span>
                <span class="value">71天</span>
              </div>
              <div class="source">
                <v-icon size="17" color="#4bdd67">mdi-shield-cross</v-icon>
                <span class="name">安全状态：</span>
                <span class="value">安全</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 表格 -->
        <div class="table">
          <div class="name">
            入廊人员名单
            <v-btn-toggle v-model="person" color="#fff" mandatory group dense>
              <v-btn text>外部入廊人员名单</v-btn>
              <v-btn text>内部入廊人员名单</v-btn>
            </v-btn-toggle>
          </div>
          <div class="source" ref="gallery">
            <v-tabs-items class="_tabs" v-model="person">
              <!-- 外部人员表格 -->
              <v-tab-item class="_item">
                <div class="sheet">
                  <v-simple-table
                    class="simple"
                    fixed-header
                    :height="indoor.length ? ElE.gallery : 100"
                  >
                    <template #default>
                      <thead>
                        <tr class="item">
                          <th>申请人</th>
                          <th>申请时间</th>
                          <th>陪同人</th>
                          <th>规定离开时间</th>
                          <th>审批人</th>
                          <th>状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          class="item"
                          v-for="(item, index) in indoor"
                          :key="index"
                        >
                          <td>{{ item.name }}</td>
                          <td>
                            {{ new Date(item.createTime).toLocaleDateString() }}
                          </td>
                          <td>{{ item.accompanyingPersonName == '哈哈哈' ? 'hhh': item.accompanyingPersonName }}</td>
                          <td>
                            {{
                              new Date(
                                item.scheduleEndTime
                              ).toLocaleDateString()
                            }}
                          </td>
                          <td>{{ item.leaderApprovalName }}</td>
                          <td>{{ status[item.status] }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                  <div
                    v-if="!indoor.length"
                    class="grey--text text-center ma-5"
                  >
                    暂无数据
                  </div>
                </div>
              </v-tab-item>
              <!-- 内部人员表格 -->
              <v-tab-item class="_item">
                <div class="sheet">
                  <v-simple-table
                    class="simple"
                    fixed-header
                    :height="sans.length ? ElE.gallery : 100"
                  >
                    <template #default>
                      <thead>
                        <tr class="item">
                          <th>申请人</th>
                          <th>申请时间</th>
                          <th>入廊人员</th>
                          <th>规定离开时间</th>
                          <th>审批人</th>
                          <th>状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          class="item"
                          v-for="(item, index) in sans"
                          :key="index"
                        >
                          <td>{{ item.submitterName }}</td>
                          <td>
                            {{ new Date(item.createTime).toLocaleDateString() }}
                          </td>
                          <td>{{ item.pipeUserName }}</td>
                          <td>
                            {{
                              new Date(
                                item.ruleDepartureTime
                              ).toLocaleDateString()
                            }}
                          </td>
                          <td>{{ item.acceptUserName }}</td>
                          <td>{{ status[item.status] }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                  <div v-if="!sans.length" class="grey--text text-center ma-5">
                    暂无数据
                  </div>
                </div>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </div>
      </div>
      <!-- 地图 -->
      <div class="map">
        <div id="gis" class="unit" />
      </div>
    </div>
    <!-- 五分之二 -->
    <div class="message">
      <!-- 预警 -->
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
        <div class="content" ref="common">
          <v-tabs-items class="_tabs" v-model="future">
            <!-- 图表 -->
            <v-tab-item class="_item">
              <div class="echarts" id="overall-ai" />
            </v-tab-item>
            <!-- 表格 -->
            <v-tab-item class="_item">
              <div class="sheet">
                <v-simple-table
                  class="simple"
                  fixed-header
                  :height="warning.length ? ElE.common : 100"
                >
                  <template #default>
                    <thead>
                      <tr class="item">
                        <th>名称</th>
                        <th>舱体</th>
                        <th>防火段</th>
                        <th>健康值</th>
                        <th>位置</th>
                        <th>类型</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        class="item"
                        v-for="(item, index) in warning"
                        :key="index"
                      >
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
                <div v-if="!warning.length" class="grey--text text-center ma-5">
                  暂无数据
                </div>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
      <!-- 报警 -->
      <div class="alarm">
        <div class="name">
          <div class="alarm-info">
            <span>报警信息</span>
            <v-select
              v-show="!warn"
              :loading="alarmloading"
              :items="plan"
              item-text="alarm"
              item-value="id"
              v-model="alarm"
              class="select"
              open-on-clear
              outlined
              dark
              dense
              @input="filter"
            />
          </div>
          <v-btn-toggle v-model="warn" color="#fff" mandatory group dense>
            <v-btn text>
              <v-icon>mdi-chart-bar-stacked</v-icon>
            </v-btn>
            <v-btn text>
              <v-icon>mdi-format-float-left</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
        <div class="content">
          <v-tabs-items class="_tabs" v-model="warn">
            <!-- 图表 -->
            <v-tab-item class="_item">
              <div class="echarts" id="overall-alarm" />
            </v-tab-item>
            <!-- 表格 -->
            <v-tab-item class="_item">
              <div class="sheet">
                <v-simple-table
                  class="simple"
                  fixed-header
                  :height="plan.length ? ElE.common : 100"
                >
                  <template #default>
                    <thead>
                      <tr class="item">
                        <th>名称</th>
                        <th>舱体</th>
                        <th>防火段</th>
                        <th>报警值</th>
                        <th>类型</th>
                        <th>原因</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        class="item"
                        v-for="(item, index) in plan"
                        :key="index"
                      >
                        <td>{{ item.deviceName }}</td>
                        <td>{{ item.capsuleName }}</td>
                        <td>{{ item.segmentName }}</td>
                        <td>{{ item.alarmValue }}</td>
                        <td>{{ item.typeName }}</td>
                        <td>{{ item.reason }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <div v-if="!plan.length" class="grey--text text-center ma-5">
                  暂无数据
                </div>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
      <!-- 工单 -->
      <div class="work">
        <div class="name">
          工单信息
          <v-btn-toggle v-model="work" color="#fff" mandatory group dense>
            <v-btn text>已完成</v-btn>
            <v-btn text>未完成</v-btn>
          </v-btn-toggle>
        </div>
        <div class="content">
          <v-tabs-items class="_tabs" v-model="work">
            <!-- 已完成表格 -->
            <v-tab-item class="_item">
              <div class="sheet">
                <v-simple-table
                  class="simple"
                  fixed-header
                  :height="finish.length ? ElE.common : 100"
                >
                  <template #default>
                    <thead>
                      <tr class="item">
                        <th>工单编号</th>
                        <th>工单名称</th>
                        <th>工单类型</th>
                        <th>提交人</th>
                        <th>提交时间</th>
                        <th>状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in finish"
                        class="item"
                        :key="index"
                      >
                        <td>{{ item.code }}</td>
                        <td>{{ item.title }}</td>
                        <td>{{ item.type }}</td>
                        <td>{{ item.submitterName }}</td>
                        <td>
                          {{ new Date(item.createTime).toLocaleDateString() }}
                        </td>
                        <td>{{ status[item.status] }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <div v-if="!finish.length" class="grey--text text-center ma-5">
                  暂无数据
                </div>
              </div>
            </v-tab-item>
            <!-- 未完成表格 -->
            <v-tab-item class="_item">
              <div class="sheet">
                <v-simple-table
                  class="simple"
                  fixed-header
                  :height="accept.length ? ElE.common : 100"
                >
                  <template #default>
                    <thead>
                      <tr class="item">
                        <th>工单编号</th>
                        <th>工单名称</th>
                        <th>工单类型</th>
                        <th>提交人</th>
                        <th>提交时间</th>
                        <th>状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in accept"
                        class="item"
                        :key="index"
                      >
                        <td>{{ item.code }}</td>
                        <td>{{ item.title }}</td>
                        <td>{{ item.type }}</td>
                        <td>{{ item.submitterName }}</td>
                        <td>
                          {{ new Date(item.createTime).toLocaleDateString() }}
                        </td>
                        <td>{{ status[item.status] }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <div v-if="!accept.length" class="grey--text text-center ma-5">
                  暂无数据
                </div>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 地图资源
import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import Icon from "ol/style/Icon";
import Fill from "ol/style/Fill";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Polygon from "ol/geom/Polygon";
import TileLayer from "ol/layer/Tile";
import * as control from "ol/control";
import LayerVector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import ScaleLine from "ol/control/ScaleLine";

// 引入主板模块
const echarts = require("echarts/lib/echarts");
import { mapGetters } from "vuex";
export default {
  name: "overall",
  data() {
    return {
      person: 0,
      work: 0,
      warn: 0,
      future: 0,
      ElE: {
        common: 0,
        gallery: 0,
      },
      type: {
        1: "运维人员",
        2: "外部人员",
      },
      status: {
        0: "已提交",
        1: "已发起",
        2: "已接受",
        4: "已确认",
        5: "已驳回",
      },
      ai: {
        deviceInfo: {},
      },
      map: {},
      warning: [],
      curve: {},
      indoor: [],
      sans: [],
      finish: [],
      accept: [],
      plan: [],
      cop: "",
      alarm: "",
      coploading: false,
      alarmloading: false,
      message: {},
      desserts: [],
      myAiTimer: "",
      myAlarmtimer: "",
    };
  },
  computed: {
    size() {
      if (this.$vuetify.breakpoint.name == "lg") {
        return 100;
      } else {
        return 200;
      }
    },
    // 数据仓库
    ...mapGetters(["mySource"]),
  },
  watch: {
    mySource: {
      handler(n) {
        if (n == "overall") {
          this.myAi();
          this.myAlarm();
        } else {
          // 清除定时器
          clearInterval(this.myAiTimer);
          clearInterval(this.myAlarmtimer);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.reset();
    this.mySans();
    this.myIndoor();
    this.myFinish();
    this.mySuperMap();
  },
  created(){
    this.myAlarm();
    this.myAi();
    this.filtrate(1);
  },
  methods: {

    mySuperMap() {
      // 基础图层
      const map = new Map({
        target: "gis",
        controls: control.defaults({
          attribution: false,
        }),
        layers: [
          new TileLayer({
            source: new OSM(),
            projection: "EPSG:4326",
          }),
        ],
        view: new View({
          zoom: 17,
          multiWorld: true,
          projection: "EPSG:4326",
          rotation: Math.PI / 2,
          center: [116.4627, 40.1211],
        }),
      });
      // 基础控件
      map.addControl(new ScaleLine());
      //点要素
      var pointFeature = new Feature({
        name: "张三（目前所在的位置）",
        geometry: new Point([116.4624, 40.1219]),
      });
      //多边形要素
      var polygonFeature = new Feature(
        new Polygon([
          [
            [116.4615, 40.1059],
            [116.4618, 40.1158],
            [116.4621, 40.1211],
            [116.4627, 40.1265],
            [116.4669, 40.1323],
            [116.4674, 40.1335],
            [116.4676, 40.1362],
            [116.4679, 40.1362],
            [116.4678, 40.1335],
            [116.4673, 40.1323],
            [116.4631, 40.1265],
            [116.4625, 40.1211],
            [116.4622, 40.1158],
            [116.4619, 40.1059],
          ],
        ])
      );
      // 实例化一个矢量图层Vector作为绘制层
      var source = new SourceVector({
        features: [pointFeature, polygonFeature],
      });
      // 定义样式
      var vectorLayer = new LayerVector({
        source,
        style: new Style({
          // 边框
          stroke: new Stroke({
            width: 3,
            color: "#757575",
          }),
          // 填充
          fill: new Fill({
            color: "rgba(55,187,134,.2)",
          }),
          // 标点
          image: new Icon({
            anchor: [0.5, 0.94],
            src: "https://openlayers.org/en/v4.6.5/examples/data/icon.png",
          }),
        }),
      });
      //将绘制层添加到地图容器中
      map.addLayer(vectorLayer);
      // 地图实例
      this.map = map;
    },
    myIndoor() {
      this.$axios.post("/api-ops/ExternalStaffPipe/list", {}).then((res) => {
        if (res) {
          this.indoor = res.data;
        }
      });
    },
    mySans() {
      this.$axios.post("/api-ops/staffpipe/list", {}).then((res) => {
        if (res) {
          this.sans = res.data;
        }
      });
    },
    myFinish() {
      this.$axios
        .post("/api-ops/workorder/page", {
          page: 1,
          limit: 999,
        })
        .then((res) => {
          if (res) {
            this.finish = res.data.records.filter(
              (res) => res.status == 4 || res.status == 5
            );
            this.accept = res.data.records.filter(
              (res) => res.status == 0 || res.status == 1 || res.status == 2
            );
          }
        });
    },
    myAi(value) {
      value = 1;
      this.warning = [
        {
          deviceInfo: {
            deviceName: "位移控制仪",
            capsuleName: "位移控制仪",
            segmentName: "控制仪",
            alarmValue: "800",
            typeName: "控制仪类型",
            reason: "reson",
            name: "位移控制仪",
            id: 1,
            spaceName: "控制仪",
            times: new Date(),
            healthIndex: 800,
            capsuleLocation: "上海",
            type: "控制",
          },
          id: 1,
          data: [800, 1200],
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

      this.$axios.post("/dataManage/alarm/earlyWarn", {}).then((res) => {
        if (res) {
          // 预警信息列表
          this.warning = res.result.map((n) => {
            return {
              ...n,
              id: `${n.deviceInfo.id}`,
              coping: `${n.deviceInfo.spaceName}/${n.deviceInfo.capsuleName}/${n.deviceInfo.name}`,
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
                    xAxis:"2022-03-06",
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
                    xAxis: ["2022-03-02","2022-03-03","2022-03-04","2022-03-05","2022-03-06"],
                  },
                ],
              ],
            },
            data:
              i == 1
                ? [
                    ["2022-03-02", "950"],
                    ["2022-03-03", "990"],
                    ["2022-03-04", "1200"],
                    ["2022-03-05", "1050"],
                    ["2022-03-06", "1000"],
                  ]
                : [
                    ["2022-03-02", "700"],
                    ["2022-03-03", "800"],
                    ["2022-03-04", "600"],
                    ["2022-03-05", "780"],
                    ["2022-03-06", "1100"],
                  ],
          });
        }
        this.coploading = false;
        // 渲染图表
        this.$chart.ai("overall-ai", this.ai);
        this.myAlarm();
      }
    },
    myAlarm() {
      this.plan = [
        {
          deviceInfo: {
            deviceName: "位移控制仪",
            capsuleName: "位移控制仪",
            segmentName: "控制仪",
            alarmValue: "800",
            typeName: "控制仪类型",
            reason: "reson",
            name: "位移控制仪",
            id: 11,
            spaceName: "控制仪",
            times: new Date(),
            healthIndex: 800,
            capsuleLocation: "上海",
            type: "控制",
          },
          id: 11,
          deviceName: "位移控制仪",
          capsuleName: "位移控制仪",
          segmentName: "控制仪",
          alarmValue: "800",
          typeName: "控制仪类型",
          reason: "reson",
          name: "位移控制仪",
          spaceName: "控制仪",
          times: new Date(),
          healthIndex: 800,
          capsuleLocation: "上海",
          type: "控制",
          data: [800, 1200],
        },
      ];
      this.plan = this.plan.map((n) => {
        return {
          ...n,
          alarm: `${n.capsuleName}/${n.segmentName}/${n.deviceName}`,
        };
      });
      // 随机选取报警设备
      const n = 0;
      this.message = this.plan[n];
      this.alarm = this.message.id;
      // 图表
      this.myCurve(this.message);
      this.$axios.post("/dataManage/alarm/currentAlarm", {}).then((res) => {
        if (res) {
          // 所有报警信息列表
          this.plan = res.result.map((n) => {
            return {
              ...n,
              alarm: `${n.capsuleName}/${n.segmentName}/${n.deviceName}`,
            };
          });
          if (res.result.length) {
            // 随机选取报警设备
            const n = Math.random() * (res.result.length - 1);
            this.message = res.result[parseInt(n)];
            this.alarm = this.message.id;
            // 图表
            this.myCurve(this.message);
          }
        }
      });
    },
    myCurve({ id, deviceName: name }) {
      const date = [];
      const data = [];
      for (const i of [
        { value: [500], gatherTime: "2022-03-03" },
        { value: [900], gatherTime: "2022-03-04" },
        { value: [500], gatherTime: "2022-03-05" },
      ]) {
        // 分类
        data.push(i.value[0]);
        date.push(i.gatherTime);
      }
      // 整合
      this.curve = {
        name,
        date,
        data,
      };
      // 展示
      this.$chart.line("overall-alarm", this.curve);
      this.alarmloading = false;
      id = 1;
      this.$axios
        .post("/dataManage/alarm/getAlarmMinuteData", {
          id,
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
            this.curve = {
              name,
              date,
              data,
            };
            // 展示
            this.$chart.line("overall-alarm", this.curve);
            this.alarmloading = false;
          }
          // 轮询
          // this.myAlarmtimer = setTimeout(() => {
          //   // 报警
          //   this.myAlarm();
          // }, 10000);
        });
    },
    filtrate(value) {
      // 赋值
      this.cop = value;
      this.coploading = true;
      // 清除定时器
      clearInterval(this.myAiTimer);
      // 图表
      this.myAi(value);
    },
    filter(value) {
      // 赋值
      this.alarm = value;
      this.alarmloading = true;
      // 清除定时器
      clearInterval(this.myAlarmTimer);
      // 图表
      this.myAlarm();
    },
    myChart() {
      // 渲染预警图表
      this.$chart.ai("overall-ai", this.ai);
      // 渲染报警图表
      this.$chart.line("overall-alarm", this.curve);
    },
    onResize() {
      this.reset();
      this.myChart();
    },
    reset() {
      this.$nextTick(() => {
            this.myAlarm();
    this.myAi();
        this.ElE = {
          common: this.$refs.common.offsetHeight,
          gallery: this.$refs.gallery.offsetHeight,
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.overall {
  flex: 1;
  display: flex;
  flex-direction: column;
  .gis {
    flex: 3;
    display: flex;
    .state {
      flex: 1;
      display: flex;
      flex-direction: column;
      .plate {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .matter {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          .circular {
            font-size: 20px;
            font-weight: bold;
          }
          .details {
            display: flex;
            flex-direction: column;
            margin-left: 40px;
            .source {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: flex-start;
              font-size: 13px;
              .name {
                color: #d6dfec;
                margin-left: 10px;
              }
              .value {
                color: #ffffff;
              }
              &:nth-child(2) {
                margin: 20px 0;
              }
            }
          }
        }
      }
      .table {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: rgba(12, 34, 59, 0.81);
        padding: 0px 10px;
        .name {
          height: 45px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(20, 56, 101, 0.5);
          font-size: 12px;
          padding: 0px 10px;
        }
        .source {
          flex: 1;
          display: flex;
          ._tabs {
            flex: 1;
            display: flex;
            background-color: transparent;
            ._item {
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
      }
    }
    .map {
      flex: 2;
      display: flex;
      padding: 20px;
      .unit {
        flex: 1;
        display: flex;
      }
    }
  }
  .message {
    flex: 2;
    display: flex;
    margin-top: 20px;
    padding-bottom: 20px;
    .ai {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: rgba(12, 34, 59, 0.81);
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
            .echarts {
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
    .alarm {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: rgba(12, 34, 59, 0.81);
      padding: 0px 10px;
      margin: 0px 20px;
      .name {
        height: 45px;
        line-height: 45px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(20, 56, 101, 0.5);
        font-size: 12px;
        padding: 0px 10px;
        .alarm-info {
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
            .echarts {
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
        padding: 0px 10px;
        font-size: 12px;
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
  }
}
</style>
