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
        <el-upload ref="avatarUploader" class="upload-wrapper" drag action="https://takeawayapp-sam.herokuapp.com/upload" show-file-list
                   :auto-upload="false"
                   accept="image/png, image/jpeg"
                   :on-progress="handleAvatarProgress"
                   :on-remove="handleAvatarRemove"
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
                   :on-remove="handlePicsRemove"
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
        <el-button type="primary" @click="submitAvatar">Edit Seller</el-button>
        <el-button @click="cancel">Cancel</el-button>
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
    data() {
      return {
        title: 'Edit Seller',
        loading: true,
        seller: {},
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
              this.avatarList.push({
                name: res.data[0].avatar.split('/')[-1],
                url: `https://takeawayapp-sam.herokuapp.com/${res.data[0].avatar}`
              })
              res.data[0].pics.forEach((pic) => {
                this.picsList.push({
                  name: pic.split('/')[-1],
                  url: `https://takeawayapp-sam.herokuapp.com/${pic}`
                })
              })
              setTimeout(() => {
                this.loading = false
              }, 1000)
            }
          })
      },
      handleAvatarProgress(event, file, fileList) {
        this.avatarStatus = true
      },
      handlePicsProgress(event, file, fileList) {
        this.picsStatus = true
      },
      handleAvatarRemove(file, fileList) {
        this.sellerForm.avatar = null
      },
      handlePicsRemove(file, fileList) {
        if (file.status === 'success') {
          let url = file.url.replace('https://takeawayapp-sam.herokuapp.com/', '')
          let index = this.sellerForm.pics.indexOf(url)
          if (index > -1) {
            this.sellerForm.pics.splice(index, 1)
          }
        }
      },
      uploadAvatar(file) {
        this.avatarFormData.append('file', file.file)
      },
      uploadPics(file) {
        this.picsFormData.append('files', file.file)
      },
      submitAvatar() {
        // this.loading = true
        this.avatarFormData = new FormData()
        let files = this.$refs.avatarUploader.uploadFiles
        let readyCount = 0
        files.forEach((file) => {
          if (file.status === 'ready') {
            readyCount++
          }
        })
        if (readyCount > 0) {
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
              this.avatarList = []
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
      },
      submitPics() {
        this.picsFormData = new FormData()
        let files = this.$refs.picsUploader.uploadFiles
        let readyCount = 0
        this.picsList = []
        files.forEach((file) => {
          if (file.status === 'ready') {
            readyCount++
          } else if (file.status === 'success') {
            let url = file.url.replace('https://takeawayapp-sam.herokuapp.com/', '')
            this.picsList.push({
              name: url.split('/')[-1],
              url: `https://takeawayapp-sam.herokuapp.com/${url}`
            })
          }
        })
        if (readyCount > 0) {
          this.$refs.picsUploader.submit()
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          axios.post('https://takeawayapp-sam.herokuapp.com/uploadmul', this.picsFormData, config)
            .then((response) => {
              response.data.filepaths.forEach((filepath) => {
                this.sellerForm.pics.push(filepath)
              })
              this.picsStatus = false
              response.data.filepaths.forEach((filepath) => {
                this.picsList.push({
                  name: filepath.split('/')[-1],
                  url: `https://takeawayapp-sam.herokuapp.com/${filepath}`
                })
              })
              this.editSeller()
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          this.editSeller()
        }
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
                this.loading = false
                if (res.code === ERR_OK) {
                  this.$message({
                    showClose: true,
                    message: res.message,
                    type: 'success',
                    center: true,
                    duration: 1000
                  })
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
                    this.$router.push('admin/login')
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
