import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: undefined,
    entries: [],
    queryEntryResult: [],
    queryPeopleResult: [],
  },
  mutations: {
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
      console.log("CHECK USER");
    },
    loadEntries({ commit }): any {
      axios.get('http://localhost:3000/api/entry/').then((res) => {
        commit('setEntries', res.data);
      });
    },
    search({ commit }, payload): any {
      axios.get('http://localhost:3000/api/' + payload[0] + '/search?query=' + payload[1]).then((res) => {
        if (payload[0] === 'entry') {
          commit('setQueryEntryResult', res.data);
        } else if (payload[0] === 'people') {
          commit('setQueryPeopleResult', res.data);
        }
      });
    },
  },
});
