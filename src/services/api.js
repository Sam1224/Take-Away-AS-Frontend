/**
 * @Author: Sam
 * @Date: 2019/11/12
 * @Version: 1.0
 **/
import axios from 'axios'
// eslint-disable-next-line no-unused-vars
import store from '@/store/store'
// eslint-disable-next-line no-unused-vars
import router from '@/router/index'
// eslint-disable-next-line no-unused-vars
import * as types from '@/store/mutation-types'

// axios.defaults.timeout = 5000

// // http request 拦截器
// axios.interceptors.request.use(
//   config => {
//     console.log(store.state.token)
//     if (store.state.token) {
//       config.headers.Authorization = `token ${store.state.token}`
//     }
//     return config
//   },
//   err => {
//     return Promise.reject(err)
//   }
// )
//
// // http response 拦截器
// axios.interceptors.response.use(
//   response => {
//     return response
//   },
//   error => {
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           // 401 清除token信息并跳转到登录页面
//           store.commit(types.LOGOUT)
//
//           // 只有在当前路由不是登录页面才跳转
//           router.currentRoute.path !== 'login' &&
//           router.replace({
//             path: 'login',
//             query: { redirect: router.currentRoute.path }
//           })
//       }
//     }
//     // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
//     return Promise.reject(error.response.data)
//   }
// )

export default () => {
  return axios.create({
    baseURL: 'https://takeawayapp-sam.herokuapp.com/'
  })
}
