<template>
  <div class="users">
    <h3 class="vue-title"><i class="fa fa-list" style="padding: 3px"></i>{{messageTitle}}</h3>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        messageTitle: 'User List'
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
</style>
