import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    entries: [],
    queryEntryResult: [],
    queryPeopleResult: [],
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setEntries(state, payload) {
      state.entries = payload.sort((a: any, b: any): number => {
        if (a.title < b.title) {
          return -1;
        } else {
          return 1;
        }
      });
    },
    sortEntriesTitle(state) {
      state.entries = state.entries.sort((a: any, b: any): number => {
        if (a.title < b.title) {
          return -1;
        } else {
          return 1;
        }
      });
    },
    setQueryEntryResult(state, payload) {
      state.queryEntryResult = payload;
    },
    setQueryPeopleResult(state, payload) {
      state.queryPeopleResult = payload;
    },
  },
  actions: {
    checkUser({ commit }): any {
      axios.get('http://localhost:3000/api/user/loggedin', {withCredentials: true}).then((res) => {
        commit('setUser', res.data.name);
      });
    },
    login({ commit, dispatch }, payload): any {
      axios.post('http://localhost:3000/api/user/login', {username: payload[0], password: payload[1]}, {withCredentials: true}).then((res) => {
        commit('setUser', res.data.name);
        commit('setEntries', []);
        dispatch('loadEntries');
      });
    },
    logout({ commit, dispatch }): any {
      axios.get('http://localhost:3000/api/user/logout', {withCredentials: true}).then((res) => {
        commit('setUser', null);
        commit('setEntries', []);
        dispatch('loadEntries');
      });
    },
    loadEntries({ commit }): any {
      axios.get('http://localhost:3000/api/entry/', {withCredentials: true}).then((res) => {
        commit('setEntries', res.data);
      });
    },
    search({ commit }, payload): any {
      axios.get('http://localhost:3000/api/' + payload[0] + '/search?query=' + payload[1], {withCredentials: true}).then((res) => {
        if (payload[0] === 'entry') {
          commit('setQueryEntryResult', res.data);
        } else if (payload[0] === 'people') {
          commit('setQueryPeopleResult', res.data);
        }
      });
    },
    createEntry({ commit, dispatch }, payload): any {
      axios.post('http://localhost:3000/api/entry/', payload, {withCredentials: true}).then((res) => {
        commit('setEntries', []);
        dispatch('loadEntries');
      });
    },
    modifyEntry({ commit, dispatch }, payload): any {
      axios.post('http://localhost:3000/api/entry/modify/' + payload[0], payload[1], {withCredentials: true}).then((res) => {
        commit('setEntries', []);
        dispatch('loadEntries');
      });
    },
    deleteEntry({ commit, dispatch }, payload): any {
      axios.get('http://localhost:3000/api/entry/delete/' + payload, {withCredentials: true}).then((res) => {
        commit('setEntries', []);
        dispatch('loadEntries');
      });
    },
  },
});
