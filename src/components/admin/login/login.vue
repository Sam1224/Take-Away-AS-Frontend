<template>
  <div class="login-wrapper">
    <h3 class="vue-title"><i class="fa fa-list" style="padding: 3px"></i>{{messageTitle}}</h3>
    <el-form ref="loginForm" :model="loginForm" status-icon :rules="rules" label-width="80px" class="login-table">
      <el-form-item label="Username" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('loginForm')">Login</el-button>
      </el-form-item>
      <el-form-item label="OtherLogin" prop="otherlogin">
        <div class="icon-wrapper">
          <span class="icon" @click="loginGoogle">
            <img :src="googleIcon" class="img" alt="Google">
          </span>
          <span class="icon" @click="loginGithub">
            <img :src="githubIcon" class="img" alt="Github">
          </span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapMutations, mapGetters } from 'vuex'
  import axios from 'axios'

  const ERR_OK = 0
  const AVATAR = 'http://static.galileo.xiaojukeji.com/static/tms/default_header.png'
  const DEFAULT = 'default'
  const GOOGLE = 'google'
  const GITHUB = 'github'

  export default {
    name: 'Login',
    data () {
      return {
        messageTitle: 'Login',
        loginForm: {
          username: '',
          password: '',
          checked: false
        },
        rules: {
          username: [
            { required: true, message: 'Please Enter Username' }
          ],
          password: [
            { required: true, message: 'Please Enter Password' }
          ]
        },
        googleIcon: 'https://camo.githubusercontent.com/62bb6eba282da108ffd78574e3c5ec775e9615f2/68747470733a2f2f67697465652e636f6d2f7961646f6e672e7a68616e672f7374617469632f7261772f6d61737465722f4a757374417574682f676f6f676c652e706e67',
        githubIcon: 'https://camo.githubusercontent.com/4e32805fc11673699795cabc24870b053f75e140/68747470733a2f2f67697465652e636f6d2f7961646f6e672e7a68616e672f7374617469632f7261772f6d61737465722f4a757374417574682f6769746875622e706e67',
        githubConfig: {
          client_id: '647b09a3a4f9bb530f27',
          client_secret: '9bcc6ff9cbd3847663f8b48c06c598246135bb9a',
          scope: 'user:email',
          state: 'Sam',
          getCodeURL: 'https://github.com/login/oauth/authorize',
          getAccessTokenURL: '/github/login/oauth/access_token',
          getUserURl: 'https://api.github.com/user',
          redirectURL: 'http://localhost:8080/admin/login',
          code: null,
          accessToken: null,
          signState: false
        }
      }
    },
    created () {
      this._initializeData()
    },
    mounted() {
      let code = this.$route.query.code
      this.githubConfig.code = code
      if (code) {
        this.getAccessToken()
      }
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    methods: {
      _initializeData() {
        if (this.token) {
          this.$router.push('/admin/index')
        }
      },
      onSubmit (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let user = {
              username: this.loginForm.username,
              password: this.loginForm.password
            }
            Service.login(user)
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
                  let account = {
                    username: user.username,
                    name: user.username,
                    avatar: AVATAR,
                    type: DEFAULT
                  }
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
          } else {
            return false
          }
        })
      },
      loginGoogle() {
        this.$gAuth.signIn()
          .then((googleUser) => {
            let profile = googleUser.getBasicProfile()
            let account = {
              username: profile.U3,
              name: profile.ig,
              avatar: profile.Paa,
              type: GOOGLE
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
      loginGithub() {
        window.location.href = `${this.githubConfig.getCodeURL}?response_type=code&client_id=${this.githubConfig.client_id}&redirect_url=${this.githubConfig.redirectURL}&state=${this.githubConfig.state}&scope=${this.githubConfig.scope}`
      },
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
  span:hover
    cursor: pointer
  .vue-title
    margin-top: 30px
    text-align: center
    font-size: 45pt
    margin-bottom: 10px
  .login-table
    width: 40%
    margin: 0 auto
    .icon-wrapper
      position: relative
      display: flex
      margin-top: 8px
      margin-left: 20px
      .icon
        display: 0 0 25px
        margin-right: 15px
        .img
          width: 25px
          height: 25px
          border-radius: 50%
</style>
