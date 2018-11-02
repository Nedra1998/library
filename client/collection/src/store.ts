import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: undefined,
    queryEntryResult: [],
    queryPeopleResult: [],
  },
  mutations: {
    setQueryEntryResult(state, payload) {
      state.queryEntryResult = payload;
    },
    setQueryPeopleResult(state, payload) {
      state.queryPeopleResult = payload;
    },
  },
  actions: {
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
