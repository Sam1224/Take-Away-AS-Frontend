<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    font-family: 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
  .VueTables__sortable
    cursor: pointer
  .VueTables__child-row-toggler
    width: 16px
    height: 16px
    line-height: 16px
    display: block
    margin: auto
    text-align: center
  .VueTables__child-row-toggler--closed::before
    content: "+"
  .VueTables__child-row-toggler--open::before
    content: "-"
</style>
