<template>
  <div class="add-wrapper" v-show="!loading">
    <h2 class="title">{{title}}</h2>
    <el-form v-loading.fullscreen.lock="loading" element-loading-text="Loading..." element-loading-background="rgb(255, 255, 255)" ref="sellerForm" :model="sellerForm" status-icon label-width="100px" class="seller-table" :rules="rules">
      <el-form-item label="Name" prop="name">
        <el-input class="name" v-model="sellerForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input class="desc" v-model="sellerForm.description" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="DeliveryTime" prop="deliveryTime">
        <el-input class="delivery" v-model="sellerForm.deliveryTime" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Bulletin" prop="bulletin">
        <el-input class="bulletin" v-model="sellerForm.bulletin" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="Avatar" prop="avatar">
        <el-upload ref="avatarUploader" class="upload-wrapper" drag action="https://takeawayapp-sam.herokuapp.com/upload" show-file-list
                   :auto-upload="false"
                   accept="image/png, image/jpeg"
                   :on-progress="handleAvatarProgress"
                   :disabled="avatarStatus"
                   :file-list="avatarList"
                   list-type="picture"
                   :http-request="uploadAvatar"
                   :limit="Number(1)"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">Drag picture here, or <em>click to upload</em></div>
          <div class="el-upload__tip" slot="tip">Only .jpg and .png files accepted</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="Pictures" prop="pics">
        <el-upload ref="picsUploader" class="upload-wrapper" drag action="https://takeawayapp-sam.herokuapp.com/uploadmul" show-file-list
                   :auto-upload="false"
                   accept="image/png, image/jpeg"
                   :on-progress="handlePicsProgress"
                   :file-list="picsList"
                   list-type="picture"
                   :disabled="picsStatus"
                   :http-request="uploadPics"
                   :limit="Number(10)"
                   multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">Drag picture here, or <em>click to upload</em></div>
          <div class="el-upload__tip" slot="tip">Only .jpg and .png files accepted, maximum: 10</div>
        </el-upload>
