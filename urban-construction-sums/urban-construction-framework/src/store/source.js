const source = {
  // 状态仓库
  state() {
    return {
      source: "overall"
    };
  },
  // 同步事件
  mutations: {
    source(state, text) {
      state.source = text;
    }
  },
  // 异步事件
  actions: {
    saveSource({ commit }, text) {
      commit("source", text);
    }
  },
  // 计算属性
  getters: {
    mySource(state) {
      return state.source;
    }
  }
};

export default source;
