<template>
  <div class="realtime">
    <!-- 动画 -->
    <div class="animation">
      <div class="car1" />
      <div class="car2" />
      <div class="car3" />
      <div class="car4" />
      <div class="car5" />
      <div class="car6" />
      <div class="car7" />
    </div>
    <!-- 设备 -->
    <div v-if="myView" class="facility">
      <div class="facility_item" v-for="(i, index) in device" :key="index">
        <div class="facility_item_header">
          <div class="facility_item_header_name">
            {{ i.name }}
          </div>
          <div class="facility_item_header_info">
            <v-icon color="#a0a7b6" light size="17">
              mdi-crosshairs-gps
            </v-icon>
            <span class="facility_item_header_info_count">
              {{ `${JSON.parse(i.position)[0]}m` }}
            </span>
          </div>
          <div class="mark">
            <div class="mark_color" />
            <v-icon
              light
              size="17"
              color="#fff"
              class="mark_pattern"
              v-text="`mdi-circle-slice-3`"
            />
          </div>
        </div>
        <div class="_header">
          <div class="_header_handle" v-if="i.common">
            <div class="_header_handle_icon">
              <v-icon color="#ffffff" size="30">
                mdi-air-conditioner
              </v-icon>
            </div>
            <div class="_header_handle_auto">
              <span class="_header_handle_auto_close">
                自动
              </span>
              <v-switch
                inset
                light
                dense
                color="#32c95c"
                :true-value="1"
                :false-value="0"
                @change="setAuto(i)"
                class="ma-0 pa-0 ml-5"
                v-model="i.value[`auto`]"
              />
              <span class="_header_handle_auto_open">
                手动
              </span>
            </div>
            <div class="_header_handle_open">
              <span class="_header_handle_auto_close">
                关
              </span>
              <v-switch
                inset
                light
                dense
                color="#32c95c"
                :true-value="1"
                :false-value="0"
                @change="setOpen(i)"
                class="ma-0 pa-0 ml-5"
                v-model="i.value[`open`]"
              />
              <span class="_header_handle_auto_open">
                开
              </span>
            </div>
          </div>
          <div class="_header_handle" v-else-if="i.auto">
            <div class="_header_handle_icon">
              <v-icon color="#ffffff" size="30">
                mdi-air-conditioner
              </v-icon>
            </div>
            <div class="_header_handle_auto">
              <span class="_header_handle_auto_close">
                自动
              </span>
              <v-switch
                inset
                light
                dense
                color="#32c95c"
                :true-value="1"
                :false-value="0"
                @change="setAuto(i)"
                class="ma-0 pa-0 ml-5"
                v-model="i.value[`auto`]"
              />
              <span class="_header_handle_auto_open">
                手动
              </span>
            </div>
          </div>
          <div class="_header_handle" v-else-if="i.open">
            <div class="_header_handle_icon">
              <v-icon color="#ffffff" size="30">
                mdi-air-conditioner
              </v-icon>
            </div>
            <div class="_header_handle_open">
              <span class="_header_handle_auto_close">
                关
              </span>
              <v-switch
                inset
                light
                dense
                color="#32c95c"
                :true-value="1"
                :false-value="0"
                @change="setOpen(i)"
                class="ma-0 pa-0 ml-5"
                v-model="i.value[`open`]"
              />
              <span class="_header_handle_auto_open">
                开
              </span>
            </div>
          </div>
          <div class="_header_handle" v-else-if="i.smoke">
            <div
              :class="
                !i.value[`smoke`]
                  ? `_header_handle_icon`
                  : `_header_handle_deep_icon`
              "
            >
              <v-icon :size="30" :color="`#ffffff`">
                mdi-air-conditioner
              </v-icon>
            </div>
            <div class="_header_handle_status">
              <span class="_header_handle_status_have" v-if="i.value[`smoke`]">
                有烟雾
              </span>
              <span class="_header_handle_status_none" v-else>
                无烟雾
              </span>
            </div>
            <div class="_header_handle_hint">
              当前状态
            </div>
          </div>
          <div v-else class="_header_property">
            <div
              :key="index"
              :class="`_header_property_source`"
              v-for="(n, name, index) of JSON.parse(i.threshold)"
            >
              <div class="facility_item_content">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      class="facility_item_content_circular"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-progress-circular
                        :value="i.value[name]"
                        :color="`#8ae8b6`"
                        :rotate="270"
                        :size="100"
                        :width="7"
                      >
                        {{ i.value[name] }}
                      </v-progress-circular>
                    </div>
                  </template>
                  <span>
                    {{ name }}
                  </span>
                </v-tooltip>
                <div class="facility_item_content_range">
                  <div class="facility_item_content_range_down">
                    <v-icon light color="#33aefd" size="17">
                      mdi-arrow-down-thick
                    </v-icon>
                    <span class="facility_item_content_range_down_count">
                      {{ n[0] }}
                    </span>
                  </div>
                  <div class="facility_item_content_range_up">
                    <v-icon light color="#fc5a7c" size="17">
                      mdi-arrow-up-thick
                    </v-icon>
                    <span class="facility_item_content_range_up_count">
                      {{ n[1] }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 管廊 -->
    <div v-else class="gallery" ref="gallery">
      <div class="tunnel" @mousedown="mousedown">
        <!-- 摄像头 -->
        <div class="camera_l" />
        <div class="camera_r" />
        <!-- 动态数据 -->
        <div
          :style="{
            top: i.y,
            left: i.x,
          }"
          :key="index"
          :class="`dynamic`"
          v-for="(i, index) in plane"
          @click='dynamic(i)'
        >
          <v-menu
            :offset-x="true"
            :open-on-hover="true"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <img
                v-on="on"
                v-bind="attrs"
                :src="require(`../assets/images/${i.type}.png`)"
              />
            </template>
            <!-- 弹窗 -->
            <div class="popup">
              <div class="name">
                {{ i.name }}
              </div>
              <div class="site">
                {{ `位置：${JSON.parse(i.position)[0]}m` }}
              </div>
              <div class="common" v-if="i.common">
                <div class="common_handle">
                  <span class="common_handle_close">
                    自动
                  </span>
                  <v-switch
                    inset
                    light
                    dense
                    color="#32c95c"
                    :true-value="1"
                    :false-value="0"
                    @change="setAuto(i)"
                    class="ma-0 pa-0 ml-5"
                    v-model="i.value[`auto`]"
                  />
                  <span class="common_handle_open">
                    手动
                  </span>
                </div>
                <div class="common_handle">
                  <span class="common_handle_close">
                    关闭
                  </span>
                  <v-switch
                    inset
                    light
                    dense
                    color="#32c95c"
                    :true-value="1"
                    :false-value="0"
                    @change="setOpen(i)"
                    class="ma-0 pa-0 ml-5"
                    v-model="i.value[`open`]"
                  />
                  <span class="common_handle_open">
                    开启
                  </span>
                </div>
              </div>
              <div class="auto" v-else-if="i.auto">
                <div class="common_handle">
                  <span class="common_handle_close">
                    自动
                  </span>
                  <v-switch
                    inset
                    light
                    dense
                    color="#32c95c"
                    :true-value="1"
                    :false-value="0"
                    @change="setAuto(i)"
                    class="ma-0 pa-0 ml-5"
                    v-model="i.value[`auto`]"
                  />
                  <span class="common_handle_open">
                    手动
                  </span>
                </div>
              </div>
              <div class="open" v-else-if="i.open">
                <div class="common_handle">
                  <span class="common_handle_close">
                    关闭
                  </span>
                  <v-switch
                    inset
                    light
                    dense
                    color="#32c95c"
                    :true-value="1"
                    :false-value="0"
                    @change="setOpen(i)"
                    class="ma-0 pa-0 ml-5"
                    v-model="i.value[`open`]"
                  />
                  <span class="common_handle_open">
                    开启
                  </span>
                </div>
              </div>
              <div class="smoke" v-else-if="i.smoke">
                当前状态：
                <span class="have" v-if="i.value[`smoke`]">
                  有烟雾
                </span>
                <span class="none" v-else>
                  无烟雾
                </span>
              </div>
              <div class="other" v-else>
                <div
                  :key="index"
                  :class="`property`"
                  v-for="(n, name, index) of JSON.parse(i.threshold)"
                >
                  {{ `当前值(${name})：` }}
                  <div
                    :class="
                      i.value[name] >= n[1] || i.value[name] <= n[0]
                        ? `anomaly`
                        : `normal`
                    "
                  >
                    {{ i.value[name] }}
                  </div>
                  <div class="down">
                    <v-icon light color="#33aefd" size="17">
                      mdi-arrow-down-thick
                    </v-icon>
                    <div class="down_data">
                      {{ n[0] }}
                    </div>
                  </div>
                  <div class="up">
                    <v-icon light color="#fc5a7c" size="17">
                      mdi-arrow-up-thick
                    </v-icon>
                    <div class="up_data">
                      {{ n[1] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-menu>
        </div>
      </div>
    </div>
    <!-- 可视化距离 -->
    <div v-if="!myView" class="distance">
      <span>{{ `${left}m` }}</span>
      <span>{{ `${center}m` }}</span>
      <span>{{ `${right}m` }}</span>
    </div>
    <!-- 数据 -->
    <div class="source">
      <div class="amount">
        <div class="amount_header">
          <span class="amount_header_name">统计概览</span>
          <div class="mark">
            <div class="mark_color" />
            <v-icon
              light
              size="17"
              color="#fff"
              class="mark_pattern"
              v-text="`mdi-circle-slice-3`"
            />
          </div>
        </div>
        <div class="amount_facility">
          <div class="amount_facility_item" v-for="(i, n) in summary" :key="n">
            <div class="amount_facility_item_icon">
              <v-icon size="25" color="#ffffff" v-text="`mdi-water-pump`" />
            </div>
            <div class="amount_facility_item_info">
              <span class="amount_facility_item_info_count">
                {{ kind[i.type] }}个
              </span>
              <span class="amount_facility_item_info_name">
                {{ i.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="echarts">
        <div class="echarts_tab">
          <v-tabs
            light
            height="44"
            v-model="type"
            color="#12bed1"
            slider-color="#12bed1"
            show-arrows
          >
            <v-tab
              v-for="(i, n) in plan" 
              :key="n"
            >
              {{ i.name }}
            </v-tab>
          </v-tabs>
        </div>
        <div class="echarts_content" v-resize.quiet="onResize">
          <div class="myChart" id="myChart" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "realtime",
  data: () => ({
    type: 0,
    left: 0,
    right: 0,
    center: 0,
    timer: "",
    kind: {},
    chart: {},
    plane: [],
    device: [],
    summary: [],
    plan: [],
  }),
  computed: {
    // 数据仓库
    ...mapGetters(["myView", "myKnob", "myZaxis"]),
  },
  watch: {
    type: {
      handler(value) {
        // 清除定时器
        clearTimeout(this.timer);
        // 绘制页面
        this.myChart(value);
      },
      deep: true,
    },
    myKnob: {
      handler(value) {
        if (value) {
          // 清除定时器
          clearTimeout(this.timer);
          // 绘制页面
          this.myId(value);
          this.mySummary(value);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.myDistance();
  },
  methods: {
    myId() {
      this.$axios
        .get("/api-device/device/queryDeviceIds", {
          params: {
            capsule: this.myKnob,
          },
        })
        .then((res) => {
          this.myDevice(res.data);
        });
    },
    myDevice(ids) {
      this.$axios
        .post("/dataManage/deviceData/realTimeData", {
          ids,
        })
        .then((res) => {
          if (res) {
            // 数据整合
            this.device = res.result.map((res) => {
              return {
                ...res,
                auto: `auto` in res.value,
                open: `open` in res.value,
                smoke: `smoke` in res.value,
                common: `auto` in res.value && `open` in res.value,
              };
            });
            // 二维平面
            this.myPlane();
          }
        });
    },
    myPlane() {
      this.plane = this.device.map((res) => {
        return {
          ...res,
          x: `${(JSON.parse(res.position)[0] / 200).toFixed(4) * 100}%`,
          y: `${(JSON.parse(res.position)[1] / this.myZaxis).toFixed(4) *
            100}%`,
        };
      });
    },
    mySummary(capsule) {
      this.$axios
        .get("/api-device/device/queryDevice", {
          params: {
            capsule,
          },
        })
        .then((res) => {
          if (res) {
            const list = [];
            const kind = {};
            for (const i of res.data) {
              if (i.type in kind) {
                kind[i.type]++;
              } else {
                kind[i.type] = 1;
                list.push(i);
              }
            }
            this.kind = kind;
            this.summary = list;
            this.plan = res.data;
            this.myChart();
          }
        });
    },
    myChart() {
      this.$chart.line("myChart", this.chart);
      this.$axios
        .post("/dataManage/deviceData/minuteData", {
          deviceId: this.plan[this.type].id
        })
        .then((res) => {
          if (res) {
            const date = [];
            const data = [];
            const dats = [];
            const datc = [];
            const daty = [];
            for (const i of res.result) {
              // 分类 
              const parameters = i.parameters.slice(1, -1).split(",");
              // 四类设备详情
              if (parameters.length == 4) {
                data.push(i.value[parameters[0]]);
                dats.push(i.value[parameters[1]]);
                datc.push(i.value[parameters[2]]);
                daty.push(i.value[parameters[3]]);
              }
              // 两类设备详情
              if (parameters.length == 2) {
                data.push(i.value[parameters[0]]);
                dats.push(i.value[parameters[1]]);
              }
              // 一类设备详情
              if (parameters.length == 1) {
                data.push(i.value[parameters[0]]);
              }
              date.push(new Date(i.gatherTime).toLocaleString());
            }
            // 整合
            this.chart = {
              date,
              data,
              dats,
              datc,
              daty,
            };
            // 展示
            this.$chart.line("myChart", this.chart);
            // 轮询
            this.timer = setTimeout(() => {
              this.myChart();
            }, 2000);
          }
        });
    },
    dynamic(value) {
      // 点击设备详情
      for (const i in this.plan) {
        if (value.id == this.plan[i].id) {
          this.type = Number(i);
        }
      }
    },
    setAuto(i) {
      // 参数整合
      const params = {
        id: i.id,
        key: "auto",
        value: i.value["auto"],
      };
      // 状态设置
      this.myStatus(params);
    },
    setOpen(i) {
      // 参数整合
      const params = {
        id: i.id,
        key: "open",
        value: i.value["open"],
      };
      // 状态设置
      this.myStatus(params);
    },
    myStatus(params) {
      this.$axios
        .post("/dataManage/instruction/updateStatus", {
          ...params,
        })
        .then((res) => {
          if (res) {
            // 成功提示
            this.$notice.success("状态已设置成功");
          } else {
            // 失败重置
            this.myId();
          }
        });
    },
    mousedown(e) {
      const down = e.x;
      document.onmousemove = (e) => {
        const move = e.x;
        const current = this.$refs.gallery.scrollLeft;
        const present = (current - (move - down) / 25).toFixed(4);
        // 可视化距离
        this.myDistance();
        // 数据赋值
        this.$refs.gallery.scrollLeft = present;
      };
      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };
    },
    myDistance() {
      // 获取
      const current = this.$refs.gallery.scrollLeft;
      // 计算
      const left = current / 10 / 2;
      const right = (document.body.clientWidth - 56 + current) / 10 / 2;
      const center = (right - left) / 2 + left;
      // 赋值
      this.left = left.toFixed(0);
      this.right = right.toFixed(0);
      this.center = center.toFixed(0);
    },
    onResize() {
      this.myDistance();
      // 重绘
      this.$chart.line("myChart", this.chart);
    },
  },
  beforeDestroy() {
    // 清除定时器
    clearTimeout(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.realtime {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .animation {
    height: 80px;
    overflow: hidden;
    position: relative;
    background: url("../assets/images/tree.png");
    .car1 {
      width: 100px;
      height: 35px;
      background: url("../assets/images/car1.png") no-repeat;
      background-size: contain;
      position: absolute;
      left: 0;
      bottom: 0;
      animation: DriveLeftToRight 10s linear infinite;
    }
    .car2 {
      width: 100px;
      height: 35px;
      background: url("../assets/images/car2.png") no-repeat;
      background-size: contain;
      position: absolute;
      left: 0;
      bottom: 0;
      animation: DriveLeftToRight 37s linear infinite;
    }
    .car3 {
      width: 100px;
      height: 35px;
      background: url("../assets/images/car3.png") no-repeat;
      background-size: contain;
      position: absolute;
      left: 0;
      bottom: 0;
      animation: DriveLeftToRight 15s linear infinite;
    }
    .car4 {
      width: 100px;
      height: 35px;
      background: url("../assets/images/car4.png") no-repeat;
      background-size: contain;
      position: absolute;
      right: 0;
      bottom: 0;
      animation: DriveRightToLeft 25s linear infinite;
    }
    .car5 {
      width: 100px;
      height: 35px;
      background: url("../assets/images/car5.png") no-repeat;
      background-size: contain;
      position: absolute;
      right: 0;
      bottom: 0;
      animation: DriveRightToLeft 7s linear infinite;
    }
    .car6 {
      width: 100px;
      height: 35px;
      background: url("../assets/images/car6.png") no-repeat;
      background-size: contain;
      position: absolute;
      right: 0;
      bottom: 0;
      animation: DriveRightToLeft 40s linear infinite;
    }
    .car7 {
      width: 100px;
      height: 35px;
      background: url("../assets/images/car7.png") no-repeat;
      background-size: contain;
      position: absolute;
      left: 0;
      bottom: 0;
      animation: DriveLeftToRight 20s linear infinite;
    }
    @keyframes DriveLeftToRight {
      from {
        left: -100px;
      }
      to {
        left: 100%;
      }
    }
    @keyframes DriveRightToLeft {
      from {
        right: -100px;
      }
      to {
        right: 100%;
      }
    }
  }
  .facility {
    flex: 2;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    min-height: 300px;
    max-height: 700px;
    overflow-y: scroll;
    .facility_item {
      margin: 5px;
      height: 270px;
      min-width: 300px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background-color: #ffffff;
      .facility_item_header {
        height: 75px;
        display: flex;
        position: relative;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        border-bottom: 1px solid #e4e9f2;
        .facility_item_header_name {
          color: #1e263e;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .facility_item_header_info {
          display: flex;
          align-items: center;
          justify-content: center;
          .facility_item_header_info_count {
            display: inline-block;
            font-size: 13px;
            color: #a0a7b6;
            margin-left: 5px;
          }
        }
        .mark {
          top: 0;
          right: 0;
          width: 40px;
          height: 40px;
          color: #fff;
          position: absolute;
          .mark_color {
            top: 0;
            right: 0;
            padding: 0;
            display: block;
            border-radius: 0;
            position: absolute;
            background: transparent;
            border: 20px solid transparent;
            border-top-color: #e0bd94;
            border-right-color: #e0bd94;
          }
          .mark_pattern {
            top: 4px;
            right: 2px;
            position: absolute;
          }
        }
      }
      ._header {
        flex: 1;
        display: flex;
        ._header_handle {
          flex: 1;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          ._header_handle_icon {
            width: 60px;
            height: 60px;
            display: flex;
            border-radius: 50%;
            align-items: center;
            justify-content: center;
            background-color: #32c95c;
          }
          ._header_handle_deep_icon {
            width: 60px;
            height: 60px;
            display: flex;
            border-radius: 50%;
            align-items: center;
            justify-content: center;
            background-color: #fc5a7c;
          }
          ._header_handle_auto,
          ._header_handle_open {
            display: flex;
            margin-top: 20px;
            justify-content: center;
            ._header_handle_auto_close {
              font-size: 13px;
              color: #33aefd;
            }
            ._header_handle_auto_open {
              font-size: 13px;
              color: #fc5a7c;
            }
          }
          ._header_handle_status {
            display: flex;
            margin-top: 20px;
            align-items: center;
            justify-content: center;
            ._header_handle_status_none {
              font-size: 15px;
              color: #33aefd;
            }
            ._header_handle_status_have {
              font-size: 15px;
              color: #fc5a7c;
            }
          }
          ._header_handle_hint {
            font-size: 15px;
            margin-top: 20px;
            color: rgb(171, 164, 164);
          }
        }
        ._header_property {
          flex: 1;
          display: flex;
          ._header_property_source {
            flex: 1;
            display: flex;
            .facility_item_content {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 15px;
              .facility_item_content_circular {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .facility_item_content_range {
                display: flex;
                align-content: center;
                justify-content: space-between;
                .facility_item_content_range_down {
                  display: flex;
                  align-items: flex-end;
                  justify-content: center;
                  .facility_item_content_range_down_count {
                    font-size: 12px;
                    color: #33aefd;
                    margin-left: 5px;
                    display: inline-block;
                  }
                }
                .facility_item_content_range_up {
                  display: flex;
                  align-items: flex-start;
                  justify-content: center;
                  .facility_item_content_range_up_count {
                    font-size: 12px;
                    color: #fc5a7c;
                    margin-left: 5px;
                    display: inline-block;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .gallery {
    flex: 2;
    display: flex;
    min-height: 450px;
    overflow-x: scroll;
    padding: 60px 0px 55px 0px;
    background-color: #434e56;
    .tunnel {
      flex: 1;
      min-width: 4000px;
      position: relative;
      background-color: #d0dee9;
      .camera_l {
        top: 5%;
        left: 0;
        width: 85px;
        height: 55px;
        position: absolute;
        background: url("../assets/images/camera.png") no-repeat;
        background-size: cover;
      }
      .camera_r {
        top: 5%;
        right: 0;
        width: 85px;
        height: 55px;
        position: absolute;
        background: url("../assets/images/camera.png") no-repeat;
        background-size: cover;
        transform: rotateY(180deg);
      }
      .dynamic {
        width: 58px;
        height: 50px;
        position: absolute;
        img {
          width: 100%;
        }
      }
    }
    &::-webkit-scrollbar {
      width: 0 !important;
    }
  }
  .distance {
    height: 72px;
    padding: 10px;
    margin-top: -72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 10000;
  }
  .source {
    flex: 1;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    .amount {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      overflow: hidden;
      background-color: #ffffff;
      .amount_header {
        height: 45px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #e4e9f2;
        .amount_header_name {
          color: #1e263e;
          font-size: 14px;
        }
        .mark {
          top: 0;
          right: 0;
          width: 40px;
          height: 40px;
          color: #fff;
          position: absolute;
          .mark_color {
            top: 0;
            right: 0;
            padding: 0;
            display: block;
            border-radius: 0;
            position: absolute;
            background: transparent;
            border: 20px solid transparent;
            border-top-color: #12bed1;
            border-right-color: #12bed1;
          }
          .mark_pattern {
            top: 4px;
            right: 2px;
            position: absolute;
          }
        }
      }
      .amount_facility {
        flex: 1;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        flex-wrap: wrap;
        min-height: 500px;
        overflow-y: scroll;
        padding-bottom: 10px;
        .amount_facility_item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 250px;
          padding: 10px;
          margin: 10px 0px 0px 10px;
          background-color: #f3f7fd;
          .amount_facility_item_icon {
            margin-right: 10px;
            border-radius: 100%;
            padding: 7px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #12bed1;
          }
          .amount_facility_item_info {
            flex: 1;
            display: flex;
            flex-direction: column;
            .amount_facility_item_info_count {
              font-size: 16px;
              color: #12bed1;
            }
            .amount_facility_item_info_name {
              font-size: 12px;
              color: #989fa9;
            }
          }
        }
      }
    }
    .echarts {
      flex: 1;
      min-width: 500px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      overflow-x: scroll;
      background-color: #ffffff;
      .echarts_tab {
        height: 45px;
        border-bottom: 1px solid #e4e9f2;
      }
      .echarts_content {
        flex: 1;
        min-height: 500px;
        overflow-y: scroll;
        display: flex;
        flex-direction: column;
        padding: 5px;
        .myChart {
          flex: 1;
        }
      }
    }
  }
}
.popup {
  padding: 7px;
  font-size: 13px;
  color: #0000008a;
  background-color: rgba(255, 255, 255, 0.9);
  .name {
    display: flex;
    align-items: center;
  }
  .site {
    display: flex;
    align-items: center;
  }
  .auto,
  .open,
  .common {
    display: flex;
    flex-direction: column;
    .common_handle {
      display: flex;
      margin-top: 7px;
      .common_handle_close {
        width: 30px;
        color: #33aefd;
      }
      .common_handle_open {
        width: 30px;
        color: #fc5a7c;
      }
    }
  }
  .smoke {
    display: flex;
    align-items: center;
    .have {
      color: #fc5a7c;
    }
    .none {
      color: #33aefd;
    }
  }
  .other {
    display: flex;
    flex-direction: column;
    .property {
      display: flex;
      align-items: center;
      .anomaly {
        display: flex;
        color: #fc5a7c;
        align-items: center;
      }
      .normal {
        display: flex;
        align-items: center;
      }
      .down {
        display: flex;
        margin-left: 15px;
        align-items: flex-end;
        .down_data {
          font-size: 12px;
          color: #33aefd;
        }
      }
      .up {
        display: flex;
        margin-left: 15px;
        align-items: flex-start;
        .up_data {
          font-size: 12px;
          color: #fc5a7c;
        }
      }
    }
  }
}
</style>
