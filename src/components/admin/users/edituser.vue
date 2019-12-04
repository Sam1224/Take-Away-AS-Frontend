<template>
  <div class="edit-wrapper" v-show="!loading">
    <h2 class="title">{{title}}</h2>
    <el-form v-loading.fullscreen.lock="loading" element-loading-text="Loading..." element-loading-background="rgb(255, 255, 255)" ref="userForm" :model="userForm" status-icon label-width="100px" class="user-table" :rules="rules">
      <el-form-item label="Username" prop="username">
        <el-input v-model="userForm.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="userForm.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Phone" prop="phone">
        <el-input v-model="userForm.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Address" prop="address">
        <ul v-if="userForm.address.length !== 0">
          <li class="address-item" v-for="(address, index) in userForm.address" :key="index">
            <div class="input-wrapper">
              <el-input v-if="userForm.address[index].status === 0" v-model="userForm.address[index].text" auto-complete="off" disabled></el-input>
              <div v-else>
                <el-form-item>
                  <googlemap @selectPlace="submitAddress($event, index)"></googlemap>
                </el-form-item>
              </div>
            </div>
            <div class="icon-wrapper">
              <i v-if="userForm.address[index].status === 0" class="iconBtn el-icon-remove-outline" @click="delAddress(index)"></i>
              <i v-else class="iconBtn el-icon-remove-outline" @click="removeAddress(index)"></i>
              <i class="iconBtn" :class="{'el-icon-circle-plus-outline': userForm.address.length - 1 === index}" @click="addAddress(index)"></i>
            </div>
          </li>
        </ul>
        <ul v-else>
          <li class="address-item">
            <div class="icon-wrapper">
              <i class="iconBtn el-icon-circle-plus-outline" @click="addAddress(0)"></i>
            </div>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="Pay" prop="pay">
        <ul v-if="userForm.pay.length !== 0">
          <li class="pay-item" v-for="(pay, index) in userForm.pay" :key="index">
            <div class="input-wrapper">
              <el-input v-model="userForm.pay[index]" auto-complete="off"></el-input>
            </div>
            <div class="icon-wrapper">
              <i class="iconBtn el-icon-remove-outline" @click="delPay(index)"></i>
              <i class="iconBtn" :class="{'el-icon-circle-plus-outline': userForm.pay.length - 1 === index}" @click="addPay(index)"></i>
            </div>
          </li>
        </ul>
        <ul v-else>
          <li class="pay-item">
            <div class="icon-wrapper">
              <i class="iconBtn el-icon-circle-plus-outline" @click="addPay(0)"></i>
            </div>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="Favorite" prop="favorite">
        <ul v-if="userForm.favorite.length !== 0">
          <li class="favorite-item" v-for="(favorite, index) in userForm.favorite" :key="index">
            <div class="input-wrapper">
              <el-input v-model="userForm.favorite[index]" auto-complete="off"></el-input>
            </div>
            <div class="icon-wrapper">
              <i class="iconBtn el-icon-remove-outline" @click="delFavorite(index)"></i>
              <i class="iconBtn" :class="{'el-icon-circle-plus-outline': userForm.favorite.length - 1 === index}" @click="addFavorite(index)"></i>
            </div>
          </li>
        </ul>
        <ul v-else>
          <li class="favorite-item">
            <div class="icon-wrapper">
              <i class="iconBtn el-icon-circle-plus-outline" @click="addFavorite(0)"></i>
            </div>
          </li>
        </ul>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editUser">Edit User</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapGetters } from 'vuex'
  import Googlemap from '@/components/admin/googlemap/googlemap'

  const ERR_OK = 0

  export default {
    props: {
      id: String
    },
    data() {
      return {
        title: 'Edit User',
        loading: true,
        user: {},
        userForm: {
          username: '',
          password: '',
          phone: '',
          address: [{
            text: '',
            status: 0
          }],
          pay: [],
          favorite: []
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
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    created() {
      this._initializeUser(this.$router.params)
    },
    methods: {
      _initializeUser(id) {
        if (!this.$router.params) {
          this.$router.push('/admin/users')
        }
        Service.getOneUser(id)
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              let addresses = []
              res.data[0].address.forEach((address) => {
                addresses.push({
                  text: address,
                  status: 0
                })
              })
              res.data[0].address = addresses
              this.userForm = res.data[0]
              this.user = res.data[0]
              setTimeout(() => {
                this.loading = false
              }, 1000)
            }
          })
      },
      editUser() {
        let user = {
          username: this.userForm.username,
          password: this.userForm.password,
          phone: this.userForm.phone,
          token: this.token
        }

        Service.updateUser(user)
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
      cancel() {
        this.$router.push('/admin/users')
      },
      addAddress(index) {
        let newAddress = {
          text: '',
          status: 1
        }
        this.userForm.address.push(newAddress)
      },
      submitAddress(address, index) {
        this.userForm.address[index].text = address
        if (this.userForm.address[index].text !== '') {
          let address = {
            username: this.user.username,
            address: this.userForm.address[index].text,
            token: this.token
          }

          Service.addAddress(address)
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
                this.userForm.address[index].status = 0
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
      },
      removeAddress(index) {
        if (this.userForm.address.length === 1) {
          this.userForm.address[0].text = ''
          this.userForm.address[0].status = 1
          return
        }
        this.userForm.address.splice(index, 1)
      },
      delAddress(index) {
        let address = {
          username: this.user.username,
          address: this.userForm.address[index].text,
          token: this.token
        }
        this.$confirm('This operation will delete this address, continue?', 'Tips', {
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          Service.deleteAddress(address)
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
                if (this.userForm.address.length === 1) {
                  this.userForm.address[0] = ''
                  return
                }
                this.userForm.address.splice(index, 1)
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
        }).catch(() => {
          this.$message({
            showClose: true,
            message: 'Cancel deleting address',
            type: 'info',
            center: true,
            duration: 1000
          })
        })
      },
      addPay(index) {
        this.$prompt('Please enter your pay', 'Tips', {
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel'
        }).then(({ value }) => {
          let pay = {
            username: this.user.username,
            pay: value,
            token: this.token
          }

          Service.addPay(pay)
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
                let newPay = value
                this.userForm.pay.push(newPay)
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
        }).catch(() => {
          this.$message({
            showClose: true,
            message: 'Cancel adding pay',
            type: 'info',
            center: true,
            duration: 1000
          })
        })
      },
      delPay(index) {
        let pay = {
          username: this.user.username,
          pay: this.userForm.pay[index],
          token: this.token
        }
        this.$confirm('This operation will delete this pay, continue?', 'Tips', {
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          Service.deletePay(pay)
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
                if (this.userForm.pay.length === 1) {
                  this.userForm.pay[0] = ''
                  return
                }
                this.userForm.pay.splice(index, 1)
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
        }).catch(() => {
          this.$message({
            showClose: true,
            message: 'Cancel deleting pay',
            type: 'info',
            center: true,
            duration: 1000
          })
        })
      },
      addFavorite(index) {
        this.$prompt('Please enter your favorite seller', 'Tips', {
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel'
        }).then(({ value }) => {
          let favorite = {
            username: this.user.username,
            favorite: value,
            token: this.token
          }

          Service.addFavorite(favorite)
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
                let newFavorite = value
                this.userForm.favorite.push(newFavorite)
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
        }).catch(() => {
          this.$message({
            showClose: true,
            message: 'Cancel adding favorite',
            type: 'info',
            center: true,
            duration: 1000
          })
        })
      },
      delFavorite(index) {
        let favorite = {
          username: this.user.username,
          favorite: this.userForm.favorite[index],
          token: this.token
        }
        this.$confirm('This operation will delete this favorite seller, continue?', 'Tips', {
          confirmButtonText: 'Submit',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          Service.deleteFavorite(favorite)
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
                if (this.userForm.favorite.length === 1) {
                  this.userForm.favorite[0] = ''
                  return
                }
                this.userForm.favorite.splice(index, 1)
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
        }).catch(() => {
          this.$message({
            showClose: true,
            message: 'Cancel deleting favorite seller',
            type: 'info',
            center: true,
            duration: 1000
          })
        })
      }
    },
    components: {
      Googlemap
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .edit-wrapper
    position: relative
    font-size: 0
    text-align: center
    .title
      font-size: 36px
      margin-top: 36px
    .user-table
      position: relative
      width: 60%
      top: 50px
      margin: 0 auto
    .address-item, .pay-item, .favorite-item
      position: relative
      display: flex
      .input-wrapper
        flex: 0 0 90%
      .icon-wrapper
        flex: 1
        position: relative
        .iconBtn
          position: relative
          top: 15px
</style>
