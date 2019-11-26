<template>
  <div class="users">
    <h3 class="vue-title"><i class="fa fa-list" style="padding: 3px"></i>{{messageTitle}}</h3>
    <div class="users-table">
      <v-client-table :columns="columns" :data="users" :options="options"></v-client-table>
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
        columns: ['_id', 'username', 'phone', 'address', 'pay', 'favorite'],
        options: {
          headings: {
            _id: 'ID',
            username: 'Username',
            phone: 'Phone',
            address: 'Address',
            pay: 'Pay',
            favorite: 'Favorite'
          }
        }
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
              console.log(res.data)
            }
          })
          .catch((err) => {
            this.errors.push(err)
          })
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
</style>
