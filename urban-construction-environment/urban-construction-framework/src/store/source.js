import { init } from "@/assets/script/deploy";

const source = {
  // 状态仓库
  state() {
    return {
      current: {
        ...init,
      },
      history: [
        {
          ...init,
        },
      ],
      view: 0,
      knob: "",
      alarm: "",
      zaxis: 0,
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
    view(state, text) {
      state.view = text;
    },
    knob(state, text) {
      state.knob = text;
    },
    alarm(state, text) {
      state.alarm = text;
    },
    zaxis(state, text) {
      state.zaxis = text;
    },
  },
  // 异步事件
  actions: {
    saveCurrent({ commit }, text) {
      commit("current", text);
      commit("history", text);
    },
    saveView({ commit }, text) {
      commit("view", text);
    },
    saveKnob({ commit }, text) {
      commit("knob", text);
    },
    saveAlarm({ commit }, text) {
      commit("alarm", text);
    },
    saveZaxis({ commit }, text) {
      commit("zaxis", text);
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
    myView(state) {
      return state.view;
    },
    myKnob(state) {
      return state.knob;
    },
    myAlarm(state) {
      return state.alarm;
    },
    myZaxis(state) {
      return state.zaxis;
    },
  },
};

export default source;
