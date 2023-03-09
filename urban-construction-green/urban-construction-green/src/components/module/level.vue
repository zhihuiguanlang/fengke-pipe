<template>
  <div class="level">
    <!-- 一级菜单封装 -->
    <v-list nav color="transparent">
      <v-list-item-group
        :value="myCurrent.id"
        :mandatory="true"
        class="item"
        color="teal lighten-3"
      >
        <v-list-item :key="n" :value="v.id" @click="jump(v)" v-for="(v, n) in menu">
          <v-list-item-icon>
            <v-icon v-text="`mdi-dialpad`" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="v.name" />
          </v-list-item-content>
          <v-btn class="conservation" color="success" small @click="jump(v, true)">启用节能</v-btn>
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
      type: Array
    }
  },
  computed: {
    // 数据仓库
    ...mapGetters(["myCurrent"])
  },
  methods: {
    jump(v, state) {
      if (state) {
        const id = v.id;
        this.$axios
          .post("/dataManage/green/openGreen", {
            id
          })
          .then(res => {
            if (res) {
              this.saveCurrent(v);
              this.$notice.success('启用节能成功')
            }
          });
      } else {
        this.saveCurrent(v);
      }
    },
    // 数据仓库
    ...mapActions(["saveCurrent"])
  }
};
</script>

<style lang="scss" scoped>
.level {
  .item {
    background-color: #2a3647;
    .conservation {
      width: 65px;
    }
  }
}
</style>