<!--        <ul>-->
<!--          <li class="pic-item" v-for="(pic, index) in sellerForm.pics" :key="index">-->
<!--            <div class="input-wrapper">-->
<!--              <el-input v-model="sellerForm.pics[index]" auto-complete="off"></el-input>-->
<!--            </div>-->
<!--            <div class="icon-wrapper">-->
<!--              <i class="iconBtn el-icon-remove-outline" @click="delPic(index)"></i>-->
<!--              <i class="iconBtn" :class="{'el-icon-circle-plus-outline': sellerForm.pics.length - 1 === index}"-->
<!--                 @click="addPic(index)"></i>-->
<!--            </div>-->
<!--          </li>-->
<!--        </ul>-->
      </el-form-item>
      <el-form-item label="Supports" prop="supports">
        <ul>
          <li class="support-item" v-for="(support, index) in sellerForm.supports" :key="index">
            <div class="input-wrapper">
              <el-col :span="8">
                <el-select id="cls-wrapper" v-model="sellerForm.supports[index].types" placeholder="Select Support">
                  <el-option class="cls" v-for="(cls, idx) in classMap" :key="idx" :value="idx"
                             :label="cls"></el-option>
                </el-select>
              </el-col>
              <el-col :span="16">
                <el-input class="support-input" v-model="sellerForm.supports[index].description" auto-complete="off"></el-input>
              </el-col>
            </div>
            <div class="icon-wrapper">
              <i class="iconBtn el-icon-remove-outline" @click="delSupport(index)"></i>
              <i class="iconBtn" :class="{'el-icon-circle-plus-outline': sellerForm.supports.length - 1 === index}"
                 @click="addSupport(index)"></i>
            </div>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="Information" prop="infos">
        <ul>
          <li class="info-item" v-for="(info, index) in sellerForm.infos" :key="index">
            <div class="input-wrapper">
              <el-input class="info-input" v-model="sellerForm.infos[index]" auto-complete="off"></el-input>
            </div>
            <div class="icon-wrapper">
              <i class="iconBtn el-icon-remove-outline" @click="delInfo(index)"></i>
              <i class="iconBtn" :class="{'el-icon-circle-plus-outline': sellerForm.infos.length - 1 === index}"
                 @click="addInfo(index)"></i>
            </div>
          </li>
        </ul>
      </el-form-item>
      <el-form-item>
        <el-button class="add-btn" type="primary" @click="submitAvatar">Add Seller</el-button>
        <el-button class="reset-btn" @click="reset">Reset</el-button>
        <el-button class="cancel-btn" @click="cancel">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import Service from '@/services/services'
  import { mapGetters, mapMutations } from 'vuex'
  import axios from 'axios'

  const ERR_NOK = -1
  const ERR_OK = 0

  export default {
    data () {
      return {
        title: 'Add Seller',
        seller: {},
        loading: false,
        avatarStatus: false,
        picsStatus: false,
        avatarList: [],
        picsList: [],
        avatarFormData: '',
        picsFormData: '',
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
          }]
        }
      }
    },
    created () {
      this.classMap = ['Decrease', 'Discount', 'Special', 'Invoice', 'Guarantee']
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    methods: {
      handleAvatarProgress(event, file, fileList) {
        this.avatarStatus = true
      },
      handlePicsProgress(event, file, fileList) {
        this.picsStatus = true
      },
      uploadAvatar(file) {
        this.avatarFormData.append('file', file.file)
      },
      uploadPics(file) {
        this.picsFormData.append('files', file.file)
      },
      submitAvatar() {
        this.$refs.sellerForm.validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.$refs.avatarUploader.uploadFiles.length !== 0) {
              this.avatarFormData = new FormData()
              this.$refs.avatarUploader.submit()
              let config = {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
              axios.post('https://takeawayapp-sam.herokuapp.com/upload', this.avatarFormData, config)
                .then((response) => {
                  this.sellerForm.avatar = response.data.filepath
                  this.avatarStatus = false
                  this.avatarList.push({
                    name: response.data.filepath.split('/')[-1],
                    url: `https://takeawayapp-sam.herokuapp.com/${response.data.filepath}`
                  })
                  this.submitPics()
                })
                .catch((err) => {
                  console.log(err)
                })
            } else {
              this.submitPics()
            }
          } else {
            return false
          }
        })
      },
      submitPics() {
        if (this.$refs.picsUploader.uploadFiles.length !== 0) {
          this.picsFormData = new FormData()
          this.$refs.picsUploader.submit()
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          axios.post('https://takeawayapp-sam.herokuapp.com/uploadmul', this.picsFormData, config)
            .then((response) => {
              this.sellerForm.pics = response.data.filepaths
              this.picsStatus = false
              response.data.filepaths.forEach((filepath) => {
                this.picsList.push({
                  name: filepath.split('/')[-1],
                  url: `https://takeawayapp-sam.herokuapp.com/${filepath}`
                })
              })
              this.addSeller()
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          this.addSeller()
        }
      },
      addSeller () {
        this.sellerForm.supports.forEach((support) => {
          if (support.description && !support.types) {
            support.types = 0
          }
        })
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

        Service.addSeller(seller)
          .then((response) => {
            let res = response.data
            this.loading = false
            if (res.code === ERR_OK) {
              this.$message({
                showClose: true,
                message: res.message,
                type: 'success',
                center: true,
                duration: 1000
              })
              setTimeout(() => {
                this.$router.push('/admin/sellers')
              }, 1500)
            } else if (res.code === ERR_NOK && res.error.name === 'TokenExpiredError') {
              this.$message({
                showClose: true,
                message: 'The token has expired, please login again',
                type: 'warning',
                center: true,
                duration: 1000
              })
              setTimeout(() => {
                this.logout()
                this.setAccount({})
                this.$router.push('/admin/login')
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
      },
      reset () {
        this.$refs.sellerForm.resetFields()
        this.avatarList = []
        this.picsList = []
        this.sellerForm.supports = [{types: '', description: ''}]
      },
      cancel () {
        this.$router.push('/admin/sellers')
      },
      addPic (index) {
        let newPic = ''
        this.sellerForm.pics.push(newPic)
      },
      delPic (index) {
        if (this.sellerForm.pics.length === 1) {
          this.sellerForm.pics[0] = ''
          return
        }
        this.sellerForm.pics.splice(index, 1)
      },
      addSupport (index) {
        let newSupport = {types: '', description: ''}
        this.sellerForm.supports.push(newSupport)
      },
      delSupport (index) {
        if (this.sellerForm.supports.length === 1) {
          this.sellerForm.supports[0].types = ''
          this.sellerForm.supports[0].description = ''
          return
        }
        this.sellerForm.supports.splice(index, 1)
      },
      addInfo (index) {
        let newInfo = ''
        this.sellerForm.infos.push(newInfo)
      },
      delInfo (index) {
        if (this.sellerForm.infos.length === 1) {
          this.sellerForm.infos[0] = ''
          return
        }
        this.sellerForm.infos.splice(index, 1)
      },
      ...mapMutations({
        logout: 'LOGOUT',
        setAccount: 'SET_ACCOUNT'
      })
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixin"

  .add-wrapper
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
