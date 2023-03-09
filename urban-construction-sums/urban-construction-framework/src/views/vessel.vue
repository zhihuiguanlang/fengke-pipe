<template>
  <div class="vessel">
    <!-- 头部 -->
    <div class="header">
      <!-- 左侧 -->
      <div class="gallery">
        <!-- 时间 -->
        <div class="time">
          <span>2020年</span>
          <span>6月9日</span>
          <span>23:59:59</span>
        </div>
        <!-- 筛选 -->
        <div class="screen">
          <div class="menu">
            <v-menu bottom origin="center center" transition="scale-transition">
              <template v-slot:activator="{ on }">
                <v-btn text small color="#ffffff" v-on="on">
                  红龙路演示段管廊
                  <v-icon right size="20" v-text="`mdi-menu-down`" />
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title>红龙路演示段管廊</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </div>
      </div>
      <!-- 标题 -->
      <div class="headline">
        <div class="title">
          <div class="logo">
            <v-img
              width="40"
              height="40"
              aspect-ratio="1"
              src="@/assets/images/logo.png"
            />
          </div>
          <span class="name">****智慧管廊综合管理运维信息平台</span>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="user">
        <!-- 操作 -->
        <div class="handle">
          <v-btn text small color="#ffffff">
            <v-icon left size="20" v-text="`mdi-account`" />
            {{roles}}
          </v-btn>
          <v-btn text small color="#ffffff" @click='layout'>
            <v-icon left size="20" v-text="`mdi-logout-variant`" />
            退出
          </v-btn>
        </div>
        <!-- 水印 -->
