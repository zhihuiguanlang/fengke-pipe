<template>
  <div class="level">
    <!-- 一级菜单封装 -->
    <v-list nav color="transparent">
      <v-list-item-group 
        :value="myCurrent.key" 
        :mandatory="true"
        class="item" 
        color="teal lighten-3" 
      >
        <v-list-item
          :key="n" 
          :value="v.key" 
          @click="jump(v)"
          v-for="(v, n) in menu" 
        >
          <v-list-item-icon>
            <v-icon v-text="v.action" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="v.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "level",
  props: {
    menu: {
      type: Array,
    }
  },
  computed: {
    // 数据仓库
    ...mapGetters([
      "myCurrent",
    ])
  },
  methods: {
    jump(v) {
      this.saveCurrent(v)
    },
    // 数据仓库
    ...mapActions([
      "saveCurrent",
    ])
  }
};
</script>

<style lang="scss" scoped>
.level{
  .item{
    background-color: #2a3647;
  }
}
</style>
