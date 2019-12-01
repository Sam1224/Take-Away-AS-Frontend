<template>
  <div class="redirect"></div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapMutations } from 'vuex'
  import axios from 'axios'

  const ERR_OK = 0
  const GITEE = 'gitee'

  export default {
    data() {
      return {
        giteeConfig: {
          client_id: 'be2a4ea3ee9855e62a174786359fd3833fd591cd920ead21f46ef2e92be5c712',
          client_secret: '17dd85e76cafab22cf107b0f2a716c7b162222a15340b23c40d467e896765b00',
          redirect_uri: 'http://localhost:8080/admin/giteeredirect',
          scope: 'user_info',
          state: 'Sam',
          getCodeURL: 'https://gitee.com/oauth/authorize',
          getAccessTokenURL: '/gitee/oauth/token',
          getUserURL: '/gitee/api/v5/user',
          code: null,
          accessToken: null
        }
      }
    },
    mounted() {
      let code = this.$route.query.code
      this.giteeConfig.code = code
      if (code) {
        this.getAccessToken()
      }
    },
    methods: {
      getAccessToken() {
        axios.post(`${this.giteeConfig.getAccessTokenURL}?grant_type=authorization_code&code=${this.giteeConfig.code}&client_id=${this.giteeConfig.client_id}&redirect_uri=${this.giteeConfig.redirect_uri}&client_secret=${this.giteeConfig.client_secret}`, {}, {
          headers: {
            'accept': 'application/json'
          }
        })
          .then((response) => {
            this.giteeConfig.accessToken = response.data.access_token
            this.getGiteeInfo()
          })
      },
      getGiteeInfo() {
        axios.get(`${this.giteeConfig.getUserURL}?access_token=${this.giteeConfig.accessToken}`, {}, {
          headers: {
            'accept': 'application/json'
          }
        })
          .then((response) => {
            let profile = response.data
            let account = {
              username: profile.login,
              name: profile.name,
              avatar: profile.avatar_url,
              type: GITEE
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