<!--        <div class="watermark">
          SUMS
        </div>-->
      </div>
    </div>
    <!-- 中心 -->
    <div class="area">
      <!-- 侧边导航栏 -->
      <div class="navigation">
        <!-- 整体态势 -->
        <v-menu
          :close-on-content-click="false"
          :nudge-width="450"
          v-model="overall"
          open-on-hover
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              dark
              v-on="on"
              class="_btn"
              v-bind="attrs"
              color="#12bed1"
              @click="windowTabs('overall')"
            >
              <v-icon>mdi-heart-pulse</v-icon>
            </v-btn>
          </template>
          <!-- 弹窗 -->
          <div class="popup">
            <div class="name">
              整体态势
            </div>
            <div class="views">
              <div class="each" @click='jump("gis")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-crosshairs-gps
                </v-icon>
                <div class="nickname">
                  GIS系统
                </div>
              </div>
              <div class="each" @click='localhost()'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-atom
                </v-icon>
                <div class="nickname">
                  BIM系统
                </div>
              </div>
              <div class="each">
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-tooltip-account
                </v-icon>
                <div class="nickname">
                  人员定位系统
                </div>
              </div>
            </div>
          </div>
        </v-menu>
        <!-- 实时监控 -->
        <v-menu
          :close-on-content-click="false"
          :nudge-width="450"
          v-model="camera"
          open-on-hover
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              dark
              v-on="on"
              class="_btn"
              v-bind="attrs"
              color="#12bed1"
              @click="windowTabs('camera')"
            >
              <v-icon>mdi-desktop-classic</v-icon>
            </v-btn>
          </template>
          <!-- 弹窗 -->
          <div class="popup">
            <div class="name">
              实时监控
            </div>
            <div class="views">
              <div class="each" @click='jump("environment")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-home-thermometer-outline
                </v-icon>
                <div class="nickname">
                  环境与设备监控系统
                </div>
              </div>
              <div class="each" @click='jump("video")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-cctv
                </v-icon>
                <div class="nickname">
                  视频监控系统
                </div>
              </div>
              <div class="each">
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-alarm-light-outline
                </v-icon>
                <div class="nickname">
                  防入侵监控系统
                </div>
              </div>
              <div class="each" @click='jump("firecontrol")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-fire-extinguisher
                </v-icon>
                <div class="nickname">
                  消防监控系统
                </div>
              </div>
              <div class="each" @click='jump("greens")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-lightbulb-on-outline
                </v-icon>
                <div class="nickname">
                  绿色节能系统
                </div>
              </div>
              <div class="each" @click='jump("cloud")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-cloud-print-outline
                </v-icon>
                <div class="nickname">
                  云系统监控
                </div>
              </div>
              <div class="each" @click='jump("health")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-bottle-tonic-plus-outline
                </v-icon>
                <div class="nickname">
                  结构健康监控系统
                </div>
              </div>
              <div class="each" @click='jump("analyze")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-video-outline
                </v-icon>
                <div class="nickname">
                  视频分析系统
                </div>
              </div>
            </div>
          </div>
        </v-menu>
        <!-- 运维管理 -->
        <v-menu
          :close-on-content-click="false"
          :nudge-width="450"
          v-model="plan"
          open-on-hover
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              dark
              v-on="on"
              class="_btn"
              v-bind="attrs"
              color="#12bed1"
              @click="windowTabs('plan')"
            >
              <v-icon>mdi-hammer-wrench</v-icon>
            </v-btn>
          </template>
          <!-- 弹窗 -->
          <div class="popup">
            <div class="name">
              运维管理
            </div>
            <div class="views">
              <div class="each" @click='jump("operational")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-table-clock
                </v-icon>
                <div class="nickname">
                  运维计划管理系统
                </div>
              </div>
              <div class="each" @click='jump("personnel")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-account-group
                </v-icon>
                <div class="nickname">
                  人员管理系统
                </div>
              </div>
              <div class="each" @click='jump("asset")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-cash-usd-outline
                </v-icon>
                <div class="nickname">
                  资产管理系统
                </div>
              </div>
              <div class="each" @click='jump("simulation")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-alert-remove-outline
                </v-icon>
                <div class="nickname">
                  故障演练系统
                </div>
              </div>
              <div class="each" @click='jump("history")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-history
                </v-icon>
                <div class="nickname">
                  历史事件管理系统
                </div>
              </div>
              <div class="each" @click='jump("worksheet")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-order-bool-descending-variant
                </v-icon>
                <div class="nickname">
                  工单管理系统
                </div>
              </div>
              <div class="each" @click='jump("report")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-file-chart-outline
                </v-icon>
                <div class="nickname">
                  自动报表系统
                </div>
              </div>
              <div class="each" @click='jump("communication")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-text-to-speech
                </v-icon>
                <div class="nickname">
                  人员通讯系统
                </div>
              </div>
            </div>
          </div>
        </v-menu>
        <!-- 数据分析 -->
        <v-menu
          :close-on-content-click="false"
          :nudge-width="450"
          v-model="resource"
          open-on-hover
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              dark
              v-on="on"
              class="_btn"
              v-bind="attrs"
              color="#12bed1"
              @click="windowTabs('resource')"
            >
              <v-icon>mdi-chart-bar</v-icon>
            </v-btn>
          </template>
          <!-- 弹窗 -->
          <div class="popup">
            <div class="name">
              数据分析
            </div>
            <div class="views">
              <div class="each" @click='jump("hadoop")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-finance
                </v-icon>
                <div class="nickname">
                  大数据分析系统
                </div>
              </div>
              <div class="each" @click='jump("ai")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-shield-cross-outline
                </v-icon>
                <div class="nickname">
                  人工智能预警系统
                </div>
              </div>
              <div class="each" @click='jump("alarmanalysis")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-fan-alert
                </v-icon>
                <div class="nickname">
                  报警分析决策辅助系统
                </div>
              </div>
            </div>
          </div>
        </v-menu>
        <!-- 协作管理 -->
        <v-menu
          :close-on-content-click="false"
          :nudge-width="450"
          v-model="team"
          open-on-hover
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon dark v-on="on" v-bind="attrs" color="#12bed1">
              <v-icon>mdi-handshake</v-icon>
            </v-btn>
          </template>
          <!-- 弹窗 -->
          <div class="popup">
            <div class="name">
              协作管理
            </div>
            <div class="views">
              <div class="each" @click='jump("performance")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-account-edit-outline
                </v-icon>
                <div class="nickname">
                  绩效考核系统
                </div>
              </div>
              <div class="each" @click='jump("gallery")'>
                <v-icon size="35" color="rgba(9, 158, 185, 0.7)">
                  mdi-door-open
                </v-icon>
                <div class="nickname">
                  入廊管理系统
                </div>
              </div>
            </div>
          </div>
        </v-menu>
      </div>
      <!-- 交互区域 -->
      <div class="domain">
        <v-window class="_window" v-model="window">
          <v-window-item class="_member" value="overall">
            <!-- 整体态势 -->
            <v-overall />
          </v-window-item>
          <v-window-item class="_member" value="camera">
            <!-- 实时监控 -->
            <v-camera />
          </v-window-item>
          <v-window-item class="_member" value="plan">
            <!-- 运维管理 -->
            <v-plan />
          </v-window-item>
          <v-window-item class="_member" value="resource">
            <!-- 数据分析 -->
            <v-resource />
          </v-window-item>
        </v-window>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";  // 引入cookie
