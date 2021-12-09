<template>
  <div class="mapList-wrap" id="mapList-wrap">
    <dragBox >
      <template slot="content">
        <!--  选择执行人  -->
        <div v-if="executorList && executorList.length >= 2" class="choose-user">
          <p class="choose-user-title" @click="getChoosePoi">请先选择执行人，再选择派遣门店</p>
          <div class="choose-user-content">
            <div v-for="item of executorList" :key="item.name" class="user-item" @click="chooseExecutor(item)">
              {{nameFilter(item.name)}}
              <svg-icon v-if="currenChooseExecutor === item.id" icon-class="yetChoose"></svg-icon>
            </div>
          </div>
          <div class="right-handle"></div>
        </div>
        <!--  筛选  -->
        <div class="filter-box">
          <!--  地址筛选  -->
          <div class="filter-address">
            <p @click="openAdministrative">
              <span>上海市-静安区</span>
              <svg t="1636353469658" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2479" width="16" height="16"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z" p-id="2480"></path></svg>
            </p>
          </div>
          <!--  关键字筛选  -->
          <div class="filter-key">
            <van-search v-model="searchKey" maxlength="20" placeholder="搜索"  shape="round" @search="searchPOI"/>
          </div>
        </div>
        <!-- 自定义 地址输入  -->
        <div class="diy-address-box">
          <i/>
          <van-search v-model="diyAddress"  maxlength="20"  placeholder="请输入地址"  shape="round" @clear="clearDiyAddress" @input="addressInput" @search="addressSearch"/>
        </div>
        <!-- 门店列表  -->
        <div class="store-list">
          <div v-for="item of storeList"
               :key="item.id"
               @click="chooseStore(item)"
               class="store-list-item">
            <span v-show="item.active" class="select-span"><svg-icon icon-class="choose-icon"/></span>
            <!-- 门店名称  -->
            <p class="store-name">{{item.name | ellipsisName(16)}}</p>
            <!-- 门店地址  -->
            <p class="store-address"> <svg-icon icon-class="location" class-name="location"/>{{item.address|ellipsisName(60)}}</p>
          </div>
        </div>
      </template>
    </dragBox>
    <!-- 行政组织结构弹层  -->
    <van-popup v-model="show" position="bottom" :style="{ height: '40%' }"  round  closeable />
    <button class="confirm-btn" @click="handleConfirm">确认</button>
  </div>
</template>

<script>
import Vue from 'vue';
import { Notify } from 'vant';
// 高德地图封装 mixin
import Gmap from '@/mixins/GMap';
// 名称处理函数
import { nameFilter } from '@/utils/index';
// 拖拽组件
import dragBox from '../dragBox';

