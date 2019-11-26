<template>
  <div class="userslist-wrapper">
    <h3 class="vue-title"><i class="fa fa-list" style="padding: 3px"></i>{{messageTitle}}</h3>
    <div class="users-table">
      <v-client-table :columns="columns" :data="users" :options="options" label-width="auto">
        <a slot="remove" slot-scope="props" class="slot fa fa-trash-o fa-2x" @click="deleteUser(props.row._id)"></a>
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
        users: [],
        errors: [],
        columns: ['_id', 'username', 'phone', 'remove'],
        options: {
          headings: {
            _id: 'ID',
            username: 'Username',
            phone: 'Phone'
          },
          sortables: ['username', 'phone']
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
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .VueTables__sortable
    cursor: pointer
  .vue-title
    margin-top: 30px
    text-align: center
    font-size: 45pt
    margin-bottom: 10px
  .users-table
    width: 80%
    margin: 0 auto
    .slot
      display: table
      margin: 0 auto
    .tab
      display: flex
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