import { mapActions } from "vuex";
export default {
  name: "vessel",
  data() {
    return {
      team: false,
      plan: false,
      camera: false,
      overall: false,
      resource: false,
      roles: '',
      window: "overall",
    };
  },
  components: {
    // 运维管理
    "v-plan": () => import("./assembly/plan"),
    // 实时监控
    "v-camera": () => import("./assembly/camera"),
    // 整体态势
    "v-overall": () => import("./assembly/overall"),
    // 数据分析
    "v-resource": () => import("./assembly/resource"),
  },
  created() {
    this.role();
  },
  methods: { 
    // 数据仓库
    ...mapActions(["saveSource"]),
    windowTabs(value) {
      // 赋值
      this.window = value;
      // 存入vuex
      this.saveSource(value);
    },
    layout() {
      this.$axios
        .post("/api-uaa/oauth/remove/token", {})
        .then(res => {
          if (res) {
            // 清除token
            Cookies.remove('token', { expires: 7, path: '/' });
            // 用户提示
            this.$notice.success('退出登录')
            // 跳转页面
            this.$router.push('/login');
          }
        });
    },
    role() {
      this.$axios.get("/api-user/users/current").then(res => {
        if (res) {
          // 当前用户角色
          this.roles = res.data.nickname;
        }
      });
    },
    jump(v) {
      // 跳转子系统
      v && window.open(`http://114.55.245.83:4396/${v}`,'_blank')
    },
    localhost() {
      // 启动本地BIM系统
      // window.open(`http://localhost/Roaming/`,'_blank')
    }
  }
};
</script>

<style lang="scss" scoped>
.vessel {
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    height: 120px;
    display: flex;
    .gallery {
      flex: 1;
      display: flex;
      flex-direction: column;
      .time {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        border-bottom: 1px solid #085470;
        span {
          margin-left: 20px;
        }
      }
      .screen {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .menu {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(8, 29, 56, 0.9);
        }
      }
    }
    .headline {
      display: flex;
      padding-top: 10px;
      align-items: flex-start;
      .title {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .logo {
          margin-right: 7px;
        }
        .name {
          font-size: 28px;
          color: #12bed1;
          font-family: "microsoft yahei";
        }
      }
    }
    .user {
      flex: 1;
      display: flex;
      flex-direction: column;
      .handle {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        border-bottom: 1px solid #085470;
      }
      .watermark {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        letter-spacing: 22px;
        font-weight: lighter;
        color: #205e65;
      }
    }
  }
  .area {
    flex: 1;
    display: flex;
    .navigation {
      width: 60px;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      ._btn {
        margin-bottom: 10px;
      }
    }
    .domain {
      flex: 1;
      display: flex;
      ._window {
        flex: 1;
        display: flex;
        ._member {
          flex: 1;
          display: flex;
          background-image: radial-gradient(#0d2643, #020f22);
        }
      }
    }
  }
}
.popup {
  display: flex;
  flex-direction: column;
  background-color: #021a34;
  border: 1px solid #00769f;
  .name {
    display: flex;
    font-size: 15px;
    padding: 15px 0px;
    align-items: center;
    justify-content: center;
  }
  .views {
    flex: 1;
    width: 450px;
    display: flex;
    flex-wrap: wrap;
    .each {
      width: 150px;
      display: flex;
      margin: 20px 0px;
      align-items: center;
      flex-direction: column;
      cursor: pointer;
      .nickname {
        margin-top: 15px;
        font-size: 12px;
      }
    }
  }
}
</style>
