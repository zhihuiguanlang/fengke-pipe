<template>
  <div class="navigation">
    <!-- 树形三级菜单 -->
    <v-treeview
      rounded
      hoverable
      selectable
      transition
      activatable
      item-key="id"
      open-on-click
      return-object
      multiple-active
      v-model="marker"
      item-text="name"
      :items="fixation"
      :open.sync="open"
      :active.sync="marker"
      :load-children="load"
      @update:active="active"
    />
    <!-- 状态加载提示框 -->
    <v-dialog
      persistent
      width="300"
      v-model="loading"
      overlay-color="#fff"
      overlay-opacity=".17"
    >
      <v-card color="primary" dark>
        <v-card-text class="pt-2">
          Please stand by
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "navigation",
  data: () => ({
    open: [],
    marker: [],
    fixation: [],
    loading: false,
  }),
  watch: {
    marker: {
      handler(value) {
        this.saveMarker([...value]);
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    // 渲染菜单
    this.myFixation();
  },
  methods: {
    // 数据仓库
    ...mapActions(["saveMarker"]),
    // 二级菜单
    myFixation() {
      this.$axios.post("/device-center/SpaceManage/list", {}).then((res) => {
        if (res) {
          // 数据整合
          for (const i of res.data) {
            i.children = i.subSpaceManage;
            for (const n of i.subSpaceManage) {
              n.children = [];
            }
          }
          // 状态赋值
          this.fixation = res.data;
        }
      });
    },
    // 设备ID集合
    myId(capsule, item) {
      this.$axios
        .get("/api-device/device/queryDeviceIds", {
          params: {
            capsule,
          },
        })
        .then((res) => {
          // 详情列表
          this.myDevice(res.data, item);
        });
    },
    // 获取ids数组详情
    myDevice(ids, item) {
      this.$axios
        .post("/dataManage/deviceData/realTimeData", {
          ids,
        })
        .then((res) => {
          if (res) {
            // 赋值子节点数据集合
            item.children = [...res.result];
            // 显示打开该节点
            this.open.push({ ...item });
            // 取消加载
            this.loading = false;
          }
        });
    },
    // 动态节点
    load(item) {
      // 加载提示
      this.loading = true;
      // 请求数据
      this.myId(item.id, item);
    },
    // 激活响应
    active(value) {
      this.marker = [...value];
    },
  },
};
</script>
