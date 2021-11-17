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
          <img src="" alt="">
          <!-- 门店名称  -->
          <p class="store-name">德克士(火车站店)</p>
          <!-- 门店地址  -->
          <p class="store-address">
            <svg-icon icon-class="location" class-name="location"/>
            上海市静安区曹家渡万航渡路849号海森国际大厦(康定路)
          </p>
          <!-- 门店评分  -->
          <p class="store-score">4.7分</p>
        </div>
        <!-- 门店拜访时间  -->
        <div class="visit-table">
          <el-table
              :data="tableData"
              header-row-class-name="table-header"
              row-class-name="table-row"
              style="width: 100%">
            <el-table-column
                prop="date"
                label="到店日期">
            </el-table-column>
            <el-table-column
                prop="toShopTime">
              <template slot="header">
                <i class="icon FF6DD400"/>到店时间
              </template>
              <template slot-scope="scope">
                <i class="icon FF6DD400"/>
                {{scope.row.toShopTime}}
              </template>
            </el-table-column>
            <el-table-column
                prop="levelShopTime">
              <template slot="header">
                <i class="icon FA6400"/>离店时间
              </template>
              <template slot-scope="scope">
                <i class="icon FA6400"/>
                {{scope.row.levelShopTime}}
              </template>
            </el-table-column>
            <el-table-column
                prop="workTime"
                width="110px">
              <template slot="header">
                <i class="icon F7B500"/>在店时长
              </template>
              <template slot-scope="scope">
                <i class="icon F7B500"/>
                {{scope.row.workTime}}
                <svg t="1636444122404" class="right-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4209" width="200" height="200"><path d="M704.401891 534.469766l-336.793622 306.990475c-11.018133 10.945883-29.008396 10.945883-40.026529 0a28.148621 28.148621 0 0 1 0-39.845904l316.527482-288.494461L327.545615 224.697665a28.148621 28.148621 0 0 1 0-39.845905c11.018133-10.945883 29.008396-10.945883 40.026529 0l336.793622 306.990475c5.852254 5.888379 8.344881 13.619135 8.019756 21.277641 0.36125 7.730756-2.131377 15.461511-7.983631 21.34989z" fill="#cdcdcd" p-id="4210"></path></svg>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </dragBox>
    <!--头部筛选组件-->
    <organzieAndTime ref="organizeChild" @changeTime="changeTime" @changeExecutor="changeExecutor"/>
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
import statisticalReportApi from '@api/statisticalReportApi.js'
// 随机色
import { getRandomColor} from '@/utils'
// 图标 图片
import defaultIcon from '../../../public/img/store_visit/defaultLocation.png'
import activeIcon from '../../../public/img/store_visit/activeLocation.png'
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
      // 当前选中的是 组织 / 担当 : 默认担当
      currentType: 0,
      // 图标
      icon: {
        default: defaultIcon,
        activeIcon: activeIcon
      }
    }
  },
  mounted() {
    this.initGMap('map-box')
  },
  methods: {
    onClickLeft() {
      console.info('dadsdas')
      let returnStatus = this.$notice.$emit('getOrganizeLevel')
      if(returnStatus) {
        // todo 返回到 工作台
      }

    },
    // 获取线路详情数据
    getRouteInfo(){
      statisticalReportApi.getVisitStoreLine({
        "endDate": this.currentDate.endTime,
        "startDate": this.currentDate.startTime,
        "orgId": "",
        "reqType": "0", // 请求方式，0:人 1:部门
        "workUserNo": ""
      })
        .then(res => {
          // 数据结构 区分两种 0当担 1组织
          if(res.code === 200) {
            if(res.extData == 0) {
              this.routeDataExecutor = res.data
            }else{
              this.routeDataOrganize = res.data
            }
          }
        })
    },
    // 绘制路线 点位
    startDrawMap() {
      const { currentType, routeDataExecutor,  routeDataOrganize, icon} = this;
      let lineData = []
      let storeData = []
      if(currentType == 0) {
        lineData = [{
          path: routeDataExecutor.lineGeom,
          strokeColor: getRandomColor()
        }]
        storeData = routeDataExecutor.storeVos
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
          item.lng = item.signLng
          item.lat = item.signLat
          item.icon = icon.default
        }
      }
      // 绘制 线路
      this.drawLine({
        data: lineData
      })
      // 绘制 点位
      this.drawMark({
        data: storeData,
        callBack: (viaMarker, item) => {
          console.info(viaMarker, item)
        }
      })
      // 绘制名称
      this.drawText({
        data: storeData,
        nameKey: 'visitCount',
        icon: ''
      })

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
      color: #FA6400;
      position: absolute;
      right: 20px;
      top: 0;
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
</style>
