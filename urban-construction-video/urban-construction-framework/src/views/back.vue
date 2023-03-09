<template>
  <div class="back">
    <v-card class="card" light>
      <div class="graph">
        <span class="graph_name">历史回放</span>
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
        <v-select
          light
          dense
          outlined
          class="select ml-5"
          label="选择视频时间段"
          item-value="id"
          item-text="name"
          background-color="#fff"
          :loading="backloading"
          v-model="backvideoId"
          :items="backvideo"
          @input="backfilter"
        />
      </div>
      <v-tabs v-model="tabs" light style="text-align:right;">
        <v-tab
          v-for="( i, index ) in items"
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
        <div :class="['box1', i!=1 ? 'box2':'']">
          <div
            v-for="k in list"
            :key="k"
            :class="['video1', i == 2 ? 'video2':'', i == 3 ? 'video3':'' ]"
          >
            <div class="camera"></div>
            <div class="text">{{k}}</div>
          </div>
        </div>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
export default {
  name: "back",
  data: () => ({
    tabs: 0,
    items: [
      { tab: "One", content: "mdi-checkbox-blank-outline" },
      { tab: "Two", content: "mdi-view-grid" },
      { tab: "Three", content: "mdi-grid" }
    ],
    list: 1,
    gallery: [
      { name: "防火段1/摄像头01", id: 1 },
      { name: "防火段1/摄像头02", id: 2 },
      { name: "防火段2/摄像头01", id: 3 }
    ],
    backvideo: [
      { name: "2020-07-30 12:00-12:05", id: 1 },
      { name: "2020-07-30 12:06-12:10", id: 2 },
      { name: "2020-07-30 12:11-12:15", id: 3 } 
    ],
    capsuleId: 1,
    backvideoId: 1,
    filterloading: false,
    backloading: false,
  }),
  methods: {
    tab(e) {
      const list = [1, 4, 9];
      this.list = list[e];
    },
    filter() {}
  }
};
</script>

<style lang="scss" scoped>
.back {
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
        width: 240px;
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
