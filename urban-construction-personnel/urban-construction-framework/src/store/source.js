import { init } from "@/assets/script/deploy";

const source = {
  // 状态仓库
  state() {
    return {
      current: {
        ...init,
      },
      history: [{
        ...init,
      }],
    };
  },
  // 同步事件
  mutations: {
    current(state, text) {
      state.current = text;
    },
    history(state, text) {
      state.history.some((res) => res.key === text.key) || state.history.push(text);
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
