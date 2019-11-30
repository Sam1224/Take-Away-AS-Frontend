<template>
  <div class="index" v-loading.fullscreen.lock="loading" element-loading-text="Loading..." element-loading-background="rgb(255, 255, 255)">
    <div v-show="!loading" class="content-wrapper">
      <h1 class="vue-title">Take-Away Backend</h1>

      <table align="center">
        <tr>
          <td>
            <p class="lead"><b><i>Time for a change !!</i></b></p>
          </td>
          <td>
            <img src="../../../assets/homer.gif" alt="description here" />
          </td>
        </tr>
      </table>

      <p></p>
      <p class="lead">This is the homepage of your <b>MEVN</b> Web app</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        loading: true
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
    height: 100vh
    margin-top: 30px
    align-items: center
    justify-content: center
    text-align: center
    .vue-title
      font-size: 70pt
      margin-bottom: 10px
    .lead
      font-weight: 200
      font-size: 2.5rem
    .bg
      position: absolute
      width: 100%
      height: 100%
      z-index: 10
      color: white
</style>
