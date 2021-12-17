import Vue from 'vue'
import Vuex from 'vuex'
import userModel from "./modules/user"
import Itinerary from "./modules/Itinerary";
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    userModel,
    Itinerary
  }
})
