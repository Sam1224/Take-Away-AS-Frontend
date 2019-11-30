<template>
  <div class="redirect"></div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapMutations } from 'vuex'
  import axios from 'axios'

  const ERR_OK = 0
  const GITHUB = 'github'

  export default {
    data() {
      return {
        githubConfig: {
          client_id: '647b09a3a4f9bb530f27',
          client_secret: '9bcc6ff9cbd3847663f8b48c06c598246135bb9a',
          scope: 'user:email',
          state: 'Sam',
          getCodeURL: 'https://github.com/login/oauth/authorize',
          getAccessTokenURL: '/github/login/oauth/access_token',
          getUserURl: 'https://api.github.com/user',
          redirectURL: 'http://localhost:8080/admin/githubredirect',
          code: null,
          accessToken: null,
          signState: false
        }
      }
    },
    mounted() {
      let code = this.$route.query.code
      this.githubConfig.code = code
      if (code) {
        this.getAccessToken()
      }
    },
    methods: {
      getAccessToken() {
        axios.post(`${this.githubConfig.getAccessTokenURL}?client_id=${this.githubConfig.client_id}&client_secret=${this.githubConfig.client_secret}&code=${this.githubConfig.code}`, {}, {
          headers: {
            'accept': 'application/json'
          }
        })
          .then((response) => {
            this.githubConfig.accessToken = response.data.access_token
            this.getGithubInfo()
          })
      },
      getGithubInfo() {
        axios.get(`${this.githubConfig.getUserURl}?access_token=${this.githubConfig.accessToken}`, {}, {
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
              type: GITHUB
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
