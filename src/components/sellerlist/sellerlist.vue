<template>
  <div class="sellerlist">
    <div class="header-wrapper">
      <h1 class="text">{{title}}</h1>
    </div>
    <div class="search-wrapper">
      <el-input :placeholder="placeholder" auto-complete="off" v-model="keyword">
        <i slot="suffix" class="el-input__icon el-icon-search" @click="fuzzySearch"></i>
      </el-input>
    </div>
    <div class="seller-wrapper" ref="sellerWrapper" v-loading="loading" :v-loading="loading" element-loading-text="Loading..." element-loading-background="rgb(255, 255, 255)">
      <ul class="content">
        <li v-for="(seller, index) in sellers" :key="index" class="seller-item border-1px" ref="sellerItem" @click="selectSeller(seller)">
          <div class="avatar-wrapper">
            <img :src="seller.avatar" width="72" height="72">
          </div>
          <div class="content-wrapper">
            <h2 class="name">{{seller.name}}</h2>
            <p class="description">{{seller.description}}</p>
            <div class="count-wrapper">
              <span class="count">Selling {{seller.sellCount}}/Month</span><span class="icon-thumb_up"></span><span class="rating">{{seller.rankRate}}%</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import BScroll from 'better-scroll'
  import { mapMutations } from 'vuex'

  const ERR_OK = 0

  export default {
    data () {
      return {
        loading: true,
        errors: [],
        sellers: [],
        listHeight: [],
        title: 'Take-Away App',
        placeholder: 'Please input keyword',
        keyword: ''
      }
    },
    created () {
      this.getSellers()
    },
    methods: {
      getSellers() {
        Service.getSellers()
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              res.data.forEach((seller) => {
                let avatar = seller.avatar
                if (avatar.startsWith('uploads')) {
                  seller.avatar = `https://takeawayapp-sam.herokuapp.com/${avatar}`
                }
                let goods = seller.goods
                goods.forEach((good) => {
                  let foods = good.foods
                  foods.forEach((food) => {
                    let icon = food.icon
                    let image = food.image
                    if (icon.startsWith('uploads')) {
                      food.icon = `https://takeawayapp-sam.herokuapp.com/${icon}`
                    }
                    if (image.startsWith('uploads')) {
                      food.image = `https://takeawayapp-sam.herokuapp.com/${image}`
                    }
                  })
                })
                let pics = seller.pics
                for (let i = 0; i < pics.length; i++) {
                  let pic = pics[i]
                  if (pic.startsWith('uploads')) {
                    seller.pics[i] = `https://takeawayapp-sam.herokuapp.com/${pic}`
                  }
                }
              })
              this.sellers = res.data
              this.$nextTick(() => {
                this._initScroll()
              })
            }
            setTimeout(() => {
              this.loading = false
            }, 1000)
          })
          .catch((err) => {
            this.errors.push(err)
          })
      },
      selectSeller(seller) {
        this.$router.params = seller._id
        this.$router.push('/sellerhome')
        // Vuex
        this.setSeller(seller)
        this.setGoods(seller.goods)
      },
      _initScroll() {
        if (!this.sellerScroll) {
          this.sellerScroll = new BScroll(this.$refs.sellerWrapper, {
            click: true
          })
        } else {
          this.sellerScroll.refresh()
        }
      },
      fuzzySearch() {
        if (this.keyword.trim() === '') {
          return
        }
        let keyword = {
          keyword: this.keyword
        }
        this.loading = true

        Service.fuzzySearch(keyword)
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              this.sellers = res.data
            }
            setTimeout(() => {
              this.loading = false
            }, 1000)
          })
      },
      ...mapMutations({
        setSeller: 'SET_SELLER',
        setGoods: 'SET_GOODS'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .header-wrapper
    position: relative
    top: 0
    width: 100%
    height: 60px
    z-index: 10
    color: #fff
    overflow: hidden
    background: dodgerblue
    .text
      position: relative
      text-align: center
      height: 20px
      line-height: 20px
      font-size: 24px
      margin: 24px
  .search-wrapper
    position: relative
    height: 40px
    z-index: 10
  .seller-wrapper
    position: absolute
    left: 0
    top: 100px
    bottom: 0px
    width: 100%
    .seller-item
      display: flex
      border-1px(rgba(7, 17, 27, 1))
      &:last-child
        border-none()
        margin-bottom: 0
      .avatar-wrapper
        flex: 0 0 72px
        margin-right: 10px
        margin-left: 36px
      .content-wrapper
        flex: 1
        position: relative
        margin: 8px 36px 8px 36px
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .description
          font-size: 10px
          color: rgb(147, 153, 159)
          line-height: 12px
          margin-bottom: 8px
        .count-wrapper
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
          .count
            margin-right: 12px
          .icon-thumb_up
            display: inline-block
            margin: 0 8px 4px 0
            font-size: 12px
            color: rgb(0, 160, 220)
          .rating
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)
</style>
