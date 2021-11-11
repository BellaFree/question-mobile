<template>
  <div class="store-wrap">
    <!-- 检索  -->
    <van-search v-model="searchKey" placeholder="搜索"  shape="round"  @search="getStoreList"/>
    <!-- 地址选择器  -->
    <div class="address-box">
        <p class="address-result" @click="addressShow=!addressShow">
          <span>{{chooseAddress}}</span>
          <svg t="1636353469658" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2479" width="16" height="16"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z" p-id="2480"></path></svg>
        </p>
    </div>
    <!--  选择执行人  -->
    <div class="choose-user">
      <p class="choose-user-title">请先选择执行人，再选择派遣门店</p>
      <div class="choose-user-content">
          <div v-for="index of 10" :key="index" class="user-item">
            美丽
            <svg-icon icon-class="yetChoose"></svg-icon>
          </div>
      </div>
      <div class="right-handle"></div>
    </div>
    <!-- tab选择 -->
    <ul class="tab">
      <li @click="handleTable('n')" :class="{'active': currentTableType === 'n'}"><span>未选门店</span></li>
      <li @click="handleTable('y')" :class="{'active': currentTableType === 'y'}"><span>已选门店</span></li>
    </ul>
    <!-- 门店列表 -->
    <div class="store-list-box">
      <div class="store-list-item">
        <!-- 门店图片 -->
        <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimages.fangxiaoer.com%2Fsy%2Fxw%2Fbig%2F2017%2F04%2F28%2F5902fd9a832e5.jpg&refer=http%3A%2F%2Fimages.fangxiaoer.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1638948593&t=703b76f91a252ac7f0d19c5847cfef27" alt="">
        <!-- 门店名称 -->
        <p class="store-name">德克士(火车站店)</p>
        <!-- 门店地址 -->
        <p class="store-address">
          <svg-icon icon-class="location" class-name="location"></svg-icon>
          上海市静安区曹家渡万航渡路849号海森国际大厦(康定路)</p>
      </div>
    </div>
    <!-- 弹层：地址集联选择器  -->
    <van-popup v-model="addressShow" round position="bottom">
      <van-cascader
          v-model="chooseAddress"
          title="请选择所在地区"
          :options="addressOptions"
          @close="addressShow = false"
          @finish="onFinish"
      />
    </van-popup>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name: "list",
  subtitle() {
    return '选择门店'
  },
  leftIcon() {
    return 'arrow-left'
  },
  data() {
    return {
      // 检索关键字
      searchKey: '',
      // 地址选择器 是否显示
      addressShow: false,
      // 选中的地址
      chooseAddress: '浙江省-杭州市',
      // 地址参数
      addressOptions: [ {
        text: '浙江省',
        value: '330000',
        children: [{ text: '杭州市', value: '330100' }],
      },
        {
          text: '江苏省',
          value: '320000',
          children: [{ text: '南京市', value: '320100' }],
        },],
      // 当前选中的门店类型
      currentTableType: 'n',
      // 数据加载loading状态
      loading: false,
    }
  },
  computed:{
    ...mapGetters('User',['userId'])
  },
  mounted() {
  },
  methods:{
    // 全部选项选择完毕后，会触发 finish 事件
    onFinish({ selectedOptions }) {
      this.addressShow = false;
      this.chooseAddress = selectedOptions.map((option) => option.text).join('-');
    },
    // 切换已选门店类型
    handleTable(type){
      this.currentTableType = type
      // todo 请求接口 切换门店数据
    },
    // 请求门店数据
    getStoreList() {

    }
  }
}
</script>

<style scoped lang="scss">
  .store-wrap{
    width: 100%;
    height: 100vh;
    background-color: #FAFAFA;
  }
  .address-box{
    background-color: #fff;
    padding: 5px 0;
    .address-result{
      span{
        font-size: 16px;
        font-weight: 600;
        color: #6B6B6B;
      }
      svg{
        display: inline-block;
        width: 11px;
        height: 11px;
      }
    }
  }
  .choose-user{
    padding: 10px 10px;
    position: relative;
    &-title{
      font-size: 14px;
      font-weight: 500;
      color: #495060;
    }
    &-content{
      display: flex;
      height: 80px;
      background: #FFFFFF;
      box-shadow: 0 2px 5px 2px rgba(0,0,0,0.03);
      border-radius: 5px;
      margin-top: 10px;
      position: relative;
      overflow-y: auto;
      padding-left: 10px;
      .user-item{
        width: 40px;
        height: 40px;
        border-radius: 40px;
        background: #0A9B58;
        font-size: 12px;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 40px;
        text-align: center;
        margin-top: 15px;
        flex-shrink: 0;
        margin-right: 18px;
        position: relative;
        svg{
          display: inline-block;
          width: 51px;
          height: 63px;
          position: absolute;
          top: -5px;
          left: -5px;
        }
      }
    }
    .right-handle{
      width: 13px;
      height: 79px;
      content: '';
      background: #FFFFFF;
      box-shadow: -1px 0px 5px 0px rgba(0,0,0,0.1);
      border-radius: 0 5px 5px 0;
      position: absolute;
      top: 40px;
      right: 10px;
    }
  }
  .tab{
    display: flex;
    height: 50px;
    justify-content: center;
    align-items: center;
    li{
      width: 50%;
      font-size: 16px;
      font-weight: 600;
      color: #3A3A3A;
      span{
        position: relative;
        z-index: 20;
      }
    }
    .active{
      position: relative;
      z-index: 10;
      &:before{
        content: '';
        width: 64px;
        height: 10px;
        border-radius: 10px;
        background: #388f67ab;
        position: absolute;
        bottom: 2px;
        left: 50%;
        z-index: 0;
        margin-left: -32px;
      }
    }
  }
  .store-list-box{
    padding: 0 10px;
    .store-list-item{
      background-color: #fff;
      height: 90px;
      box-shadow: 0 2px 5px 2px rgba(0,0,0,0.03);
      border-radius: 5px;
      position: relative;
      img{
        display: inline-block;
        width: 99px;
        height: 68px;
        border-radius: 5px;
        position: absolute;
        top: 10px;
        left: 10px;
      }
      .store-name{
        font-size: 15px;
        font-weight: 600;
        color: #424242;
        position: absolute;
        top: 10px ;
        left: 120px;
      }
      .store-address{
        width: 225px;
        font-size: 13px;
        font-weight: 400;
        color: #999999;
        word-break: break-all;
        text-align: left;
        position: absolute;
        top: 40px ;
        left: 120px;
        .location{
          display: inline-block;
          width: 11px;
          height: 14px;
        }
      }
    }
  }
</style>
