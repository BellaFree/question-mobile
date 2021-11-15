<template>
  <div
      @touchstart="touchDown" @touchmove="touchmove"
      class="popup-drag"
      id="drag-wrap">
    <div class="drag-box"></div>
    <slot name="content"/>
  </div>
</template>
<script>
export default {
  name: "dragBox",
  data() {
    return {
      // 拖拽 定位
      drag: {
        positionX: '',
        positionY: ''
      },
      // 最大高度
      maxThreshold: '',
      // 最小高度
      minThreshold: 80
    }
  },
  mounted() {
    this.computedThreshold()
  },
  methods: {
    // 初始化 计算最大/小高度
    computedThreshold() {
      // 当前视窗高度
      const bodyHeight = document.body.clientHeight;
      // 头部 导航栏高度
      let  headerHeight = document.getElementsByClassName('nav-bar')[0].clientHeight;
      // 留出空隙
      headerHeight = headerHeight + 20
      // 最大高度
      this.maxThreshold = bodyHeight - headerHeight
    },
    // 按住
    touchDown(e) {
      this.default()
      this.drag.positionX = e.changedTouches[0].pageX;
      this.drag.positionY = e.changedTouches[0].pageY;
    },
    // 拖动
    touchmove(e) {
      this.drag.positionX = e.changedTouches[0].pageX;
      this.drag.positionY = e.changedTouches[0].pageY;
      this.setVal()
    },
    // 松开
    touchend() {},
    // 阻止移动端屏幕默认滑动
    default() {
      document.getElementById('drag-wrap').addEventListener(
          'touchmove',
          function(e) {
            e.preventDefault();
          }, {
            passive: false
          }
      );
    },
    // 设置 高度 和 定位的top值
    setVal() {
      let popup =  document.getElementById('drag-wrap')
      let bodyHeight = document.body.clientHeight
      let domHeight = bodyHeight - this.drag.positionY;
      // 阀值 拦截
      if(domHeight < this.minThreshold || domHeight > this.maxThreshold) {return}
      popup.style.top = `${this.drag.positionY}px`;
      popup.style.height = `${bodyHeight - this.drag.positionY}px`;
    }
  }
}
</script>

<style scoped lang="scss">
.popup-drag{
  width: 100%;
  height: 300px;
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  border-radius: 20px 20px 0 0 ;
  box-shadow: 0 1px 9px 1px rgba(0,0,0,0.21);
  .drag-box{
      width: 35px;
      height: 5px;
      background: #D8D8D8;
      border-radius: 4px;
      margin: 10px auto;
  }
}
</style>
