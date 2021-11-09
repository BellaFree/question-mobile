<template>
  <div class="mapList-wrap" id="mapList-wrap">
    <div class="popup" id="popup" >
      <div class="drag-box"></div>
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
      <!--  筛选  -->
      <div class="filter-box">
        <!--  地址筛选  -->
        <div class="filter-address">
          <p>
            <span>上海市-静安区</span>
            <svg t="1636353469658" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2479" width="16" height="16"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z" p-id="2480"></path></svg>
          </p>
        </div>
        <!--  关键字筛选  -->
        <div class="filter-key">
          <van-search v-model="searchKey" placeholder="搜索"  shape="round" />
        </div>
      </div>
      <!-- 自定义 地址输入  -->
      <div class="diy-address-box">
        <i/>
        <van-field v-model="diyAddress" placeholder="请输入地址"  clearable="true"/>
      </div>
      <!-- 门店列表  -->
      <div class="store-list">
        <div class="store-list-item">
          <!-- 门店名称  -->
          <p class="store-name">德克士(火车站店)</p>
          <!-- 门店地址  -->
          <p class="store-address"> <svg-icon icon-class="location" class-name="location"/>德克士(火车站店)</p>
        </div>
      </div>
    </div>
    <button class="confirm-btn">确认</button>
  </div>
</template>

<script>
import Gmap from '@/mixins/GMap'
export default {
  name: "mapList",
  subtitle() {
    return '选择门店'
  },
  leftIcon() {
    return 'arrow-left'
  },
  mixins: [Gmap],
  data() {
    return {
      // 检索关键字
      searchKey: '',
      // 自定义输入地址
      diyAddress: ''
    }
  },
  mounted() {
    this.initGMap('mapList-wrap')
  },
  methods:{
  }
}
</script>

<style scoped lang="scss">
.mapList-wrap{
  width: 100%;
  height: 100vh;
}
.confirm-btn{
  width: 345px;
  margin: 0 15px;
  height: 45px;
  background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
  border-radius: 22px;
  position: fixed;
  left: 0;
  bottom: 10px;
  z-index: 10;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
}
.popup{
  width: 100%;
  height: 500px;
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 1px 9px 1px rgba(0,0,0,0.21);
  .drag-box{
    width: 35px;
    height: 5px;
    background: #D8D8D8;
    border-radius: 4px;
    margin: 10px auto;
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
.filter-box{
  display: flex;
  align-items: center;
  padding: 10px 10px 0 16px;
  .filter-address{
    font-size: 14px;
    font-weight: 600;
    color: #6B6B6B;
    line-height: 33px;
    svg{
      display: inline-block;
      width: 10px;
      margin-left: 5px;
      position: relative;
      top: 3px;
    }
  }
}
.filter-key{
  width: 225px;
  height: 30px;
  margin-left:10px;
  ::v-deep .van-search{
    padding: 0;
  }
}
.diy-address-box{
  display: flex;
  align-items: center;
  width: 100%;
  padding: 10px 15px 0 18px;
  position: relative;
  i{
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background-color:#F7B500;
  }
  &:after{
    width: 85%;
    height: 1px;
    background: #0A9B58;
    content: '';
    position: absolute;
    bottom: 0;
    left: 15px;
  }
  ::v-deep{
    .van-cell{
      width: 340px;
    }
  }
}
.store-list{
  padding: 20px 10px;
  &-item{
    height: 81px;
    background: #FFFFFF;
    box-shadow: 0 2px 5px 2px rgba(0,0,0,0.07);
    border-radius: 5px;
    position: relative;
    .store-name{
      font-size: 16px;
      font-weight: 600;
      color: #424242;
      position: absolute;
      top: 8px;
      left: 16px;
    }
    .store-address{
      font-size: 13px;
      font-weight: 400;
      color: #999999;
      text-align: left;
      position: absolute;
      top: 40px;
      left: 16px;
    }
    .location{
      display: inline-block;
      width: 11px;
      height: 14px;
      margin-right: 10px;
    }
  }
}
</style>
