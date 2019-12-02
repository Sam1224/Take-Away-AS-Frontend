<template>
  <div class="redirect"></div>
</template>

<script type="text/ecmascript-6">
  import { mapMutations } from 'vuex'
  import axios from 'axios'

  const ERR_OK = 0

  export default {
    data() {
      return {
        weiboConfig: {
          client_id: '4195182896',
          client_secret: '577c9eb2eaf2534d64679cf2c886c727',
          redirect_uri: 'https://takeawayapp-88d06.firebaseapp.com/admin/weiboredirect',
          scope: 'all',
          state: 'Sam',
          getCodeURL: 'https://api.weibo.com/oauth2/authorize',
          getAccessTokenURL: 'https://takeawayapp-sam.herokuapp.com/loginWeibo',
          getUserURL: '/weibo/2/users/show.json',
          code: null,
          accessToken: null,
          uid: ''
        }
      }
    },
    mounted() {
      let code = this.$route.query.code
      this.weiboConfig.code = code
      if (code) {
        this.getAccessToken()
      }
    },
    methods: {
      getAccessToken() {
        axios.get(`${this.weiboConfig.getAccessTokenURL}?grant_type=authorization_code&code=${this.weiboConfig.code}&client_id=${this.weiboConfig.client_id}&redirect_uri=${this.weiboConfig.redirect_uri}&client_secret=${this.weiboConfig.client_secret}`, {}, {
          headers: {
            'accept': 'application/json'
          }
        })
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              this.$message({
                showClose: true,
                message: 'Successfully Login',
                type: 'success',
                center: true,
                duration: 1000
              })
              this.login(res.token)
              this.setAccount(res.account)
              setTimeout(() => {
                this.$router.push('/admin/index')
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
      },
      ...mapMutations({
        login: 'LOGIN',
        setAccount: 'SET_ACCOUNT'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
