<!--访店记录-->
<template>
  <div class="record-wrap">
    <!-- 地图主体  -->
    <div id="map-box" class="map-box"></div>
    <!-- 筛选  -->
    <div class="filter-box" v-show="filterStatus">
      <!-- 筛选 人 -->
      <p class="filter-user" @click="openExecutor">
        <span>{{currentExecutor && currentExecutor.name}}</span>
        <svg t="1636353469658" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2479" width="16" height="16"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z" p-id="2480"></path></svg>
      </p>
      <!-- 筛选 时间 -->
      <p class="filter-time" @click="openTimePopup">
        <span>{{currentDate.startTime}}至{{currentDate.endTime}}</span>
        <svg t="1636353469658" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2479" width="16" height="16"><path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z" p-id="2480"></path></svg>
      </p>
    </div>
    <!-- 门店拜访信息  -->
    <dragBox v-show="storeStatus">
      <template slot="content">
        <!-- 门店信息  -->
        <div class="store-info">
          <!-- 门店图片  -->
          <img :src="tableData.length > 0 && tableData[0].iconUrl" alt="">
          <!-- 门店名称  -->
          <p class="store-name">{{tableData.length > 0 && tableData[0].storeName}}</p>
          <!-- 门店地址  -->
          <p class="store-address">
            <svg-icon icon-class="location" class-name="location"/>
            {{tableData.length > 0 && tableData[0].storeAddress}}
          </p>
          <!-- 关闭  -->
          <p @click="closeStoreDetail" class="store-score">
            <svg-icon icon-class="close"/>
          </p>
        </div>
        <!-- 门店拜访时间  -->
        <div class="visit-table">
          <el-table
              :data="tableData"
              header-row-class-name="table-header"
              row-class-name="table-row"
              style="width: 100%">
            <el-table-column
                prop="visitDate"
                label="访店日期">
            </el-table-column>
            <el-table-column
                prop="startTime">
              <template slot="header">
                <i class="icon FF6DD400"/>到店时间
              </template>
              <template slot-scope="scope">
                <i class="icon FF6DD400"/>
                {{scope.row.startTime}}
              </template>
            </el-table-column>
            <el-table-column
                prop="endTime">
              <template slot="header">
                <i class="icon FA6400"/>离店时间
              </template>
              <template slot-scope="scope">
                <i class="icon FA6400"/>
                {{scope.row.endTime}}
              </template>
            </el-table-column>
            <el-table-column
                prop="times"
                width="110px">
              <template slot="header">
                <i class="icon F7B500"/>在店时长
              </template>
              <template slot-scope="scope">
                <i class="icon F7B500"/>
                {{scope.row.times}}
                <svg t="1636444122404" class="right-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4209" width="200" height="200"><path d="M704.401891 534.469766l-336.793622 306.990475c-11.018133 10.945883-29.008396 10.945883-40.026529 0a28.148621 28.148621 0 0 1 0-39.845904l316.527482-288.494461L327.545615 224.697665a28.148621 28.148621 0 0 1 0-39.845905c11.018133-10.945883 29.008396-10.945883 40.026529 0l336.793622 306.990475c5.852254 5.888379 8.344881 13.619135 8.019756 21.277641 0.36125 7.730756-2.131377 15.461511-7.983631 21.34989z" fill="#cdcdcd" p-id="4210"></path></svg>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </dragBox>
    <!--头部筛选组件-->
    <organzieAndTime ref="organizeChild" @changeTime="changeTime" @changeExecutor="changeExecutor" :backUrl="backUrl"/>
  </div>
</template>

<script>
// 地图 mixin
import Gmap from '@/mixins/GMap'
// 拖拽组件
import dragBox from "@/components/dragBox";
// 头部筛选组件 方法
import organizeTime from "./minxins/organizeTime";
// 接口
import statisticalReportApi from '@api/statistical_report_api.js'
// 随机色
import { getRandomColor} from '@/utils'
// 列表详情 图标
import listDetail from '../../../public/img/store_visit/list-detail.png'
import {mapGetters} from "vuex";

