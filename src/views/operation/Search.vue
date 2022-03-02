<template>
  <div v-show="showSearchPage" class="search-list-wrapper">
    <div v-if="false" class="top-title">
      <van-icon name="arrow-left" @click="handleClose" />
      <span>搜索</span>
    </div>
    <div class="content">
      <div class="search">
        <div class="search-input">
          <!-- <van-icon name="search" /> -->
          <van-icon name="arrow-left" @click="handleClose" />
          <input v-model="searchText" placeholder="请输入" type="text">
        </div>
        <van-icon name="close" @click="clearSearch" />
        <span class="search-btn" @click="onLoad">搜索</span>
      </div>
      <!-- mint方式-lazy加载  -->
      <div v-if="true" class="list">
        <!--        <ul-->
        <!--          v-show="!noData"-->
        <!--          v-infinite-scroll="onLoad"-->
        <!--          :infinite-scroll-disabled="searchLoading"-->
        <!--          infinite-scroll-distance="10">-->
        <ul
          v-show="!noData">
          <li
            v-for="(item, i) in searchPageList"
            :key="i"
            class="drawerItem"
            @click="showItem(item)">
            <van-icon name="location-o" size="14" />
            <div>
              <h4>{{ item.name }}</h4>
              <p>{{ item.address }}</p>
            </div>
          </li>
        </ul>
        <div v-show="noData" class="no-data">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Notify } from 'vant';
Vue.use(Notify);
import { InfiniteScroll } from 'mint-ui';
Vue.use(InfiniteScroll);
import MAP_API from '../../../api/map_api';
// 高德地图封装 mixin
import Gmap from '@/mixins/GMap';
export default {
  name: 'searchList',
  props: ['showSearchPage', 'GdMap'],
  // 混入 地图相关方法
  mixins: [Gmap],
  data() {
    return {
      userInfo: {},
      pickerInfo: {},
      searchText: '',
      searchLoading: false,
      finished: false,
      searchPageList: [],
      totalNum: 0, // 总条数
      pageNum: 0, // 页码
      pageSize: 10, // 每页条数
      timer: '', // 定时器
      noData: false,
      mapSearch: ''
    };
  },
  watch: {
    showSearchPage(val) {
      if (val) {
        this.clearSearch();
      }
    },
    // 检测输入值为空时 clear
    searchText(val) {
      if (!val) {
        this.clearSearch();
      }
    },
  },
  mounted() {
    this.initPoiSearch();
  },
  methods: {
    handleClose() {
      this.$emit('handleSearchPageClose', false);
      this.clearSearch();
    },
    onLoad() {
      console.info('dasds');
      this.searchPOI();
      // if (!this.showSearchPage) {
      //   return;
      // }
      // if (!this.searchText) {
      //   Notify({ type: 'warning', message: '请输入搜索关键字', duration: 1000 });
      //   return;
      // }
      // if (this.finished) {
      //   return;
      // }
      // if (!this.timer) {
      //   this.pageNum += 1;
      //   // 防止滑动时频繁请求
      //   this.timer = setTimeout(() => {
      //     this.getListData();
      //     this.timer = null;
      //   }, 1000);
      // }
    },
    // 从接口查询
    async getListData() {
      this.searchLoading = true;
      this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo')) || {};
      this.pickerInfo = JSON.parse(window.sessionStorage.getItem('pickerInfo')) || {};
      // 调用接口请求数据
      const params =
        // `?cityCode=${this.pickerInfo.fmCityCode}` + // 城市编码  200201010138
        `?pageNum=${this.pageNum}` +
        `&pageSize=${this.pageSize}` +
        `&keyword=${this.searchText}` +
        `&sales=${this.userInfo.tuId}`; // 担当id ${this.userInfo.tuId}
      const res = await MAP_API.getSearchReasult(params);
      const { code, data } = res;
      if (code == 200) {
        if (data && data.records && data.records.length) {
          data.records.forEach((el) => {
            this.searchPageList.push({
              name: el.pointName,
              address: el.pointAddress,
              location: `${el.gdLng},${el.gdLat}`,
            });
          });
        }
        this.totalNum = data && data.total ? this.total : 0;
        this.noData = this.totalNum === 0;

        // 数据全部加载完成
        if (this.searchPageList.length >= this.totalNum) {
          this.finished = true;
        }
      } else {
        Notify({ type: 'warning', message: '接口异常', duration: 1000 });
        this.finished = true;
      }
      // 加载状态结束
      this.searchLoading = false;
    },
    clearSearch() {
      this.searchText = '';
      this.searchPageList = [];
      this.finished = false;
      this.pageNum = 0;
      this.pageSize = 10;
      this.totalNum = 0;
      this.noData = false;
    },
    showItem(o) {
      // 高德API查询数据的结构：
      // const TEMP_GAODE = {
      //   name: '上海市',
      //   address: '黄浦区',
      //   location: '121.473667,31.230525',
      // }
      // 接口API查询数据结构：
      // const TEMP_API = {
      //   pointName: '上海市',
      //   pointAddress: '黄浦区',
      //   gdLng: '121.473667',
      //   gdLat: '31.230525'
      // }
      this.$emit('handleSearchPageClose', o);
      this.clearSearch();
    },
    // 初始化 地图检索
    initPoiSearch() {
      this.placeSearch({ pageSize: 20, map: this.GdMap, city: '全国' })
        .then(res => {
          this.mapSearch = res;
        })
        .catch(err => console.error(err));
    },
    // 地图POI 检索服务
    searchPOI() {
      const { mapSearch, searchText } = this;
      mapSearch.search(searchText, (status, result) => {
        if (status === 'complete') {
          if (result.poiList && result.poiList.pois) {
            result.poiList.pois.map(item => {
              this.searchPageList.push({
                name: item.pointName,
                address: item.address,
                location: `${item.location.lng},${item.location.lat}`,
              });
            });
          }
        }
      });
    },

  },
};
</script>

