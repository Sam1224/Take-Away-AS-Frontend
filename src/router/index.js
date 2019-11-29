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
import AdminUserIndex from '@/components/admin/users/index'
import AdminUsersList from '@/components/admin/users/userslist'
import AdminAddUser from '@/components/admin/users/adduser'
import AdminEditUser from '@/components/admin/users/edituser'
import AdminSellerIndex from '@/components/admin/sellers/index'
import AdminSellersList from '@/components/admin/sellers/sellerslist'
import AdminAddSeller from '@/components/admin/sellers/addseller'
import AdminEditSeller from '@/components/admin/sellers/editseller'
import AdminEditGoods from '@/components/admin/sellers/editgoods'
import AdminEditRatings from '@/components/admin/sellers/editratings'
import AdminOrdersIndex from '@/components/admin/orders/index'
import AdminOrdersList from '@/components/admin/orders/orderslist'
import AdminAddOrder from '@/components/admin/orders/addorder'
import AdminEditOrder from '@/components/admin/orders/editorder'
import AdminCommentOrder from '@/components/admin/orders/commentorder'
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
      component: sellerhome,
      children: [
        {
          path: '',
          name: 'sellerhome',
          component: goods,
          props: true
        },
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
      component: AdminHome,
      children: [
        {
          path: '',
          name: 'index',
          component: AdminIndex
        },
        {
          path: 'users',
          component: AdminUserIndex,
          children: [
            {
              path: '',
              name: 'userslist',
              component: AdminUsersList
            },
            {
              path: 'users',
              name: 'users',
              component: AdminUsersList
            },
            {
              path: 'add',
              name: 'adduser',
              component: AdminAddUser
            },
            {
              path: 'edit',
              name: 'edituser',
              component: AdminEditUser,
              props: true
            }
          ]
        },
        {
          path: 'sellers',
          component: AdminSellerIndex,
          children: [
            {
              path: '',
              name: 'sellerslist',
              component: AdminSellersList
            },
            {
              path: 'sellers',
              name: 'sellers',
              component: AdminSellersList
            },
            {
              path: 'add',
              name: 'addseller',
              component: AdminAddSeller
            },
            {
              path: 'edit',
              name: 'editseller',
              component: AdminEditSeller,
              props: true
            },
            {
              path: 'editgoods',
              name: 'editgoods',
              component: AdminEditGoods,
              props: true
            },
            {
              path: 'editratings',
              name: 'editratings',
              component: AdminEditRatings,
              props: true
            }
          ]
        },
        {
          path: 'orders',
          component: AdminOrdersIndex,
          children: [
            {
              path: '',
              name: 'orderslist',
              component: AdminOrdersList
            },
            {
              path: 'orders',
              name: 'orders',
              component: AdminOrdersList
            },
            {
              path: 'add',
              name: 'addOrder',
              component: AdminAddOrder,
              props: true
            },
            {
              path: 'edit',
              name: 'editOrder',
              component: AdminEditOrder,
              props: true
            },
            {
              path: 'comment',
              name: 'commentOrder',
              component: AdminCommentOrder,
              props: true
            }
          ]
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
