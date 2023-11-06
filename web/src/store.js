import { createStore } from 'vuex';
import {login} from '@/communicationsManager.js';

const store = createStore({
  state: {
    auth: false, 
    user: {
        email: "",
        password: "",
        nom: "",
        cognom: ""
      },
  },
  mutations: {
    setAuth(state, isAuthenticated) {
      this.state.auth = isAuthenticated;
    },
    setEmail(state, loginEmail){
        this.state.user.email = loginEmail;
    },
    setPassword(state, loginPassword){
        this.state.user.password = loginPassword;
    },
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    login({ commit }) {
        
        return new Promise((resolve, reject) => {
      login(this.state.user).then((response) => response.json())
      .then((data) => {
        commit('setUser',data);
        this.loading = false;
        if (data.email != '') {
          commit('setAuth', true);
          resolve(true);
        } else {
            commit('setAuth', false);
            resolve(false);
        }
      }).catch((error) => {
        console.error('Error al iniciar sesión:', error);
        commit('setAuth', false);
        reject(error);
    });
    });
    },
    logout({ commit }) {
      this.state.user = {
        email: "",
        password: "",
        nom: "",
        cognom: ""
      };
      commit('setAuth', false);
    },
  },
  getters: {
    isAuthenticated: (state) => state.auth,
  },
});

export default store;