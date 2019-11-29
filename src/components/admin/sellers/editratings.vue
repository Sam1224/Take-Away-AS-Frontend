<template>
  <div class="edit-ratings-wrapper">
    <h2 class="title">{{title}}</h2>
    <el-form ref="ratingsForm" :model="ratingsForm" status-icon label-width="100px" class="ratings-table" :rules="rules">
      <el-collapse>
        <el-collapse-item title="Ratings" name="Ratings">
          <el-collapse>
            <div v-for="(rating, index) in ratingsForm.ratings" :key="index" class="rating-wrapper">
              <el-collapse-item class="rating-item" :title="rating.username" :name="index">
                <div class="input-wrapper" v-if="rating.status === 0">
                  <el-card shadow="never" class="content-wrapper">
                    <div class="rating">
                      <div class="avatar">
                        <img :src="rating.avatar" width="18" height="18">
                      </div>
                      <div class="content">
                        <h1 class="name">{{rating.username}}</h1>
                        <div class="star-wrapper">
                          <star :size="24" :score="Number(rating.score)"></star>
                          <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}min</span>
                        </div>
                        <p class="text">{{rating.text}}</p>
                        <div class="recommend" v-show="rating.recommend.length">
                          <span class="icon-thumb_up"></span>
                          <span class="item" v-for="(item, index) in rating.recommend" :key="index">{{item}}</span>
                        </div>
                        <div class="time">
                          {{rating.rateTime | formatDate}}
                        </div>
                      </div>
                    </div>
                  </el-card>
                </div>
                <div class="input-wrapper" v-else>
                  <el-form-item label="Username" :prop="`ratings.${index}.username`" :rules="rules.username">
                    <el-input v-model="ratingsForm.ratings[index].username" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="DeliveryTime" :prop="rating.deliveryTime">
                    <el-input type="number" v-model="ratingsForm.ratings[index].deliveryTime" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item label="Score" :prop="rating.score" class="score-wrapper">
                    <star :size="36" :score="Number(ratingsForm.ratings[index].score)" :click="true" @updateScore="updateScore($event, index)" class="star"></star>
                  </el-form-item>
                  <el-form-item label="RateType" :prop="rating.rateType">
                    <el-radio v-model="ratingsForm.ratings[index].rateType" label="0">Satisfied</el-radio>
                    <el-radio v-model="ratingsForm.ratings[index].rateType" label="1">Unsatisfied</el-radio>
                  </el-form-item>
                  <el-form-item label="Text" :prop="rating.text">
                    <el-input type="textarea" v-model="ratingsForm.ratings[index].text" auto-complete="off"></el-input>
                  </el-form-item>
                  <el-form-item v-show="ratingsForm.ratings[index].status === 1">
                    <el-button type="primary" @click="submitRating(index)">Submit Rating</el-button>
                  </el-form-item>
                </div>
              </el-collapse-item>
              <div class="icon-wrapper">
                <i class="iconBtn el-icon-remove-outline" @click="delRating(index)"></i>
                <i class="iconBtn" :class="{'el-icon-circle-plus-outline': ratingsForm.ratings.length - 1 === index}" @click="addRating(index)"></i>
              </div>
            </div>
          </el-collapse>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapGetters } from 'vuex'
  import Star from '@/components/star/star'
  import { formatDate } from '@/common/js/date'

  const ERR_OK = 0
  const DEFAULT_AVATAR = 'http://static.galileo.xiaojukeji.com/static/tms/default_header.png'

  export default {
    data() {
      return {
        title: 'Edit Ratings',
        ratings: {},
        ratingsForm: {
          ratings: [{
            username: '',
            deliveryTime: null,
            score: '5',
            rateTime: null,
            rateType: '0',
            text: '',
            avatar: DEFAULT_AVATAR,
            recommend: [],
            status: 0
          }]
        },
        rules: {
          username: [{
            required: true,
            message: 'Please enter username',
            trigger: 'blur'
          }, {
            min: 5,
            message: 'The length of username should be at least 5 characters'
          }]
        }
      }
    },
    created() {
      this._initializeRatings(this.$router.params)
    },
    filters: {
      formatDate(time) {
        if (!time) {
          return ''
        }
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh: mm')
      }
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    methods: {
      _initializeRatings(id) {
        if (!this.$router.params) {
          this.$router.push('/admin/sellers')
        }
        Service.getOneSeller(id)
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              if (res.data[0].ratings.length === 0) {
                this.ratingsForm.ratings = [{
                  username: '',
                  deliveryTime: null,
                  score: '5',
                  rateTime: null,
                  rateType: '0',
                  text: '',
                  avatar: DEFAULT_AVATAR,
                  recommend: [],
                  status: 1
                }]
                return
              }
              res.data[0].ratings.forEach((rating) => {
                rating.deliveryTime = rating.deliveryTime === undefined || rating.deliveryTime === null ? rating.deliveryTime : rating.deliveryTime.toString()
                rating.score = rating.score === undefined || rating.score === null ? rating.score : rating.score.toString()
                rating.rateType = rating.rateType === undefined || rating.rateType === null ? rating.rateType : rating.rateType.toString()
                rating.status = 0
              })
              this.ratingsForm.ratings = res.data[0].ratings
              this.ratings = res.data[0].ratings
            }
          })
      },
      updateScore(score, index) {
        this.ratingsForm.ratings[index].score = score.toString()
      },
      addRating(index) {
        let newRating = {
          username: '',
          deliveryTime: '',
          score: '5',
          rateTime: null,
          rateType: '0',
          text: '',
          avatar: DEFAULT_AVATAR,
          recommend: [],
          status: 1
        }
        this.ratingsForm.ratings.push(newRating)
      },
      delRating(index) {
        let rating = this.ratingsForm.ratings[index]
        rating.token = this.token

        this.$confirm('This operation will delete this rating, continue?', 'Tips', {
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          Service.deleteRating(this.$router.params, rating)
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
                if (this.ratingsForm.ratings.length === 1) {
                  this.ratingsForm.ratings[0].username = ''
                  this.ratingsForm.ratings[0].deliveryTime = null
                  this.ratingsForm.ratings[0].score = '5'
                  this.ratingsForm.ratings[0].rateTime = null
                  this.ratingsForm.ratings[0].rateType = '0'
                  this.ratingsForm.ratings[0].text = ''
                  this.ratingsForm.ratings[0].avatar = DEFAULT_AVATAR
                  this.ratingsForm.ratings[0].recommend = []
                  this.ratingsForm.ratings[0].status = 1
                  return
                }
                this.ratingsForm.ratings.splice(index, 1)
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
            showClose: true,
            message: 'Cancel deleting rating',
            type: 'info',
            center: true,
            duration: 1000
          })
        })
      },
      submitRating(index) {
        this.$refs.ratingsForm.validate((valid) => {
          if (valid) {
            if (this.ratingsForm.ratings[index].deliveryTime === 0 || this.ratingsForm.ratings[index].deliveryTime === '') {
              this.ratingsForm.ratings[index].deliveryTime = null
            }
            this.ratingsForm.ratings[index].username = this.hideUsername(this.ratingsForm.ratings[index].username)
            let rating = this.ratingsForm.ratings[index]
            rating.token = this.token

            Service.addRating(this.$router.params, rating)
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
                  this.ratingsForm.ratings[index].status = 0
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
      cancel() {
        this.$router.push('/admin/sellers')
      },
      hideUsername(username) {
        username = username.toLowerCase()
        return `${username.charAt(0)}******${username.charAt(username.length - 1)}`
      }
    },
    components: {
      Star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .edit-ratings-wrapper
    position: relative
    font-size: 0
    text-align: center
    .title
      font-size: 36px
      margin-top: 36px
    .ratings-table
      position: relative
      width: 60%
      top: 50px
      margin: 0 auto
      .rating-wrapper
        display: flex
        .rating-item
          position: relative
          flex: 0 0 90%
          .input-wrapper
            position: relative
            .content-wrapper
              padding: 0 18px
              .rating
                display: flex
                padding: 18px 0
                .avatar
                  flex: 0 0 28px
                  width: 28px
                  margin-right: 12px
                  img
                    border-radius: 50%
                .content
                  position: relative
                  flex: 1
                  .name
                    margin-bottom: 4px
                    line-height: 12px
                    font-size: 10px
                    color: rgb(7, 17, 27)
                  .star-wrapper
                    margin-bottom: 6px
                    font-size: 0
                    .star
                      display: inline-block
                      margin-right: 6px
                      vertical-align: top
                    .delivery
                      display: inline-block
                      vertical-align: top
                      line-height: 12px
                      font-size: 10px
                      color: rgb(147, 153, 159)
                  .text
                    margin-bottom: 8px
                    line-height: 18px
                    font-size: 12px
                    color: rgb(7, 17, 27)
                  .recommend
                    line-height: 16px
                    font-size: 0
                    .icon-thumb_up, .item
                      display: inline-block
                      margin: 0 8px 4px 0
                      font-size: 9px
                    .icon-thumb_up
                      color: rgb(0, 160, 220)
                    .item
                      padding: 0 6px
                      border: 1px solid rgba(7, 17, 27, 0.1)
                      border-radius: 1px
                      color: rgb(147, 153, 159)
                      background: #fff
                  .time
                    position: absolute
                    top: 0
                    right: 0
                    line-height: 12px
                    font-size: 10px
                    color: rgb(147, 153, 159)
        .icon-wrapper
          position: relative
          flex: 1
          .iconBtn
            position: relative
            top: 15px
</style>
