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
  addSeller(seller) {
    return Api().post('/seller', seller, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  updateSeller(id, seller) {
    return Api().put(`/seller/${id}`, seller, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  deleteSeller(id, seller) {
    return Api().delete(`/seller/${id}`, {
      data: seller,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  fuzzySearch(keyword) {
    return Api().post('/seller/search', keyword, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  updateGoods(id, goods) {
    return Api().put(`/seller/${id}/goods`, goods, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  addRating(id, rating) {
    return Api().post(`/seller/${id}/ratings`, rating, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  deleteRating(id, rating) {
    return Api().delete(`/seller/${id}/ratings`, {
      data: rating,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  login(user) {
    return Api().post('/login', user, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  getToken(username) {
    return Api().get(`/token/${username}`, {
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
  updateUser(user) {
    return Api().put('/user', user, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  deleteUser(id) {
    return Api().delete(`/user/${id}`)
  },
  addAddress(address) {
    return Api().post('/user/address', address, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  deleteAddress(address) {
    console.log(address)
    return Api().delete('/user/address', {
      data: address,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  addPay(pay) {
    return Api().post('/user/pay', pay, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  deletePay(pay) {
    return Api().delete('/user/pay', {
      data: pay,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  addFavorite(favorite) {
    return Api().post('/user/favorite', favorite, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  deleteFavorite(favorite) {
    return Api().delete('/user/favorite', {
      data: favorite,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  getOrders(token) {
    return Api().get('/order', {
      headers: {
        token: token,
        'Content-Type': 'application/json'
      }
    })
  },
  getOneOrder(id, token) {
    return Api().get(`/order/${id}`, {
      headers: {
        token: token,
        'Content-Type': 'application/json'
      }
    })
  },
  addOrder(order) {
    return Api().post('/order', order, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  updateOrder(id, order) {
    return Api().put(`/order/${id}`, order, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  commentOrder(id, comment) {
    return Api().put(`/order/${id}/comment`, comment, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  deleteOrder(id, order) {
    return Api().delete(`/order/${id}`, {
      data: order,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}
