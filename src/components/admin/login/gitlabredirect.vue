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
        gitlabConfig: {
          app_id: 'cd768aeb6419ef7370f2e390990dc8850bc4abab86d2631137c303bf09141a92',
          secret_id: '11efcd87a92963e0f9dbc80653de8fa516afd86c96197ed95e3e1412e39e97e5',
          redirectURL: 'http://localhost:8080/admin/gitlabredirect',
          scope: 'read_user+profile',
          state: 'Sam',
          getCodeURL: 'https://gitlab.com/oauth/authorize',
          getAccessTokenURL: 'https://takeawayapp-sam.herokuapp.com/loginGitlab',
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
        axios.get(`${this.gitlabConfig.getAccessTokenURL}?client_id=${this.gitlabConfig.app_id}&client_secret=${this.gitlabConfig.secret_id}&code=${this.gitlabConfig.code}&grant_type=authorization_code&redirect_uri=${this.gitlabConfig.redirectURL}`, {}, {
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
