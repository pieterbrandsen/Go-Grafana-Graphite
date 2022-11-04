import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Cookies from 'js-cookie';
// import VueCookies from 'vue-cookies';

interface UserState {
  username?: string;
  id?: number;
}

export default createStore({
  state: {
    username: undefined,
    id: undefined,
  },
  actions: {
    setUser({ commit }) {
      commit('setUser');
    },
    logoutUser({ commit }) {
      commit('logoutUser');
    },
  },
  mutations: {
    setUser(state:UserState) {
      state.username = Cookies.getJSON('username');
      state.id = Cookies.getJSON('id');
    },
    logoutUser(state:UserState) {
      state.username = undefined;
      state.id = undefined;
    },
  },
  plugins: [
    createPersistedState({
      getState: (key:string) => Cookies.getJSON(key),
      setState: (key:string, state:UserState) => Cookies.set(key, state, { expires: 3, secure: true }),
    }),
  ],
});
