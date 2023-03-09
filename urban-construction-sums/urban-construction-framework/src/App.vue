<template>
  <div class="App">
    <v-app class="main">
      <router-view />
    </v-app>
  </div>
</template>

<script>
// socket
import Vue from "vue";
import SocketIO from "socket.io-client";
import VueSocketIO from "vue-socket.io";

export default {
  name: "App",
  data() {
    return {};
  },
  mounted() {
    this.vueSocket();
  },
  methods: {
    vueSocket() {
      Vue.use(
        new VueSocketIO({
          debug: true,
          connection: SocketIO("http://:9099", {
            transports: ["websocket", "xhr-polling", "jsonp-polling"],
          }),
        })
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.App {
  height: 100%;
  padding: 0px 20px;
  background-image: radial-gradient(#0d2643, #020f22);
  .main {
    font-family: "microsoft yahei";
    background-color: transparent;
  }
}
</style>
