<template>
  <div class="wrap">
    <!-- 地图 -->
    <div id="map-content" class="map-content"></div>
    <!-- 头部-->
    <div class="header">
      <div class="left">
        <svg-icon icon-class="position" class-name="position"></svg-icon>
        <h5>{{ title }}</h5>
      </div>
      <div class="right">
        <!--  组织  -->
        <span @click="footprintStatus = !footprintStatus">
          <svg-icon icon-class="organization" class-name="tool-icon"></svg-icon>
        </span>
        <!--  检索  -->
        <span>
          <svg-icon icon-class="search" class-name="tool-icon"></svg-icon>
        </span>
      </div>
    </div>
    <!-- 功能入口   通过定位方式处理的 -->
    <div class="entry-box">
      <!--地图图层 -->
      <div class="map-ctr">
        <!-- 商圈图层 -->
        <div class="map-ctr-item" @click="openBusiness"><van-icon :name="bizDistrict" size="36"/></div>
        <!-- 网格图层 -->
        <div class="map-ctr-item"> <van-icon :name="grid" size="36"/></div>
        <!-- 人口热力图层 -->
        <div class="map-ctr-item"> <van-icon :name="heatMap" size="36" /></div>
      </div>
      <!-- 足迹 -->
      <div class="footprint" @click="pointStatus = !pointStatus">
        <svg-icon icon-class="footprint"></svg-icon>
      </div>
      <!-- 行程路线 -->
      <div class="router" @click="getRouterData">
        <svg-icon icon-class="routeIcon"></svg-icon>
      </div>
      <!--日期-->
      <div class="datepicker" @click="calendarShow = !calendarShow">
        <svg-icon icon-class="datePicker"></svg-icon>
      </div>
      <!-- 定位 -->
      <div class="position">
        <svg-icon icon-class="operate-location"></svg-icon>
      </div>
      <!-- 刷新 -->
      <div class="reload">
        <svg-icon icon-class="reload"></svg-icon>
      </div>
      <!-- 路线 图例 -->
      <div class="line">
        <van-icon :name="legendRoute" size="15"/>
        <span>路线</span>
      </div>
    </div>
    <!-- 弹出层 -->
    <van-popup v-model="footprintStatus" position="bottom" closeable :style="{ height: '70%' }" :round="true">
      <organize/>
    </van-popup>
    <!-- 计划 和 实际   -->
    <van-popup v-model="pointStatus" position="bottom" :style="{ height: '100%',width: '100%' }" >
      <pointList ref="pointChild" :timeRange="yetChooseTime"  @closePoint="closePoint"/>
    </van-popup>
    <!-- 日期组件 -->
    <van-calendar v-model="calendarShow" @confirm="onConfirmTime" :min-date="minDate" :max-date="maxDate"/>
  </div>
</template>

<script>
// 组织组件
import organize from "./components/organize";
// 实际/计划 点位
import pointList from "./components/pointList.vue"
// 时间格式化 工具函数
import moment from 'moment';
// 地图图层控制 图标
import bizDistrict from '../../../public/img/network-planning-views/bizDistrict.png'
import bizDistrictActive from '../../../public/img/network-planning-views/bizDistrictOn.png'
import grid from '../../../public/img/network-planning-views/grid.png'
import gridActive from '../../../public/img/network-planning-views/gridOn1.png'
import heatMap from '../../../public/img/network-planning-views/heatMap.png'
import heatMapActive from '../../../public/img/network-planning-views/heatMapOn.png'
import legendRoute from '../../../public/img/network-planning-views/route.png'

export default {
  name: "index",
  components: {
    organize,
    pointList
  },
  data() {
    return {
      // 网格图标
      grid: grid,
      // 网格图标 选中
      gridActive: gridActive,
      // 商圈图标
      bizDistrict: bizDistrict,
      // 商圈图标 选中
      bizDistrictActive: bizDistrictActive,
      // 人口热力图标
      heatMap: heatMap,
      // 人口热力图标 选中
      heatMapActive: heatMapActive,
      legendRoute: legendRoute,
      // 头部显示标题
      title: '万象城',
      // 高德地图实例化结果
      map: '',
      // 组织选择弹层控制
      footprintStatus: false,
      // 点位显示弹层控制
      pointStatus: false,
      // 时间选择弹层控制
      calendarShow: false,
      // 时间范围 最小值
      minDate: new Date(),
      // 时间范围 最大值
      maxDate: new Date(),
      // 选中的时间
      yetChooseTime: {
        start: '',
        end: ''
      }
    }
  },
  mounted() {
    // 地图初始化
    this.gdMapInit()
  },
  methods: {
    // 高德地图初始化
    gdMapInit() {
      this.map = new AMap.Map ('map-content', {
        resizeEnable: true,
        zoom: 5,
      })
      console.info(this.map)
    },
    // 开启商圈图层
    openBusiness() {},
    // 获取当前周
    getCurrentWeek() {
      let weekDay = moment().format('E')
      this.yetChooseTime.start = moment().subtract(weekDay, 'days').format('YYYY-MM-DD')
      this.yetChooseTime.end = moment().add(6 - weekDay, 'days').format('YYYY-MM-DD')
    },
    // 确认时间
    onConfirmTime(date) {
      this.calendarShow = !this.calendarShow;
      let weekDay = moment(date).format('d')
      let startTime = moment(date).subtract(weekDay, 'days').format('YYYY-MM-DD')
      let endTime = moment(date).add(6 - weekDay, 'days').format('YYYY-MM-DD')
      this.yetChooseTime.start = startTime
      this.yetChooseTime.end = endTime
    },
    // 关闭计划点弹层
    closePoint() {
      this.pointStatus = false
    },
    // 获取路线数据
    getRouterData() {
      // todo 接口
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
  .entry-box {
    %icon {
      width: 36px;
      height: 36px;
      cursor: pointer;

      svg {
        display: inline-block;
        width: 36px;
        height: 36px;
      }
    }
    .map-ctr{
      @extend %common;
      right: 10px;
      top: 120px;
      &-item{
        @extend %icon;
        background: #fff;
        margin-bottom:13px;
      }
    }
    .footprint {
      @extend %common;
      @extend %icon;
      right: 10px;
      top: 270px;
    }
    .router{
      @extend %common;
      @extend %icon;
      right: 10px;
      top: 315px;
    }

    .datepicker {
      @extend %common;
      @extend %icon;
      top: 120px;
      left: 10px;
    }

    .position {
      @extend %common;
      @extend %icon;
      background: #fff;
      bottom: 65px;
      left: 10px;
    }

    .reload {
      @extend %common;
      @extend %icon;
      bottom: 26px;
      left: 10px;
    }

    .line {
      @extend %common;
      width: 71px;
      height: 24px;
      line-height: 24px;
      background: #FFFFFF;
      border: 1px solid #DDDEE1;
      cursor: pointer;
      bottom: 26px;
      right: 10px;
      span{
        font-size: 12px;
        font-weight: 400;
        color: #495060;
        margin-left: 10px;
      }
    }
  }
</style>