export default {
  name: "storeVisitRecord",
  subtitle() {
    return '访店记录'
  },
  leftIcon() {
    return 'arrow-left'
  },
  onLeft() {
    return this.onClickLeft()
  },
  rightIcon() {
    return listDetail
  },
  rightTitle() {
    return '列表详情'
  },
  onRight() {
    return this.onClickRight()
  },
  mixins: [Gmap, organizeTime],
  components:{
    dragBox,
  },
  data() {
    return {
      // 门店拜访详细数据
      tableData: [],
      // 线路数据 执行者
      routeDataExecutor: '',
      // 线路数据 组织
      routeDataOrganize: '',
      // 当前选中的是 组织1 / 担当0 : 默认担当
      currentType: 1,
      // 当前查看的门店 mark
      viewMarker: '',
      // 当前查看门店 info
      viewStoreInfo: '',
      // 门店地图绘制结果
      storeMarkResult: '',
      // 线路地图绘制结果
      lineMapResult: '',
      // name
      titleName: '访店记录',
      // 回退地址
      backUrl: '/workbench'
    }
  },
  computed: {
    ...mapGetters(['userId', 'userName', 'userInfo'])
  },
  mounted() {
    this.initGMap('map-box')
    this.getRouteInfo()
    console.info(this.currentExecutor)
  },
  methods: {
    // 跳转至 列表详情
    onClickRight() {
      this.$router.push(`/statistical-report/list-details?startTime=${this.currentDate.startTime}&endTime=${this.currentDate.endTime}&Executor=`)
      // window.location.href = '/statistical-report/list-details'
    },
    // 数据更新
    updateData() {
      this.getRouteInfo()
    },
    // 获取线路详情数据
    getRouteInfo(){
      statisticalReportApi.getVisitStoreLine({
        "endDate": this.currentDate.endTime,
        "startDate": this.currentDate.startTime,
        "orgId": this.currentExecutor && this.currentExecutor.id,
        "reqType": this.currentExecutor && this.currentExecutor.type, // 请求方式，0:人 1:部门
        "workUserNo": this.currentExecutor && this.currentExecutor.id,
      })
        .then(res => {
          // 数据结构 区分两种 0当担 1组织
          if(res.code === 200) {
            if(res.extData === 0) {
              this.routeDataExecutor = res.data
            }else{
              this.routeDataOrganize = res.data
            }
            this.startDrawMap()
          }
        })
    },
    // 绘制路线 点位
    startDrawMap() {
      const { currentType, routeDataExecutor,  routeDataOrganize} = this;
      let lineData = []
      let storeData = []
      if(currentType === 1) {
        lineData = [{
          path: routeDataExecutor.lineGeom,
          strokeColor: getRandomColor()
        }]
        storeData = routeDataExecutor.routeVos
      } else {
        routeDataOrganize && routeDataOrganize.map(item => {
          item.workUserVos.map(routeItem => {
            // 收集路线数据
            lineData.push({
              path: routeItem.lineGeom,
              strokeColor: getRandomColor(),
            })
            storeData = storeData.concat(routeItem.routeVos)
          })
        })
      }
      //点位数据处理
      if(Array.isArray(storeData) && storeData.length > 0) {
        for(let item of storeData) {
          item.lat = item.signLat
          item.lng = item.signLng
          item.content = `<div class="store-icon"><p>${item.visitCount}</p></div>`
        }
      }
      console.log('路线数据',lineData)
      // 绘制 线路
     let lineResult = this.drawLine({
        data: lineData,
        alias: 'path',
       strokeWeight: 3
      })
      this.lineMapResult = lineResult
    console.log('点位数据', storeData)
      // 绘制 点位
     this.storeMarkResult = this.drawMark({
        data: storeData,
        callBack: (viaMarker, item) => {
          this.mapEvent(viaMarker, item)
        }
      })
      //放置到视图中
      this.map.setFitView(this.storeMarkResult)
    },
    // 地图点击事件
    mapEvent(viaMarker, item) {
      viaMarker.on('click',() =>{
        // 其他门店 选中状态回置
        for(let item of this.storeMarkResult){
          if(item !== viaMarker){
            let storeInfo = item.getExtData()
            item.setContent(`<div class="store-icon"><p>${storeInfo.visitCount}</p></div>`)
          }
        }
        this.viewMarker = viaMarker
        this.viewStoreInfo = item
        // 切换图标
        let activeDom = `<div class="store-icon store-active"><p>${item.visitCount}</p></div>`
        viaMarker.setContent(activeDom)
        // 因图片变大 调整偏移量
        viaMarker.setOffset(new AMap.Pixel(-15,-38))
        // 请求拜访信息
        this.getStoreVisitData(item.storeNo)
        // 移动地图 点位可视
        // this.map.panBy(0, -150)
      })
    },
    // 获取门店拜访信息
    getStoreVisitData(storeNo) {
      statisticalReportApi.getStoreVisitInfo({
        'work_user_no': this.currentExecutor && this.currentExecutor.id,
        'store_no':  storeNo,
        'start_date': this.currentDate.startTime,
        'end_date':  this.currentDate.endTime
      })
      .then(res => {
        if(res.code === 200) {
          this.tableData = res.data.signInfos
          this.storeStatus = true
        }
      })
    },
    // 关闭门店详情
    closeStoreDetail() {
      this.storeStatus = false
      this.tableData = []
      // 门店状态回置
      let defaultDom = `<div class="store-icon"><p>${this.viewStoreInfo.visitCount}</p></div>`
      this.viewMarker.setContent(defaultDom)
    }
  }
}
</script>

