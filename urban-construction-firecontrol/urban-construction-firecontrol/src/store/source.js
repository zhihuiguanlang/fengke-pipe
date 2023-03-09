const source = {
  // 状态仓库
  state() {
    return {
      current: {},
      history: [],
    };
  },
  // 同步事件
  mutations: {
    current(state, text) {
      state.current = text;
    },
    history(state, text) {
      state.history.some((res) => res.id === text.id) || state.history.push(text);
    },
  },
  // 异步事件
  actions: {
    saveCurrent({ commit }, text) {
      commit("current", text);
      commit("history", text);
    },
  },
  // 计算属性
  getters: {
    myCurrent(state) {
      return state.current;
    },
    myHistory(state) {
      return state.history;
    },
  },
};

export default source;
