<template>
  <div class="redirect"></div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapMutations } from 'vuex'
  import axios from 'axios'

  const ERR_OK = 0
  const WECHAT = 'wechat'

  export default {
    data () {
      return {
        wechatConfig: {
          app_id: 'wx02989b05866416be',
          secret_id: '011ebb2b151848bbae53c37ab8a5839b',
          redirectURL: 'https://take-away-app-frontend.firebaseapp.com/admin/wechatredirect',
          scope: 'snsapi_base,snsapi_userinfo',
          state: 'Sam',
          getCodeURL: 'https://open.weixin.qq.com/connect/qrconnect',
          getAccessTokenURL: 'https://api.weixin.qq.com/sns/oauth2/access_token',
          getUserURL: 'https://api.weixin.qq.com/sns/userinfo',
          code: null,
          accessToken: null
        }
      }
    },
    mounted () {
      let code = this.$route.query.code
      this.wechatConfig.code = code
      if (code) {
        this.getAccessToken()
      }
    },
    methods: {
      getAccessToken () {
        axios.post(`${this.wechatConfig.getAccessTokenURL}?appid=${this.wechatConfig.app_id}&secret=${this.wechatConfig.secret_id}&code=${this.wechatConfig.code}&grant_type=authorization_code`, {}, {
          headers: {
            'accept': 'application/json'
          }
        })
          .then((response) => {
            console.log(response.data)
            this.wechatConfig.accessToken = response.data.access_token
            // this.getGitlabInfo()
          })
      },
      getGitlabInfo () {
        axios.get(`${this.wechatConfig.getUserURL}?access_token=${this.wechatConfig.accessToken}&openid=${this.wechatConfig.app_id}`, {}, {
          headers: {
            'accept': 'application/json'
          }
        })
          .then((response) => {
            let profile = response.data
            let account = {
              username: profile.nickname,
              name: profile.nickname,
              avatar: profile.headimgurl,
              type: WECHAT
            }
            Service.getToken(account.username)
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
                  this.setAccount(account)
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
