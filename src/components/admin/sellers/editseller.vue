<template>
  <div class="edit-wrapper" v-show="!loading">
    <h2 class="title">{{title}}</h2>
    <el-form v-loading.fullscreen.lock="loading" element-loading-text="Loading..." element-loading-background="rgb(255, 255, 255)" ref="sellerForm" :model="sellerForm" status-icon label-width="100px" class="seller-table" :rules="rules">
      <el-form-item label="Name" prop="name">
        <el-input v-model="sellerForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input v-model="sellerForm.description" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="DeliveryTime" prop="deliveryTime">
        <el-input v-model="sellerForm.deliveryTime" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Bulletin" prop="bulletin">
        <el-input v-model="sellerForm.bulletin" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Avatar" prop="avatar">
        <el-input v-model="sellerForm.avatar" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Pictures" prop="pics">
        <ul>
          <li class="pic-item" v-for="(pic, index) in sellerForm.pics" :key="index">
            <div class="input-wrapper">
              <el-input v-model="sellerForm.pics[index]" auto-complete="off"></el-input>
            </div>
            <div class="icon-wrapper">
              <i class="iconBtn el-icon-remove-outline" @click="delPic(index)"></i>
              <i class="iconBtn" :class="{'el-icon-circle-plus-outline': sellerForm.pics.length - 1 === index}" @click="addPic(index)"></i>
            </div>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="Supports" prop="supports">
        <ul>
          <li class="support-item" v-for="(support, index) in sellerForm.supports" :key="index">
            <div class="input-wrapper">
              <el-col :span="8">
                <el-select id="cls-wrapper" v-model="sellerForm.supports[index].types" placeholder="Select Support">
                  <el-option class="cls" v-for="(cls, idx) in classMap" :key="idx" :value="idx" :label="cls"></el-option>
                </el-select>
              </el-col>
              <el-col :span="16">
                <el-input v-model="sellerForm.supports[index].description" auto-complete="off"></el-input>
              </el-col>
            </div>
            <div class="icon-wrapper">
              <i class="iconBtn el-icon-remove-outline" @click="delSupport(index)"></i>
              <i class="iconBtn" :class="{'el-icon-circle-plus-outline': sellerForm.supports.length - 1 === index}" @click="addSupport(index)"></i>
            </div>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="Information" prop="infos">
        <ul>
          <li class="info-item" v-for="(info, index) in sellerForm.infos" :key="index">
            <div class="input-wrapper">
              <el-input v-model="sellerForm.infos[index]" auto-complete="off"></el-input>
            </div>
            <div class="icon-wrapper">
              <i class="iconBtn el-icon-remove-outline" @click="delInfo(index)"></i>
              <i class="iconBtn" :class="{'el-icon-circle-plus-outline': sellerForm.infos.length - 1 === index}" @click="addInfo(index)"></i>
            </div>
          </li>
        </ul>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editSeller">Edit Seller</el-button>
        <el-button @click="cancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapGetters } from 'vuex'

  const ERR_OK = 0

  export default {
    data() {
      return {
        title: 'Edit Seller',
        loading: true,
        seller: {},
        sellerForm: {
          name: '',
          description: '',
          deliveryTime: '',
          bulletin: '',
          avatar: '',
          pics: [''],
          supports: [{types: '', description: ''}],
          infos: ['']
        },
        rules: {
          name: [{
            required: true,
            message: 'Please enter name',
            trigger: 'blur'
          }],
          description: [{
            required: true,
            message: 'Please enter description',
            trigger: 'blur'
          }],
          deliveryTime: [{
            required: true,
            message: 'Please enter delivery time',
            trigger: 'blur'
          }],
          bulletin: [{
            required: true,
            message: 'Please enter bulletin',
            trigger: 'blur'
          }],
          avatar: [{
            required: true,
            message: 'Please enter avatar',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.classMap = ['Decrease', 'Discount', 'Special', 'Invoice', 'Guarantee']
      this._initializeSeller(this.$router.params)
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    methods: {
      _initializeSeller(id) {
        if (!this.$router.params) {
          this.$router.push('/admin/sellers')
        }
        Service.getOneSeller(id)
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              this.sellerForm = res.data[0]
              this.seller = res.data[0]
              setTimeout(() => {
                this.loading = false
              }, 1000)
            }
          })
      },
      editSeller() {
        this.$refs.sellerForm.validate((valid) => {
          if (valid) {
            let seller = {
              name: this.sellerForm.name,
              description: this.sellerForm.description,
              deliveryTime: this.sellerForm.deliveryTime,
              bulletin: this.sellerForm.bulletin,
              avatar: this.sellerForm.avatar,
              pics: this.sellerForm.pics,
              supports: this.sellerForm.supports,
              infos: this.sellerForm.infos,
              token: this.token
            }

            Service.updateSeller(this.seller._id, seller)
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
          } else {
            return false
          }
        })
      },
      cancel() {
        this.$router.push('/admin/sellers')
      },
      addPic(index) {
        let newPic = ''
        this.sellerForm.pics.push(newPic)
      },
      delPic(index) {
        if (this.sellerForm.pics.length === 1) {
          this.sellerForm.pics[0] = ''
          return
        }
        this.sellerForm.pics.splice(index, 1)
      },
      addSupport(index) {
        let newSupport = {types: '', description: ''}
        this.sellerForm.supports.push(newSupport)
      },
      delSupport(index) {
        if (this.sellerForm.supports.length === 1) {
          this.sellerForm.supports[0].types = ''
          this.sellerForm.supports[0].description = ''
          return
        }
        this.sellerForm.supports.splice(index, 1)
      },
      addInfo(index) {
        let newInfo = ''
        this.sellerForm.infos.push(newInfo)
      },
      delInfo(index) {
        if (this.sellerForm.infos.length === 1) {
          this.sellerForm.infos[0] = ''
          return
        }
        this.sellerForm.infos.splice(index, 1)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixin"

  .edit-wrapper
    position: relative
    font-size: 0
    text-align: center
    .title
      font-size: 36px
      margin-top: 36px
    .seller-table
      position: relative
      width: 40%
      top: 50px
      margin: 0 auto
    .pic-item, .support-item, .info-item
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
