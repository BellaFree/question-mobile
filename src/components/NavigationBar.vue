<template>
  <nav
      v-show="navShowStatus"
    class="nav-bar"
    >
    <span>
      <van-icon :name="leftIcon" @click="leftClick" v-show="leftIcon" class="icon" />
      <i class="left-title" @click="leftClick" v-show="leftTitle">{{leftTitle}}</i>
    </span>
    <h1>{{heading}}</h1>
    <span class="right-span">
      <van-icon :name="rightIcon" @click="rightClick" v-show="rightIcon" class="icon" />
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
    onLeft: { type: Function },
    onRight: { type: Function }
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
    rightClick(e) {
      this.onRight && this.onRight(e);
    }
  }
};
</script>
<style lang="scss">
nav.nav-bar {
  z-index: 10000;
  background: #fff;
  height: 50px;
  line-height: 50px;
  border-bottom: 1PX solid #eee;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  font-family: PingFangSC-Regular;
  color: #1C2438;
  display: flex;
  box-sizing: border-box;
  h1 {
    text-align: center;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    font-weight: normal;
    flex: 5;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span {
    flex: 1;
    &:last-child{
      right: 0;
      text-align: right;
      i {
        float: right;
      }
    }
  }
  .right-span{
    display: flex;
    flex: none;
    padding-right: 10px;
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
    font-style: normal;
    font-size: 12px;
    color: #333;
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
}
</style>
