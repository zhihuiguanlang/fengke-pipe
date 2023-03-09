<template>
  <div class="history">
    <v-btn icon color="grey">
      <v-icon v-text="'mdi-home'" size="24" />
    </v-btn>
    <v-tabs
      grow
      light
      show-arrows
      color="teal"
      center-active
      class="content"
      :value="current"
      slider-color="teal lighten-3"
      prev-icon="mdi-arrow-left-bold-box-outline"
      next-icon="mdi-arrow-right-bold-box-outline"
    >
      <v-tab light v-for="(i) in myHistory" :key="i.key" @click="jump(i)">
        <v-icon left v-text="`mdi-dialpad`" />
        {{ i.name }}
      </v-tab>
    </v-tabs>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "history",
  computed: {
    current () {
      // 查找激活项
      return this.myHistory.findIndex(res => res.id == this.myCurrent.id)
    },
    // 数据仓库
    ...mapGetters([
      "myCurrent", 
      "myHistory"
    ])
  },
  methods: {
    jump(v) {
      this.saveCurrent(v);
    },
    // 数据仓库
    ...mapActions([
      "saveCurrent"
    ])
  }
};
</script>

<style lang="scss" scoped>
.history {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  .content {
    width: 1000px;
  }
}
</style>
