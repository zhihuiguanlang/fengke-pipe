<template>
  <!-- App.vue -->
  <v-app>
    <v-app-bar app clipped-left>
      <!-- instance -->
      <v-helmet />
    </v-app-bar>
    <v-navigation-drawer
      app
      clipped
      hide-overlay
      color="#2f3c4f"
      mini-variant.sync
      disable-route-watcher
      disable-resize-watcher
      style='width:300px;'
    >
      <!-- instance -->
      <v-navigation />
    </v-navigation-drawer>
    <!-- Sizes your content based upon application components -->
    <v-content class="content blue-grey lighten-5" style="padding: 64px 0px 0px 300px;">
      <div class="frame">
        <!-- Provides the application the proper gutter -->
        <div class="main">
          <v-container fluid class="core">
            <!-- If using vue-router -->
            <router-view />
          </v-container>
        </div>
      </div>
    </v-content>
  </v-app>
</template>

<script>
// socket
import Vue from "vue";
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

export default {
  name: "App",
  components: {
    "v-helmet": () => import("@/components/helmet"),
    "v-navigation": () => import("@/components/navigation")
  },
  mounted() {
    this.vueSocket();
  },
  methods: {
    vueSocket () {
      Vue.use(new VueSocketIO({
        debug: true,
        connection: SocketIO('http://:9099',{
          transports:[
            'websocket',
            'xhr-polling',
            'jsonp-polling',
          ]
        })
      }))
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  height: 100%;
  .frame {
    height: 100%;
    display: flex;
    flex-direction: column;
    .main {
      flex: 1;
      padding: 10px;
      display: flex;
      flex-direction: column;
      .core{
        flex: 1;
      }
    }
  }
}
</style>
