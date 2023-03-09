<template>
  <div class="camera">
    <div class="handle">
      <v-btn class="mr-3" outlined color="light-green" @click="setThreshold">
        <v-icon left v-text="'mdi-cog-refresh-outline'" />导入设备
      </v-btn>
      <v-btn
        outlined
        class="mr-3"
        color="teal"
        @click="refresh"
        :loading="loading"
      >
        <v-icon left v-text="'mdi-cached'" />刷新
      </v-btn>
      <v-menu
        :close-on-content-click="false"
        :nudge-width="250"
        v-model="menu"
        light
        offset-x
      >
        <template #activator="{ on }">
          <v-btn class="mr-3" outlined color="cyan" v-on="on">
            <v-icon left v-text="'mdi-file-find'" />搜索
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <v-container>
              <v-form ref="searchForm">
                <v-text-field v-model="searchForm.name" label="设备名称" />
                <v-text-field v-model="searchForm.code" label="设备编号" />
                <v-select
                  :items="type"
                  label="设备类型"
                  item-text="type"
                  item-value="type"
                  v-model="searchForm.type"
                />
              </v-form>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn text @click="reset" :loading="resetloading">Reset</v-btn>
            <v-btn text @click="search" color="primary" :loading="searchloading"
              >Search</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-menu
        :close-on-content-click="false"
        :nudge-width="250"
        v-model="load"
        light
        offset-x
      >
        <template #activator="{ on }">
          <v-btn class="mr-3" outlined color="#FF3D00" v-on="on">
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
            <v-btn text @click="download" color="primary" :loading="downloading"
              >Download</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-menu>
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
      >摄像头列表</v-alert
    >
    <div class="elevation-7">
      <el-table :data="fixation" row-key="id" border>
        <el-table-column width="45" align="center">
          <template slot-scope="scope">
            <v-checkbox
              light
              dense
              multiple
              class="my-2"
              v-model="select"
              @click="choice(scope.row)"
              color="rgba(0, 0, 0, 0.54)"
              v-if="`threshold` in scope.row"
              :value="JSON.stringify(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="设备名称"
          align="center"
          min-width="200"
        />
        <el-table-column
          prop="code"
          label="设备编号"
          align="center"
          min-width="200"
        />
        <el-table-column label="阈值" align="center" min-width="217">
          <template slot-scope="scope">
            <div class="threshold" v-if="scope.row.threshold">
              <span
                :key="index"
                class="group"
                v-for="(i, name, index) of JSON.parse(scope.row.threshold)"
              >
                <span class="name">{{ name }}：</span>
                <span class="value">{{ i[0] }} ~ {{ i[1] }}</span>
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="producedTime"
          label="生产日期"
          align="center"
          min-width="300"
        />
        <el-table-column
          prop="warranty"
          label="保修期（天）"
          align="center"
          min-width="200"
        />
        <el-table-column
          prop="overhaul"
          label="检修期（天）"
          align="center"
          min-width="200"
        />
        <el-table-column
          prop="theory"
          label="理论寿命（天）"
          align="center"
          min-width="200"
        />
        <el-table-column
          prop="type"
          label="设备类型"
          align="center"
          min-width="200"
        />
        <el-table-column
          prop="plcName"
          label="设备所属PLC"
          align="center"
          min-width="200"
        />
        <el-table-column
          align="center"
          prop="vendorName"
          label="设备生产厂商	"
          min-width="200"
        />
        <el-table-column
          align="center"
          prop="capsuleLocation"
          label="设备所在舱体区域	"
          min-width="200"
        />
        <el-table-column
          prop="healthIndex"
          label="健康值"
          align="center"
          min-width="200"
        />
        <el-table-column
          prop="status"
          label="状态"
          align="center"
          min-width="200"
        >
          <template slot-scope="scope">
            <v-chip
              label
              light
              v-if="scope.row.status"
              :class="`${scope.row.status == 1 || 'error'}`"
              >{{ status[scope.row["status"]] }}</v-chip
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加阈值模态框 -->
    <v-dialog v-model="dialog" light persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Threshold Profile</span>
        </v-card-title>
        <v-card-text class="pt-5">
          <v-container>
            <v-form ref="form">
              <div
                class="d-flex align-center justify-start"
                v-for="(value, key, index) of form"
                :key="index"
              >
                <div class="_threshold">{{ key }}</div>
                <v-text-field
                  v-model="value[0]"
                  label="上限值"
                  type="number"
                  dense
                />
                <v-text-field
                  v-model="value[1]"
                  label="下限值"
                  type="number"
                  class="ml-4"
                  dense
                />
              </div>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">关闭</v-btn>
          <v-btn color="blue darken-1" text @click="save" :loading="saveloading"
            >保存</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "camera",
  data: () => ({
    status: {
      1: "正常",
      2: "异常",
    },
    form: {},
    searchForm: {
      name: "",
      code: "",
      type: "",
      startTime: "",
      endTime: "",
    },
    type: [],
    select: [],
    fixation: [],
    menu: false,
    dialog: false,
    loading: false,
    saveloading: false,
    resetloading: false,
    searchloading: false,
    load: false,
    startTime: false,
    endTime: false,
    downloading: false,
    resetdownloading: false,
  }),
  mounted() {
    this.myType();
    this.myFixation();
  },
  methods: {
    myFixation() {
      const { searchForm } = this;
      this.$axios
        .post("/device-center/device/list", {
          ...searchForm,
        })
        .then((res) => {
          if (res) {
            this.fixation = res.data.map((res) => {
              return {
                ...res,
                children: res.subSpaceManage || [],
              };
            });
          }
          this.menu = false;
          this.loading = false;
          this.resetloading = false;
          this.searchloading = false;
        });
    },
    myType() {
      this.$axios.get("/device-center/device/queryDeviceByType").then((res) => {
        if (res) {
          this.type = res.data;
        }
      });
    },
    setThreshold() {
      if (!this.select[0]) {
        this.$notice.error("请先选择设备");
        return;
      }
      const threshold = JSON.parse(this.select[0]).threshold;
      if (threshold) {
        this.form = {
          ...JSON.parse(threshold),
        };
      } else {
        // 置空
        this.form = {};
        // 初始数组
        const stringParameters = JSON.parse(this.select[0]).parameters;
        const arrayParameters = stringParameters.slice(1, -1).split(",");
        // 循环动态创造键值
        for (const i of arrayParameters) {
          this.form = {
            ...this.form,
            [i]: [],
          };
        }
      }
      this.dialog = true;
    },
    refresh() {
      this.loading = true;
      this.myFixation();
    },
    reset() {
      this.$refs.searchForm.reset();
      this.resetloading = true;
      this.myFixation();
    },
    search() {
      this.searchloading = true;
      this.myFixation();
    },
    choice(value) {
      this.select = [JSON.stringify(value)];
    },
    close() {
      this.dialog = false;
      this.$refs.form.reset();
    },
    save() {
      // 设备id
      const id = JSON.parse(this.select[0]).id;
      // 数据整合
      const threshold = JSON.stringify({
        ...this.form,
      });
      this.saveloading = true;
      this.$axios
        .post("/device-center/device/saveOrUpdate", {
          id,
          threshold,
        })
        .then((res) => {
          if (res) {
            this.$notice.success("设置成功");
            this.myFixation();
            this.select = [];
            this.close();
          }
          this.saveloading = false;
        });
    },
    resetDown() {},
    download() {},
  },
};
</script>

<style lang="scss" scoped>
.camera {
  height: 100%;
  .handle {
    width: 100%;
    display: flex;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #e0e0e0;
    .select {
      flex: none;
      width: 280px;
      height: 40px;
      margin-right: 12px;
    }
  }
  .alert {
    display: flex;
    margin: 24px 0px;
  }
  .threshold {
    display: flex;
    flex-direction: column;
    .group {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .name {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
      .value {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
    }
  }
  ::v-deep .el-table__expand-icon {
    position: absolute !important;
    left: 25% !important;
    top: 30% !important;
  }
}
</style>
