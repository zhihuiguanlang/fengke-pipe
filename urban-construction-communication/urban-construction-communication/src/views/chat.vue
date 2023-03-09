<template>
  <div class="chat" ref="chat" v-if="myCurrent.id">
    <div @mousedown="move" class="wicket">
      <!-- 窗口 -->
      <div class="wicket-win">
        <div class="wicket-info">
          <li>{{ myCurrent.username }}</li>
          <v-menu v-model="menu"  :nudge-width="100" :open-on-hover='true' light offset-x>
            <template v-slot:activator="{ on }">
              <v-btn class="ml-6" light small color="success" v-on="on">查看联系方式</v-btn>
            </template>
            <v-card class='pa-4'>
              <div>手机: {{ myCurrent.mobile }}</div>
              <div>微信: {{ myCurrent.wxNumber }}</div>
              <div>邮箱: {{ myCurrent.email }}</div>
            </v-card>
          </v-menu>
        </div>
        <div class="wicket-icon">
          <v-img :src="imgUrl" class='mt-2 mr-2' width='24px' height="24px" light alt @click="close" />
        </div>
      </div>
      <!-- 记录区 -->
      <div class="wicket-content" ref="container">
        <div class="wicket-content-taik" v-for="(i, index) in lists" :key="index">
          <div :class="[(i.sendUserId == sendUserId )?'wicket-speak-btalk':'wicket-speak-atalk']">
            <div class="wicket-speak-info">
              <div
                class="wicket-speak-container"
                v-if="/(http|https):\/\/([\w.]+\/?)\S*/.test(i.msg) && i.msg.match(/\.(jpeg|jpg|gif|png|tif)$/) != null"
              >
                <img :src="i.msg" alt class="wicket-speak-image" />
              </div>
              <div class="wicket-speak-text" v-else>{{ i.msg }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 发送内容区 -->
      <div class="wicket-talk">
        <div class="wicket-function">
          <div class="wicket-tool">
            <v-icon light color="white" left v-text="'mdi-image'" />
            <input
              type="file"
              accept="image/*"
              class="upload"
              name="file"
              ref="file"
              @change="getImgBase()"
            />
          </div>
        </div>
        <div class="wicket-input">
          <textarea name id cols="30" rows="10" v-model="msg"></textarea>
        </div>
        <div class="wicket-send">
          <button class='button' @click="fnAdd()">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "chat",
  data: () => ({
    imgUrl: require("@/assets/images/clear.png"),
    sendUserId: "1", // 发送人
    receiveUserId: "", //接收人
    msg: "", //消息
    lists: [],
    menu: false
  }),
  computed: {
    // 数据仓库
    ...mapGetters(["myCurrent", "myHistory"]),
  },
  watch: {
    myHistory: {
      handler(n) {
        this.lists = n;
        this.msg = "";
        if (this.myCurrent.id) this.scrollToBottom();
      },
      deep: true
    }
  },
  sockets: {
    // 成功回调
    connect() {
      console.log("Socket.io link success");
    },
    chatMessage(res) {
      this.lists.push(res);
      this.msg = "";
      this.scrollToBottom();
    }
  },
  methods: {
    // 数据仓库
    ...mapActions(["saveCurrent", "saveHistory"]),
    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.container.scrollTop = this.$refs.container.scrollHeight;
      });
    },
    // 模仿发送
    fnAdd() {
      if (this.msg == "") {
        this.$notice.normal('请输入内容!')
        return;
      }
      this.$socket.emit("chatMessage", {
        sendUserId: this.sendUserId,
        receiveUserId: this.myCurrent.id,
        msg: this.msg
      });
      this.msg = "";
      this.scrollToBottom();
    },
    // 窗口移动事件
    move(e) {
      let odiv = e.target; // 获取目标元素
      let x = e.clientX - odiv.offsetLeft;
      let y = e.clientY - odiv.offsetTop;
      document.onmousemove = e => {
        let left = e.clientX - x - 20;
        let top = e.clientY - y - 20;
        let refs = this.$refs.chat;
        if (left <= 0) {
          left = 0;
        } else if (left >= refs.clientWidth - odiv.offsetWidth) {
          left = refs.clientWidth - odiv.offsetWidth;
        }
        if (top <= 0) {
          top = 0;
        } else if (top >= refs.clientHeight - odiv.offsetHeight) {
          top = refs.clientHeight - odiv.offsetHeight;
        }
        odiv.style.left = left + "px";
        odiv.style.top = top + "px";
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    // 关闭按钮
    close() {
      this.saveCurrent({});
      this.saveHistory({});
      this.lists = [];
    },
    // 上传图片
    getImgBase() {
      const file = this.$refs.file.files[0];
      const formData = new FormData();
      formData.append("file", file);
      this.$axios
        .post("/dataManage/document/uploadForChat", formData)
        .then(res => {
          if (res) {
            this.$socket.emit("chatMessage", {
              sendUserId: this.sendUserId,
              receiveUserId: this.myCurrent.id,
              msg: res.result
            });
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.chat {
  height: 100%;
  color: black;
  font-size: 14px;
  .wicket {
    position: relative;
    width: 600px;
    height: 600px;
    z-index: 10000;
    top: 100px;
    left: 200px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px 10px 0px 0px;
    background-color: rgba(103, 117, 134, 0.6);
    box-sizing: border-box;
    .wicket-win {
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0px 5px 10px 20px;
      border-radius: 10px 10px 0px 0px;
      z-index: -1;
      .wicket-info {
        display: flex;
        justify-content: center;
        align-items: center;
        list-style: none;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 40px;
        line-height: 40px;
      }
      .wicket-icon {
        display: flex;
        cursor: pointer;
      }
    }
    .wicket-content {
      height: 400px;
      background-color: white;
      border-bottom: 1px solid rgba(98, 98, 98, 0.2);
      padding: 20px 0;
      overflow-y: auto;
      .wicket-content-taik {
        margin: 10px;
      }
      .wicket-speak-atalk {
        display: flex;
      }
      .wicket-speak-btalk {
        display: flex;
        flex-direction: row-reverse;
      }
      .wicket-speak-info {
        margin: 0 10px;
        max-width: 300px;
        word-break: break-all;
        border-radius: 10px;
        background-color: #d9d9d9;
        .wicket-speak-container {
          width: 300px;
          height: 300px;
          border-radius: 0 !important;
          background-color: white !important;
          .wicket-speak-image {
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        .wicket-speak-text {
          padding: 10px;
        }
      }
    }
    .wicket-talk {
      height: 140px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
      background-color: white;
      .wicket-function {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: space-between;
        background-color: rgba(103, 117, 134, 0.6);
        padding: 5px 5px 0px 5px;
        .wicket-tool {
          position: relative;
          .upload {
            outline: none;
            border: 0;
            background-color: none;
            position: absolute !important;
            top: -5px !important;
            left: 0 !important;
            width: 24px;
            opacity: 0;
            background: red;
            z-index: 999;
          }
        }
      }
      .wicket-chat {
        color: rgba(51, 51, 51, 0.7);
        &:hover {
          cursor: pointer;
          color: #11bed2;
        }
      }
      .wicket-input {
        height: 72px;
        padding: 5px 5px 0px 5px;
        textarea {
          width: 100%;
          height: 72px;
          border: none;
          resize: none;
          outline: none;
        }
      }
      .wicket-send {
        text-align: right;
        .button {
          font-size: 12px;
          cursor: pointer;
          height: 28px;
          min-width: 50px;
          padding: 0 12.4444444444px;
          color: #03a9f4 !important;
          border: thin solid currentColor;
          border-radius: 5px;
          caret-color: #03a9f4 !important;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
