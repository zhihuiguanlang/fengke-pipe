<template>
  <div class="water">
    <!-- 水信舱 -->
    <div class="letter" ref="letter">
      <div class="box" :style="{height:ElE.graphical+'px'}">
        <div class="facility_item" v-for="( i, index ) in list" :key="index">
          <div class="facility_item_header">
            <div class="facility_item_header_name">{{ i.name }}</div>
            <div class="facility_item_header_info">
              <v-icon color="#a0a7b6" light size="17">mdi-crosshairs-gps</v-icon>
              <span class="facility_item_header_info_count">{{ `${JSON.parse(i.position)[0]}m` }}</span>
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
            <div class="_header">
              <div class="_header_handle" v-if="i.common">
                <div class="_header_handle_icon">
                  <v-icon color="#ffffff" size="30">mdi-air-conditioner</v-icon>
                </div>
                <div class="_header_handle_auto">
                  <span class="_header_handle_auto_close">自动</span>
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
                  <span class="_header_handle_auto_open">手动</span>
                </div>
                <div class="_header_handle_open">
                  <span class="_header_handle_auto_close">关</span>
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
                  <span class="_header_handle_auto_open">开</span>
                </div>
              </div>
              <div class="_header_handle" v-else-if="i.auto">
                <div class="_header_handle_icon">
                  <v-icon color="#ffffff" size="30">mdi-air-conditioner</v-icon>
                </div>
                <div class="_header_handle_auto">
                  <span class="_header_handle_auto_close">自动</span>
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
                  <span class="_header_handle_auto_open">手动{{i.open}}</span>
                </div>
              </div>
              <div class="_header_handle" v-else-if="i.open">
                <div class="_header_handle_icon">
                  <v-icon color="#ffffff" size="30">mdi-air-conditioner</v-icon>
                </div>
                <div class="_header_handle_open">
                  <span class="_header_handle_auto_close">关</span>
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
                  <span class="_header_handle_auto_open">开</span>
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
                  <v-icon :size="30" :color="`#ffffff`">mdi-air-conditioner</v-icon>
                </div>
                <div class="_header_handle_status">
                  <span class="_header_handle_status_have" v-if="i.value[`smoke`]">有烟雾</span>
                  <span class="_header_handle_status_none" v-else>无烟雾</span>
                </div>
                <div class="_header_handle_hint">当前状态</div>
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
                        <div class="facility_item_content_circular" v-bind="attrs" v-on="on">
                          <v-progress-circular
                            :value="i.value[name]"
                            :color="`#8ae8b6`"
                            :rotate="270"
                            :size="100"
                            :width="7"
                          >{{ i.value[name] }}</v-progress-circular>
                        </div>
                      </template>
                      <span>{{ name }}</span>
                    </v-tooltip>
                    <div class="facility_item_content_range">
                      <div class="facility_item_content_range_down">
                        <v-icon light color="#33aefd" size="17">mdi-arrow-down-thick</v-icon>
                        <span class="facility_item_content_range_down_count">{{ n[0] }}</span>
                      </div>
                      <div class="facility_item_content_range_up">
                        <v-icon light color="#fc5a7c" size="17">mdi-arrow-up-thick</v-icon>
                        <span class="facility_item_content_range_up_count">{{ n[1] }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 地图 -->
    <div v-resize.quiet="onResize" class="map">
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
          >感温光纤实时曲线</v-alert>
        </div>
        <div id="myChart-all" class="echart" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { echarts, echarting,list as listxx} from "@/assets/script/mock";
export default {
  name: "water",
  data: () => ({
    echarts,
    list: [],
    page: 1,
    limit: 10,
    timeData: "",
    timer: "",
    deviceTypes: "",
    fiber: "",
    plan: [],
    election: [],
    status: {
      1: "在用正常",
      2: "异常",
      3: "模拟中"
    },
    ElE: {
      graphical: 0
    },
    wait: false,
    echarting
  }),
  computed: {
    // 数据仓库
    ...mapGetters(["myCurrent"])
  },
  watch: {
    myCurrent: {
      handler(value) {
        const { id } = value;
        if (id) {
          clearInterval(this.timer);
          this.wait = true;
          // 响应请求
          this.query(id);
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.ElE = {
        graphical: this.$refs.letter.offsetHeight
      };
    });
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    query(id) {
      this.$axios.post("/api-device/DeviceSystemType/list", {}).then(res => {
        if (res) {
          for (const i of res.data) {
            if (i.systemName == "消防系统") {
              this.deviceTypes = i.deviceTypes;
            }
            if (i.systemName == "消防系统-感温光纤") {
              this.fiber = i.deviceTypes;
            }
          }
          this.first(this.deviceTypes, this.fiber, id);
        }
      });
    },
    first(deviceTypes, fiber, id) {
      this.plan = [];
      this.election = [];
      this.$axios
        .get(`/api-device/device/queryDevice?capsule=${id}`, {})
        .then(res => {
          const parameters = deviceTypes.slice(1, -1).split(",");
          const fibers = fiber.slice(1, -1).split(",");
          for (const i of res.data) {
            for (const e of parameters) {
              if (e == i.type.trim()) {
                this.plan.push(i.id);
              }
            }
            for (const e of fibers) {
              if (e == i.type.trim()) {
                this.election.push(i.id);
              }
            }
          }
          this.create(this.plan);
          this.second(this.election);
        });
    },
    create(ids) {
      this.$chart.line("myChart-all", echarts);
      this.list = listxx;
      this.$axios
        .post("/dataManage/deviceData/realTimeData", {
          ids
        })
        .then(res => {
          // 数据整合
          this.list = res.result.map(res => {
            const analog = {};
            const parameters = res.parameters.slice(1, -1).split(",");
            for (const i of parameters) {
              analog[i] = "";
            }
            return {
              ...res,
              analog,
              auto: `auto` in res.value,
              open: `open` in res.value,
              smoke: `smoke` in res.value,
              common: `auto` in res.value && `open` in res.value
            };
          });
        });
    },
    second(ids) {
      this.$axios
        .post("/dataManage/deviceData/realTimeData", {
          ids
        })
        .then(res => {
          if (res.result.length) {
            const seriesData = [];
            echarts.xAxis.data = JSON.parse(res.result[0].position);
            for (const e of JSON.parse(res.result[0].position)) {
              if (e) {
                seriesData.push(res.result[0].value.temperature);
              }
            }
            echarts.series[0].data = seriesData;
            this.$chart.line("myChart-all", echarts);
            this.wait = true;
            // 轮询
            this.timer = setTimeout(() => {
              this.second(this.election);
            }, 2000);
          } else {
            this.wait = false;
          }
        });
    },
    setAuto(i) {
      // 参数整合
      const params = {
        id: i.id,
        key: "auto",
        value: i.value["auto"]
      };
      // 状态设置
      this.myStatus(params);
    },
    setOpen(i) {
      // 参数整合
      const params = {
        id: i.id,
        key: "open",
        value: i.value["open"]
      };
      // 状态设置
      this.myStatus(params);
    },
    myStatus(params) {
      this.$axios
        .post("/dataManage/instruction/updateStatus", {
          ...params
        })
        .then(res => {
          if (res) {
            // 成功提示
            this.$notice.success("状态已设置成功");
          }
        });
    },
    onResize() {
      // 重置
      if (this.wait) {
        this.$chart.line("myChart-all", echarts);
      } else {
        this.$chart.line("myChart-all", echarting);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.water {
  height: 100%;
  display: flex;
  flex-direction: column;
  .letter {
    flex: 4;
    .box {
      margin: 0 5px 5px 0;
      height: 270px;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      overflow-x: hidden;
      overflow-y: auto;
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
              height: 24px;
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
  }
  .map {
    flex: 2;
    .nape {
      width: 100%;
      height: 100%;
      .header {
        padding: 16px 16px 0px 16px;
        border-bottom: 1px solid #e6e6e6;
        .alert {
          display: flex;
        }
      }
      .echart {
        height: calc(100% - 51px);
      }
    }
  }
}
</style>
