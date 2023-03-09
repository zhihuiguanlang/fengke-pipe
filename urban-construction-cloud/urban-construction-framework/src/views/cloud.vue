<template>
  <div class="cloud">
    <div v-resize="onResize" class="main">
      <v-row dense class="row">
        <v-col md="4" cols="12" class="col">
          <div class="nape white">
            <div class="header">
              服务器主机1:192.168.1.191
            </div>
            <div class="content">
              <div class="rates">
                <div class="rate">
                  <span class="name">CPU</span>
                  <div class="linear">
                    <v-progress-linear
                      rounded
                      striped
                      value="10"
                      height="8"
                      color="#1E9FFF"
                      background-color="#e0ebf1"
                    />
                  </div>
                  <span class="name">10%</span>
                </div>
                <div class="rate">
                  <span class="name">内存</span>
                  <div class="linear">
                    <v-progress-linear
                      rounded
                      striped
                      value="20"
                      height="8"
                      color="#f9be3f"
                      background-color="#e0ebf1"
                    />
                  </div>
                  <span class="name">20%</span>
                </div>
                <div class="rate">
                  <span class="name">磁盘</span>
                  <div class="linear">
                    <v-progress-linear
                      rounded
                      striped
                      value="30"
                      height="8"
                      color="#f64456"
                      background-color="#e0ebf1"
                    />
                  </div>
                  <span class="name">30%</span>
                </div>
              </div>
              <div class="echarts mb-3">
                <div class="echart" id="myChart-1" />
                <div class="echart" id="myChart-2" />
                <div class="echart" id="myChart-3" />
              </div>
              <div class="elevation-7">
                <v-data-table
                  :light="true"
                  :height="500"
                  :items="items"
                  :item-key="'key'"
                  :headers="headers"
                  :fixed-header="true"
                  :items-per-page="10"
                  :calculate-widths="true"
                  :loading-text="'loading...'"
                />
              </div>
            </div>
          </div>
        </v-col>
        <v-col md="4" cols="12" class="col">
          <div class="nape white">
            <div class="header">
              服务器主机1:192.168.1.192
            </div>
            <div class="content">
              <div class="rates">
                <div class="rate">
                  <span class="name">CPU</span>
                  <div class="linear">
                    <v-progress-linear
                      rounded
                      striped
                      value="20"
                      height="8"
                      color="#1E9FFF"
                      background-color="#e0ebf1"
                    />
                  </div>
                  <span class="name">20%</span>
                </div>
                <div class="rate">
                  <span class="name">内存</span>
                  <div class="linear">
                    <v-progress-linear
                      rounded
                      striped
                      value="30"
                      height="8"
                      color="#f9be3f"
                      background-color="#e0ebf1"
                    />
                  </div>
                  <span class="name">30%</span>
                </div>
                <div class="rate">
                  <span class="name">磁盘</span>
                  <div class="linear">
                    <v-progress-linear
                      rounded
                      striped
                      value="40"
                      height="8"
                      color="#f64456"
                      background-color="#e0ebf1"
                    />
                  </div>
                  <span class="name">40%</span>
                </div>
              </div>
              <div class="echarts mb-3">
                <div class="echart" id="myChart-4" />
                <div class="echart" id="myChart-5" />
                <div class="echart" id="myChart-6" />
              </div>
              <div class="elevation-7">
                <v-data-table
                  :light="true"
                  :height="500"
                  :items="items"
                  :item-key="'key'"
                  :headers="headers"
                  :fixed-header="true"
                  :items-per-page="10"
                  :calculate-widths="true"
                  :loading-text="'loading...'"
                />
              </div>
            </div>
          </div>
        </v-col>
        <v-col md="4" cols="12" class="col">
          <div class="nape white">
            <div class="header">
              服务器主机1:192.168.1.193
            </div>
            <div class="content">
              <div class="rates">
                <div class="rate">
                  <span class="name">CPU</span>
                  <div class="linear">
                    <v-progress-linear
                      rounded
                      striped
                      value="50"
                      height="8"
                      color="#1E9FFF"
                      background-color="#e0ebf1"
                    />
                  </div>
                  <span class="name">50%</span>
                </div>
                <div class="rate">
                  <span class="name">内存</span>
                  <div class="linear">
                    <v-progress-linear
                      rounded
                      striped
                      value="60"
                      height="8"
                      color="#f9be3f"
                      background-color="#e0ebf1"
                    />
                  </div>
                  <span class="name">60%</span>
                </div>
                <div class="rate">
                  <span class="name">磁盘</span>
                  <div class="linear">
                    <v-progress-linear
                      rounded
                      striped
                      value="70"
                      height="8"
                      color="#f64456"
                      background-color="#e0ebf1"
                    />
                  </div>
                  <span class="name">70%</span>
                </div>
              </div>
              <div class="echarts mb-3">
                <div class="echart" id="myChart-7" />
                <div class="echart" id="myChart-8" />
                <div class="echart" id="myChart-9" />
              </div>
              <div class="elevation-7">
                <v-data-table
                  :light="true"
                  :height="500"
                  :items="items"
                  :item-key="'key'"
                  :headers="headers"
                  :fixed-header="true"
                  :items-per-page="10"
                  :calculate-widths="true"
                  :loading-text="'loading...'"
                />
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { items, headers } from "@/assets/script/mock";
export default {
  name: "cloud",
  data: () => ({
    items,
    headers,
  }),
  mounted() {
    // 创建图表
    this.create();
  },
  methods: {
    create() {
      this.$chart.line("myChart-1");
      this.$chart.line("myChart-2");
      this.$chart.line("myChart-3");
      this.$chart.line("myChart-4");
      this.$chart.line("myChart-5");
      this.$chart.line("myChart-6");
      this.$chart.line("myChart-7");
      this.$chart.line("myChart-8");
      this.$chart.line("myChart-9");
    },
    onResize() {
      // 重置
      this.create();
    },
  },
};
</script>

<style lang="scss" scoped>
.cloud {
  height: 100%;
  .main {
    height: 100%;
    .row {
      height: 100%;
      .col {
        height: 100%;
        .nape {
          height: 100%;
          display: flex;
          flex-direction: column;
          .header {
            padding: 10px;
            font-size: 14px;
            color: #1e263e;
            text-align: center;
            border-bottom: 1px solid #e6e6e6;
          }
          .content {
            flex: 1;
            height: 100%;
            padding: 15px;
            display: flex;
            flex-direction: column;
            .rates {
              width: 100%;
              margin-bottom: 22px;
              .rate {
                width: 100%;
                display: flex;
                margin-bottom: 5px;
                align-items: center;
                justify-content: space-between;
                .name {
                  color: #1e263e;
                }
                .linear {
                  flex: 1;
                  margin: 0px 20px;
                }
              }
            }
            .echarts {
              flex: 1;
              justify-content: flex-start;
              .echart {
                height: 145px;
                margin-bottom: 22px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
