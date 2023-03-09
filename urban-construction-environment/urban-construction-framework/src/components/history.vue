<template>
  <div class="history">
    <!-- 实时监控 -->
    <div v-if="myCurrent.router == `realtime`" class="realtime">
      <!-- 位置信息 -->
      <div>
        <v-select
          :loading="cabinloading"
          v-model="cabinId"
          item-text="name"
          item-value="id"
          label="所属舱体"
          :items="cabin"
          class="select"
          outlined
          light
          dense
        />
        <v-select
          :loading="knobloading"
          label="所属防火段"
          v-model="knobId"
          item-text="name"
          item-value="id"
          class="select"
          :items="knob"
          outlined
          light
          dense
        />
      </div>
      <!-- 视图切换 -->
      <div>
        <v-btn-toggle dark dense mandatory v-model="view">
          <v-btn>
            <v-icon v-text="`mdi-image-filter-hdr`" />
          </v-btn>
          <v-btn>
            <v-icon v-text="`mdi-table-headers-eye`" />
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <!-- 当前报警 -->
    <div v-else class="alarm">
      <div>
        <v-select
          :loading="alarmloading"
          label="当前报警设备"
          v-model="alarmId"
          item-text="name"
          item-value="id"
          :items="alarm"
          class="select"
          outlined
          light
          dense
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "history",
  data() {
    return {
      knob: [],
      cabin: [],
      alarm: [],
      knobId: "",
      cabinId: "",
      alarmId: "",
      knobloading: false,
      cabinloading: false,
      alarmloading: false,
      view: 0,
    };
  },
  watch: {
    view: {
      handler(value) {
        this.saveView(value);
      },
      immediate: true,
      deep: true,
    },
    knobId: {
      handler(value) {
        if (value) {
          this.find(value);
          this.saveKnob(value);
        }
      },
      immediate: true,
      deep: true,
    },
    alarmId: {
      handler(value) {
        if (value) {
          this.saveAlarm(value);
        }
      },
      immediate: true,
      deep: true,
    },
    cabinId: {
      handler(value) {
        if (value) {
          this.myKnob();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    // 数据仓库
    ...mapGetters(["myCurrent"]),
  },
  mounted() {
    this.myCabin();
    this.myAlarm();
  },
  methods: {
    // 数据仓库
    ...mapActions(["saveView", "saveKnob", "saveAlarm", "saveZaxis"]),
    myCabin() {
      this.cabinloading = true;
      this.$axios.post("/device-center/device/list", {}).then((res) => {
        if (res) {
          this.cabin = res.data;
          // 初始化默认数据
          this.cabinId = this.cabin[0].id;
        }
        this.cabinloading = false;
      });
    },
    myKnob() {
      this.knobloading = true;
      const list = this.cabin.filter((res) => res.id == this.cabinId);
      this.knob = list[0].subSpaceManage || [];
      this.knobId = this.knob[0] && this.knob[0].id;
      this.knobloading = false;
    },
    myAlarm() {
      this.alarmloading = true;
      this.$axios.post("/dataManage/autoReport/getAlarmToday", {}).then((res) => {
        if (res) {
          this.alarm = res.result.map((res) => {
            return {
              ...res,
              name: `${res.deviceName}（ ${res.segmentName} / ${res.capsuleName} ）`,
            };
          });
          // 初始化默认数据
          this.alarmId = this.alarm.length ? this.alarm[0].id : '';
        }
        this.alarmloading = false;
      });
    },
    find(value) {
      const list = this.knob.filter((res) => res.id == value);
      const zaxis = list[0].zaxis;
      this.saveZaxis(zaxis);
    },
  },
};
</script>

<style lang="scss" scoped>
.history {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 15px;
  .alarm,
  .realtime {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .select {
      width: 300px;
      margin-right: 15px;
      display: inline-block;
    }
  }
}
</style>
