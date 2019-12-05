<template>
  <div class="edit-goods-wrapper" v-show="!loading">
    <h2 class="title">{{title}}</h2>
    <el-form v-loading.fullscreen.lock="loading" element-loading-text="Loading..." element-loading-background="rgb(255, 255, 255)" ref="goodsForm" :model="goodsForm" status-icon label-width="100px" class="goods-table" :rules="rules">
      <el-form-item label="Goods" prop="goods">
        <el-collapse>
          <div v-for="(good, goodIndex) in goodsForm.goods" :key="goodIndex" class="good-wrapper">
            <el-collapse-item class="good-item" :title="good.name" :name="goodIndex">
              <div class="input-wrapper">
                <el-form-item label="GoodName" :prop="`goods.${goodIndex}.name`" :rules="rules.goodName">
                  <el-input v-model="goodsForm.goods[goodIndex].name" auto-complete="off"></el-input>
                </el-form-item>
                <el-collapse>
                  <div v-for="(food, foodIndex) in good.foods" :key="foodIndex" class="food-wrapper">
                    <el-collapse-item class="food-item" :title="food.name" :name="foodIndex">
                      <div class="input-wrapper">
                        <el-form-item label="FoodName" :prop="`goods.${goodIndex}.foods.${foodIndex}.name`" :rules="rules.foodName">
                          <el-input v-model="goodsForm.goods[goodIndex].foods[foodIndex].name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Description" :prop="`goods.${goodIndex}.foods.${foodIndex}.description`" :rules="rules.description">
                          <el-input type="textarea" v-model="goodsForm.goods[goodIndex].foods[foodIndex].description" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Information" :prop="`goods.${goodIndex}.foods.${foodIndex}.info`" :rules="rules.info">
                          <el-input type="textarea" v-model="goodsForm.goods[goodIndex].foods[foodIndex].info" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Price" :prop="`goods.${goodIndex}.foods.${foodIndex}.price`" :rules="rules.price">
                          <el-input type="number" v-model="goodsForm.goods[goodIndex].foods[foodIndex].price" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="OldPrice" :prop="`goods.${goodIndex}.foods.${foodIndex}.oldPrice`">
                          <el-input type="number" v-model="goodsForm.goods[goodIndex].foods[foodIndex].oldPrice" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="Image" :prop="`goods.${goodIndex}.foods.${foodIndex}.image`" :rules="rules.image">
                          <el-upload ref="imageUploader" class="upload-wrapper" drag action="https://takeawayapp-sam.herokuapp.com/upload" show-file-list
                                     accept="image/png, image/jpeg"
                                     :on-success="(response, file, fileList) => {return handleImageSuccess(response, file, fileList, goodIndex, foodIndex)}"
                                     :on-remove="(file, fileList) => {return handleImageRemove(file, fileList, goodIndex, foodIndex)}"
                                     :file-list="goodsForm.goods[goodIndex].foods[foodIndex].imageList"
                                     list-type="picture"
                                     :limit="Number(1)"
                          >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">Drag picture here, or <em>click to upload</em></div>
                            <div class="el-upload__tip" slot="tip">Only .jpg and .png files accepted</div>
                          </el-upload>
                        </el-form-item>
                        <el-form-item label="Icon" :prop="`goods.${goodIndex}.foods.${foodIndex}.icon`" :rules="rules.icon">
                          <el-upload ref="iconUploader" class="upload-wrapper" drag action="https://takeawayapp-sam.herokuapp.com/upload" show-file-list
                                     accept="image/png, image/jpeg"
                                     :on-success="(response, file, fileList) => {return handleIconSuccess(response, file, fileList, goodIndex, foodIndex)}"
                                     :on-remove="(file, fileList) => {return handleIconRemove(file, fileList, goodIndex, foodIndex)}"
                                     :file-list="goodsForm.goods[goodIndex].foods[foodIndex].iconList"
                                     list-type="picture"
                                     :limit="Number(1)"
                          >
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">Drag picture here, or <em>click to upload</em></div>
                            <div class="el-upload__tip" slot="tip">Only .jpg and .png files accepted</div>
                          </el-upload>
                        </el-form-item>
                      </div>
                    </el-collapse-item>
                    <div class="icon-wrapper">
                      <i class="iconBtn el-icon-remove-outline" @click="delFood(goodIndex, foodIndex)"></i>
                      <i class="iconBtn" :class="{'el-icon-circle-plus-outline': goodsForm.goods[goodIndex].foods.length - 1 === foodIndex}" @click="addFood(goodIndex, foodIndex)"></i>
                    </div>
                  </div>
                </el-collapse>
              </div>
            </el-collapse-item>
            <div class="icon-wrapper">
              <i class="iconBtn el-icon-remove-outline" @click="delGood(goodIndex)"></i>
              <i class="iconBtn" :class="{'el-icon-circle-plus-outline': goodsForm.goods.length - 1 === goodIndex}" @click="addGood(goodIndex)"></i>
            </div>
          </div>
        </el-collapse>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editGoods">Edit Goods</el-button>
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
        title: 'Edit Goods',
        loading: true,
        goods: {},
        goodsForm: {
          goods: [{
            name: '',
            types: -1,
            foods: [{
              name: '',
              description: '',
              info: '',
              sellCount: 0,
              rating: 0,
              price: 0,
              oldPrice: null,
              image: '',
              imageList: [],
              icon: '',
              iconList: [],
              ratings: []
            }]
          }]
        },
        rules: {
          goodName: [{
            required: true,
            message: 'Please enter good name',
            trigger: 'blur'
          }],
          foodName: [{
            required: true,
            message: 'Please enter food name',
            trigger: 'blur'
          }],
          description: [{
            required: true,
            message: 'Please enter the description of the food',
            trigger: 'blur'
          }],
          info: [{
            required: true,
            message: 'Please enter the information of the food',
            trigger: 'blur'
          }],
          price: [{
            required: true,
            message: 'Please enter the price of the food',
            trigger: 'blur'
          }],
          image: [{
            required: true,
            message: 'Please input the image of the food',
            trigger: 'blur'
          }],
          icon: [{
            required: true,
            message: 'Please input the icon of the food',
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this._initializeGoods(this.$router.params)
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    methods: {
      _initializeGoods(id) {
        if (!this.$router.params) {
          this.$router.push('/admin/sellers')
        }
        Service.getOneSeller(id)
          .then((response) => {
            let res = response.data
            if (res.code === ERR_OK) {
              if (res.data[0].goods.length === 0) {
                setTimeout(() => {
                  this.loading = false
                }, 1000)
                return
              }
              let goods = res.data[0].goods
              this.goodsForm.goods = goods
              this.goods = goods
              for (let i = 0; i < goods.length; i++) {
                let foods = goods[i].foods
                for (let j = 0; j < foods.length; j++) {
                  let image = foods[j].image
                  let icon = foods[j].icon
                  this.goodsForm.goods[i].foods[j].imageList = []
                  this.goodsForm.goods[i].foods[j].iconList = []
                  this.goodsForm.goods[i].foods[j].imageList.push({
                    name: image.split('/')[-1],
                    url: `https://takeawayapp-sam.herokuapp.com/${image}`
                  })
                  this.goodsForm.goods[i].foods[j].iconList.push({
                    name: icon.split('/')[-1],
                    url: `https://takeawayapp-sam.herokuapp.com/${icon}`
                  })
                }
              }
              setTimeout(() => {
                this.loading = false
              }, 1000)
            }
          })
      },
      handleImageSuccess(response, file, fileList, goodIndex, foodIndex) {
        if (response.code === ERR_OK) {
          this.goodsForm.goods[goodIndex].foods[foodIndex].image = response.filepath
          this.goodsForm.goods[goodIndex].foods[foodIndex].imageList = []
          this.goodsForm.goods[goodIndex].foods[foodIndex].imageList.push({
            name: response.filepath.split('/')[-1],
            url: `https://takeawayapp-sam.herokuapp.com/${response.filepath}`
          })
        }
      },
      handleIconSuccess(response, file, fileList, goodIndex, foodIndex) {
        if (response.code === ERR_OK) {
          this.goodsForm.goods[goodIndex].foods[foodIndex].icon = response.filepath
          this.goodsForm.goods[goodIndex].foods[foodIndex].iconList = []
          this.goodsForm.goods[goodIndex].foods[foodIndex].iconList.push({
            name: response.filepath.split('/')[-1],
            url: `https://takeawayapp-sam.herokuapp.com/${response.filepath}`
          })
        }
      },
      handleImageRemove(file, fileList, goodIndex, foodIndex) {
        this.goodsForm.goods[goodIndex].foods[foodIndex].image = null
      },
      handleIconRemove(file, fileList, goodIndex, foodIndex) {
        this.goodsForm.goods[goodIndex].foods[foodIndex].icon = null
      },
      editGoods() {
        this.$refs.goodsForm.validate((valid) => {
          if (valid) {
            this.goodsForm.goods.forEach((good) => {
              good.foods.forEach((food) => {
                if (food.oldPrice === 0) {
                  food.oldPrice = null
                }
              })
            })
            let goods = {
              goods: this.goodsForm.goods,
              token: this.token
            }

            Service.updateGoods(this.$router.params, goods)
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
      addGood(index) {
        let newGood = {
          name: '',
          types: -1,
          foods: [{
            name: '',
            description: '',
            info: '',
            sellCount: 0,
            rating: 0,
            price: 0,
            oldPrice: null,
            image: '',
            icon: '',
            ratings: []
          }]
        }
        this.goodsForm.goods.push(newGood)
      },
      delGood(index) {
        if (this.goodsForm.goods.length === 1) {
          this.goodsForm.goods[0].name = ''
          this.goodsForm.goods[0].foods = [{}]
          this.goodsForm.goods[0].foods[0].name = ''
          this.goodsForm.goods[0].foods[0].description = ''
          this.goodsForm.goods[0].foods[0].info = ''
          this.goodsForm.goods[0].foods[0].sellCount = 0
          this.goodsForm.goods[0].foods[0].rating = 0
          this.goodsForm.goods[0].foods[0].price = 0
          this.goodsForm.goods[0].foods[0].oldPrice = null
          this.goodsForm.goods[0].foods[0].image = ''
          this.goodsForm.goods[0].foods[0].icon = ''
          this.goodsForm.goods[0].foods[0].ratings = []
          console.log(this.goodsForm.goods[0])
          return
        }
        this.goodsForm.goods.splice(index, 1)
      },
      addFood(goodIndex, foodIndex) {
        let newFood = {
          name: '',
          description: '',
          info: '',
          sellCount: 0,
          rating: 0,
          price: 0,
          oldPrice: null,
          image: '',
          icon: '',
          ratings: []
        }
        this.goodsForm.goods[goodIndex].foods.push(newFood)
      },
      delFood(goodIndex, foodIndex) {
        if (this.goodsForm.goods[goodIndex].foods.length === 1) {
          this.goodsForm.goods[goodIndex].foods = [{
            name: '',
            description: '',
            info: '',
            sellCount: 0,
            rating: 0,
            price: 0,
            oldPrice: null,
            image: '',
            icon: '',
            ratings: []
          }]
          return
        }
        this.goodsForm.goods[goodIndex].foods.splice(foodIndex, 1)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .edit-goods-wrapper
    position: relative
    font-size: 0
    text-align: center
    .title
      font-size: 36px
      margin-top: 36px
    .goods-table
      position: relative
      width: 60%
      top: 50px
      margin: 0 auto
      .good-wrapper
        display: flex
        .good-item
          position: relative
          flex: 0 0 90%
          .input-wrapper
            position: relative
          .food-wrapper
            display: flex
            .food-item
              position: relative
              flex: 0 0 90%
              .input-wrapper
                position: relative
            .icon-wrapper
              position: relative
              flex: 1
              .iconBtn
                position: relative
                top: 15px
        .icon-wrapper
          position: relative
          flex: 1
          .iconBtn
            position: relative
            top: 15px
</style>
