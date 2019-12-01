/**
 * @Author: Sam
 * @Date: 2019/11/12
 * @Version: 1.0
 **/
import * as types from './mutation-types'

const mutations = {
  [types.SET_SELLER](state, seller) {
    state.seller = seller
  },
  [types.SET_GOODS](state, goods) {
    state.goods = goods
  },
  [types.LOGIN](state, token) {
    localStorage.token = token
    state.token = token
  },
  [types.LOGOUT](state) {
    localStorage.removeItem('token')
    state.token = null
  },
  [types.SET_ACCOUNT](state, account) {
    if (Object.keys(account).length !== 0) {
      localStorage.setItem('account', JSON.stringify(account))
    } else {
      localStorage.removeItem('account')
    }
    state.account = account
  }
}
export default mutations
