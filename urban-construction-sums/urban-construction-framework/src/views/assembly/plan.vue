<template>
  <div class="plan" v-resize="onResize">
    <!-- 廊内情况 -->
    <div class="upper">
      <!-- 即时通讯 -->
      <div class="chat">
        <div class="area" ref="area">
          <!-- 部门成员 -->
          <div class="branch" :style="`height:${ElE.area}px`">
            <v-list dense>
              <v-list-group
                no-action
                :key="index"
                v-for="(i, index) in branch"
                prepend-icon="mdi-account-cowboy-hat"
              >
                <template #activator>
                  <v-list-item-content>
                    <v-list-item-title v-text="i.deptName" />
                  </v-list-item-content>
                </template>
                <v-list-item-group v-model="choose">
                  <v-list-item :value="n" :key="index" v-for="(n, index) in i.userInfo">
                    <v-list-item-icon>
                      <v-icon v-text="`mdi-account`" />
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="n.nickname" />
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list-group>
            </v-list>
          </div>
          <!-- 聊天室 -->
          <div class="room">
            <!-- 内容 -->
            <div class="matter">
              <div class="name">
                <v-icon size="19">mdi-message-text</v-icon>
                {{
                `${
                choose.id
                ? `正在对话：${choose.nickname}`
                : `请选择相关人员`
                }`
                }}
              </div>
              <div class="vessel" ref="vessel">
                <div ref="visit" class="visit" :style="`height:${ElE.vessel}px`">
                  <div class="talk" v-for="i in list" :key="i.id">
                    <div :class="[i.sendUserId == 1 ? `me` : `else`]">
                      <v-img
                        :src="i.msg"
                        class="image"
                        width="400px"
                        style="flex:none;"
                        v-if="/(http|https):\/\/([\w.]+\/?)\S*/.test(i.msg)"
                      />
                      <div v-else class="word">{{ i.msg }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 编辑 -->
            <div class="edit">
              <!-- 操作栏 -->
              <div class="handle">
                <v-icon light size="25" color="grey">mdi-folder-open</v-icon>
                <input ref="file" type="file" class="upload" accept="image/*" @input="upload()" />
              </div>
              <!-- 区域 -->
              <div class="draw">
                <!-- 固高文本组件 -->
                <v-textarea v-model="msg" full-width no-resize height="110" />
              </div>
              <!-- 发送 -->
              <div class="send">
                <v-btn small color="teal" @click="send">发送</v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 入廊人员 -->
      <div class="access">
        <div class="name">
          入廊人员名单
          <v-btn-toggle v-model="person" color="#fff" mandatory group dense>
            <v-btn text>外部入廊人员名单</v-btn>
            <v-btn text>内部入廊人员名单</v-btn>
          </v-btn-toggle>
        </div>
        <div class="source" ref="gallery">
          <v-tabs-items class="_tabs" v-model="person">
            <!-- 外部人员表格 -->
            <v-tab-item class="_item">
              <div class="sheet">
                <v-simple-table
                  class="simple"
                  fixed-header
                  :height="indoor.length ? ElE.gallery : 100"
                >
                  <template #default>
                    <thead>
                      <tr class="item">
                        <th>申请人</th>
                        <th>申请时间</th>
                        <th>陪同人</th>
                        <th>规定离开时间</th>
                        <th>审批人</th>
                        <th>状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="item" v-for="(item, index) in indoor" :key="index">
                        <td>{{ item.name }}</td>
                        <td>{{ new Date(item.createTime).toLocaleDateString() }}</td>
                        <td>{{ item.accompanyingPersonName }}</td>
                        <td>
                          {{
                          new Date(item.scheduleEndTime).toLocaleDateString()
                          }}
                        </td>
                        <td>{{ item.leaderApprovalName }}</td>
                        <td>{{ status[item.status] }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <div v-if="!indoor.length" class="grey--text text-center ma-5">暂无数据</div>
              </div>
            </v-tab-item>
            <!-- 内部人员表格 -->
            <v-tab-item class="_item">
              <div class="sheet">
                <v-simple-table
                  class="simple"
                  fixed-header
                  :height="sans.length ? ElE.gallery : 100"
                >
                  <template #default>
                    <thead>
                      <tr class="item">
                        <th>申请人</th>
                        <th>申请时间</th>
                        <th>入廊人员</th>
                        <th>规定离开时间</th>
                        <th>审批人</th>
                        <th>状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="item" v-for="(item, index) in sans" :key="index">
                        <td>{{ item.submitterName }}</td>
                        <td>{{ new Date(item.createTime).toLocaleDateString() }}</td>
                        <td>{{ item.pipeUserName }}</td>
                        <td>
                          {{
                          new Date(item.ruleDepartureTime).toLocaleDateString()
                          }}
                        </td>
                        <td>{{ item.acceptUserName }}</td>
                        <td>{{ status[item.status] }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <div v-if="!sans.length" class="grey--text text-center ma-5">暂无数据</div>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
    </div>
    <!-- 任务列表 -->
    <div class="lower">
      <!-- 运维计划 -->
      <div class="maintain">
        <div class="name">运维计划表</div>
        <div class="content" ref="common">
          <v-tabs-items class="_tabs" v-model="items">
            <!-- 运维计划表 -->
            <v-tab-item class="_item">
              <div class="sheet">
                <v-simple-table
                  class="simple"
                  fixed-header
                  :height="plan.length ? ElE.common : 100"
                >
                  <template #default>
                    <thead>
                      <tr class="item">
                        <th>计划名称</th>
                        <th>计划内容</th>
                        <th>地点</th>
                        <th>状态</th>
                        <th>计划类型</th>
                        <th>制定计划人姓名</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in plan" class="item" :key="index">
                        <td>{{ item.name }}</td>
                        <td>{{ item.content }}</td>
                        <td>{{ item.site }}</td>
                        <td>{{ planStatus[item.status] }}</td>
                        <td>{{ planType[item.type] }}</td>
                        <td>{{ item.formulateName }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <div v-if="!plan.length" class="grey--text text-center ma-5">暂无数据</div>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
      <!-- 工单列表 -->
      <div class="work">
        <div class="name">
          工单信息
          <v-btn-toggle v-model="work" color="#fff" mandatory group dense>
            <v-btn text>已完成</v-btn>
            <v-btn text>未完成</v-btn>
          </v-btn-toggle>
        </div>
        <div class="content" ref="common">
          <v-tabs-items class="_tabs" v-model="work">
            <!-- 已完成表格 -->
            <v-tab-item class="_item">
              <div class="sheet">
                <v-simple-table
                  class="simple"
                  fixed-header
                  :height="finish.length ? ElE.common : 100"
                >
                  <template #default>
                    <thead>
                      <tr class="item">
                        <th>工单编号</th>
                        <th>工单名称</th>
                        <th>工单类型</th>
                        <th>提交人</th>
                        <th>提交时间</th>
                        <th>状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in finish" class="item" :key="index">
                        <td>{{ item.code }}</td>
                        <td>{{ item.title }}</td>
                        <td>{{ item.type }}</td>
                        <td>{{ item.submitterName }}</td>
                        <td>{{ new Date(item.createTime).toLocaleDateString() }}</td>
                        <td>{{ status[item.status] }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <div v-if="!finish.length" class="grey--text text-center ma-5">暂无数据</div>
              </div>
            </v-tab-item>
            <!-- 未完成表格 -->
            <v-tab-item class="_item">
              <div class="sheet">
                <v-simple-table
                  class="simple"
                  fixed-header
                  :height="accept.length ? ElE.common : 100"
                >
                  <template #default>
                    <thead>
                      <tr class="item">
                        <th>工单编号</th>
                        <th>工单名称</th>
                        <th>工单类型</th>
                        <th>提交人</th>
                        <th>提交时间</th>
                        <th>状态</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in accept" class="item" :key="index">
                        <td>{{ item.code }}</td>
                        <td>{{ item.title }}</td>
                        <td>{{ item.type }}</td>
                        <td>{{ item.submitterName }}</td>
                        <td>{{ new Date(item.createTime).toLocaleDateString() }}</td>
                        <td>{{ status[item.status] }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <div v-if="!accept.length" class="grey--text text-center ma-5">暂无数据</div>
              </div>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "plan",
  data() {
    return {
      msg: "",
      work: 0,
      person: 0,
      items: 0,
      choose: {},
      ElE: {
        area: 0,
        vessel: 0,
        common: 0,
        gallery: 0
      },
      type: {
        1: "运维人员",
        2: "外部人员"
      },
      status: {
        0: "已提交",
        1: "已发起",
        2: "已接受",
        4: "已确认",
        5: "已驳回",
      },
      planType: {
        0: "保洁",
        1: "巡检",
        2: "维修",
        3: "监控"
      },
      planStatus: {
        0: "已计划开始",
        1: "已完成"
      },
      list: [],
      plan: [],
      indoor: [],
      sans: [],
      finish: [],
      accept: [],
      branch: [],
      desserts: []
    };
  },
  watch: {
    choose: {
      handler(value) {
        // 历史信息
        this.myHistory(value);
      },
      deep: true
    }
  },
  sockets: {
    chatMessage(res) {
      // 消息整合
      this.list = [...this.list, res];
      // 可视最新消息
      this.$nextTick(() => {
        this.$refs.visit.scrollTop = this.$refs.visit.scrollHeight;
      });
    }
  },
  mounted() {
    this.myPlan();
    this.myIndoor();
    this.mySans();
    this.myFinish();
    this.myBranch();
  },
  methods: {
    myPlan() {
      this.$axios
        .post("/ops-center/operationplan/page", {
          page: 1,
          limit: 999
        })
        .then(res => {
          if (res) {
            this.plan = res.data.records;
          }
        });
    },
    myIndoor() {
      this.$axios.post("/api-ops/ExternalStaffPipe/list", {}).then(res => {
        if (res) {
          this.indoor = res.data;
        }
      });
    },
    mySans() {
      this.$axios.post("/api-ops/staffpipe/list", {}).then(res => {
        if (res) {
          this.sans = res.data;
        }
      });
    },
    myFinish() {
      this.$axios
        .post("/api-ops/workorder/page", {
          page: 1,
          limit: 999
        })
        .then(res => {
          if (res) {
            this.finish = res.data.records.filter(res => res.status == 4 || res.status == 5);
            this.accept = res.data.records.filter(res => res.status == 0 || res.status == 1 || res.status == 2);
          }
        });
    },
    myAccept() {
      this.$axios
        .post("/api-ops/worker/findTaskByAssignee", {
          page: 1,
          limit: 999
        })
        .then(res => {
          if (res) {
            this.accept = res.data.records;
          }
        });
    },
    myBranch() {
      this.$axios.get("/api-user/dept/deptUser").then(res => {
        if (res) {
          for (const i of res.data) {
            if (i.subDept == false) {
              this.branch.push(i);
            } else {
              this.branch.push(...i.subDept);
            }
          }
        }
      });
    },
    myHistory({ id: receiveUserId }) {
      this.$axios
        .post("/api-user/chatMessage/historyChat", {
          size: 100,
          current: 1,
          sendUserId: 1,
          receiveUserId
        })
        .then(res => {
          if (res) {
            this.list = res.data.records;
            // 可视最新消息
            this.$nextTick(() => {
              this.$refs.visit.scrollTop = this.$refs.visit.scrollHeight;
            });
          }
        });
    },
    upload() {
      const file = this.$refs.file.files[0];
      const formData = new FormData();
      formData.append("file", file);
      this.$axios
        .post("/dataManage/document/uploadForChat", formData)
        .then(res => {
          if (res) {
            const msg = res.result;
            const source = {
              msg,
              sendUserId: 1,
              receiveUserId: this.choose.id
            };
            this.$socket.emit("chatMessage", source);
          }
          this.$refs.file.value = "";
        });
    },
    send() {
      if (this.msg) {
        this.$socket.emit("chatMessage", {
          msg: this.msg,
          sendUserId: 1,
          receiveUserId: this.choose.id
        });
        // 清空消息
        this.msg = "";
      }
    },
    onResize() {
      this.$nextTick(() => {
        this.ElE = {
          area: this.$refs.area.offsetHeight,
          vessel: this.$refs.vessel.offsetHeight,
          common: this.$refs.common.offsetHeight,
          gallery: this.$refs.gallery.offsetHeight
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.plan {
  flex: 1;
  display: flex;
  flex-direction: column;
  .upper {
    flex: 1;
    display: flex;
    margin-bottom: 20px;
    .chat {
      flex: 2;
      display: flex;
      .area {
        flex: 1;
        display: flex;
        background-color: rgba(12, 34, 59, 0.81);
        .branch {
          flex: 1;
          overflow-x: hidden;
          overflow-y: scroll;
        }
        .room {
          flex: 4;
          display: flex;
          flex-direction: column;
          background-color: rgba(255, 255, 255, 0.05);
          .matter {
            flex: 1;
            display: flex;
            flex-direction: column;
            .name {
              padding: 10px;
              font-size: 13px;
              background-color: rgba(12, 34, 59, 0.5);
            }
            .vessel {
              flex: 1;
              display: flex;
              flex-direction: column;
              .visit {
                display: flex;
                overflow-x: hidden;
                overflow-y: scroll;
                flex-direction: column;
                .talk {
                  display: flex;
                  .me {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding: 5px 10px;
                    .image {
                      animation: right 0.5s;
                    }
                    .word {
                      font-size: 13px;
                      padding: 3px 7px;
                      border-radius: 4px;
                      letter-spacing: 1px;
                      animation: right 0.5s;
                      background-color: rgb(46, 139, 87);
                      @keyframes right {
                        from {
                          opacity: 0;
                          transform: translate3d(100%, 0, 0);
                        }
                        to {
                          opacity: 1;
                          transform: translate3d(0, 0, 0);
                        }
                      }
                    }
                  }
                  .else {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    padding: 5px 10px;
                    .image {
                      animation: left 0.5s;
                    }
                    .word {
                      font-size: 13px;
                      padding: 3px 7px;
                      border-radius: 4px;
                      letter-spacing: 1px;
                      animation: left 0.5s;
                      color: rgb(25, 19, 19);
                      background-color: rgb(237, 245, 241);
                      @keyframes left {
                        from {
                          opacity: 0;
                          transform: translate3d(-100%, 0, 0);
                        }
                        to {
                          opacity: 1;
                          transform: translate3d(0, 0, 0);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          .edit {
            display: flex;
            position: relative;
            flex-direction: column;
            .handle {
              display: flex;
              align-items: center;
              border-top: 2px solid rgba(20, 56, 101, 1);
              padding: 3px 5px;
              .upload {
                opacity: 0;
                width: 30px;
                z-index: 10000;
                margin-left: -28px;
              }
            }
            .draw {
              flex: 1;
            }
            .send {
              right: 15px;
              bottom: 15px;
              position: absolute;
            }
          }
        }
      }
    }
    .access {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: rgba(12, 34, 59, 0.81);
      margin-left: 20px;
      padding: 0px 10px;
      .name {
        height: 45px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(20, 56, 101, 0.5);
        font-size: 12px;
        padding: 0px 10px;
      }
      .source {
        flex: 1;
        display: flex;
        ._tabs {
          flex: 1;
          display: flex;
          background-color: transparent;
          ._item {
            flex: 1;
            display: flex;
            .sheet {
              flex: 1;
              .simple {
                background-color: transparent;
                .item {
                  td {
                    text-align: center;
                    background-color: transparent;
                    font-size: 12px;
                  }
                  th {
                    text-align: center;
                    background-color: rgba(12, 34, 59, 0.81);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .lower {
    flex: 1;
    display: flex;
    margin-bottom: 20px;
    .maintain {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: rgba(12, 34, 59, 0.81);
      padding: 0px 10px;
      .name {
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(20, 56, 101, 0.5);
        font-size: 12px;
        padding: 0px 10px;
      }
      .content {
        flex: 1;
        display: flex;
        ._tabs {
          flex: 1;
          display: flex;
          background-color: transparent;
          ._item {
            flex: 1;
            display: flex;
            .sheet {
              flex: 1;
              .simple {
                background-color: transparent;
                .item {
                  td {
                    text-align: center;
                    background-color: transparent;
                    font-size: 12px;
                  }
                  th {
                    text-align: center;
                    background-color: rgba(12, 34, 59, 0.81);
                  }
                }
              }
            }
          }
        }
      }
    }
    .work {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: rgba(12, 34, 59, 0.81);
      margin-left: 20px;
      padding: 0px 10px;
      .name {
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(20, 56, 101, 0.5);
        padding: 0px 10px;
        font-size: 12px;
      }
      .content {
        flex: 1;
        display: flex;
        ._tabs {
          flex: 1;
          display: flex;
          background-color: transparent;
          ._item {
            flex: 1;
            display: flex;
            .sheet {
              flex: 1;
              .simple {
                background-color: transparent;
                .item {
                  td {
                    text-align: center;
                    background-color: transparent;
                    font-size: 12px;
                  }
                  th {
                    text-align: center;
                    background-color: rgba(12, 34, 59, 0.81);
                  }
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
