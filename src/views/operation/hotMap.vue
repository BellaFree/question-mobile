<template>
  <div></div>
</template>
<script>
import MAP_API from '@api/map_api'

export default {
  name: "hotPopulat",
  props: ["map"],
  data() {
    return {
      hotPopulatObj: '',
      timer: '',
    };
  },
  computed: {
    zoom() {
      return this.$store.getters.zoom
    },
    hotPopulat() {
      return this.$store.getters.hotPopulat
    },
    pickerInfo() {
      return JSON.parse(window.sessionStorage.getItem("userInfo"));
    },
    cityCode() {
      return this.pickerInfo.adcode;
    },
    cityName() {
      return this.pickerInfo.province ? this.pickerInfo.province : this.pickerInfo.city;
    },
  },
  watch: {
    zoom(val, oldVal) { // 缩放改变
      let zoomUp = val < oldVal ? false : true
      if (zoomUp && this.hotPopulat) {
        if (oldVal <= 11 && val >= 11) {
          if (this.hotPopulatObj) {
            // this.hotPopulatObj.hide()
            this.hotPopulatObj.setMap(null)
            this.hotPopulatObj = null
          }
        }
      } else if (!zoomUp && this.hotPopulat) {
        if (oldVal >= 12 && val < 12) {
          if (this.timer) clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.HeatmapLayer()
          }, 1000)
        }
      }
    },
    hotPopulat(val) { // 热力图开关状态改变
      if (val) {
        this.HeatmapLayer()
      } else if (this.hotPopulatObj) {
        // this.hotPopulatObj.hide()
        this.hotPopulatObj.setMap(null)
        this.hotPopulatObj = null
      }
    },
    cityCode() { // 拖动地图 改变城市 重新获取热力图
      if (this.hotPopulat) this.HeatmapLayer()
    },
  },
  methods: {
    async HeatmapLayer() {
      const that = this
      let heatmap;
      if (this.hotPopulatObj) {
        // this.hotPopulatObj.hide();
        this.hotPopulatObj.setMap(null)
        this.hotPopulatObj = null
      }
      let adcode;
      if (this.cityName == "上海市") {
        adcode = "310100";
      } else if (this.cityName == "重庆市") {
        adcode = "500100";
      } else if (this.cityName == "天津市") {
        adcode = "120100";
      } else if (this.cityName == "北京市") {
        adcode = "110100";
      } else {
        // let url1 = `${MAP_API.amapDistrict}?keywords=${this.$store.getters.cityName}&subdistrict=0&key=8df587e1cc91a38a54f1987a5c369a13`;
        // this.$fetch.get(url1).then((res) => {
        //   adcode = res.districts && res.districts.length ? res.districts[0].adcode : "310100";
        // });
        adcode = this.cityCode
      }

      let limitBounds = this.map.getBounds();
      let json = {
        pedestrianType: "PEDESTRIAN_FLOAT",
        city: adcode,
        level: this.map.getZoom(),
        lng1: limitBounds.southwest.lng,
        lat1: limitBounds.northeast.lat,
        lng2: limitBounds.northeast.lng,
        lat2: limitBounds.southwest.lat,
      };

      let res = await MAP_API.pedestrianByTA_Phone(json)
      // console.log("hot data", res);
      let arr = res.data;
      var list = [];
      arr.forEach((item) => {
        list.push({
          lng: item.lng,
          lat: item.lat,
          count: item.pedestrian,
        });
      });
      that.map.plugin(["AMap.Heatmap"], function() {
        heatmap = new AMap.Heatmap(that.map, {
          // radius: 45, //给定半径
          opacity: [0, 0.6],
        });
        heatmap.setDataSet({
          data: list,
          max: 100,
        });
      });
      // 防止操作过于频繁 上次热力图未清除
      if (this.hotPopulatObj) {
        // this.hotPopulatObj.hide();
        this.hotPopulatObj.setMap(null)
        this.hotPopulatObj = null
      }
      this.hotPopulatObj = heatmap
    },
  },
};
</script>
<style lang="scss">
</style>
