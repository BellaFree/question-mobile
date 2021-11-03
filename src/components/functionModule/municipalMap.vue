<template>
  <div id="muMap" class="muMapStyle">
    <div class="goback" @click="goback">
      <i class="el-icon-arrow-left"></i>
    </div>
    <div class="a" id="infoBox">
      <p>{{ addressInfos }}</p>
      <el-button type="primary" size="mini" @click="submit">确定</el-button>
    </div>
  </div>
</template>
<script>
// import mapUtils from "@/utils/map.js";
export default {
  name: "municipalMap",
  data() {
    return {
      marker: null,
      municipalMap: null,
      addressInfos: "",
      positions: [],
      infoWindow: null,
    };
  },
  mounted() {
    this.initMap();
  },
  props: ["localhostPosition", "addressInfo"],
  methods: {
    initMap() {
      let _this = this;
      let element = document.getElementById("infoBox");
      _this.positions = this.localhostPosition;
      _this.addressInfos = _this.addressInfo;
      _this.municipalMap = new AMap.Map("muMap", {
        resizeEnable: true,
        center: _this.localhostPosition, //中心点坐标
        zoom: 15, //缩放级别
      });
      let iconItmes = new AMap.Icon({
        size: new AMap.Size(15, 18),
        image: "/img/network-planning-views/location.png", // 图标的取图地址
        imageSize: new AMap.Size(15, 18),
        imageOffset: new AMap.Pixel(0, 0), // 图标取图偏移量
      });
      let configs = {
        map: _this.municipalMap,
        icon: iconItmes,
        lngLat: _this.localhostPosition,
        offset: [-14, -35],
        zIndex: 2999,
      };
      _this.addMarker(configs);
      _this.infoWindow = new AMap.InfoWindow({
        position: _this.positions,
        offset: new AMap.Pixel(0, -45),
        content: element,
      });
      _this.infoWindow.open(_this.municipalMap);
      AMapUI.loadUI(["misc/PositionPicker"], function (PositionPicker) {
        /*拖拽定位*/

        _this.municipalMap.on("movestart", function () {
          if (_this.marker) {
            _this.municipalMap.remove(_this.marker);
          }
          if (_this.infoWindow) {
            _this.infoWindow.close();
          }
        });
        _this.municipalMap.on("moveend", function () {
          let centerMap = _this.municipalMap.getCenter();
          let iconItme = new AMap.Icon({
            size: new AMap.Size(15, 18), // 图标尺寸
            image: "/img/network-planning-views/location.png", // 图标的取图地址
            imageSize: new AMap.Size(15, 18), // 图标所用图片大小
            imageOffset: new AMap.Pixel(0, 0), // 图标取图偏移量
          });
          let config = {
            map: _this.municipalMap,
            icon: iconItme,
            lngLat: [centerMap.lng, centerMap.lat],
            offset: [-14, -35],
            zIndex: 999,
          };
          _this.positions = [centerMap.lng, centerMap.lat];
          _this.addMarker(config);
          _this.infoWindow = new AMap.InfoWindow({
            position: _this.positions,
            offset: new AMap.Pixel(0, -45),
            content: element,
          });
          _this.infoWindow.open(_this.municipalMap);
        });
        var positionPicker = new PositionPicker({
          //拖拽选址
          mode: "dragMap", //设定为拖拽地图模式
          map: _this.municipalMap, //依赖地图对象

          iconStyle: {
            url: "//webapi.amap.com/ui/1.0/assets/position-picker2.png",
            ancher: [-10, -30],
            size: [0, 0],
            color: "rgba(0,0,0,0)",
          },
        });
        positionPicker.on("success", (res) => {
          //绑定事件,拖拽成功后会进行服务查询获得所选位置的信息otPopulatS.hide()

          _this.addressInfos = res.address;
          _this.positions = [res.position.lng, res.position.lat];
        });
        positionPicker.start();
      });
    },
    addMarker(config) {
      // this.marker = mapUtils.setMarker(config);
      this.marker = this.setMarker(config);
    },
    setMarker (markerConfig) {
      let marker = new AMap.Marker({
        map: markerConfig.map,
        position: markerConfig.lngLat,
        offset: markerConfig.offset?new AMap.Pixel(markerConfig.offset[0], markerConfig.offset[1]):new AMap.Pixel(-10, -10),
        icon: markerConfig.icon?markerConfig.icon:'',
        title: markerConfig.title?markerConfig.title:'',
        zIndex: markerConfig.zIndex?markerConfig.zIndex:100
      });
      return marker;
    },
    goback() {
      this.$emit("closeMap");
    },
    submit() {
      let b = {
        address: this.addressInfos,
        position: this.positions,
      };
      this.$emit("maoSubmit", b);
    },
  },
};
</script>
<style lang="scss" scoped>
.muMapStyle {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 2009;
  top: 0;
  left: 0;
  background: #fff;
  .goback {
    position: absolute;
    z-index: 100;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.5);
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 15px;
    .el-icon-arrow-left {
      margin-top: 3px;
      font-size: 24px;
      color: #fff;
    }
  }
  // .a /deep/ {
  .a {
    width: 98%;
    //   height: 45px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;

    p {
      flex: 1;
      margin: 0;
      padding: 0;
      line-height: 24px;
      height: 24px;
      overflow-x: auto;
      font-size: 12px;
      display: flex;
      word-break: break-all;
      flex-direction: row;
      flex-wrap: nowrap;
    }
  }
}
.btn {
  position: relative;
  width: 12rem;
  left: 3.6rem;
  margin: 10px 0 0 0;
}
.a + .amap-info-close {
  display: none !important;
}
</style>