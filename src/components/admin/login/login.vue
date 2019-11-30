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
                  this.login(res.token)
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
      ...mapMutations({
        login: 'LOGIN'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .vue-title
    margin-top: 30px
    text-align: center
    font-size: 45pt
    margin-bottom: 10px
  .login-table
    width: 40%
    margin: 0 auto
</style>
