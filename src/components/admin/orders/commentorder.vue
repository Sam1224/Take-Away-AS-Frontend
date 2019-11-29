<template>
  <div class="comment-wrapper">
    <h2 class="title">{{title}}</h2>
    <el-form ref="commentForm" :model="commentForm" status-icon label-width="100px" class="comment-table" :rules="rules">
      <el-form-item label="Seller" prop="seller">
        <el-input v-model="commentForm.seller" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="DeliveryTime" prop="deliveryTime">
        <el-input v-model="commentForm.deliveryTime" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Score" prop="score" class="score-wrapper">
        <star :size="36" :score="Number(commentForm.score)" :click="true" @updateScore="updateScore" class="star"></star>
      </el-form-item>
      <el-form-item label="RateType" prop="rateType">
        <el-radio v-model="commentForm.rateType" label="0">Satisfied</el-radio>
        <el-radio v-model="commentForm.rateType" label="1">Unsatisfied</el-radio>
      </el-form-item>
      <el-form-item label="Text" prop="text">
        <el-input type="textarea" v-model="commentForm.text" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Recommend" prop="recommend" style="text-align:left;">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="selectAll">Select All</el-checkbox>
        <el-checkbox-group v-model="commentForm.recommend" @change="selectFood">
          <el-checkbox v-for="(food, index) in foods" :label="food" :key="index">{{food}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="commentOrder">Comment Order</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapGetters } from 'vuex'
  import Star from '@/components/star/star'

  const ERR_OK = 0
  const USERNAME = 'admin'
  const AVATAR = 'http://static.galileo.xiaojukeji.com/static/tms/default_header.png'

  export default {
    data () {
      return {
        title: 'Comment Order',
        checkAll: false,
        isIndeterminate: true,
        foods: [],
        order: {},
        commentForm: {
          seller: '',
          deliveryTime: null,
          score: '5',
          rateType: '0',
          text: '',
          recommend: [],
          username: USERNAME,
          avatar: AVATAR
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
              let data = res.data[0]
              this.commentForm.seller = data.seller
              this.commentForm.deliveryTime = null
              this.commentForm.score = '5'
              this.commentForm.rateType = '0'
              this.commentForm.text = ''
              this.commentForm.recommend = []
              this.commentForm.username = USERNAME
              this.commentForm.avatar = AVATAR
              this.order = data
              this.foods = []
              data.foods.forEach((food) => {
                this.foods.push(food.name)
              })
            }
          })
      },
      updateScore(score) {
        this.commentForm.score = score.toString()
      },
      selectAll(val) {
        this.commentForm.recommend = val ? this.foods : []
        this.isIndeterminate = false
      },
      selectFood(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.foods.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.foods.length
      },
      commentOrder () {
        this.$refs.commentForm.validate((valid) => {
          if (valid) {
            let comment = this.commentForm
            comment.token = this.token

            Service.commentOrder(this.$router.params, comment)
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
      cancel () {
        this.$router.push('/admin/orders')
      }
    },
    components: {
      Star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixin"

  .comment-wrapper
    position: relative
    font-size: 0
    text-align: center
    .title
      font-size: 36px
      margin-top: 36px
    .comment-table
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
