<template>
  <div class="add-wrapper">
    <h2 class="title">{{title}}</h2>
    <el-form ref="orderForm" :model="orderForm" status-icon label-width="100px" class="order-table" :rules="rules">
      <el-form-item label="User" prop="user">
        <el-input class="user" v-model="orderForm.user" auto-complete="off" disabled></el-input>
        <v-client-table v-if="showUserTable" :columns="userColumns" :data="users" :options="userOptions" label-width="auto">
          <el-button slot="select" slot-scope="props" @click="selectUser(props.row)">Select</el-button>
        </v-client-table>
      </el-form-item>
      <el-form-item label="Seller" prop="seller">
        <el-input class="seller" v-model="orderForm.seller" auto-complete="off" disabled></el-input>
        <v-client-table v-if="showSellerTable" :columns="sellerColumns" :data="sellers" :options="sellerOptions" label-width="auto">
          <el-button slot="select" slot-scope="props" @click="selectSeller(props.row)">Select</el-button>
        </v-client-table>
      </el-form-item>
      <el-form-item label="Address" prop="address">
        <el-input class="address" v-model="orderForm.address" auto-complete="off" disabled></el-input>
        <el-form-item>
          <googlemap @selectPlace="selectAddress($event)"></googlemap>
        </el-form-item>
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input class="phone" v-model="orderForm.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Note" prop="note">
        <el-input class="note" v-model="orderForm.note" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Foods" prop="foods">
        <el-collapse>
          <el-collapse-item v-for="(item, index) in goods" :key="index" class="food-list" :title="item.name" :name="item.name">
            <ul>
              <li v-for="(food, index) in item.foods" :key="index" class="food-item">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">Selling {{food.sellCount}}/Month</span><span>Good Ratings: {{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol2 @add="addFood" @dec="decFood" :food="food"></cartcontrol2>
                  </div>
                </div>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
        <el-card v-show="orderForm.foods.length !== 0" shadow="never">
          <el-table :data="orderForm.foods" border strip style="width: 100%">
            <el-table-column prop="name" label="Name"></el-table-column>
            <el-table-column prop="price" label="Price"></el-table-column>
            <el-table-column prop="quantity" label="Quantity"></el-table-column>
            <el-table-column prop="totalPrice" label="TotalPrice"></el-table-column>
          </el-table>
        </el-card>
      </el-form-item>
      <el-form-item>
        <el-button class="add-btn" type="primary" @click="addOrder">Add Order</el-button>
        <el-button class="reset-btn" @click="reset">Reset</el-button>
        <el-button class="cancel-btn" @click="cancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapGetters, mapMutations } from 'vuex'
  import cartcontrol2 from '@/components/cartcontrol/cartcontrol2'
  import Googlemap from '@/components/admin/googlemap/googlemap'

  const ERR_NOK = -1
  const ERR_OK = 0

  export default {
    data() {
      return {
        title: 'Add Order',
        showUserTable: true,
        showSellerTable: true,
        userColumns: ['select', '_id', 'username', 'phone'],
        userOptions: {
          headings: {
            _id: 'ID',
            username: 'Username',
            phone: 'Phone'
          },
          sortables: ['_id', 'username', 'phone'],
          perPage: 10,
          filterable: ['_id', 'username', 'phone'],
          uniqueKey: '_id'
        },
        sellerColumns: ['select', '_id', 'name', 'description', 'score'],
        sellerOptions: {
          headings: {
            _id: 'ID',
            name: 'Name',
            description: 'Description',
            score: 'Score'
          },
          sortables: ['_id', 'name', 'description', 'score'],
          perPage: 10,
          filterable: ['_id', 'name', 'description', 'score'],
          uniqueKey: '_id'
        },
        users: [],
        sellers: [],
        goods: [],
        order: {},
        orderForm: {
          user: '',
          seller: '',
          address: '',
          phone: null,
          note: '',
          status: '0',
          foods: []
        },
        rules: {
          user: [{
            required: true,
            message: 'Please select user',
            trigger: 'blur'
          }],
          seller: [{
            required: true,
            message: 'Please select seller',
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: 'Please enter address',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: 'Please enter phone number',
            trigger: 'blur'
          }],
          foods: [{
            required: true,
            message: 'Please select food, if no food provided, please change a seller',
            trigger: 'blur'
          }]
        }
      }
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    created() {
      this._initializeData()
    },
    methods: {
      _initializeData() {
        Service.getUsers()
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              this.users = res.data
            }
          })
          .catch((err) => {
            console.log(err)
          })
        Service.getSellers()
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              res.data.forEach((seller) => {
               let goods = seller.goods
                goods.forEach((good) => {
                  let foods = good.foods
                  foods.forEach((food) => {
                    let image = food.image
                    let icon = food.icon
                    if (image.startsWith('uploads')) {
                      food.image = `https://takeawayapp-sam.herokuapp.com/${image}`
                    }
                    if (icon.startsWith('uploads')) {
                      food.icon = `https://takeawayapp-sam.herokuapp.com/${icon}`
                    }
                  })
                })
              })
              this.sellers = res.data
            }
          })
          .catch((err) => {
            console.log(err)
          })
      },
      selectAddress(data) {
        this.orderForm.address = data
      },
      addOrder() {
        this.$refs.orderForm.validate((valid) => {
          if (valid) {
            let order = this.orderForm
            order.token = this.token
            if (order.foods.length > 1) {
              order.foods.pop()
            }

            Service.addOrder(order)
              .then((response) => {
                let res = response.data
                if (res.code === ERR_OK) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success',
                    center: true,
                    duration: 1000
                  })
                  setTimeout(() => {
                    this.$router.push('/admin/orders')
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
          } else {
            return false
          }
        })
      },
      reset() {
        this.$refs.orderForm.resetFields()
        this.showUserTable = true
        this.showSellerTable = true
        this.goods = []
      },
      cancel() {
        this.$router.push('/admin/orders')
      },
      selectUser(data) {
        this.orderForm.user = data._id
        this.showUserTable = false
      },
      selectSeller(data) {
        this.orderForm.seller = data._id
        this.goods = data.goods
        this.showSellerTable = false
      },
      statisticFoods() {
        let statisticalRow = {
          name: 'Sum',
          price: '-',
          quantity: 0,
          totalPrice: 0
        }
        let index = this.orderForm.foods.findIndex((value, index, arr) => {
          return value.name === statisticalRow.name && value.price === statisticalRow.price
        })
        if (index >= 0) {
          this.orderForm.foods.splice(index, 1)
        }
        this.orderForm.foods.forEach((food) => {
          let totalPrice = Number(food.quantity) * Number(food.price)
          food.totalPrice = totalPrice
          statisticalRow.quantity += Number(food.quantity)
          statisticalRow.totalPrice += totalPrice
        })
        this.orderForm.foods.push(statisticalRow)
      },
      addFood(food) {
        let index = this.orderForm.foods.findIndex((value, index, arr) => {
          return value.name === food.name
        })
        if (index >= 0) {
          this.orderForm.foods[index].quantity = food.count
        } else {
          let newFood = {
            name: food.name,
            quantity: food.count,
            price: food.price
          }
          this.orderForm.foods.push(newFood)
        }
        this.statisticFoods()
      },
      decFood(food) {
        let index = this.orderForm.foods.findIndex((value, index, arr) => {
          return value.name === food.name
        })
        if (index >= 0) {
          if (food.count > 0) {
            this.orderForm.foods[index].quantity = food.count
          } else {
            this.orderForm.foods.splice(index, 1)
          }
          this.statisticFoods()
        }
      },
      ...mapMutations({
        logout: 'LOGOUT',
        setAccount: 'SET_ACCOUNT'
      })
    },
    components: {
      cartcontrol2,
      Googlemap
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixin"

  .add-wrapper
    position: relative
    font-size: 0
    text-align: center
    .title
      font-size: 36px
      margin-top: 36px
    .order-table
      position: relative
      width: 80%
      top: 50px
      margin: 0 auto
    .food-item
      position: relative
      display: flex
      .input-wrapper
        flex: 0 0 90%
      .icon-wrapper
        flex: 1
        position: relative
        .iconBtn
          position: relative
          top: 15px
    .food-list
      text-align: center
      .food-item
        padding-bottom: 18px
        width: 75%
        margin: auto
        &:last-child
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 40px
        .content
          flex: 1
          text-align: left
          white-space: nowrap
          overflow: hidden
          text-overflow: ellipsis
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
