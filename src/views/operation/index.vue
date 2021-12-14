<template>
  <div class="wrap">
    this istests
    <!-- 头部定位-->
    <div class="header">
      <div class="left">
        <svg-icon icon-class="position" class-name="position"></svg-icon>
        <h5>{{ title }}</h5>
      </div>
      <div class="right">
        <!--  组织  -->
        <span>
          <svg-icon icon-class="organization" class-name="tool-icon"></svg-icon>
        </span>
      </div>
    </div>
    <!-- 地图 -->
    <div id="map-content" class="map-content"></div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      title: '万象城',
      //
      map: ''
    }
  },
  methods: {
    // 高德地图初始化
    gdMapInit() {

    }
  }
}
</script>

<style scoped lang="scss">
  %common {
  position: fixed;
  z-index: 10;
}
  .wrap{
    height: 100%;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 48px;
    background: #FFFFFF;
    border-top: 1px solid #E9E9E9;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.06);
    @extend %common;
    top: 50px;
    left: 0;

    .position {
      display: block;
      width: 20px;
      height: 20px;
    }

    .tool-icon {
      display: block;
      width: 20px;
      height: 20px;
    }

    .left {
      display: flex;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-left: 12px;

      h5 {
        margin-left: 5px;
      }
    }

    .right {
      display: flex;
      padding-right: 10px;

      span {
        display: block;
        padding: 0 5px;
      }
    }
  }
  .map-content{
    width: 100%;
    height: 100vh;
  }
</style>
