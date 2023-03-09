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
      :value="reveal"
      expand-on-hover
      mini-variant.sync
      disable-route-watcher
      disable-resize-watcher
    >
      <!-- instance -->
      <v-navigation />
    </v-navigation-drawer>
    <!-- Sizes your content based upon application components -->
    <v-content class="content blue-grey lighten-5">
      <div class="frame">
        <v-card 
          tile 
          light 
          v-if="reveal"
        >
          <v-history />
        </v-card>
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
import { reveal } from "@/assets/script/deploy";
export default {
  name: "App",
  data() {
    return {
      reveal,
    };
  },
  components: {
    "v-helmet": () => import("@/components/helmet"),
    "v-history": () => import("@/components/history"),
    "v-navigation": () => import("@/components/navigation"),
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
      display: flex;
      flex-direction: column;
      .core {
        flex: 1;
      }
    }
  }
}
</style>
