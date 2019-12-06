<template>
  <div class="home">
    <el-drawer
      :visible.sync="drawer"
      :with-header="false"
      direction="ltr"
      :show-close="false"
      class="drawer-wrapper"
    >
      <h1>TODO</h1>
    </el-drawer>
    <el-menu
      :default-active="defaultActive"
      class="nav-wrapper"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      style="display:flex;height:60px;border:none;">
      <div style="flex:0 0 100px;display:flex;justify-content:center;align-items:center;">
        <el-button type="info" style="background-color:rgba(84,92,100,1);border:none;" @click="toggleDrawer" :icon="drawer ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></el-button>
      </div>
      <el-menu-item index="1">
        <router-link tag="a" to="/admin/index" class="nav-item">Home</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link tag="a" to="/admin/users" class="nav-item">Users</router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <router-link tag="a" to="/admin/sellers" class="nav-item">Sellers</router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <router-link tag="a" to="/admin/orders" class="nav-item">Orders</router-link>
      </el-menu-item>
      <el-menu-item index="5" v-if="!token || Object.keys(account).length === 0" style="position:absolute;right:0;margin-right:10px;width:200px;text-align:center;">
        <router-link tag="a" to="/admin/login" class="nav-item"><i class="fa fa-sign-in"></i> Login</router-link>
      </el-menu-item>
      <el-submenu index="6" v-else style="position:absolute;right:0;margin-right:10px;width:200px;">
        <template slot="title">
          <el-avatar :size="40" :src="account.avatar"></el-avatar>
          <span style="padding-left:30px;padding-right:40px;">{{account.name}}</span>
        </template>
        <el-menu-item index="6-1" @click="signOut" style="text-align:center;"><i class="fa fa-sign-out"></i> Logout</el-menu-item>
      </el-submenu>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    data() {
      return {
        drawer: false,
        defaultActive: '1'
      }
    },
    computed: {
      ...mapGetters([
        'token',
        'account'
      ])
    },
    methods: {
      toggleDrawer() {
        this.drawer = !this.drawer
      },
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
    .nav-wrapper
      .nav-item
        text-decoration: none
        width: 100%
        height: 100%
        display: inline-table
        text-align: center
</style>
