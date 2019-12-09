<template>
  <div class="login-wrapper">
    <h3 class="vue-title"><i class="fa fa-list" style="padding: 3px"></i>{{messageTitle}}</h3>
    <el-form ref="loginForm" :model="loginForm" status-icon :rules="rules" label-width="80px" class="login-table">
      <el-form-item label="Username" prop="username">
        <el-input class="username" v-model="loginForm.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input class="password" type="password" v-model="loginForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" type="primary" @click="onSubmit('loginForm')">Login</el-button>
      </el-form-item>
      <el-form-item label="OtherLogin" prop="otherlogin">
        <div class="icon-wrapper">
          <span class="icon" @click="loginGoogle">
            <img :src="googleIcon" class="img" alt="Google">
          </span>
          <span class="icon" @click="loginGithub">
            <img :src="githubIcon" class="img" alt="Github">
          </span>
          <span class="icon" @click="loginGitlab">
            <img :src="gitlabIcon" class="img" alt="Gitlab">
          </span>
          <span class="icon" @click="loginGitee">
            <img :src="giteeIcon" class="img" alt="Gitee">
          </span>
          <span class="icon" @click="loginBitbucket">
            <img :src="bitbucketIcon" class="img" alt="Bitbucket">
          </span>
          <span class="icon" @click="loginWeibo">
            <img :src="weiboIcon" class="img" alt="Weibo">
          </span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapMutations, mapGetters } from 'vuex'

  const ERR_OK = 0
  const AVATAR = 'http://static.galileo.xiaojukeji.com/static/tms/default_header.png'
  const DEFAULT = 'default'
  const GOOGLE = 'google'
  // eslint-disable-next-line no-unused-vars
  const GITHUB = 'github'
  // eslint-disable-next-line no-unused-vars
  const GITLAB = 'gitlab'
  // eslint-disable-next-line no-unused-vars
  const GITEE = 'gitee'
  // eslint-disable-next-line no-unused-vars
  const BITBUCKET = 'bitbucket'
  // eslint-disable-next-line no-unused-vars
  const WEIBO = 'weibo'

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
        googleIcon: require('../../../assets/google-icon.png'),
        githubIcon: require('../../../assets/github-icon.png'),
        githubConfig: {
          client_id: '647b09a3a4f9bb530f27',
          client_secret: '9bcc6ff9cbd3847663f8b48c06c598246135bb9a',
          scope: 'user:email',
          state: 'Sam',
          getCodeURL: 'https://github.com/login/oauth/authorize',
          getAccessTokenURL: '/github/login/oauth/access_token',
          getUserURl: 'https://api.github.com/user',
          redirectURL: 'https://takeawayapp-88d06.firebaseapp.com/admin/githubredirect',
          code: null,
          accessToken: null,
          signState: false
        },
        gitlabIcon: require('../../../assets/gitlab-icon.png'),
        gitlabConfig: {
          app_id: '55ee814d9f753bfdb7e76a6053987b8eac33575c9e43cfca10e087f19849b7bb',
          secret_id: '558c93119c11ac2ed964bac31ac7e8069a10644985352079049b6dd00867d777',
          redirectURL: 'https://takeawayapp-88d06.firebaseapp.com/admin/gitlabredirect',
          scope: 'read_user+profile',
          state: 'Sam',
          getCodeURL: 'https://gitlab.com/oauth/authorize',
          getAccessTokenURL: '/gitlab/oauth/token',
          getUserURL: '/gitlab/api/v4/user',
          code: null,
          accessToken: null
        },
        giteeIcon: require('../../../assets/gitee-icon.png'),
        giteeConfig: {
          client_id: 'be2a4ea3ee9855e62a174786359fd3833fd591cd920ead21f46ef2e92be5c712',
          client_secret: '17dd85e76cafab22cf107b0f2a716c7b162222a15340b23c40d467e896765b00',
          redirect_uri: 'https://takeawayapp-88d06.firebaseapp.com/admin/giteeredirect',
          scope: 'user_info',
          state: 'Sam',
          getCodeURL: 'https://gitee.com/oauth/authorize',
          getAccessTokenURL: '/gitee/oauth/token',
          getUserURL: '/gitee/api/v5/user',
          code: null,
          accessToken: null
        },
        bitbucketIcon: require('../../../assets/bitbucket-icon.png'),
        bitbucketConfig: {
          client_id: 'sBxPceYExjFSBJDctK',
          client_secret: 'AyDFbpNSDTjgrJmHDVs2HTJ2zsHsLP3a',
          redirect_uri: 'https://takeawayapp-88d06.firebaseapp.com/admin/bitbucketredirect',
          scope: 'account',
          state: 'Sam',
          getCodeURL: 'https://bitbucket.org/site/oauth2/authorize',
          getAccessTokenURL: '/bitbucket/site/oauth2/access_token',
          getUserURL: '/bitbucket/api/v5/user',
          code: null,
          accessToken: null
        },
        weiboIcon: require('../../../assets/weibo-icon.png'),
        weiboConfig: {
          client_id: '4195182896',
          client_secret: '577c9eb2eaf2534d64679cf2c886c727',
          redirect_uri: 'https://takeawayapp-88d06.firebaseapp.com/admin/weiboredirect',
          scope: 'all',
          state: 'Sam',
          getCodeURL: 'https://api.weibo.com/oauth2/authorize',
          getAccessTokenURL: '/weibo/oauth2/access_token',
          getUserURL: '/weibo/2/users/show.json',
          code: null,
          accessToken: null
        }
      }
    },
    created () {
      this._initializeData()
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
      loginGitlab() {
        window.location.href = `${this.gitlabConfig.getCodeURL}?response_type=code&client_id=${this.gitlabConfig.app_id}&redirect_uri=${this.gitlabConfig.redirectURL}&state=${this.gitlabConfig.state}&scope=${this.gitlabConfig.scope}`
      },
      loginGitee() {
        window.location.href = `${this.giteeConfig.getCodeURL}?client_id=${this.giteeConfig.client_id}&redirect_uri=${this.giteeConfig.redirect_uri}&response_type=code&scope=${this.giteeConfig.scope}`
      },
      loginBitbucket() {
        window.location.href = `${this.bitbucketConfig.getCodeURL}?client_id=${this.bitbucketConfig.client_id}&redirect_uri=${this.bitbucketConfig.redirect_uri}&response_type=token&scope=${this.bitbucketConfig.scope}`
      },
      loginWeibo() {
        window.location.href = `${this.weiboConfig.getCodeURL}?client_id=${this.weiboConfig.client_id}&redirect_uri=${this.weiboConfig.redirect_uri}&response_type=code`
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
    margin-bottom: 30px
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
