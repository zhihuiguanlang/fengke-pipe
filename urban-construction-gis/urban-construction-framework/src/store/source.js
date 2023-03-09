const source = {
  // 状态仓库
  state() {
    return {
      marker: [],
    };
  },
  // 同步事件
  mutations: {
    marker(state, text) {
      state.marker = text;
    },
  },
  // 异步事件
  actions: {
    saveMarker({ commit }, text) {
      commit("marker", text);
    },
  },
  // 计算属性
  getters: {
    myMarker(state) {
      return state.marker;
    },
  },
};

export default source;
