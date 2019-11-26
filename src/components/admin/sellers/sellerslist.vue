<template>
  <div class="sellerslist-wrapper">
    <h3 class="vue-title"><i class="fa fa-list" style="padding: 3px"></i>{{messageTitle}}</h3>
    <div class="sellers-table">
      <v-client-table :columns="columns" :data="sellers" :options="options" label-width="auto">
        <a slot="edit" slot-scope="props" class="el-icon-setting" @click="editSeller(props.row._id)"></a>
        <a slot="remove" slot-scope="props" class="el-icon-delete" @click="deleteSeller(props.row._id)"></a>
      </v-client-table>
      <div class="tab">
        <div class="tab-item">
          <router-link to="/admin/sellers/add" tag="a">Add Seller</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import Vue from 'vue'
  import VueTables from 'vue-tables-2'
  import { mapGetters } from 'vuex'

  Vue.use(VueTables.ClientTable, {compileTemplates: true, filterByColumn: true})

  const ERR_OK = 0

  export default {
    data() {
      return {
        messageTitle: 'Seller List',
        sellers: [],
        errors: [],
        columns: ['_id', 'name', 'description', 'score', 'edit', 'remove'],
        options: {
          headings: {
            _id: 'ID',
            name: 'Name',
            description: 'Description',
            score: 'Score'
          },
          sortables: ['name', 'description', 'score'],
          perPage: 10,
          filterable: ['name', 'description', 'score']
        },
        props: [
          '_id'
        ]
      }
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    created () {
      this._initializeSellers()
    },
    methods: {
      _initializeSellers() {
        Service.getSellers()
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              this.sellers = res.data
            }
          })
          .catch((err) => {
            this.errors.push(err)
          })
      },
      deleteSeller(id) {
        this.$confirm('This operation will delete the seller, continue?', 'Tips', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          let seller = {
            token: this.token
          }
          Service.deleteSeller(id, seller)
            .then((response) => {
              let res = response.data
              if (res.code === ERR_OK) {
                this.$message({
                  showClose: true,
                  message: 'Successfully deleting one seller',
                  type: 'success',
                  center: true,
                  duration: 1000
                })
                setTimeout(() => {
                  this._initializeSellers()
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Cancel deleting'
          })
        })
      },
      editSeller(id) {
        this.$router.params = id
        this.$router.push('/admin/sellers/edit')
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
  .sellers-table
    width: 80%
    margin: 0 auto
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
