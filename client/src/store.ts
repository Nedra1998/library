import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

// const HOST = 'http://localhost:8000';
const HOST = '';

export default new Vuex.Store({
  state: {
    user: null,
    sortMethod: 'title',
    entries: [],
    people: [],
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
      state.sortMethod = 'title';
    },
    sortEntriesDate(state) {
      state.entries = state.entries.sort((a: any, b: any): number => {
        if (a.date < b.date) { return -1; }
        return 1;
      });
      state.sortMethod = 'date';
    },
    sortEntriesAuthor(state) {
      state.entries = state.entries.sort((a: any, b: any): number => {
        if (a.authors.length === 0 && b.authors.length === 0) {
          if (a.date < b.date) { return -1; }
          return 1;
        } else if (a.authors.length === 0) {
          return -1;
        } else if (b.authors.length === 0) {
          return 1;
        } else {
          if (a.authors[0] < b.authors[0]) {
            return -1;
          } else if (a.authors[0] === b.authors[0]) {
            if (a.date < b.date) { return -1; }
            return 1;
          }
          return 1;
        }
        return 0;
      });
      state.sortMethod = 'author';
    },
    setPeople(state, payload) {
      state.people = payload.sort((a: any, b: any): number => {
        if (a.name < b.name) {
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
      axios.get(HOST + '/api/user/loggedin', {withCredentials: true}).then((res) => {
        commit('setUser', res.data.name);
      });
    },
    login({ commit, dispatch }, payload): any {
      axios.post(HOST + '/api/user/login', {username: payload[0], password: payload[1]}, {withCredentials: true}).then((res) => {
        commit('setUser', res.data.name);
        commit('setEntries', []);
        dispatch('loadEntries');
      });
    },
    logout({ commit, dispatch }): any {
      axios.get(HOST + '/api/user/logout', {withCredentials: true}).then((res) => {
        commit('setUser', null);
        commit('setEntries', []);
        dispatch('loadEntries');
      });
    },
    loadEntries({ commit }): any {
      axios.get(HOST + '/api/entry/', {withCredentials: true}).then((res) => {
        commit('setEntries', res.data);
      });
    },
    loadPeople({ commit }): any {
      axios.get(HOST + '/api/people/', {withCredentials: true}).then((res) => {
        commit('setPeople', res.data);
      });
    },
    search({ commit }, payload): any {
      axios.get(HOST + '/api/' + payload[0] + '/search?query=' + payload[1], {withCredentials: true}).then((res) => {
        if (payload[0] === 'entry') {
          commit('setQueryEntryResult', res.data);
        } else if (payload[0] === 'people') {
          commit('setQueryPeopleResult', res.data);
        }
      });
    },
    createEntry({ commit, dispatch }, payload): any {
      axios.post(HOST + '/api/entry/', payload, {withCredentials: true}).then((res) => {
        commit('setEntries', []);
        dispatch('loadEntries');
      });
    },
    modifyEntry({ commit, dispatch }, payload): any {
      axios.post(HOST + '/api/entry/modify/' + payload[0], payload[1], {withCredentials: true}).then((res) => {
        commit('setEntries', []);
        dispatch('loadEntries');
      });
    },
    deleteEntry({ commit, dispatch }, payload): any {
      axios.get(HOST + '/api/entry/delete/' + payload, {withCredentials: true}).then((res) => {
        commit('setEntries', []);
        dispatch('loadEntries');
      });
    },
  },
});