<style scoped lang="scss">
  .record-wrap{
    .map-box{
      width: 100%;
      height: 100vh;
    }
  }
  .filter-box{
    display: flex;
    align-items: center;
    width: 355px;
    height: 36px;
    background: #FFFFFF;
    box-shadow: 0 2px 5px 2px rgba(0,0,0,0.13);
    border-radius: 18px;
    padding: 0 3px;
    position: fixed;
    top: 55px;
    left: 10px;
    z-index: 10;
    svg{
      display: inline-block;
      width: 8px;
      position: relative;
      top: 3px;
      left: 3px;
    }
    .filter-user{
      width: 160px;
      font-size: 14px;
      font-weight: 600;
      color: #424242;
      position: relative;
      &:after{
        content: '';
        width: 1px;
        height: 23px;
        background-color: #B8B8B8;
        position: absolute;
        top: 0;
        right: 0;
      }
    }
    .filter-time{
      font-size: 14px;
      font-weight: 600;
      color: #424242;
      padding-left: 8px;
      span{
        margin-right: 5px;
      }
    }
  }
  .store-info{
    height: 90px;
    position: relative;
    img{
      display: inline-block;
      width: 102px;
      height: 68px;
      background: #EFEFEF;
      border-radius: 5px;
      position: absolute;
      top: 0;
      left: 10px;
    }
    .store-name{
      font-size: 17px;
      font-weight: 600;
      color: #424242;
      position: absolute;
      top: 0;
      left: 122px;
    }
    .store-address{
      font-size: 13px;
      font-weight: 400;
      color: #999999;
      padding-right: 10px;
      position: absolute;
      left: 122px;
      top: 30px;
      text-align: left;
      .location{
        display: inline-block;
        width: 11px;
        height: 14px;
        margin-right: 3px;
      }
    }
    .store-score{
      font-size: 14px;
      font-weight: 600;
      position: absolute;
      right: 20px;
      top: -15px;
      svg{
        width: 30px;
        height: 30px;
        font-weight: 600;
      }
    }
  }
  .visit-table{
    .icon{
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 8px;
      margin-right: 3px;
    }
    .FF6DD400{
      background-color: #6DD400;
    }
    .FA6400{
      background-color: #FA6400;
    }
    .F7B500{
      background-color: #F7B500;
    }
    .right-icon{
      display: inline-block;
      width: 20px;
      height: 20px;
      position: relative;
      top: 5px;
    }
  }
  .nav.nav-bar i.right-title{
    right: 0;
  }
</style>
<style lang="scss">
.table-header{
  background: #d8d8d882 !important;
  .el-table__cell{
    background: #d8d8d882 !important;
    font-size: 14px;
    font-weight: 600;
    color: #424242;
  }
}
.table-row{
  font-size: 14px !important;
  font-weight: 600;
  color: #424242;
}
.store-icon{
  width: 24px;
  height: 38px;
  position: relative;
  background-image:url('/img/store_visit/defaultLocation.png');
  background-repeat: no-repeat;
  background-size: contain;
  svg{
    width: 24px !important;
    height: 38px !important;
  }
  p{
    width: 24px;
    height: 20px;
    line-height: 25px;
    color: #fff;
    font-size: 12px;
    position: absolute;
    top:0;
    left: 0;
  }
}
.store-active{
  width: 30px;
  height: 46px;
  background-image:url('/img/store_visit/activeLocation.png');
  background-repeat: no-repeat;
  p{
    width: 30px;
    line-height: 32px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
  }
}
</style>