Vue.use(Notify);
export default {
  name: 'mapList',
  // subtitle() {
  //   return '选择门店';
  // },
  // leftIcon() {
  //   return 'arrow-left';
  // },
  components:{ dragBox },
  props:{
    // 执行人 list
    executorList:{
      type: Array,
      require: true,
      default:function() {
        // todo 假数据
        return [
          {
            name: '殷梨亭',
            id: 1
          },
          {
            name: '纳兰容若',
            id: 2
          },
          {
            name: '朱九真',
            id: 3
          }
        ];
      }
    }
  },
  // 混入 地图相关方法
  mixins: [Gmap],
  data() {
    return {
      // 检索关键字
      searchKey: '',
      // 自定义输入地址
      diyAddress: '',
      // 自定义输入地址检索出的门店
      diyAddressStore: '',
      // 当前选中的执行人的ID
      currenChooseExecutor: '',
      // 当前选中的执行人的名称
      currenChooseExecutorName: '',
      // 地图检索 实例化对象
      mapSearch: '',
      // poi 检索出的门店列表
      storeList: [],
      /**
       * 执行人绑定的门店 Map
       *  key 执行人ID
       *  value 绑定门店ID
       */
      executorAssociateStoreMap: new Map(),
      // 行政组织弹层控制
      show: false
    };
  },
  filters: {
    ellipsisName(val, length) {
      if (val) {
        if (val.length > length) {
          return val.substring(0, length) + '...';
        } else {
          return  val;
        }
      }
    }
  },
  mounted() {
    // 初始化地图
    this.initGMap('mapList-wrap', () => {
      // 初始化地图检索
      this.initPoiSearch();
    });
    // 执行人默认值
    this.currenChooseExecutor =  this.executorList && this.executorList.length > 0 && this.executorList[0]['id'];
    this.currenChooseExecutorName =  this.executorList && this.executorList.length > 0 && this.executorList[0]['name'];
  },
  methods:{
    nameFilter,
    // 选择执行人
    chooseExecutor(item) {
      this.currenChooseExecutor = item.id;
      this.currenChooseExecutorName = item.name;
      this.storeActive();
    },
    // 初始化 地图检索
    initPoiSearch() {
      this.placeSearch({ pageSize: 10 })
        .then(res => {
          this.mapSearch = res;
        })
        .catch(err => console.error(err));
    },
    // 地图POI 检索服务
    searchPOI() {
      const { mapSearch, searchKey } = this;
      // 和自定义检索部分互斥
      this.mutuallyExclusive('search');
      mapSearch.search(searchKey, (status, result) => {
        console.info(result);
        if (status === 'complete') {
          this.storeList = result && result.poiList && result.poiList.pois;
          this.storeList &&  this.storeList.map(item => {
            this.$set(item, 'active', false);
          });
        }
      });
    },
    // 关键字检索 / 自定义检索 互斥处理
    mutuallyExclusive(type) {
      let { currenChooseExecutor, executorAssociateStoreMap } = this;
      let data = executorAssociateStoreMap.has(currenChooseExecutor) && executorAssociateStoreMap.get(currenChooseExecutor);
      if (!data) {
        return;
      }
      if (type === 'search') {
        // 清空 自定义地址部分检索内容
        data = {
          ...data,
          diyAddressStore: '',
          diyAddress: ''
        };
        this.diyAddress = '';
        this.diyAddressStore = '';
      } else {
        // 清空 绑定门店内容
        data = {
          ...data,
          storeList: []
        };
        this.storeList = [];
        this.searchKey = '';
      }
      executorAssociateStoreMap.set(currenChooseExecutor, data);
    },
    // 门店和执行人绑定
    chooseStore(storeItem) {
      const { executorAssociateStoreMap, currenChooseExecutor, currenChooseExecutorName, diyAddress, diyAddressStore } = this;
      // map中是否已存在
      let storeArray, activeStatus = true, defaultItem = {
        adName: storeItem.adname,
        cityName:storeItem.cityname,
        gdLat: storeItem.location.lat,
        gdLng: storeItem.location.lng,
        pname: storeItem.pname,
        poiAddress: storeItem.address,
        poiName:storeItem.name,
        id: storeItem.id
      };
      if (executorAssociateStoreMap.has(currenChooseExecutor)) {
        storeArray =  executorAssociateStoreMap.get(currenChooseExecutor).storeList;
        let Index;
        for (let i = 0; i < storeArray.length; i++) {
          if (storeArray[i].id === storeItem.id) {
            Index = i;
            break;
          }
        }
        if (storeArray && Index >= 0) {
          storeArray.splice(Index, 1);
          activeStatus = false;
        } else {
          storeArray.push(defaultItem);
        }
      } else {
        // 后端接口部分 入参使用
        storeArray = [defaultItem];
      }
      executorAssociateStoreMap.set(currenChooseExecutor, {
        name: currenChooseExecutorName,
        diyAddress: diyAddress,
        diyAddressStore: diyAddressStore,
        storeList: storeArray
      });
      // 状态绑定
      this.$set(storeItem, 'active', activeStatus);
    },
    // 门店状态切换
    storeActive() {
      let currenExecutorMapValue = this.executorAssociateStoreMap.get(this.currenChooseExecutor);
      let currenChooseStoreArray = currenExecutorMapValue && currenExecutorMapValue.storeList;
      this.diyAddressStore = '';
      this.diyAddress = '';
      this.storeList &&  this.storeList.map(item => {
        this.$set(item, 'active', currenChooseStoreArray && currenChooseStoreArray.filter(storeItem => storeItem.id === item.id).length > 0);
      });
      if (currenExecutorMapValue && currenExecutorMapValue.diyAddress) {
        this.diyAddress = currenExecutorMapValue.diyAddress;
        this.diyAddressStore = currenExecutorMapValue.diyAddressStore;
      }
    },
    // 获取选中的poi
    getChoosePoi() {
      if (this.executorAssociateStoreMap.size === 0) {
        return null;
      }
      let userStoreMappingVo = [];
      for (let [ key, value ] of this.executorAssociateStoreMap) {
        let item = {
          userName: value.name,
          userNo: key,
          poiList: value.storeList
        };
        // 自定义检索地址门店是否存在
        if (value.diyAddressStore) {
          item.poiList.push(value.diyAddressStore);
        }
        userStoreMappingVo.push(item);
      }
      return  userStoreMappingVo;
    },
    // 自定义地址 检索
    addressSearch() {
      const { mapSearch, diyAddress } = this;
      // 和自定义检索部分互斥
      this.mutuallyExclusive('diy');
      mapSearch.search(diyAddress, (status, result) => {
        if (status === 'complete') {
          let diyAddressStore = result && result.poiList && result.poiList.pois[0];
          this.diyAddressStore = {
            adName: diyAddressStore.adname,
            cityName:diyAddressStore.cityname,
            gdLat: diyAddressStore.location.lat,
            gdLng: diyAddressStore.location.lng,
            pname: diyAddressStore.pname,
            poiAddress: diyAddressStore.address,
            poiName:diyAddressStore.name,
            id: diyAddressStore.id
          };
          this.handleMap('search');
        } else {
          Notify ({ type: 'warning', message: '找不到信息，请重新输入', duration: 1000 });
          this.diyAddress = '';
        }
      });
    },
    // 自定义地址变更
    addressInput() {
      this.handleMap('input');
    },
    // 清除  自定义地址
    clearDiyAddress() {
      this.handleMap('clear');
    },
    // map 操作
    handleMap(type) {
      let value = {
        name: this.currenChooseExecutorName,
        diyAddress: this.diyAddress,
        diyAddressStore: '',
        storeList: []
      };
      if (type === 'search') {
        value.diyAddressStore =  this.diyAddressStore;
      }
      // map 赋值
      if (this.executorAssociateStoreMap.has(this.currenChooseExecutor)) {
        value.storeList = this.executorAssociateStoreMap.get(this.currenChooseExecutor).storeList;
        if (type === 'input') {
          value.diyAddressStore = this.executorAssociateStoreMap.get(this.currenChooseExecutor).diyAddressStore;
        }
      }
      this.executorAssociateStoreMap.set(this.currenChooseExecutor, value);
    },
    // 开启行政弹层
    openAdministrative() {
      this.show = !this.show;
    },
    /**
     * @description: 按钮-确认
     * @param {*}
     * @return {*}
     */
    handleConfirm() {
      let data = this.getChoosePoi();
      this.$emit('closeMapList', data);
    },
  }
};
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
  height: 415px;
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
    .van-search{
      padding:0;
    }
    .van-field__left-icon{
      display: none;
    }
    .van-search__content--round{
      border-radius: 0;
      background-color: #fff;
    }
    .van-cell{
      width: 340px;
    }
  }
}
.store-list{
  padding: 20px 10px;
  max-height: 400px;
  overflow-y: auto;
  &-item{
    height: 81px;
    background: #FFFFFF;
    box-shadow: 0 2px 5px 2px rgba(0,0,0,0.07);
    border-radius: 5px;
    position: relative;
    margin-bottom: 10px;
    &:last-child{
      margin-bottom: 170px;
    }
    .select-span{
      display: inline-block;
      width: 26px;
      height: 26px;
      position: absolute;
      top: 0;
      right: 0;
      svg{
        width: 26px;
        height: 26px;
      }
    }
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
