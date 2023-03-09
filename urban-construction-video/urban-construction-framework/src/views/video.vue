<template>
  <div class="video">
    <v-card class="card" light>
      <div class="graph">
        <span class="graph_name">摄像头</span>
        <v-select
          light
          dense
          outlined
          class="select"
          label="摄像头"
          item-value="id"
          item-text="name"
          background-color="#fff"
          :loading="filterloading"
          v-model="capsuleId"
          :items="gallery"
          @input="filter"
        />
      </div>
      <v-tabs v-model="tabs" light style="text-align:right;">
        <v-tab
          v-for="(i, index) in items"
          :key="index"
          class="primary--text"
          @change="tab(index)"
        >
          <v-icon>{{ i.content }}</v-icon>
        </v-tab>
      </v-tabs>
    </v-card>
    <v-tabs-items light class="handle mt-4" v-model="tabs">
      <v-tab-item v-for="i in 3" :key="i">
        <div :class="['box1', i != 1 ? 'box2' : '']">
          <div
            v-for="k in list"
            :key="k"
            :class="['video1', i == 2 ? 'video2' : '', i == 3 ? 'video3' : '']"
          >
            <div class="camera"></div>
            <div class="text">{{ k }}</div>
            <div v-show="i == 1" class="yun">
              <div class="box1">
                <div class="barContent">
                  <ul>
                    <li>
                      <a href="#">前进</a>
                    </li>
                    <li>
                      <a href="#">右转</a>
                    </li>
                    <li>
                      <a href="#">后退</a>
                    </li>
                    <li>
                      <a href="#">左转</a>
                    </li>
                  </ul>
                  <div class="centerBtn">
                    <a href="#">停止</a>
                  </div>
                </div>
                <div class="controlName">车体控制</div>
              </div>
              <div class="box2">
                <div class="barContent">
                  <ul>
                    <li>
                      <a href="#">上移</a>
                    </li>
                    <li>
                      <a href="#">右移</a>
                    </li>
                    <li>
                      <a href="#">下移</a>
                    </li>
                    <li>
                      <a href="#">左移</a>
                    </li>
                  </ul>
                  <div class="centerBtn">
                    <a href="#">停止</a>
                  </div>
                </div>
                <div class="controlName">云台控制</div>
              </div>
            </div>
          </div>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: "video",
  data: () => ({
    tabs: 0,
    items: [
      { tab: "One", content: "mdi-checkbox-blank-outline" },
      { tab: "Two", content: "mdi-view-grid" },
      { tab: "Three", content: "mdi-grid" },
    ],
    list: 1,
    gallery: [
      { name: "防火段1/摄像头01", id: 1 },
      { name: "防火段1/摄像头02", id: 2 },
      { name: "防火段2/摄像头01", id: 3 },
    ],
    capsuleId: 1,
    filterloading: false,
  }),
  methods: {
    tab(e) {
      const list = [1, 4, 9];
      this.list = list[e];
    },
    filter() {},
  },
};
</script>

<style lang="scss" scoped>
.video {
  height: 100%;
  display: flex;
  flex-direction: column;
  .card {
    display: flex;
    .graph {
      flex: 1;
      display: flex;
      flex-direction: row;
      height: 20px;
      display: flex;
      color: #333333;
      line-height: 20px;
      padding-left: 15px;
      align-items: center;
      margin: 12px 0px 10px 0px;
      align-content: flex-start;
      border-left: 5px solid #00bcd4;
      .graph_name {
        width: 80px;
      }
      .select {
        flex: none;
        width: 200px;
        height: 40px;
      }
    }
  }
  .handle {
    flex: 1;
    .box1 {
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      padding-left: 10px;
      padding-right: 10px;
      .video1 {
        width: 100%;
        height: 100%;
        background-color: #7285a1;
        position: relative;
        .camera {
          top: 50%;
          left: 50%;
          width: 240px;
          height: 150px;
          margin-top: -75px;
          margin-left: -120px;
          position: absolute;
          background: url("../assets/images/camera.png") no-repeat;
          background-size: cover;
        }
        .text {
          position: absolute;
          top: 15px;
          right: 30px;
          color: red;
        }
        .yun {
          width: 400px;
          height: 300px;
          color: black;
          position: absolute;
          bottom: 0;
          display: flex;
          flex-direction: row;
          font-size: 14px;
          .box1,
          .box2 {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .barContent {
              width: 200px;
              height: 200px;
              border-radius: 50%;
              background: #ddd;
              position: relative;
              overflow: hidden;
              margin-bottom: 10px;
              max-width: 140px;
              max-height: 140px;
              margin: 0 auto;
              ul {
                li {
                  width: 50%;
                  height: 50%;
                  background: #9ca9b2;
                  position: absolute;
                  top: 0;
                  left: 0;
                  overflow: hidden;
                  -webkit-transform-origin: 100% 100%;
                  transform-origin: 100% 100%;
                  a {
                    line-height: 20px;
                    display: block;
                    width: 100%;
                    height: 20px;
                    position: absolute;
                    top: 50%;
                    margin-top: -10px;
                    color: #fff;
                    font-weight: 700;
                    text-decoration: none;
                    text-align: center;
                    -webkit-transform-origin: 50% 50%;
                    transform-origin: 50% 50%;
                  }
                }
                li:first-child {
                  transform: rotate(45deg) skew(0deg);
                  a {
                    transform: rotate(-45deg);
                  }
                }
                li:nth-child(2) {
                  transform: rotate(135deg) skew(0deg);
                  a {
                    transform: rotate(-135deg);
                  }
                }
                li:nth-child(3) {
                  transform: rotate(-135deg) skew(0deg);
                  a {
                    transform: rotate(135deg);
                  }
                }
                li:nth-child(4) {
                  transform: rotate(-45deg) skew(0deg);
                  a {
                    transform: rotate(45deg);
                  }
                }
              }
              .centerBtn {
                width: 50%;
                height: 50%;
                background: #fff;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-top: -25%;
                margin-left: -25%;
                text-align: center;
                z-index: 100;
                color: #333;
                cursor: pointer;
                a {
                  text-decoration: none;
                  color: #333;
                  display: block;
                  width: 100%;
                  height: 20px;
                  line-height: 20px;
                  position: absolute;
                  top: 50%;
                  margin-top: -10px;
                }
              }
            }
            .controlName {
              color: white;
              font-size: 16px;
              margin-top: 20px;
            }
          }
        }
      }
      .video2 {
        width: 50% !important;
        height: 50% !important;
        border-right: 10px solid white;
        border-bottom: 10px solid white;
      }
      .video3 {
        width: 33.33% !important;
        height: 33.33% !important;
        border-right: 10px solid white !important;
        border-bottom: 10px solid white !important;
      }
    }
    .box2 {
      padding-right: 0px !important;
    }
  }
}
</style>
