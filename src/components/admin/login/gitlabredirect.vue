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
          app_id: '55ee814d9f753bfdb7e76a6053987b8eac33575c9e43cfca10e087f19849b7bb',
          secret_id: '558c93119c11ac2ed964bac31ac7e8069a10644985352079049b6dd00867d777',
          redirectURL: 'https://takeawayapp-88d06.firebaseapp.com/admin/gitlabredirect',
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
