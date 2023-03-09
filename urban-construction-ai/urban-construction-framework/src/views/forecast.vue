<template>
  <div class="forecast">
    <div class="graph">
      <div class="graph_name">
        <span>预警图形</span>
        <v-select
          light
          dense
          outlined
          class="select"
          label="所属舱体"
          item-value="id"
          item-text="name"
          background-color="#fff"
          :loading="filterloading"
          v-model="capsuleId"
          :items="gallery"
          @input="filter"
        />
        <v-select
          light
          dense
          outlined
          class="select"
          item-value="name"
          item-text="name"
          label="传感器类型"
          background-color="#fff"
          :loading="filtrateloading"
          v-model="deviceType"
          :items="filtratey"
          @input="filtrate"
        />
      </div>
      <div class="echarts" v-resize.quiet="onResize">
        <div class="echart">
         <div class="echart_name">
            <v-icon light small>mdi-cloud-upload</v-icon>
            <span class="ml-4">投入式液位计9</span>
          </div>
          <div class="myChart" :id="`myChart1`" />
        </div>
        <!-- <div class="echart" v-for="(i, index) in list" :key="index">
          <div class="echart_name">
            <v-icon light small>mdi-cloud-upload</v-icon>
            <span class="ml-4"></span>
          </div>
          <div class="myChart" :id="`myChart${index}`" />
        </div> -->
      </div>
    </div>
    <div class="sheet">
      <div class="sheet_name">数据列表</div>
      <div class="table elevation-7">
        <el-table :data="forecast" :loading="table" row-key="id" height="450" border>
          <el-table-column prop="deviceName" label="传感器名称" align="center" min-width="200" />
          <el-table-column prop="deviceId" label="传感器编号" align="center" min-width="200" />
          <el-table-column prop="value" label="当前数值" align="center" min-width="200" />
          <el-table-column prop="safe" label="是否安全" align="center" min-width="200" />
          <el-table-column prop="threshold" label="报警值" align="center" min-width="200" />
          <el-table-column prop="alarmTime" label="预计到达报警值时刻" align="center" min-width="200" />
          <el-table-column prop="countDown" label="距离预计报警时间" align="center" min-width="200" />
          <el-table-column prop="spaceName" label="舱体名称" align="center" min-width="200" />
          <el-table-column prop="capsuleName" label="防火段名称" align="center" min-width="200" />
          <el-table-column prop="danger" label="危急值" align="center" min-width="200" />
          <el-table-column prop label="预计到达危机值时间" align="center" min-width="200" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "forecast",
  data: () => ({
    list: [],
    forecast: [],
    filterloading: false,
    filtrateloading: false,
    table: false,
    capsuleId: "",
    deviceType: "",
    gallery: [],
    filtratey: [],
    deviceTypes: [],
    plan: [],
    deviceId: [],
    idx: []
  }),
  mounted() {
    this.create();
  },
  methods: {
    create() {
      this.$axios.post("/device-center/SpaceManage/list", {}).then(res => {
        if (res) {
          this.filterloading = true;
          if (res) {
            this.gallery = res.data;
            this.capsuleId = this.gallery[0].id;
            this.filterloading = false;
            this.first();
          }
        }
      });
    },
    first() {
      this.$axios.post("/api-device/DeviceSystemType/list", {}).then(res => {
        if (res) {
          for (const i of res.data) {
            if (i.systemName == "人工智能") {
              this.deviceTypes = i.deviceTypes;
              this.repaint(this.capsuleId, true);
            }
          }
        }
      });
    },
    repaint(id, only) {
      this.filtrateloading = true;
      this.table = true;
      this.plan = [];
      this.deviceId = []

      this.forecast= [

        {
          deviceName:"传感器",
          deviceId:1,
          value:100,
          safe:'是',
          threshold:9392,
          alarmTime:'2022-12-01',
          countDown:'211',
          spaceName:'综合',
          capsuleName:'防火段',
          danger:'危急值'
        }

      ]
      this.$chart.line(`myChart1`, {});
      this.$axios
        .get(`/api-device/device/querySpaceDevice?spaceId=${id}`, {})
        .then(res => {
          if (res.data.length) {
            const parameters = this.deviceTypes.slice(1, -1).split(",");
            for (const i of res.data) {
              for (const e of parameters) {
                if (e == i.type.trim()) {
                  this.plan.push(i);
                }
              }
            }
            const result = new Map();
            this.filtratey = this.plan.filter(arr => !result.has(arr.type) && result.set(arr.type, 1));
            if (only) this.deviceType = this.filtratey[0].name;
            this.filtrateloading = false;
            this.deviceId = this.plan.filter(n => this.deviceType == n.name && n.id);
            this.idx = this.deviceId.map(n => n.id);
            this.query(this.idx);
            this.myForecast(this.idx);
          } else {
            this.filterloading = false;
            this.filtratey = [];
            this.deviceType = null;
            this.filtrateloading = false;
            this.list = [];
            this.forecast = [];
            
          }
        });
    },
    query(ids) {

      this.$axios
        .post("/dataManage/alarm/earlyWarn", {
          ids
        })
        .then(res => {
          if (res) {
            this.list = res.result.map(n => {
              for (const e of this.filtratey) {
                if (e.name == n.deviceName) {
                  n.parameters = e.parameters.slice(1, -1).split(",");
                }
              }
              n.times = [...n.times, ...n.earlyTimes];
              if (n.parameters.length > 1) {
                for (const e of n.parameters) {
                  n.data[e] = [ ...n.data[e], ...n.earlyData[e]]
                }
                return {
                  ...n
                }
              }
              return {
                ...n,
                data: [
                  ...n.data[n.parameters[0]],
                  ...n.earlyData[n.parameters[0]]
                ]
              };
            });
            this.$nextTick(() => {
              this.list.forEach((n, v) => {
                this.$chart.line(`myChart${v}`, n);
              });
            });
          }
        });
    },
    myForecast(ids) {
      this.$axios
        .post("/dataManage/alarm/earlyWarnTable", {
          ids
        })
        .then(res => {
          if (res) {
            this.forecast = res.result.map(n => {
              for (const e of this.filtratey) {
                if (e.name == n.deviceName) {
                  n.parameters = e.parameters.slice(1, -1).split(",");
                }
              }
              if (n.parameters.length > 1) {
                const building = [];
                for (const i of n.parameters) {
                  if (i) {
                    building.push(n);
                  }
                }
                const children = building.map((k, u) => {
                  return {
                    ...k,
                    id: (Math.random() * 1000).toFixed(4),
                    safe: k.isSafe == true ? "安全" : "警告",
                    deviceName: [k.parameters[u]],
                    threshold: `[${k.threshold[k.parameters[u]][0]}, ${k.threshold[k.parameters[u]][1]}]`,
                    danger: `[${k.danger[k.parameters[u]][0]}, ${k.danger[k.parameters[u]][1]}]`,
                    value: k.value[k.parameters[u]]
                  };
                });
                return {
                  deviceName: n.deviceName,
                  id: (Math.random() * 1000).toFixed(4),
                  children
                };
              }
              return {
                ...n,
                id: (Math.random() * 1000).toFixed(4),
                safe: n.isSafe == true ? "安全" : "警告",
                threshold: `[${n.threshold[n.parameters][0]}, ${n.threshold[n.parameters][1]}]`,
                danger: `[${n.danger[n.parameters][0]}, ${n.danger[n.parameters][1]}]`,
                value: n.value[n.parameters]
              };
            });
            this.filterloading = false;
            this.filtrateloading = false;
          }
        });
    },
    filter(value) {
      this.filterloading = true;
      this.capsuleId = value || "";
      this.repaint(this.capsuleId, true);
    },
    filtrate(value) {
      this.filtrateloading = true;
      this.deviceType = value || "";
      this.repaint(this.capsuleId, false);
    },
    onResize() {
      // 重置
      this.$nextTick(() => {
        this.list.forEach((n, v) => {
          this.$chart.line(`myChart${v}`, n);
        });
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.forecast {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .graph {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
        width: 200px;
        height: 40px;
        margin-left: 10px;
      }
    }
    .echarts {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      overflow-y: scroll;
      max-height: 1250px;
      align-items: stretch;
      align-content: stretch;
      justify-content: flex-start;
      .echart {
        flex: 1;
        display: flex;
        min-width: 450px;
        min-height: 200px;
        flex-direction: column;
        margin: 10px 10px 0px 0px;
        background-color: #ffffff;
        justify-content: space-between;
        .echart_name {
          color: #333333;
          padding: 10px 20px;
          border-bottom: 1px solid #e6e6e6;
        }
        .myChart {
          flex: 1;
          background-color: #ffffff;
        }
      }
    }
  }
  .sheet {
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .sheet_name {
      height: 20px;
      margin: 15px 0px;
      color: #333333;
      line-height: 20px;
      padding-left: 15px;
      border-left: 5px solid #00bcd4;
    }
    .table {
      flex: 1;
    }
  }
}
</style>
