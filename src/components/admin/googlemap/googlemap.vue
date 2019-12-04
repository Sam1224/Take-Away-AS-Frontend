<template>
  <div class="map" style="padding-bottom:10px">
    <el-form-item>
      <el-col :span="20">
        <gmap-autocomplete style="width:100%;height:48px;" @place_changed="setPlace"  @input="input"></gmap-autocomplete>
      </el-col>
      <el-col :span="4">
        <el-button style="width:100%;height:48px;" @click="addMarker">Select</el-button>
      </el-col>
    </el-form-item>
    <el-form-item>
      <gmap-map :center="center" :zoom="16" style="width:100%;height:400px;">
        <gmap-marker :key="index" v-for="(m, index) in markers" :position="m.position" @click="center=m.position"></gmap-marker>
      </gmap-map>
    </el-form-item>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        center: {lat: 45.508, lng: -73.587},
        markers: [],
        places: [],
        currentPlace: null,
        address: []
      }
    },
    mounted () {
      this.geolocate()
    },
    methods: {
      input(data) {
        this.address = data.data
      },
      setPlace(place) {
        this.currentPlace = place
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        }
        this.markers = []
        this.markers.push({position: marker})
        this.center = marker
        this.address = `${place.name}, ${place.formatted_address}`
      },
      addMarker() {
        if (this.currentPlace) {
          const marker = {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
          }
          this.markers = []
          this.markers.push({position: marker})
          this.center = marker
          this.$emit('selectPlace', this.address)
        }
      },
      geolocate() {
        navigator.geolocation.getCurrentPosition(position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
