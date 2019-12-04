<template>
  <div class="edit-wrapper" v-show="!loading">
    <h2 class="title">{{title}}</h2>
    <el-form v-loading.fullscreen.lock="loading" element-loading-text="Loading..." element-loading-background="rgb(255, 255, 255)" ref="orderForm" :model="orderForm" status-icon label-width="100px" class="order-table" :rules="rules">
      <el-form-item label="User" prop="user">
        <el-input v-model="orderForm.user" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Seller" prop="seller">
        <el-input v-model="orderForm.seller" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Address" prop="address">
        <el-input v-model="orderForm.address" auto-complete="off" disabled></el-input>
        <el-form-item>
          <googlemap @selectPlace="selectAddress($event)"></googlemap>
        </el-form-item>
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input v-model="orderForm.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Note" prop="note">
        <el-input v-model="orderForm.note" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Status" prop="status">
        <el-radio v-model="orderForm.status" label="0">Not commented</el-radio>
        <el-radio v-model="orderForm.status" label="1">Commented</el-radio>
      </el-form-item>
      <el-form-item label="Foods" prop="foods">
        <el-collapse>
          <div v-for="(food, index) in orderForm.foods" :key="index" class="food-wrapper">
            <el-collapse-item class="food-item" :title="food.name" :name="index">
              <div class="input-wrapper">
                <el-form-item label="Name" :prop="`foods.${index}.name`" :rules="rules.foodName">
                  <el-input v-if="food.status === 0" v-model="orderForm.foods[index].name" auto-complete="off" disabled></el-input>
                  <el-input v-else v-model="orderForm.foods[index].name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Quantity" :prop="food.quantity">
                  <el-input type="number" v-model="orderForm.foods[index].quantity" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Price" :prop="food.price">
                  <el-input type="number" v-model="orderForm.foods[index].price" auto-complete="off"></el-input>
                </el-form-item>
              </div>
            </el-collapse-item>
            <div class="icon-wrapper">
              <i class="iconBtn el-icon-remove-outline" @click="delFood(index)"></i>
              <i class="iconBtn" :class="{'el-icon-circle-plus-outline': orderForm.foods.length - 1 === index}" @click="addFood(index)"></i>
            </div>
          </div>
        </el-collapse>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editOrder">Edit Order</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapGetters } from 'vuex'
  import Googlemap from '@/components/admin/googlemap/googlemap'

  const ERR_OK = 0

  export default {
    data () {
      return {
        title: 'Edit Order',
        loading: true,
        order: {},
        orderForm: {
          _id: '',
          user: '',
          seller: '',
          address: '',
          phone: null,
          note: '',
          status: '0',
          foods: [{
            name: '',
            quantity: '0',
            price: '0'
          }]
        },
        rules: {
          foodName: [{
            required: true,
            message: 'Please enter food name',
            trigger: 'blur'
          }]
        }
      }
    },
    created () {
      this._initializeOrder(this.$router.params)
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    methods: {
      _initializeOrder(id) {
        if (!this.$router.params) {
          this.$router.push('/admin/orders')
        }
        Service.getOneOrder(id, this.token)
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              res.data[0].status = res.data[0].status.toString()
              res.data[0].foods.forEach((food) => {
                food.price = food.price.toString()
                food.quantity = food.quantity.toString()
                food.status = 0
              })
              this.orderForm = res.data[0]
              this.order = res.data[0]
              setTimeout(() => {
                this.loading = false
              }, 1000)
            }
          })
      },
      editOrder () {
        this.$refs.orderForm.validate((valid) => {
          if (valid) {
            let order = this.orderForm
            order.token = this.token

            Service.updateOrder(this.$router.params, order)
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
      selectAddress(data) {
        this.orderForm.address = data
      },
      cancel () {
        this.$router.push('/admin/orders')
      },
      addFood (index) {
        let newFood = {
          name: '',
          quantity: '0',
          price: '0',
          status: 1
        }
        this.orderForm.foods.push(newFood)
      },
      delFood (index) {
        if (this.orderForm.foods.length === 1) {
          this.orderForm.foods[0].name = ''
          this.orderForm.foods[0].quantity = '0'
          this.orderForm.foods[0].price = '0'
          this.orderForm.foods[0].status = 1
          return
        }
        this.orderForm.foods.splice(index, 1)
      }
    },
    components: {
      Googlemap
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixin"

  .edit-wrapper
    position: relative
    font-size: 0
    text-align: center
    .title
      font-size: 36px
      margin-top: 36px
    .order-table
      position: relative
      width: 40%
      top: 50px
      margin: 0 auto
      .food-wrapper
        display: flex
        .food-item
          position: relative
          flex: 0 0 90%
          .input-wrapper
            position: relative
        .icon-wrapper
          position: relative
          flex: 1
          .iconBtn
            position: relative
            top: 15px
</style>
