<template>
  <div class="sellerhome">
    <v-header></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/sellerhome/goods" tag="a">Goods</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/sellerhome/ratings" tag="a">Ratings</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/sellerhome/seller" tag="a">Seller</router-link>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import header from '@/components/header/header.vue'
  import { mapMutations } from 'vuex'

  const ERR_OK = 0

  export default {
    data() {
      return {
        errors: [],
        seller: {
          id: '5dcac95b7c213e3a154265ec'
        }
      }
    },
    created() {
      // this.getSeller()
    },
    methods: {
      getSeller () {
        Service.getOneSeller(this.seller.id)
          .then(response => {
            let res = response.data
            if (res.code === ERR_OK) {
              let seller = res.data[0]
              this.seller = seller
              // // Vuex
              this.setSeller(seller)
              this.setGoods(seller.goods)
            }
          })
          .catch(error => {
            this.errors.push(error)
          })
      },
      getGoods () {
        this.$router.params = this.seller.id
        this.$router.push('/sellerhome/goods')
          .catch((err) => {
          this.errors.push(err)
        })
      },
      getRatings () {
        this.$router.params = this.seller.id
        this.$router.push('/sellerhome/ratings')
          .catch((err) => {
            this.errors.push(err)
          })
      },
      getSellers () {
        this.$router.params = this.seller.id
        this.$router.push('/sellerhome/seller')
          .catch((err) => {
            this.errors.push(err)
          })
      },
      ...mapMutations({
        setSeller: 'SET_SELLER',
        setGoods: 'SET_GOODS'
      })
    },
    components: {
      'v-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'

  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    .tab-item
      flex: 1
      text-align: center
      border-1px(rgba(7, 17, 27, 0.1))
      & > a
        display: block
        text-decoration: none
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
