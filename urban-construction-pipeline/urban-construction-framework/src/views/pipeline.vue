<template>
  <div class="pipeline">
    <div class="screen">
      <v-select
        :items="select"
        background-color="#FFF"
        class="select"
        open-on-clear
        label="管廊"
        outlined
        light
        dense
      />
    </div>
    <div v-resize="onResize" class="main">
      <v-row dense>
        <v-col md="6" cols="12">
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
              >
                线缆温度
              </v-alert>
            </div>
            <div class="echart" id="myChart-fire" />
          </div>
        </v-col>
        <v-col md="6" cols="12">
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
              >
                燃气管流量
              </v-alert>
            </div>
            <div class="echart" id="myChart-all" />
          </div>
        </v-col>
        <v-col md="6" cols="12">
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
              >
                污水管流量
              </v-alert>
            </div>
            <div class="echart" id="myChart-drain" />
          </div>
        </v-col>
        <v-col md="6" cols="12">
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
              >
                污水管压力
              </v-alert>
            </div>
            <div class="echart" id="myChart-gas" />
          </div>
        </v-col>
        <v-col md="6" cols="12">
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
              >
                给水管流量
              </v-alert>
            </div>
            <div class="echart" id="myChart-mean" />
          </div>
        </v-col>
        <v-col md="6" cols="12">
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
              >
                给水管压力
              </v-alert>
            </div>
            <div class="echart" id="myChart-pressure" />
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "pipeline",
  data: () => ({
    select: [
      {
        text: "红龙路在建管廊",
        value: 1
      },
      {
        text: "红龙路演示管廊",
        value: 2
      }
    ],
  }),
  mounted() {
    // 创建图表
    this.create()
  },
  methods: {
    create() {
      this.$chart.line("myChart-all");
      this.$chart.line("myChart-gas");
      this.$chart.line("myChart-fire");
      this.$chart.line("myChart-mean");
      this.$chart.line("myChart-drain");
      this.$chart.line("myChart-pressure");
    },
    onResize () {
      // 重置
      this.create()
    },
  },
};
</script>

<style lang="scss" scoped>
.pipeline {
  height: 100%;
  .screen {
    width: 100%;
    margin: 10px 0px 15px 0px;
    .select {
      width: 280px;
      height: 40px;
    }
  }
  .main {
    width: 100%;
    .nape {
      width: 100%;
      .header {
        padding: 16px 16px 0px 16px;
        border-bottom: 1px solid #e6e6e6;
        .alert {
          display: flex;
        }
      }
      .echart {
        height: 300px;
      }
    }
  }
}
</style>
