"use strict";

import Vue from "vue";
import Vuex from "vuex";
import source from "./source";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    source
  }
});
