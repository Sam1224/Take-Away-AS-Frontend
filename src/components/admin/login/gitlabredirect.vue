<template>
  <div class="redirect"></div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapMutations } from 'vuex'
  import axios from 'axios'

  const ERR_OK = 0
  const GITLAB = 'gitlab'

  export default {
    data() {
      return {
        gitlabConfig: {
          app_id: 'cd768aeb6419ef7370f2e390990dc8850bc4abab86d2631137c303bf09141a92',
          secret_id: '11efcd87a92963e0f9dbc80653de8fa516afd86c96197ed95e3e1412e39e97e5',
          redirectURL: 'http://localhost:8080/admin/gitlabredirect',
          scope: 'read_user+profile',
          state: 'Sam',
          getCodeURL: 'https://gitlab.com/oauth/authorize',
          getAccessTokenURL: '/gitlab/oauth/token',
          getUserURL: '/gitlab/api/v4/user',
          code: null,
          accessToken: null
        }
      }
    },
    mounted() {
      let code = this.$route.query.code
      this.gitlabConfig.code = code
      if (code) {
        this.getAccessToken()
      }
    },
    methods: {
      getAccessToken() {
        axios.post(`${this.gitlabConfig.getAccessTokenURL}?client_id=${this.gitlabConfig.app_id}&client_secret=${this.gitlabConfig.secret_id}&code=${this.gitlabConfig.code}&grant_type=authorization_code&redirect_uri=${this.gitlabConfig.redirectURL}`, {}, {
          headers: {
            'accept': 'application/json'
          }
        })
          .then((response) => {
            this.gitlabConfig.accessToken = response.data.access_token
            this.getGitlabInfo()
          })
      },
      getGitlabInfo() {
        axios.get(`${this.gitlabConfig.getUserURL}?access_token=${this.gitlabConfig.accessToken}`, {}, {
          headers: {
            'accept': 'application/json'
          }
        })
          .then((response) => {
            let profile = response.data
            let account = {
              username: profile.username,
              name: profile.name,
              avatar: profile.avatar_url,
              type: GITLAB
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
