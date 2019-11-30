<template>
  <div class="home">
    <b-navbar toggleable="md" variant="dark" type="dark">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <img src="../../../assets/mevnnav.png" class="img-circle" style="padding: 5px">
      <b-navbar-brand to="/admin">Take-Away Backend Management</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/admin"><i class="fa fa-home" style="padding: 5px">Home</i></b-nav-item>
          <b-nav-item to="/admin/users"><i class="fa fa-list" style="padding: 5px">Users</i></b-nav-item>
          <b-nav-item to="/admin/sellers"><i class="fa fa-list" style="padding: 5px">Sellers</i></b-nav-item>
          <b-nav-item to="/admin/orders"><i class="fa fa-list" style="padding: 5px">Orders</i></b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="/login"><i class="fa fa-sign-in" style="padding: 5px">Login</i></b-nav-item>
          <b-nav-item @click="signOut"><i class="fa fa-sign-out" style="padding: 5px">Logout</i></b-nav-item>
          <i class="fa fa-pied-piper-alt fa-1x" style="padding: 5px; color: white;"></i>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapMutations } from 'vuex'

  export default {
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
        setTimeout(() => {
          this.$router.push('/admin')
        }, 1500)
      },
      ...mapMutations({
        logout: 'LOGOUT'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .home
    text-align: center
</style>
