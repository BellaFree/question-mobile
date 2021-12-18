<template>
  <nav
      v-show="navShowStatus"
    class="nav-bar"
    >
    <!-- 左侧 操作   -->
    <span v-show="leftIcon" class="left-handle">
      <van-icon :name="leftIcon" @click="leftClick" v-show="leftIcon" class="icon" />
      <i class="left-title" @click="middleClick" v-show="leftTitle">{{leftTitle}}</i>
    </span>
    <!-- title   -->
    <h1>{{heading}}</h1>
    <!-- 右侧 操作   -->
    <span class="right-span">
      <van-icon :name="exportIcon" @click="exportClick" v-show="exportIcon" class="icon" />
      <van-icon :name="rightIcon" @click="rightClick" v-show="rightIcon" class="icon right-icon" />
      <i class="right-title" @click="rightClick" v-show="rightTitle">{{rightTitle}}</i>
    </span>
  </nav>
</template>
<script>
import Vue from 'vue';
import { Icon } from 'vant';

Vue.use(Icon);
// import Button from 'vant/lib/button';
// import 'vant/lib/button/style';
// import {browser} from '../util'
export default {
  props: {
    heading: {
      type: String,
      default: ''
    },
    leftIcon: {
      type: String,
      default: ''
    },
    leftTitle: {
      type: String,
      default: ''
    },
    rightIcon: {
      type: String,
      default: ''
    },
    rightTitle: {
      type: String,
      default: ''
    },
    // 导航栏 是否显示
    navShowStatus: {
      type: Boolean,
      default: true
    },
    // 导出icon
    exportIcon: {
      type: String,
      default: ''
    },
    onLeft: { type: Function },
    onClose: { type: Function },
    onRight: { type: Function },
    onExport: { type: Function }
  },
  // computed: {
  //   statusBarHeight () {
  //     const ssrContext = this.$ssrContext
  //     const os = browser(ssrContext && ssrContext.userAgent)
  //     return os.statusBarHeight
  //   }
  // },
  created() {},
  methods: {
    leftClick(e) {
      this.onLeft && this.onLeft(e);
    },
    middleClick(e) {
      this.onClose && this.onClose(e);
    },
    rightClick(e) {
      this.onRight && this.onRight(e);
    },
    exportClick(e) {
      this.onExport && this.onExport(e)
    }
  }
};
</script>
<style lang="scss">
nav.nav-bar {
  z-index: 1000;
  background: #fff;
  height: 50px;
  line-height: 50px;
  border-bottom: 1PX solid #eee;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  color: #1C2438;
  //display: flex;
  box-sizing: border-box;
  h1 {
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: normal;
    flex: 5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: absolute;
    top: 0;
    left: 0;
  }
  .left-handle{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
  span {
   position: absolute;
    top: 0;
    &:last-child{
      right: 0;
      text-align: right;
      i {
        float: right;
      }
    }
  }
  i {
    display: inline-block;
  }

  i.right-title {
    font-style: normal;
    font-size: 15px;
    color: #0A9B58;
    //position: absolute;
    //right: 0;
    //top: 0;
  }
  i.left-title {
    width: 70px;
    font-style: normal;
    font-size: 16px;
    display: inline-block;
    position: absolute;
    left: 50px;
    top: 0;
  }
  .icon {
    margin: 13px 12px;
    display: block;
    width: 22px;
    height: 22px;
    fill: #333;
    .van-icon__image {
      width: 21px;
      height: 21px;
    }
  }
  .icon:before {
    font-size: 22px;
  }
  .right-span{
    display: flex;
    padding-right: 10px;
    .icon{
      margin: 13px 5px;
    }
    .right-icon{
      display: inline-block;
      width: 36px;
      height: 36px;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
}

</style>
