<template>
  <div class="index" v-loading.fullscreen.lock="loading" element-loading-text="Loading..." element-loading-background="rgb(255, 255, 255)">
    <div v-show="!loading" class="content-wrapper">
      <h1 class="vue-title">Welcome to the Backend of Take-Away App!</h1>
      <el-carousel :interval="3000" arrow="hover" class="slides">
        <el-carousel-item v-for="(food, index) in foods" :key="index">
          <el-image :src="food" fit="fill"></el-image>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        loading: true,
        foods: [
          require('../../../assets/food0.jpg'),
          require('../../../assets/food1.jpg'),
          require('../../../assets/food2.jpg'),
          require('../../../assets/food3.jpg'),
          require('../../../assets/food4.jpg'),
          require('../../../assets/food5.jpg'),
          require('../../../assets/food6.jpg'),
          require('../../../assets/food7.jpg'),
          require('../../../assets/food8.jpg')
        ]
      }
    },
    created() {
      this._initializeData()
    },
    methods: {
      _initializeData() {
        setTimeout(() => {
          this.loading = false
        }, 1000)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .index
    align-items: center
    justify-content: center
    text-align: center
    margin-top: 25px
    .content-wrapper
      text-align: center
      width: 1280px
      margin: 0 auto
      .vue-title
        font-size: 40px
        margin-bottom: 25px
      .slides
        .el-carousel__container
          width: 100%
          height: 480px
</style>
