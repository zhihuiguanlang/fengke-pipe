<template>
  <div class="gis">
    <!-- 地图 -->
    <div id="map" />
    <!-- 信息图层 -->
    <div id="message" class="message elevation-11">
      <div class="name">{{ message.name }} - {{ message.capsuleLocation }}</div>
      <div class="content">
        <div class="content_handle" v-if="message.common">
          <div class="content_handle_icon">
            <v-icon color="#ffffff" size="30">mdi-air-conditioner</v-icon>
          </div>
          <div class="content_handle_auto">
            <span class="content_handle_auto_close">自动</span>
            <v-switch
              inset
              light
              dense
              color="#32c95c"
              :true-value="1"
              :false-value="0"
              class="ma-0 pa-0 ml-5"
              @change="setAuto(message)"
              v-model="message.value[`auto`]"
            />
            <span class="content_handle_auto_open">手动</span>
          </div>
          <div class="content_handle_open">
            <span class="content_handle_auto_close">关</span>
            <v-switch
              inset
              light
              dense
              color="#32c95c"
              :true-value="1"
              :false-value="0"
              class="ma-0 pa-0 ml-5"
              @change="setOpen(message)"
              v-model="message.value[`open`]"
            />
            <span class="content_handle_auto_open">开</span>
          </div>
        </div>
        <div class="content_handle" v-else-if="message.auto">
          <div class="content_handle_icon">
            <v-icon color="#ffffff" size="30">mdi-air-conditioner</v-icon>
          </div>
          <div class="content_handle_auto">
            <span class="content_handle_auto_close">自动</span>
            <v-switch
              inset
              light
              dense
              color="#32c95c"
              :true-value="1"
              :false-value="0"
              class="ma-0 pa-0 ml-5"
              @change="setAuto(message)"
              v-model="message.value[`auto`]"
            />
            <span class="content_handle_auto_open">手动</span>
          </div>
        </div>
        <div class="content_handle" v-else-if="message.open">
          <div class="content_handle_icon">
            <v-icon color="#ffffff" size="30">mdi-air-conditioner</v-icon>
          </div>
          <div class="content_handle_open">
            <span class="content_handle_auto_close">关</span>
            <v-switch
              inset
              light
              dense
              color="#32c95c"
              :true-value="1"
              :false-value="0"
              class="ma-0 pa-0 ml-5"
              @change="setOpen(message)"
              v-model="message.value[`open`]"
            />
            <span class="content_handle_auto_open">开</span>
          </div>
        </div>
        <div class="content_handle" v-else-if="message.smoke">
          <div
            :class="
              !message.value[`smoke`]
                ? `content_handle_icon`
                : `content_handle_deep_icon`
            "
          >
            <v-icon :size="30" :color="`#ffffff`">mdi-air-conditioner</v-icon>
          </div>
          <div class="content_handle_status">
            <span
              class="content_handle_status_have"
              v-if="message.value[`smoke`]"
              >有烟雾</span
            >
            <span class="content_handle_status_none" v-else>无烟雾</span>
          </div>
          <div class="content_handle_hint">当前状态</div>
        </div>
        <div v-else class="content_property">
          <div
            :key="index"
            :class="`content_property_source`"
            v-for="(n, name, index) of JSON.parse(message.threshold || `[]`)"
          >
            <div class="content_property_source_container">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div
                    class="content_property_source_container_circular"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-progress-circular
                      :value="message.value[name]"
                      :color="`#8ae8b6`"
                      :rotate="270"
                      :size="100"
                      :width="7"
                      >{{ message.value[name] }}</v-progress-circular
                    >
                  </div>
                </template>
                <span>{{ name }}</span>
              </v-tooltip>
              <div class="content_property_source_container_range">
                <div class="content_property_source_container_range_down">
                  <v-icon light color="#33aefd" size="17"
                    >mdi-arrow-down-thick</v-icon
                  >
                  <span
                    class="content_property_source_container_range_down_count"
                    >{{ n[1] }}</span
                  >
                </div>
                <div class="content_property_source_container_range_up">
                  <v-icon light color="#fc5a7c" size="17"
                    >mdi-arrow-up-thick</v-icon
                  >
                  <span
                    class="content_property_source_container_range_up_count"
                    >{{ n[0] }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Map from "ol/Map";
import View from "ol/View";
import OSM from "ol/source/OSM";
import Icon from "ol/style/Icon";
import Fill from "ol/style/Fill";
import Feature from "ol/Feature";
import Overlay from "ol/Overlay";
import Point from "ol/geom/Point";
import { mapGetters } from "vuex";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Polygon from "ol/geom/Polygon";
import TileLayer from "ol/layer/Tile";
import * as control from "ol/control";
import LayerVector from "ol/layer/Vector";
import SourceVector from "ol/source/Vector";
import ScaleLine from "ol/control/ScaleLine";

export default {
  name: "gis",
  data: () => ({
    map: {},
    mark: {},
    message: {},
  }),
  computed: {
    // 数据仓库
    ...mapGetters(["myMarker"]),
  },
  watch: {
    myMarker: {
      handler(value) {
        // 数据整合
        const list = value.map((res) => {
          return {
            // 基础数据
            ...res,
            // 两者功能都兼具
            common:
              // 打开关闭
              `open` in JSON.parse(res.threshold) &&
              // 自动手动
              `auto` in JSON.parse(res.threshold),
            // 打开关闭
            open: `open` in JSON.parse(res.threshold),
            // 自动手动
            auto: `auto` in JSON.parse(res.threshold),
            // 烟雾感应
            smoke: `smoke` in JSON.parse(res.threshold),
          };
        });
        // 实例创建
        this.create(list);
      },
      deep: true,
    },
  },
  mounted() {
    this.myMap();
  },
  methods: {
    myMap() {
      // 基础图层
      const map = new Map({
        target: "map",
        controls: control.defaults({
          attribution: false,
        }),
        layers: [
          new TileLayer({
            source: new OSM(),
            projection: "EPSG:4326",
          }),
        ],
        view: new View({
          zoom: 17,
          multiWorld: true,
          projection: "EPSG:4326",
          rotation: Math.PI / 2,
          center: [116.4627, 40.1211],
        }),
      });
      // 基础控件
      map.addControl(new ScaleLine());
      // 弹层配置
      var popup = new Overlay({
        autoPan: true,
        offset: [0, -57],
        positioning: "bottom-center",
        autoPanAnimation: { duration: 500 },
        element: document.getElementById("message"),
      });
      // 地图添加弹层实例
      map.addOverlay(popup);
      // 创建标记点击事件
      map.on("click", (e) => {
        // 查询点击要素
        var feature = map.forEachFeatureAtPixel(e.pixel, (feature) => {
          return feature;
        });
        // 实时定位
        if (feature) {
          // 点标记
          const res = feature.get("res");
          // 是否存在
          if (res) {
            // 绑定数据
            this.message = {
              // 选项扩展
              ...res,
            };
            // 即时显示
            popup.setPosition(feature.getGeometry().getCoordinates());
          } else {
            // 隐藏弹层
            popup.setPosition(undefined);
          }
        } else {
          // 隐藏弹层
          popup.setPosition(undefined);
        }
      });
      // 地图实例
      this.map = map;
      // 初始化
      this.create([]);
    },
    create(list) {
      // 清空所有标记
      this.mark.clear && this.mark.clear();
      // 几何位置配置
      var polygonFeature = new Feature(
        new Polygon([
          [
            [116.4615, 40.1059],
            [116.4618, 40.1158],
            [116.4621, 40.1211],
            [116.4627, 40.1265],
            [116.4669, 40.1323],
            [116.4674, 40.1335],
            [116.4676, 40.1362],
            [116.4679, 40.1362],
            [116.4678, 40.1335],
            [116.4673, 40.1323],
            [116.4631, 40.1265],
            [116.4625, 40.1211],
            [116.4622, 40.1158],
            [116.4619, 40.1059],
          ],
        ])
      );
      // 实例化一个矢量图层Vector作为绘制层
      var source = new SourceVector({
        features: [polygonFeature],
      });
      // 定义样式
      var layerVector = new LayerVector({
        source,
        style: new Style({
          // 边框
          stroke: new Stroke({
            width: 3,
            color: "#757575",
          }),
          // 填充
          fill: new Fill({
            color: "rgba(55,187,134,.2)",
          }),
          // 标点
          image: new Icon({
            anchor: [0.5, 0.94],
            src: "https://openlayers.org/en/v4.6.5/examples/data/icon.png",
          }),
        }),
      });
      //将绘制层添加到地图容器中
      this.map.addLayer(layerVector);
      // 循环遍历标记
      for (const res of list) {
        // 动态创建标记源
        const feature = new Feature({
          res,
          geometry: new Point([116.4624, 40.116 + Math.random() / 100]),
        });
        // 追加到矢量标记集合中
        source.addFeature(feature);
      }
      // 储存矢量数据源实例
      this.mark = source;
    },
    setAuto(i) {
      // 参数整合
      const params = {
        id: i.id,
        key: "auto",
        value: i.value["auto"],
      };
      // 状态设置
      this.myStatus(params);
    },
    setOpen(i) {
      // 参数整合
      const params = {
        id: i.id,
        key: "open",
        value: i.value["open"],
      };
      // 状态设置
      this.myStatus(params);
    },
    myStatus(params) {
      this.$axios
        .post("/dataManage/instruction/updateStatus", {
          ...params,
        })
        .then((res) => {
          if (res) {
            // 成功提示
            this.$notice.success("状态已设置成功");
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.gis {
  height: 100%;
  position: relative;
  background-image: linear-gradient(179deg, #d9e8ff 0%, #f7f7f8 27%);
  #map {
    height: 100%;
  }
  .message {
    display: flex;
    flex-direction: column;
    background-color: #f7f7f8;
    .name {
      display: flex;
      font-size: 13px;
      color: #555555;
      font-weight: bold;
      padding: 17px 21px;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid rgba(153, 153, 153, 0.3);
    }
    .content {
      flex: 1;
      display: flex;
      font-size: 13px;
      min-width: 270px;
      padding: 17px 21px;
      .content_handle {
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        .content_handle_icon {
          width: 60px;
          height: 60px;
          display: flex;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          background-color: #32c95c;
        }
        .content_handle_deep_icon {
          width: 60px;
          height: 60px;
          display: flex;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          background-color: #fc5a7c;
        }
        .content_handle_auto,
        .content_handle_open {
          display: flex;
          margin-top: 20px;
          justify-content: center;
          .content_handle_auto_close {
            font-size: 13px;
            color: #33aefd;
          }
          .content_handle_auto_open {
            font-size: 13px;
            color: #fc5a7c;
          }
        }
        .content_handle_status {
          display: flex;
          margin-top: 20px;
          align-items: center;
          justify-content: center;
          .content_handle_status_none {
            font-size: 15px;
            color: #33aefd;
          }
          .content_handle_status_have {
            font-size: 15px;
            color: #fc5a7c;
          }
        }
        .content_handle_hint {
          font-size: 15px;
          margin-top: 20px;
          color: rgb(171, 164, 164);
        }
      }
      .content_property {
        flex: 1;
        display: flex;
        .content_property_source {
          flex: 1;
          display: flex;
          .content_property_source_container {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 15px;
            .content_property_source_container_circular {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .content_property_source_container_range {
              display: flex;
              align-content: center;
              justify-content: space-between;
              .content_property_source_container_range_down {
                display: flex;
                align-items: flex-end;
                justify-content: center;
                .content_property_source_container_range_down_count {
                  font-size: 12px;
                  color: #33aefd;
                  margin-left: 5px;
                  display: inline-block;
                }
              }
              .content_property_source_container_range_up {
                display: flex;
                align-items: flex-start;
                justify-content: center;
                .content_property_source_container_range_up_count {
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
</style>
