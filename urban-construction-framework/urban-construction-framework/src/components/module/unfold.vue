<template>
  <div class="unfold">
    <!-- 二级菜单封装 -->
    <v-list nav color="transparent">
      <v-list-group 
        :key="n" 
        :prepend-icon="i.action" 
        :value="i.key==myCurrent.parentKey" 
        v-for="(i, n) in menu" 
        color="teal lighten-3" 
        no-action
      >
        <template #activator>
          <v-list-item-content>
            <v-list-item-title v-text="i.title" />
          </v-list-item-content>
        </template>
        <v-list-item-group 
          :value="myCurrent.key" 
          :mandatory="i.key==myCurrent.parentKey"
          class="item" 
          color="teal lighten-3" 
        >
          <v-list-item 
            :key="m" 
            :value="v.key" 
            @click="jump(v)"
            v-for="(v, m) in i.children" 
          >
            <v-list-item-icon>
              <v-icon v-text="v.action" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="v.title" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list-group>
    </v-list>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "unfold",
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
      // 加载路由
      v.router && this.$router.push(v.router)
    },
    // 数据仓库
    ...mapActions([
      "saveCurrent",
    ])
  }
};
</script>

<style lang="scss" scoped>
.unfold{
  .item{
    background-color: #2a3647;
  }
}
</style>
