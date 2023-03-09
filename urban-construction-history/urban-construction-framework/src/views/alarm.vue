<template>
  <div class="alarm">
    <div class="handle">
      <div class="rowed">
        <div class="rowing">
          <span class="colour">报警级别:</span>
          <v-select
            :loading="levelloading"
            :items="level"
            item-text="title"
            item-value="value"
            v-model="searchForm.level"
            class="select"
            open-on-clear
            clearable
            outlined
            light
            dense
          />
        </div>
        <div class="rowing">
          <span class="colour">报警类型:</span>
          <v-select
            :loading="capsuleIdloading"
            :items="type"
            item-text="name"
            item-value="id"
            v-model="searchForm.type"
            class="select"
            open-on-clear
            clearable
            outlined
            light
            dense
          />
        </div>
        <div class="rowing">
          <span class="colour">设备类型:</span>
          <v-select
            :loading="deviceTypeloading"
            :items="deviceType"
            item-text="type"
            item-value="type"
            v-model="searchForm.deviceType"
            class="select"
            open-on-clear
            clearable
            outlined
            light
            dense
          />
        </div>
        <div class="rowing">
          <span class="colour">所属舱体:</span>
          <v-select
            :loading="typeloading"
            :items="capsuleId"
            item-text="name"
            item-value="id"
            v-model="searchForm.capsuleId"
            class="select"
            open-on-clear
            clearable
            outlined
            light
            dense
          />
        </div>
        <div class="rowing">
          <span class="colour">起止时间:</span>
          <v-menu
            color="red"
            v-model="picker"
            :nudge-right="40"
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="290px"
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                :value="range"
                clearable
                class="starttime"
                light
                v-on="on"
                readonly
                @click:clear="ranges"
              />
            </template>
            <v-date-picker light range v-model="range">
              <v-spacer />
              <v-btn
                text
                v-text="`OK`"
                color="primary"
                @click="picker = false"
              />
            </v-date-picker>
          </v-menu>
          <v-btn class="ml-4 mr-5" outlined color="cyan" @click="query">查询</v-btn>
          <v-menu
            :close-on-content-click="false"
            :nudge-width="250"
            v-model="load"
            light
            offset-x
          >
            <template #activator="{ on }">
              <v-btn class="mr-6" outlined color="#FF3D00" v-on="on">
                <v-icon left v-text="'mdi-file-find'" />下载
              </v-btn>
            </template>
            <v-card>
              <v-card-text>
                <v-container>
                  <v-form ref="searchForm">
                    <v-menu v-model="startTime" transition="scale-transition">
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="searchForm.startTime"
                          label="开始时间"
                          v-on="on"
                          readonly
                        />
                      </template>
                      <v-date-picker v-model="searchForm.startTime" />
                    </v-menu>
                    <v-menu v-model="endTime" transition="scale-transition">
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="searchForm.endTime"
                          label="结束时间"
                          v-on="on"
                          readonly
                        />
                      </template>
                      <v-date-picker v-model="searchForm.endTime" />
                    </v-menu>
                  </v-form>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn text @click="resetDown" :loading="resetdownloading"
                  >Reset</v-btn
                >
                <v-btn
                  text
                  @click="download"
                  color="primary"
                  :loading="downloading"
                  >Download</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>
      </div>
    </div>
    <v-alert
      tile
      light
      dense
      width="150"
      height="18"
      color="cyan"
      class="alert"
      border="left"
      elevation="0"
      colored-border
      transition="scale-transition"
      >历史报警查询</v-alert
    >
    <div class="elevation-7">
      <v-data-table
        light
        fixed-header
        single-select
        calculate-width
        height="500"
        item-key="id"
        :items="alarm"
        :loading="table"
        :headers="headers"
        :page.sync="current"
        :items-per-page="pageSize"
        :loading-text="'loading...'"
        :server-items-length="total"
        :footer-props="{
          itemsPerPageOptions: [5, 10, 15, 20],
        }"
        v-model="select"
        @update:page="updatePage"
        @update:items-per-page="updateItem"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "alarm",
  data: () => ({
    headers: [
      {
        text: "报警设备",
        align: "center",
        value: "deviceName",
        width: 200,
      },
      {
        text: "所属舱体",
        align: "center",
        value: "capsuleIdName",
        width: 200,
      },
      {
        text: "报警类型",
        align: "center",
        value: "typeName",
        width: 200,
      },
      {
        text: "报警原因",
        align: "center",
        value: "reason",
        width: 200,
      },
      {
        text: "报警级别",
        align: "center",
        value: "level",
        width: 200,
      },
      {
        text: "报警时间",
        align: "center",
        value: "alarmTime",
        width: 200,
      },
    ],
    searchForm: {
      level: "",
      type: "",
      capsuleId: "",
      deviceType: "",
      startTime: "",
      endTime: "",
    },
    total: 0,
    pageNum: 1,
    pageSize: 10,
    current: 1,
    alarm: [],
    select: [],
    range: [],
    capsuleId: [],
    deviceType: [],
    type: [],
    level: [
      { title: "1", value: 1 },
      { title: "2", value: 2 },
      { title: "3", value: 3 },
      { title: "4", value: 4 },
      { title: "5", value: 5 },
    ],
    picker: false,
    table: false,
    levelloading: false,
    capsuleIdloading: false,
    deviceTypeloading: false,
    typeloading: false,
    load: false,
    startTime: false,
    endTime: false,
    downloading: false,
    resetdownloading: false,
  }),
  mounted() {
    this.create();
    this.frist();
    this.myAlarm();
    this.query();
  },
  methods: {
    myAlarm() {
      this.table = true;
      this.$axios.post("/dataManage/alarm/getAlarmType", {}).then((res) => {
        if (res) {
          const { type } = res.result;
          this.type = type.map((n) => {
            return {
              name: n,
              id: n,
            };
          });
        }
        this.levelloading = false;
        this.capsuleIdloading = false;
        this.deviceTypeloading = false;
        this.typeloading = false;
        this.table = false;
      });
    },
    ranges() {
      this.range = [];
      delete this.searchForm.startTime;
      delete this.searchForm.endTime;
    },
    query() {
      this.table = true;
      if (this.range && this.range.length == 2) {
        this.searchForm.startTime =
          new Date(this.range[0]).getTime() < new Date(this.range[1]).getTime()
            ? this.range[0]
            : this.range[1];
        this.searchForm.endTime =
          new Date(this.range[0]).getTime() < new Date(this.range[1]).getTime()
            ? this.range[1]
            : this.range[0];
      }
      const { searchForm, pageNum, pageSize } = this;
      for (var key in searchForm) {
        if (!searchForm[key]) {
          delete searchForm[key];
        }
      }
      this.$axios
        .post("/dataManage/alarm/getAllAlarm", {
          ...searchForm,
          pageNum,
          pageSize,
        })
        .then((res) => {
          if (res) {
            const { total, list, pageNum } = res.result;
            this.total = total;
            this.alarm = list.map((n) => {
              for (const i of this.capsuleId) {
                if (i.id == n.capsuleId) {
                  n.capsuleIdName = i.name;
                }
              }
              n.alarmTime = this.formatDateTime(n.alarmTime);
              return n;
            });
            this.current = pageNum;
          }
          this.levelloading = false;
          this.capsuleIdloading = false;
          this.typeloading = false;
          this.table = false;
        });
    },
    create() {
      this.$axios.post("/device-center/SpaceManage/list", {}).then((res) => {
        if (res) {
          this.capsuleId = res.data;
        }
      });
    },
    frist() {
      this.$axios.post("/api-device/deviceParameter/list", {}).then((res) => {
        if (res) {
          this.deviceType = res.data;
        }
      });
    },
    updatePage(value) {
      this.pageNum = value;
      this.query();
    },
    updateItem(value) {
      this.pageSize = value;
      this.query();
    },
    formatDateTime(inputTime) {
      let date = new Date(inputTime);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return `${y}-${m}-${d}`; //  ${h}:${minute}+':'+second;
    },
    resetDown() {},
    download() {},
  },
};
</script>

<style lang="scss" scoped>
.alarm {
  height: 100%;
  .handle {
    width: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #e0e0e0;
    .rowed {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .rowing {
        flex: 1;
        display: flex;
        align-items: center;
        .colour {
          color: black;
          margin-right: 10px;
          white-space: nowrap;
        }
        .select {
          flex: none;
          width: 200px;
          height: 40px;
          margin-right: 12px;
        }
      }
    }
  }
  .alert {
    display: flex;
    margin: 27px 0px;
  }
  .starttime {
    width: 200px;
    flex: none;
  }
}
._dialog_title {
  width: 100px;
  text-align: right;
  display: inline-block;
}
</style>
