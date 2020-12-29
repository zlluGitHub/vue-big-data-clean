import Vue from 'vue';
import Vuex from 'vuex';
import dataState from './dataState';

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    dataState,
  }
});
// console.log(store);
export default store;
