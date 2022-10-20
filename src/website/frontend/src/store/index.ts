import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Cookies from 'js-cookie';

interface UserState {
  username?: string;
  email?: string;
}

export default createStore({
  state: {
    username: undefined,
    email: undefined,
  },
  actions: {
    verifyUser({ commit }, user:UserState) {
      commit('verifyUser', user);
    },
    logoutUser({ commit }) {
      commit('logoutUser');
    },
  },
  mutations: {
    verifyUser(state:UserState, user: UserState) {
      state.email = user.email;
      state.username = user.username;
    },
    logoutUser(state:UserState) {
      console.log('logoutUser3');
      state.email = undefined;
      state.username = undefined;
    },
  },
  plugins: [
    createPersistedState({
      getState: (key:string) => Cookies.getJSON(key),
      setState: (key:string, state:UserState) => Cookies.set(key, state, { expires: 3, secure: true }),
    }),
  ],
});
