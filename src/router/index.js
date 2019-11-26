import Vue from 'vue'
import Router from 'vue-router'
import goods from '@/components/goods/goods'
import ratings from '@/components/ratings/ratings'
import seller from '@/components/seller/seller'
import sellerlist from '@/components/sellerlist/sellerlist'
import sellerhome from '@/components/sellerhome/sellerhome'
import Login from '@/components/login/login'
import Register from '@/components/register/register'
import AdminHome from '@/components/admin/home/home'
import AdminIndex from '@/components/admin/index/index'
import store from '@/store/store'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'sellerlist',
      component: sellerlist
    },
    {
      path: '/sellerhome',
      name: 'sellerhome',
      component: sellerhome,
      children: [
        {
          path: 'goods',
          name: 'goods',
          component: goods,
          props: true
        },
        {
          path: 'ratings',
          name: 'ratings',
          component: ratings,
          props: true
        },
        {
          path: 'seller',
          name: 'seller',
          component: seller,
          props: true
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminHome,
      children: [
        {
          path: '',
          name: 'index',
          component: AdminIndex
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (store.state.token) {
      next();
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next();
  }
})

export default router
