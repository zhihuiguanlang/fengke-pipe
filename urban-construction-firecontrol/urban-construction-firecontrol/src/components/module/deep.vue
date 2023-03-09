<template>
  <div class="deep">
    <!-- 三级菜单封装 -->
    <v-list nav color="transparent">
      <v-list-group
        :key="n"
        :prepend-icon="i.action"
        :value="i.key==myCurrent.grandparentKey"
        v-for="(i, n) in menu"
        color="teal lighten-3"
        no-action
      >
        <template #activator>
          <v-list-item-content>
            <v-list-item-title v-text="i.title" />
          </v-list-item-content>
        </template>
        <v-list-group
          :key="m"
          :prepend-icon="v.action"
          :value="v.key==myCurrent.parentKey"
          v-for="(v, m) in i.children"
          color="teal lighten-3"
          sub-group
          no-action
        >
          <template #activator>
            <v-list-item-content>
              <v-list-item-title v-text="v.title" />
            </v-list-item-content>
          </template>
          <v-list-item-group 
            :value="myCurrent.key" 
            :mandatory="v.key==myCurrent.parentKey"
            class="item" 
            color="teal lighten-3" 
          >
            <v-list-item
              :key="w" 
              :value="k.key" 
              @click="jump(k)"
              v-for="(k, w) in v.children" 
            >
              <v-list-item-icon>
                <v-icon v-text="k.action" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="k.title" />
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list-group>
      </v-list-group>
    </v-list>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "deep",
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
.deep{
  .item{
    background-color: #2a3647;
  }
}
</style>
