<template>
  <div class="userslist-wrapper">
    <h3 class="vue-title"><i class="fa fa-list" style="padding: 3px"></i>{{messageTitle}}</h3>
    <div class="users-table">
      <v-client-table v-loading.fullscreen.lock="loading" element-loading-background="rgb(255, 255, 255)" :columns="columns" :data="users" :options="options" label-width="auto">
        <div slot="child_row" slot-scope="props">
          <el-form :model="props.row" status-icon label-width="100px" style="position:relative;width: 50%;margin:auto;">
            <el-form-item label="Username" prop="username">
              <el-card shadow="never">
                <span>{{props.row.username}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="Phone" prop="phone">
              <el-card shadow="never">
                <span>{{props.row.phone}}</span>
              </el-card>
            </el-form-item>
            <el-form-item label="Address" prop="address">
              <ul>
                <li class="address-item" v-for="(address, index) in props.row.address" :key="index">
                  <el-card shadow="never">
                    <span>{{address}}</span>
                  </el-card>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label="Pay" prop="pay">
              <ul>
                <li class="pay-item" v-for="(pay, index) in props.row.pay" :key="index">
                  <el-card shadow="never">
                    <span>{{pay}}</span>
                  </el-card>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label="Favorite" prop="favorite">
              <ul>
                <li class="favorite-item" v-for="(favorite, index) in props.row.favorite" :key="index">
                  <el-card shadow="never">
                    <span>{{favorite}}</span>
                  </el-card>
                </li>
              </ul>
            </el-form-item>
          </el-form>
        </div>
        <a slot="edit" slot-scope="props" class="el-icon-setting" @click="editUser(props.row._id)"></a>
        <a slot="remove" slot-scope="props" class="el-icon-delete" @click="deleteUser(props.row._id)"></a>
      </v-client-table>
      <div class="tab">
        <div class="tab-item">
          <router-link to="/admin/users/add" tag="a">Add User</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import Vue from 'vue'
  import VueTables from 'vue-tables-2'

  Vue.use(VueTables.ClientTable, {compileTemplates: true, filterByColumn: true})

  const ERR_OK = 0

  export default {
    data() {
      return {
        messageTitle: 'User List',
        loading: true,
        users: [],
        errors: [],
        columns: ['_id', 'username', 'phone', 'edit', 'remove'],
        options: {
          headings: {
            _id: 'ID',
            username: 'Username',
            phone: 'Phone'
          },
          sortables: ['username', 'phone'],
          perPage: 10,
          filterable: ['username', 'phone'],
          uniqueKey: '_id'
        },
        props: [
          '_id'
        ]
      }
    },
    created () {
      this._initializeUsers()
    },
    methods: {
      _initializeUsers() {
        Service.getUsers()
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              this.users = res.data
              setTimeout(() => {
                this.loading = false
              }, 1000)
            }
          })
          .catch((err) => {
            this.errors.push(err)
          })
      },
      deleteUser(id) {
        this.$confirm('This operation will delete the user, continue?', 'Tips', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          Service.deleteUser(id)
            .then((response) => {
              let res = response.data
              if (res.code === ERR_OK) {
                this.$message({
                  showClose: true,
                  message: 'Successfully deleting one user',
                  type: 'success',
                  center: true,
                  duration: 1000
                })
                setTimeout(() => {
                  this._initializeUsers()
                }, 1500)
              }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel deleting'
          })
        })
      },
      editUser(id) {
        this.$router.params = id
        this.$router.push('/admin/users/edit')
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .vue-title
    margin-top: 30px
    text-align: center
    font-size: 45pt
    margin-bottom: 10px
  .users-table
    width: 80%
    margin: 0 auto
    .address-item, .pay-item, .favorite-item
      position: relative
      width: 100%
    .slot
      display: table
      margin: 0 auto
    .tab
      display: flex
      position: relative
      bottom: 50px
      float: right
      height: 40px
      line-height: 40px
      .tab-item
        flex: 1
        text-align: center
        border-radius: 10px
        padding-left: 5px
        padding-right: 5px
        border: solid black 1px
        & > a
          display: block
          text-decoration: none
          font-size: 18px
          color: rgb(77, 85, 93)
          &.active
            color: rgb(240, 20, 20)
</style>
