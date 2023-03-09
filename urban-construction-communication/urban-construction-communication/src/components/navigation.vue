<template>
  <div class="navigation">
    <v-container>
      <v-row>
        <!-- Tab切换 -->
        <v-col cols="12" class="navigation-department">
          <v-tabs fixed-tabs background-color="rgb(47, 60, 79)">
            <v-tab v-for="( i, index ) in items" :key="index" @change="tabs(index)">{{ i.tab }}</v-tab>
            <!-- 通讯录 -->
            <v-tab-item class="navigation-tabs">
              <div class="navigation-communication">
                <v-list nav color="transparent">
                  <v-list-group
                    :key="n"
                    v-for="(i, n) in lists"
                    color="teal lighten-3"
                    :prepend-icon="i.icon"
                    no-action
                  >
                    <template #activator>
                      <v-list-item-content>
                        <v-list-item-title class="navigation-title">{{ i.deptName }}</v-list-item-title>
                      </v-list-item-content>
                    </template>
                    <v-list-group
                      :key="m"
                      v-for="(v, m) in i.subDept"
                      color="teal lighten-3"
                      sub-group
                      no-action
                    >
                      <template #activator>
                        <v-list-item-content>
                          <v-list-item-title class="navigation-title">{{ v.deptName }}</v-list-item-title>
                        </v-list-item-content>
                      </template>
                      <v-list-item-group :value='myCurrent.id' class="navigation-color" color="teal lighten-3">
                        <v-list-item :key="w" v-for="(k, w) in v.userInfo" :value="k.id"  @click="department(k)">
                          <div class="navigation-info">
                            <div class="navigation-value">
                              <li class="navigation-value-name">{{ k.username }}</li>
                              <li>{{ k.nickname }}</li>
                            </div>
                          </div>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list-group>
                  </v-list-group>
                </v-list>
              </div>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { items } from "@/assets/script/mock";
export default {
  name: "navigation",
  data: () => ({
    items,
    lists: [],
    list: [],
    input: "",
    value: "0",
    current: 1,
    size: 10,
    sendUserId: 1,
    receiveUserId: ""
  }),
  computed: {
    // 数据仓库
    ...mapGetters([
      "myCurrent",
    ])
  },
  sockets: {
    // 成功回调
    connect() {
      console.log("Socket.io link success");
    },
    RECENTLY_MESSAGE_EVENT(res) {
      this.list = [...res];
    }
  },
  mounted() {
    this.query();
  },
  methods: {
    // 数据仓库
    ...mapActions(["saveCurrent", "saveHistory"]),
    query() {
      this.$axios.get("/api-user/dept/deptUser").then(res => {
        if (res) {
          this.lists = res.data.map(n => {
            n.icon = "mdi-account-lock";
            return n;
          });
        }
      });
    },
    department(v) {
      const that = this;
      that.saveHistory({});
      that.saveCurrent({});
      const { current, size, sendUserId } = that;
      const receiveUserId = v.id ? v.id.toString() : "";
      that.$axios
        .post("/api-user/chatMessage/historyChat", {
          current,
          size,
          sendUserId,
          receiveUserId
        })
        .then(res => {
          if (res) {
            v.infos = false;
            that.saveHistory(res.data.records);
            that.saveCurrent(v);
          }
        });
    },
    tabs(e) {
      if (e == 1) {
        this.$socket.emit("RECENTLY_MESSAGE_EVENT", {
          sendUserId: "1"
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.navigation {
  height: 100%;
  .navigation-department {
    margin: 0;
    padding: 0;
    .navigation-tabs {
      background-color: rgb(47, 60, 79);
    }
    .navigation-communication {
      color: white;
      font-size: 14px;
      .navigation-title {
        font-size: 15px;
        color: #bfc5cf;
      }
    }
    .navigation-color {
      background-color: rgb(47, 60, 79);
      .navigation-info {
        display: flex;
        padding: 12px 0;
        .navigation-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
        .navigation-value {
          list-style: none;
          padding-left: 20px;
          .navigation-value-name {
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}
// 更改tabs 背景色
.theme--dark.v-list {
  background-color: rgb(47, 60, 79);
}
// 点击tab 颜色
.active {
  color: #fff !important;
  background-color: #12bed1;
}
</style>
