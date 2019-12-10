<template>
  <div class="orderslist-wrapper" v-show="!loading">
    <h3 class="vue-title"><i class="fa fa-list" style="padding: 3px"></i>{{messageTitle}}</h3>
    <div class="orders-table">
      <v-client-table v-loading.fullscreen.lock="loading" element-loading-text="Loading..." element-loading-background="rgb(255, 255, 255)" :columns="columns" :data="orders" :options="options" label-width="auto">
        <div slot="child_row" slot-scope="props">
          <el-form :model="props.row" status-icon label-width="100px" style="position:relative;width: 75%;margin:auto;">
            <el-form-item label="OrderID" prop="_id">
              <el-card shadow="never">
                <span>{{props.row._id}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="User" prop="user">
              <el-card shadow="never">
                <span>{{props.row.user}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="Seller" prop="seller">
              <el-card shadow="never">
                <span>{{props.row.seller}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="Note" prop="note">
              <el-card shadow="never">
                <span>{{props.row.note}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="Address" prop="address">
              <el-card shadow="never">
                <span>{{props.row.address}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="Phone" prop="phone">
              <el-card shadow="never">
                <span>{{props.row.phone}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="Foods" prop="foods">
              <el-card shadow="never">
                <el-table :data="props.row.foods" border strip style="width: 100%">
                  <el-table-column prop="name" label="Name"></el-table-column>
                  <el-table-column prop="price" label="Price"></el-table-column>
                  <el-table-column prop="quantity" label="Quantity"></el-table-column>
                  <el-table-column prop="totalPrice" label="TotalPrice"></el-table-column>
                </el-table>
              </el-card>
            </el-form-item>
            <el-form-item label="Status" prop="status">
              <el-card shadow="never">
                <span>{{props.row.status === 0 ? 'Not commented' : 'Commented'}}</span>
              </el-card>
            </el-form-item>
          </el-form>
        </div>
        <a v-if="props.row.status === 0" slot="comment" slot-scope="props" class="el-icon-edit-outline" @click="commentOrder(props.row._id)"></a>
        <a v-else slot="comment" slot-scope="props" class="el-icon-check"></a>
        <a slot="edit" slot-scope="props" class="el-icon-setting" @click="editOrder(props.row._id)"></a>
        <a slot="remove" slot-scope="props" class="el-icon-delete" @click="deleteOrder(props.row)"></a>
      </v-client-table>
      <div class="tab-wrapper">
        <div class="tab-item">
          <router-link class="add" to="/admin/orders/add" tag="a">Add Order</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import Vue from 'vue'
  import VueTables from 'vue-tables-2'
  import { mapGetters, mapMutations } from 'vuex'

  Vue.use(VueTables.ClientTable, {compileTemplates: true, filterByColumn: true})

  const ERR_NOK = -1
  const ERR_OK = 0

  export default {
    data() {
      return {
        messageTitle: 'Order List',
        loading: true,
        orders: [],
        errors: [],
        columns: ['_id', 'user', 'seller', 'phone', 'comment', 'edit', 'remove'],
        options: {
          headings: {
            _id: 'ID',
            user: 'User',
            seller: 'Seller',
            phone: 'Phone'
          },
          sortables: ['user', 'seller', 'phone'],
          perPage: 10,
          filterable: ['user', 'seller', 'phone'],
          uniqueKey: '_id'
        },
        props: [
          '_id'
        ]
      }
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    created () {
      this._initializeOrders()
    },
    methods: {
      _initializeOrders() {
        Service.getOrders(this.token)
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              // Deal with the orders list to fit the table, do some statistics
              res.data.forEach((order) => {
                let statisticalRow = {
                  name: 'Sum',
                  price: '-',
                  quantity: 0,
                  totalPrice: 0
                }
                order.foods.forEach((food) => {
                  let totalPrice = Number(food.quantity) * Number(food.price)
                  food.totalPrice = totalPrice
                  statisticalRow.quantity += Number(food.quantity)
                  statisticalRow.totalPrice += totalPrice
                })
                order.foods.push(statisticalRow)
              })
              this.orders = res.data
              setTimeout(() => {
                this.loading = false
              }, 1000)
            } else if (res.code === ERR_NOK && res.error.name === 'TokenExpiredError') {
              this.$message({
                showClose: true,
                message: 'The token has expired, please login again',
                type: 'warning',
                center: true,
                duration: 1000
              })
              setTimeout(() => {
                this.logout()
                this.setAccount({})
                this.$router.push('/admin/login')
              }, 1500)
            }
          })
          .catch((err) => {
            this.errors.push(err)
          })
      },
      deleteOrder(order) {
        this.$confirm('This operation will delete the order, continue?', 'Tips', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          order.token = this.token
          Service.deleteOrder(order._id, order)
            .then((response) => {
              let res = response.data
              if (res.code === ERR_OK) {
                this.$message({
                  showClose: true,
                  message: 'Successfully deleting one seller',
                  type: 'success',
                  center: true,
                  duration: 1000
                })
                setTimeout(() => {
                  this._initializeOrders()
                }, 1500)
              } else if (res.code === ERR_NOK && res.error.name === 'TokenExpiredError') {
                this.$message({
                  showClose: true,
                  message: 'The token has expired, please login again',
                  type: 'warning',
                  center: true,
                  duration: 1000
                })
                setTimeout(() => {
                  this.logout()
                  this.setAccount({})
                  this.$router.push('/admin/login')
                }, 1500)
              } else {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'warning',
                  center: true,
                  duration: 1000
                })
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel deleting'
          })
        })
      },
      editOrder(id) {
        this.$router.params = id
        this.$router.push('/admin/orders/edit')
      },
      commentOrder(id) {
        this.$router.params = id
        this.$router.push('/admin/orders/comment')
      },
      ...mapMutations({
        logout: 'LOGOUT',
        setAccount: 'SET_ACCOUNT'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .vue-title
    margin-top: 30px
    text-align: center
    font-size: 45pt
    margin-bottom: 10px
  .orders-table
    width: 80%
    margin: 0 auto
    .slot
      display: table
      margin: 0 auto
    .tab-wrapper
      display: flex
      position: relative
      bottom: 50px
      float: right
      height: 40px
      line-height: 40px
      .tab-item
        flex: 1
        text-align: center
        border-radius: 10px
        padding-left: 5px
        padding-right: 5px
        border: solid black 1px
        .add
          display: block
          text-decoration: none
          font-size: 18px
          color: rgb(77, 85, 93)
</style>
