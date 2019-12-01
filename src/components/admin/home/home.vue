<template>
  <div class="home">
    <b-navbar toggleable="md" variant="dark" type="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <img src="../../../assets/mevnnav.png" class="img-circle" style="padding: 5px">
      <b-navbar-brand to="/admin/index">Take-Away Backend Management</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/admin/index"><i class="fa fa-home" style="padding: 5px">Home</i></b-nav-item>
          <b-nav-item to="/admin/users"><i class="fa fa-list" style="padding: 5px">Users</i></b-nav-item>
          <b-nav-item to="/admin/sellers"><i class="fa fa-list" style="padding: 5px">Sellers</i></b-nav-item>
          <b-nav-item to="/admin/orders"><i class="fa fa-list" style="padding: 5px">Orders</i></b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-show="!token || Object.keys(account).length === 0" to="/admin/login"><i class="fa fa-sign-in" style="padding:5px;font-size:18px;">Login</i></b-nav-item>
          <div v-show="token && Object.keys(account).length !== 0" style="display:flex;font-size:0;height:50px;line-height:50px;">
            <el-avatar :size="50" :src="account.avatar" style="flex: 0 0 50px"></el-avatar>
            <span style="display:inline-block;vertical-align:top;height:50px;line-height:50px;font-size:20px;color:rgba(255,255,255,0.5);padding-left:5px;">{{account.name}}</span>
            <b-nav-item @click="signOut" style="flex:1;"><i class="fa fa-sign-out" style="padding:5px;font-size:18px;">Logout</i></b-nav-item>
          </div>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'token',
        'account'
      ])
    },
    methods: {
      signOut() {
        this.$message({
          showClose: true,
          message: 'Successfully Logout',
          type: 'success',
          center: true,
          duration: 1000
        })
        this.logout()
        this.setAccount({})
        setTimeout(() => {
          this.$router.push('/admin')
        }, 1500)
      },
      ...mapMutations({
        logout: 'LOGOUT',
        setAccount: 'SET_ACCOUNT'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .home
    text-align: center
</style>
