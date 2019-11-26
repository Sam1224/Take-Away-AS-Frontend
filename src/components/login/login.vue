<template>
  <div class="login">
    <div class="header-wrapper">
      <h1 class="text">{{title}}</h1>
    </div>
    <el-form ref="loginForm" v-if="!isLogin" :model="loginForm" status-icon :rules="rules" label-width="80px" class="login-form">
      <el-form-item label="Username" prop="username">
        <el-input v-model="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="loginForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('loginForm')">Login</el-button>
        <br>
        <router-link to="/register">No account? Register now</router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapMutations, mapGetters } from 'vuex'

  const ERR_OK = 0

  export default {
    name: 'Login',
    data () {
      return {
        title: 'Login',
        isLogin: false,
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
        }
      }
    },
    mounted () {
      this.isLogin = this.token
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    methods: {
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
                  this.login(res.token)
                  this.loginForm.username = ''
                  this.loginForm.password = ''
                  this.$router.push({ path: '/' })
                }
              })
          } else {
            return false
          }
        })
      },
      ...mapMutations({
        login: 'LOGIN'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .header-wrapper
    position: relative
    top: 0
    width: 100%
    height: 60px
    z-index: 10
    color: #fff
    overflow: hidden
    background: dodgerblue
    .text
      position: relative
      text-align: center
      height: 20px
      line-height: 20px
      font-size: 24px
      margin: 24px
  .login-form
    position: relative
    top: 60px
    width: 80%
    margin: 20px auto auto
    padding: 20px
    border: 1px solid #ddd
</style>
