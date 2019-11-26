/**
 * @Author: Sam
 * @Date: 2019/11/12
 * @Version: 1.0
 **/
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,
  // strict: debug,
  strict: false,
  plugins: debug ? [createLogger()] : []
})
