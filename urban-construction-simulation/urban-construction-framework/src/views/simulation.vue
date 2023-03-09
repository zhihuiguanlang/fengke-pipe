<template>
  <div class="simulation">
    <div class="handle">
      <div class="handle_name">故障模拟仿真器</div>
      <v-spacer />
      <v-btn
        class="ml-3"
        @click="create"
        color="#29ca97"
        :loading="createLoading"
      >
        <v-icon left v-text="'mdi-airplane'" />
        开始模拟
      </v-btn>
      <v-btn
        class="ml-3"
        color="cyan"
        @click="shutDown"
        :loading="shutDownLoading"
      >
        <v-icon left v-text="'mdi-restart'" />
        重置正常值
      </v-btn>
    </div>
    <div class="deploy">
      <div class="facility elevation-7" v-for="i in mock" :key="i.id">
        <div class="facility_header">
          <div class="facility_header_info">
            <span class="facility_header_info_name">{{ i.name }}</span>
            <span class="facility_header_info_distance">
              <v-icon class="mr-1" light size="17">mdi-crosshairs-gps</v-icon>
              {{ `${JSON.parse(i.position)[0]}m` }}
            </span>
          </div>
          <div class="_header">
            <div
              :key="index"
              :class="`_header_source`"
              v-for="(n, name, index) of JSON.parse(i.threshold)"
            >
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div class="facility_header_source" v-bind="attrs" v-on="on">
                    <v-icon class="mr-2" light color="#29ca97" size="30"
                      >mdi-information</v-icon
                    >
                    {{ i.value[name] }}
                  </div>
                </template>
                <span>
                  {{ name }}
                </span>
              </v-tooltip>
              <div class="facility_header_range">
                <span class="facility_header_range_down">
                  <v-icon class="mr-1" light color="#33aefd" size="17"
                    >mdi-arrow-down-thick</v-icon
                  >
                  {{ n[0] }}
                </span>
                <span class="facility_header_range_up">
                  <v-icon class="mr-1" light color="#fc5a7c" size="17"
                    >mdi-arrow-up-thick</v-icon
                  >
                  {{ n[1] }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="facility_source">
          <div class="_source">
            <div
              :key="index"
              :class="`_source_group`"
              v-for="(n, name, index) of JSON.parse(i.threshold)"
            >
              <v-text-field
                :label="`${name} 模拟值：`"
                v-model="i.analog[name]"
                class="ma-0 mb-2"
                dense
                light
              />
            </div>
          </div>
          <v-radio-group
            class="facility_source_radio_group ma-0"
            v-model="i.radio"
            light
            dense
          >
            <v-radio
              :value="0"
              label="不设置"
              color="#29ca97"
              class="ma-0 mb-2"
            />
            <v-radio
              :value="1"
              color="#29ca97"
              label="立即设置"
              class="ma-0 mb-1"
            />
            <div class="facility_source_radio_group_field">
              <v-radio
                :value="2"
                hide-details
                class="ma-0"
                color="#29ca97"
                label="缓慢设置，耗时"
              />
              <v-text-field
                light
                dense
                id="field"
                v-model="i.consuming"
                :disabled="!(i.radio === 2)"
                class="facility_source_field ma-0"
              />
              秒
            </div>
          </v-radio-group>
          <div class="facility_source_renew">
            <v-checkbox
              dense
              light
              label="持续"
              class="mt-0"
              color="#29ca97"
              v-model="i.continued"
            />
            <v-text-field
              class="facility_source_field ma-0"
              v-model="i.continuedTime"
              :disabled="!i.continued"
              id="field"
              light
              dense
            />
            秒自动恢复正常
          </div>
        </div>
        <div class="mark">
          <div class="mark_color" />
          <v-icon
            light
            size="17"
            color="#fff"
            class="mark_pattern"
            v-text="`mdi-water-pump`"
          />
        </div>
      </div>
    </div>
    <!-- 加载提示框 -->
    <v-dialog
      overlay-opacity=".1"
      overlay-color="#fff"
      v-model="wait"
      width="300"
      persistent
    >
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
export default {
  name: "simulation",
  data: () => ({
    mock: [],
    wait: false,
    createLoading: false,
    shutDownLoading: false,
  }),
  computed: {
    // 数据仓库
    ...mapGetters(["myCurrent"]),
  },
  watch: {
    myCurrent: {
      handler(value) {
        const { id } = value;
        if (id) {
          this.wait = true;
          // 响应请求
          this.myId(id);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    myId(capsule) {
      this.$axios
        .get("/api-device/device/queryDeviceIds", {
          params: {
            capsule,
          },
        })
        .then((res) => {
          console.log(res)
          res.data.forEach((item) =>{
            console.log(item)
            this.mock.push({
            name:item,
            position:"["+Math.ceil(Math.random()*50)+"]",
            threshold:"[10]",
            analog:"10"
          });
          });
          // this.myFacility(res.data);
        });
    },
    myFacility(ids) {
      this.$axios
        .post("/dataManage/deviceData/realTimeData", {
          ids,
        })
        .then((res) => {
          // 数据整合
          this.mock = res.result.map((res) => {
            const analog = {};
            const parameters = res.parameters.slice(1, -1).split(",");
            for (const i of parameters) {
              analog[i] = "";
            }
            return {
              ...res,
              // 测试数据
              analog,
              radio: 0,
              consuming: "",
              deviceId: res.id,
              continued: false,
              continuedTime: "",
            };
          });
          // 加载结束
          this.wait = false;
        });
    },
    create() {
      this.createLoading = true;
      // 过滤掉 不需要模拟的设备
      const record = this.mock.filter((res) => {
        for(let i in JSON.parse(res.threshold)) {
          if (res.analog[i]) {
            return {
              ...res
            }
          }
        }
      });
      const mockData = record.map((res) => {
        const {
          radio,
          analog,
          deviceId,
          consuming,
          continued,
          continuedTime,
        } = res;
        return {
          radio,
          analog,
          deviceId,
          consuming,
          continued,
          continuedTime,
        };
      });
      this.$axios
        .post("/dataManage/mock/create", {
          mockData,
          id: this.myCurrent.parentId,
        })
        .then((res) => {
          if (res) {
            this.createLoading = false;
            this.$notice.info("数据模拟成功");
          }
        });
    },
    shutDown() {
      this.shutDownLoading = true;
      this.$axios
        .post("/dataManage/mock/shutDown", {
          id: this.myCurrent.parentId,
        })
        .then((res) => {
          if (res) {
            this.shutDownLoading = false;
            this.$notice.success("数据已重置");
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.simulation {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .handle {
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    background-color: #ffffff;
    .handle_name {
      height: 20px;
      color: #1e263e;
      line-height: 20px;
      padding-left: 20px;
      border-left: 5px solid #12bed1;
    }
  }
  .deploy {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    .facility {
      overflow: hidden;
      position: relative;
      border-radius: 2px;
      margin: 0px 10px 10px 0px;
      background-color: #ffffff;
      .facility_header {
        padding: 20px 20px 15px 20px;
        border-bottom: 2px solid #e4e9f2;
        .facility_header_info {
          display: flex;
          margin-bottom: 10px;
          align-items: center;
          justify-content: center;
          .facility_header_info_name {
            font-size: 14px;
            color: #1e263e;
          }
          .facility_header_info_distance {
            display: flex;
            font-size: 13px;
            color: #a0a7b6;
            margin-left: 20px;
            align-items: center;
          }
        }
        ._header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          ._header_source {
            flex: 1;
            margin: 0px 10px;
            .facility_header_source {
              display: flex;
              font-size: 20px;
              color: #29ca97;
              margin-bottom: 5px;
              align-items: center;
              justify-content: center;
            }
            .facility_header_range {
              display: flex;
              align-items: center;
              justify-content: space-between;
              .facility_header_range_down {
                display: flex;
                font-size: 12px;
                color: #33aefd;
                align-items: center;
              }
              .facility_header_range_up {
                display: flex;
                font-size: 12px;
                color: #fc5a7c;
                align-items: center;
              }
            }
          }
        }
      }
      .facility_source {
        padding: 20px;
        ._source {
          display: flex;
          align-items: center;
          justify-content: space-between;
          ._source_group {
            flex: 1;
            margin: 0px 3px;
          }
        }
        .facility_source_radio_group {
          display: flex;
          flex-direction: column;
          .facility_source_radio_group_field {
            display: flex;
            align-items: center;
            color: rgba(0, 0, 0, 0.6);
          }
          .facility_source_field {
            flex: none;
            width: 50px;
          }
        }
        .facility_source_renew {
          display: flex;
          align-items: center;
          color: rgba(0, 0, 0, 0.6);
          .facility_source_field {
            flex: none;
            width: 50px;
          }
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
          border-top-color: #3bcf76;
          border-right-color: #3bcf76;
        }
        .mark_pattern {
          top: 4px;
          right: 2px;
          position: absolute;
        }
      }
    }
  }
}
</style>
