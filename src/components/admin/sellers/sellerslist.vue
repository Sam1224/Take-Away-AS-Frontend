<template>
  <div class="sellerslist-wrapper">
    <h3 class="vue-title"><i class="fa fa-list" style="padding: 3px"></i>{{messageTitle}}</h3>
    <div class="sellers-table">
      <v-client-table :columns="columns" :data="sellers" :options="options" label-width="auto">
        <div slot="child_row" slot-scope="props">
          <el-form :model="props.row" status-icon label-width="100px" style="position:relative;width: 50%;margin:auto;">
            <el-form-item label="Name" prop="name">
              <el-card shadow="never">
                <span>{{props.row.name}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="Description" prop="description">
              <el-card shadow="never">
                <span>{{props.row.description}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="DeliveryTime" prop="deliveryTime">
              <el-card shadow="never">
                <span>{{props.row.deliveryTime}}min</span>
              </el-card>
            </el-form-item>
            <el-form-item label="GeneralScore" prop="score">
              <el-card shadow="never" class="score-wrapper">
                <star :size="36" :score="props.row.score" class="star"></star>
                <span class="score">{{props.row.score}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="ServiceScore" prop="serviceScore">
              <el-card shadow="never" class="score-wrapper">
                <star :size="36" :score="props.row.serviceScore" class="star"></star>
                <span class="score">{{props.row.serviceScore}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="FoodScore" prop="foodScore">
              <el-card shadow="never" class="score-wrapper">
                <star :size="36" :score="props.row.foodScore" class="star"></star>
                <span class="score">{{props.row.foodScore}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="RankRate" prop="rankRate">
              <el-card shadow="never">
                <span>{{props.row.rankRate}}%</span>
              </el-card>
            </el-form-item>
            <el-form-item label="Bulletin" prop="bulletin">
              <el-card shadow="never">
                <span style="text-align:left;float:left;">{{props.row.bulletin}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="Avatar" prop="avatar">
              <el-image style="width:128px;height:128px;" :src="props.row.avatar" fit="fill"></el-image>
            </el-form-item>
            <el-form-item label="Pictures" prop="pics">
              <el-carousel :interval="3000" type="card" height="90px">
                <el-carousel-item v-for="(pic, index) in props.row.pics" :key="index">
                  <el-image style="width:120px;height:90px;" :src="pic" fit="fill"></el-image>
                </el-carousel-item>
              </el-carousel>
            </el-form-item>
            <el-form-item label="Supports" prop="supports">
              <ul>
                <li class="support-item" v-for="(support, index) in props.row.supports" :key="index">
                  <el-col :span="8">
                    <el-card shadow="never">
                      <span>{{classMap[support.types]}}</span>
                    </el-card>
                  </el-col>
                  <el-col :span="16">
                    <el-card shadow="never">
                      <span>{{support.description}}</span>
                    </el-card>
                  </el-col>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label="Information" prop="infos">
              <ul>
                <li class="info-item" v-for="(info, index) in props.row.infos" :key="index">
                  <el-card shadow="never" style="width:100%">
                    <span style="text-align:left;float:left;">{{info}}</span>
                  </el-card>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label="Goods" prop="goods">
              <el-collapse>
                <el-collapse-item v-for="(item, index) in props.row.goods" :key="index" class="food-list" :title="item.name" :name="item.name">
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
                      </div>
                    </li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
            </el-form-item>
            <el-form-item label="Ratings" prop="ratings">
              <el-collapse>
                <el-collapse-item title="Ratings" name="Ratings">
                  <el-card shadow="never" class="rating-wrapper">
                    <ul>
                      <li v-for="(rating, index) in props.row.ratings" :key="index" class="rating-item">
                        <div class="avatar">
                          <img :src="rating.avatar" width="18" height="18">
                        </div>
                        <div class="content">
                          <h1 class="name">{{rating.username}}</h1>
                          <div class="star-wrapper">
                            <star :size="24" :score="rating.score"></star>
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
                      </li>
                    </ul>
                  </el-card>
                </el-collapse-item>
              </el-collapse>
            </el-form-item>
          </el-form>
        </div>
        <a slot="goods" slot-scope="props" class="el-icon-tableware" @click="editGoods(props.row._id)"></a>
        <a slot="ratings" slot-scope="props" class="el-icon-edit" @click="editRatings(props.row._id)"></a>
        <a slot="edit" slot-scope="props" class="el-icon-setting" @click="editSeller(props.row._id)"></a>
        <a slot="remove" slot-scope="props" class="el-icon-delete" @click="deleteSeller(props.row._id)"></a>
      </v-client-table>
      <div class="tab">
        <div class="tab-item">
          <router-link to="/admin/sellers/add" tag="a">Add Seller</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import Vue from 'vue'
  import VueTables from 'vue-tables-2'
  import { mapGetters } from 'vuex'
  import Star from '@/components/star/star'
  import { formatDate } from '@/common/js/date'

  Vue.use(VueTables.ClientTable, {compileTemplates: true, filterByColumn: true})

  const ERR_OK = 0

  export default {
    data() {
      return {
        messageTitle: 'Seller List',
        sellers: [],
        errors: [],
        columns: ['_id', 'name', 'description', 'score', 'goods', 'ratings', 'edit', 'remove'],
        options: {
          headings: {
            _id: 'ID',
            name: 'Name',
            description: 'Description',
            score: 'Score'
          },
          sortables: ['name', 'description', 'score'],
          perPage: 10,
          filterable: ['name', 'description', 'score'],
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
    filters: {
      formatDate(time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh: mm')
      }
    },
    created () {
      this.classMap = ['Decrease', 'Discount', 'Special', 'Invoice', 'Guarantee']
      this._initializeSellers()
    },
    methods: {
      _initializeSellers() {
        Service.getSellers()
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              this.sellers = res.data
            }
          })
          .catch((err) => {
            this.errors.push(err)
          })
      },
      deleteSeller(id) {
        this.$confirm('This operation will delete the seller, continue?', 'Tips', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let seller = {
            token: this.token
          }
          Service.deleteSeller(id, seller)
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
                  this._initializeSellers()
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
      editSeller(id) {
        this.$router.params = id
        this.$router.push('/admin/sellers/edit')
      },
      editGoods(id) {
        this.$router.params = id
        this.$router.push('/admin/sellers/editgoods')
      },
      editRatings(id) {
        this.$router.params = id
        this.$router.push('/admin/sellers/editratings')
      }
    },
    components: {
      Star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .vue-title
    margin-top: 30px
    text-align: center
    font-size: 45pt
    margin-bottom: 10px
  .sellers-table
    width: 80%
    margin: 0 auto
    .slot
      display: table
      margin: 0 auto
    .score-wrapper
      margin-bottom: 8px
      font-size: 0
      line-height: 0
      .title
        display: inline-block
        line-height: 18px
        vertical-align: top
        font-size: 12px
        color: rgb(7, 17, 27)
      .star
        display: inline-block
        vertical-align: top
        margin: 0 12px
      .score
        display: inline-block
        line-height: 18px
        vertical-align: top
        font-size: 12px
        color: rgb(255, 153, 0)
    .pic-item, .support-item, .info-item, .food-item
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
    .rating-wrapper
      padding: 0 18px
      .rating-item
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
    .tab
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
        & > a
          display: block
          text-decoration: none
          font-size: 18px
          color: rgb(77, 85, 93)
          &.active
            color: rgb(240, 20, 20)
</style>