<style lang="scss" scoped>
.search-list-wrapper {
  width: 100%;
  background: #fff;
  z-index: 2001;
  // height: 100vh;
  height: calc(100% - 55px);
  position: absolute;
  left: 0;
  top: 50px;
  // top: 0;
  .top-title {
    font-size: 14px;
    text-align: center;
    height: 50px;
    line-height: 50px;
    position: relative;
    i {
      position: absolute;
      top: 20px;
      left: 10px;
    }
    span {
      display: inline-block;
      flex: 1;
    }
  }
  .content {
    height: 100%;
    .search {
      margin: 5px;
      height: 40px;
      border: 1px solid #dcdfe6;
      box-shadow: 0 0 2px 0 rgb(0 0 0 / 12%), 0 2px 2px 0 rgb(0 0 0 / 24%);
      .search-input {
        float: left;
        width: 285px;
        height: 30px;
        margin-top: 5px;
        // border-radius: 16px;
        position: relative;
        .van-icon-search,
        .van-icon-arrow-left {
          float: left;
          font-size: 18px;
          color: #000;
          height: 30px;
          width: 34px;
          line-height: 30px;
        }
        input {
          float: left;
          height: 30px;
          width: 240px;
          color: #606266;
          font-size: 14px;
        }
      }
      .van-icon-close {
        float: left;
        font-size: 18px;
        color: #ccc;
        height: 40px;
        width: 14px;
        line-height: 40px;
      }
      .search-btn {
        float: right;
        display: inline-block;
        margin: 4px 10px;
        padding-left: 10px;
        line-height: 30px;
        color: #409eff;
        font-size: 14px;
        border-left: 1px solid #ccc;
      }
    }
    .list {
      height: calc(100% - 50px);
      overflow-y: auto;
      margin: 5px;
      padding: 0 5px;
      box-shadow: 0 0 2px 0 rgb(0 0 0 / 12%), 0 2px 2px 0 rgb(0 0 0 / 24%);
      .drawerItem {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e8e8e8;
        padding-left: 15px;
        div {
          padding: 10px;
          h4 {
            margin: 0;
            text-align: left;
            font-size: 16px;
          }
          p {
            font-size: 14px;
            text-align: left;
          }
        }
      }
      .no-data {
        font-size: 16px;
        color: rgb(156, 154, 154);
        margin-top: 20px;
      }
    }
  }
}
</style>
