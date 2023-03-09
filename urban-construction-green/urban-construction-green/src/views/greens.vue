<template>
  <div class="greens">
    <div class="voltage">
      <!-- 电压 -->
      <v-row dense>
        <v-col cols="2.4" class="progress" v-for="(i, index) in list" :key="index">
          <v-progress-circular
            :rotate="180"
            :size="imageHeight"
            :width="7"
            :value="i.value"
            color="#2aca97"
          >{{i.title}}</v-progress-circular>
        </v-col>
      </v-row>
      <!-- Echarts -->
      <div v-resize.quiet="onResize" class="main">
        <v-row dense>
          <v-col cols="12">
            <div class="nape white">
              <div :class="[ imageHeight== '240'?'echart':'echart-small']" id="myChart-all" />
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { echarts } from "@/assets/script/mock";
export default {
  name: "greens",
  data: () => ({
    list: [],
    ids: [],
    wait: false,
    timer: '',
    echarts,
  }),
  computed: {
    imageHeight() {
      const arr = ["xs", "sm", "md", "lg", "xl"];
      if (this.$vuetify.breakpoint.name == arr[4]) {
        return "240";
      } else if (this.$vuetify.breakpoint.name == arr[3]) {
        return "190";
      } else if (this.$vuetify.breakpoint.name == arr[2]) {
        return "150";
      } else if (this.$vuetify.breakpoint.name == arr[1]) {
        return "110";
      } else if (this.$vuetify.breakpoint.name == arr[0]) {
        return "80";
      } else {
        return "80";
      }
    },
    // 数据仓库
    ...mapGetters(["myCurrent"])
  },
  watch: {
    myCurrent: {
      handler(value) {
        const { id } = value;
        if (id) {
          // 清除上一个定时器
          clearInterval(this.timer);
          this.ids = [id];
          this.query(this.ids);
          this.create(id)
        }
      },
      immediate: true,
      deep: true
    }
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    query(ids) {
      this.$axios.post("/dataManage/deviceData/realTimeData", {
        ids
      }).then(res => {
        if (res) {
          const parameters = res.result[0].parameters.slice(1,-1).split(',');
          const list = ["电压 ", '电流 ', "功率 ", "电量 "];
          const company = ["V", "A", "KW", "kWh"];


          this.list = parameters.map((n,v)=>{
            return {
              title: list[v] + res.result[0].value[n] + company[v],
              value : (res.result[0].value[n]/10000) * 100 // 总量 暂时还没有
            }
          })
          // 轮询
          this.timer = setTimeout(() => {
            this.query(this.ids);
          }, 2000);
        }
      });
    },
    create(id) {
      echarts.series[0].data = [0,1,4,Math.ceil(Math.random()*10),20,Math.ceil(Math.random()*50),28,Math.ceil(Math.random()*10),32,28];
      echarts.series[1].data = [1,1,Math.ceil(Math.random()*10),2,8,5,Math.ceil(Math.random()*10),1,Math.ceil(Math.random()*10),9];     
      this.$chart.line("myChart-all", echarts);
          const v = Math.random()*1000;
          const a = Math.random()*200;
          const KW = Math.random()*5000;
          const kWh = Math.random()*200000;
          this.list = [{
            title:"电压"+v.toFixed(2)+"V",
            value:v
          },{
            title:"电流"+a.toFixed(2)+"A",
            value:a
          },{
            title:"功率"+KW.toFixed(2)+"KW",
            value:KW
          },{
            title:"电量"+kWh.toFixed(2)+"kWh",
            value:kWh
          }]
    
      this.$axios.post("/dataManage/green/getDataById", {
        id
      }).then(res => {
        if (res) {
          const { electricityList, dates, powerList } = res.result;
          echarts.xAxis.power = dates;
          echarts.xAxis.factor =  dates;
          echarts.series[0].data = powerList;
          echarts.series[1].data = electricityList;
          this.$chart.line("myChart-all", echarts);
          this.wait = true;
        }
      });
    },
    onResize() {
      // 重置
      if (this.wait) {
        this.$chart.line("myChart-all", echarts);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.greens {
  height: 100%;
  .voltage {
    height: 100%;
  }
  .progress {
    margin: 0;
    padding: 20px 0;
    text-align: center;
  }
  .main {
    width: 100%;
    border-top: 10px solid #ECEFF1;
    .nape {
      width: 100%;
      overflow: hidden;
      .header {
        padding: 16px 16px 0px 16px;
        border-bottom: 1px solid #e6e6e6;
        .alert {
          display: flex;
        }
      }
      .echart {
        height: 800px;
      }
      .echart-small {
        height: 500px;
      }
    }
  }
}
@media screen and (max-width: 1920px) {
  .common .main .nape .echart {
    height: 500px !important;
  }
}
</style>
