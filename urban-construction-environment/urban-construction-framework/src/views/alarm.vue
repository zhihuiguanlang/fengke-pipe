<template>
  <div class="alarm">
    <div class="vessel">
      <div class="video">
        <div class="title">
          <div class="name">
            实时视频
          </div>
        </div>
        <div class="core">
          <img :src="require(`../assets/images/video.png`)" alt="" />
        </div>
      </div>
      <div class="message">
        <div class="title">
          <div class="name">
            报警信息
          </div>
        </div>
        <div class="core">
          <div class="warn">
            <div class="name">舱体：</div>
            <div class="value">{{ message.capsuleName }}</div>
          </div>
          <div class="warn">
            <div class="name">分区：</div>
            <div class="value">{{ message.segmentName }}</div>
          </div>
          <div class="warn">
            <div class="name">报警设备：</div>
            <div class="value">{{ message.deviceName }}</div>
          </div>
          <div class="warn">
            <div class="name">设备类型：</div>
            <div class="value">{{ message.deviceType }}</div>
          </div>
          <div class="warn">
            <div class="name">报警原因：</div>
            <div class="value">{{ message.reason }}</div>
          </div>
          <div class="warn">
            <div class="name">报警值：</div>
            <div class="value">{{ message.alarmValue }}</div>
          </div>
          <div class="warn">
            <div class="name">报警等级：</div>
            <div class="value">{{ message.level }}</div>
          </div>
          <div class="warn">
            <div class="name">报警类型：</div>
            <div class="value">{{ message.typeName }}</div>
          </div>
          <div class="warn">
            <div class="name">报警时间：</div>
            <div class="value">
              {{ new Date(message.alarmTime).toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
      <div class="news">
        <div class="title">
          <div class="name">
            廊内人员
          </div>
        </div>
        <div class="core"></div>
      </div>
    </div>
    <div class="curve">
      <div class="echart">
        <div class="title">
          <div class="name">
            实时曲线
          </div>
        </div>
        <div class="core" v-resize.quiet="onResize">
          <div class="myCurve" id="myCurve" />
        </div>
      </div>
      <div class="deal">
        <div class="title">
          <div class="name">
            处理措施
          </div>
        </div>
        <div class="core">
          <div class="handle">
            <v-checkbox
              v-model="checkbox"
              label="自动打印"
              color="#5FB878"
              hide-details
              class="ma-0"
              disabled
              light
              dense
            />
          </div>
          <div class="print">
            <span class="hint" v-for="i in motion" :key="i.id">
              {{
                `${new Date(i.createTime).toLocaleString()}：${i.description}`
              }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "alarm",
  data: () => ({
    chart: {},
    motion: [],
    message: {           
            segmentName: "分区1",
            capsuleName: "主干廊",
            deviceType: "控制仪",
            alarmValue: "800",
            reason: "reson",
            name: "位移控制仪",
            id: 11,
            spaceName: "控制仪",
            alarmTime: new Date(),
            capsuleLocation: "上海",
            typeName:"自动",
            deviceName:"位移控制仪",
            level: "1",},
    checkbox: true,
    curveTimer: "",
    motionTimer: "",
  }),
  computed: {
    // 数据仓库
    ...mapGetters(["myAlarm"]),
  },
  watch: {
    myAlarm: {
      handler(value) {
        if (value) {
          // 清除定时器
          clearTimeout(this.curveTimer);
          clearTimeout(this.motionTimer);
          // 重置页面
          this.myCurve(value);
          this.myMotion(value);
          this.myMessage(value);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
  methods: {
    myMessage(id) {

      this.message  = {
            segmentName: "位移控制仪",
            capsuleName: "位移控制仪",
            deviceType: "控制仪",
            alarmValue: "800",
            reason: "reson",
            name: "位移控制仪",
            id: 11,
            spaceName: "控制仪",
            typeName: new Date(),
            capsuleLocation: "上海",
            level: "1",
      }
      this.$axios
        .post("/dataManage/alarm/getAlarmById", {
          id,
        })
        .then((res) => {
          if (res) {
            this.message = res.result;
          }
        });
    },
    myMotion(id) {
      this.$axios
        .post("/dataManage/alarm/getAlarmSOP", {
          id,
        })
        .then((res) => {
          if (res) {
            this.motion = res.result;
            // 轮询
            this.motionTimer = setTimeout(() => {
              this.myMotion(this.myAlarm);
            }, 2500);
          }
        });
    },
    myCurve(id) {
      this.$axios
        .post("/dataManage/alarm/getAlarmMinuteData", {
          id,
          isRealTime: true
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
            this.chart = {
              date,
              data,
            };
            // 展示
            this.$chart.line("myCurve", this.chart);
            // 轮询
            this.curveTimer = setTimeout(() => {
              this.myCurve(this.myAlarm);
            }, 2500);
          }
        });
    },
    onResize() {
      this.$chart.line("myCurve", this.chart);
    },
  },
  beforeDestroy() {
    // 清除定时器
    clearTimeout(this.curveTimer);
    clearTimeout(this.motionTimer);
  },
};
</script>

<style lang="scss" scoped>
.alarm {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 15px 0px;
  color: #1e263e;
  .vessel {
    flex: 1;
    display: flex;
    padding: 0px 15px;
    margin-bottom: 15px;
    .video {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      .title {
        height: 50px;
        padding: 15px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e4e9f2;
        .name {
          height: 15px;
          font-size: 15px;
          line-height: 15px;
          padding-left: 15px;
          border-left: 4px solid #12bed1;
        }
      }
      .core {
        flex: 1;
        padding: 5px;
        display: flex;
        img {
          flex: 1;
        }
      }
    }
    .message {
      flex: 1;
      display: flex;
      margin-left: 15px;
      margin-right: 15px;
      flex-direction: column;
      background-color: #ffffff;
      .title {
        height: 50px;
        padding: 15px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e4e9f2;
        .name {
          height: 15px;
          font-size: 15px;
          line-height: 15px;
          padding-left: 15px;
          border-left: 4px solid #12bed1;
        }
      }
      .core {
        flex: 1;
        padding: 20px;
        .warn {
          display: flex;
          align-items: center;
          justify-content: start;
          margin-bottom: 5px;
          .name {
            width: 70px;
            display: flex;
            font-size: 13px;
            justify-content: flex-end;
          }
          .value {
            flex: 1;
            font-size: 13px;
          }
        }
      }
    }
    .news {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      .title {
        height: 50px;
        padding: 15px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e4e9f2;
        .name {
          height: 15px;
          font-size: 15px;
          line-height: 15px;
          padding-left: 15px;
          border-left: 4px solid #12bed1;
        }
      }
      .core {
        flex: 1;
        padding: 5px;
        display: flex;
      }
    }
  }
  .curve {
    flex: 1;
    display: flex;
    padding: 0px 15px;
    .echart {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: #ffffff;
      .title {
        height: 50px;
        padding: 15px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e4e9f2;
        .name {
          height: 15px;
          font-size: 15px;
          line-height: 15px;
          padding-left: 15px;
          border-left: 4px solid #12bed1;
        }
      }
      .core {
        flex: 1;
        display: flex;
        padding: 10px;
        .myCurve {
          flex: 1;
        }
      }
    }
    .deal {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 15px;
      background-color: #ffffff;
      .title {
        height: 50px;
        padding: 15px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e4e9f2;
        .name {
          height: 15px;
          font-size: 15px;
          line-height: 15px;
          padding-left: 15px;
          border-left: 4px solid #12bed1;
        }
      }
      .core {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 20px;
        .handle {
          display: flex;
          align-items: center;
        }
        .print {
          flex: 1;
          display: flex;
          padding: 0px 5px;
          flex-direction: column;
          .hint {
            margin-top: 5px;
            font-size: 13px;
            color: #1e263e;
          }
        }
      }
    }
  }
}
</style>
