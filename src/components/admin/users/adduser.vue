<template>
  <div class="add-wrapper">
    <h2 class="title">{{title}}</h2>
    <el-form ref="userForm" :model="userForm" status-icon label-width="100px" class="user-table" :rules="rules">
      <el-form-item label="Username" prop="username">
        <el-input v-model="userForm.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="userForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input v-model="userForm.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addUser">Add User</el-button>
        <el-button @click="reset">Reset</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapMutations } from 'vuex'

  const ERR_NOK = -1
  const ERR_OK = 0
  const USER_DUP = 2

  export default {
    data() {
      return {
        title: 'Add User',
        user: {},
        userForm: {
          username: '',
          password: '',
          phone: ''
        },
        rules: {
          username: [{
            required: true,
            message: 'Please enter username',
            trigger: 'blur'
          }, {
            min: 5,
            message: 'The length of username should be at least 5 characters'
          }],
          password: [{
            required: true,
            message: 'Please enter password',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: 'Please enter phone',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      addUser() {
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            let user = {
              username: this.userForm.username,
              password: this.userForm.password,
              phone: this.userForm.phone
            }

            Service.addUser(user)
              .then((response) => {
                let res = response.data
                if (res.code === ERR_OK) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success',
                    center: true,
                    duration: 1000
                  })
                  setTimeout(() => {
                    this.$router.push('/admin/users')
                  }, 1500)
                } else if (res.code === USER_DUP) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'warning',
                    center: true,
                    duration: 1000
                  })
                } else if (res.code === ERR_NOK && res.error.name === 'TokenExpiredError') {
                  this.$message({
                    showClose: true,
                    message: 'The token has expired, please login again',
                    type: 'warning',
                    center: true,
                    duration: 1000
                  })
                  setTimeout(() => {
                    this.logout()
                    this.setAccount({})
                    this.$router.push('/admin/login')
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
      reset() {
        this.$refs.userForm.resetFields()
      },
      cancel() {
        this.$router.push('/admin/users')
      },
      ...mapMutations({
        logout: 'LOGOUT',
        setAccount: 'SET_ACCOUNT'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .add-wrapper
    position: relative
    font-size: 0
    text-align: center
    .title
      font-size: 36px
      margin-top: 36px
    .user-table
      position: relative
      width: 40%
      top: 50px
      margin: 0 auto
</style>
