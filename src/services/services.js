/**
 * @Author: Sam
 * @Date: 2019/11/12
 * @Version: 1.0
 **/
import Api from './api'

export default {
  getOneSeller (id) {
    return Api().get(`/seller/${id}`)
  },
  getSellers () {
    return Api().get('/seller')
  },
  login(user) {
    return Api().post('/login', user, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  addUser(user) {
    return Api().post('/user', user, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  getUsers() {
    return Api().get('/user')
  },
  getOneUser(id) {
    return Api().get(`/user/${id}`)
  },
  updateUser(id, user) {
    return Api().put(`/user/${id}`, user, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  deleteUser(id) {
    return Api().delete(`/user/${id}`)
  }
}
