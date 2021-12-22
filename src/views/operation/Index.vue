<template>
  <main>
    <!-- 搜索 -->
    <div class='search-box'>
      <van-icon name='location' class='icon-location'/>
      <p>{{ pickerInfo.formattedAddress }}</p>
      <i class='icon-search' @click='isSearch = true'></i>
      <i class='icon-principal' @click='openFootprint()'></i>
    </div>

    <!-- 高德 -->
    <div id='container'></div>

    <!-- 地图效果展示 -->
    <div class='effect-display'>

      <i class='to-biz-district' :class='{ "on" : isHaveBizDistrictShow }' @click='getBizDistrictFn(1)'></i>
      <div v-show='isBizDistrictShow' class='biz-district-div'>
        <button v-for='(item, i) in bSList' :key='i' :class='item.isOn ? "on" : ""' :disabled="!item.count"
                @click='getBizFn(item.code)'>{{ item.name }}
        </button>
      </div>

      <i class='to-grid' :class="{'on': isGridShow}" @click='getGridOperFn(1)'></i>

      <i class='to-heat-map' :class="{'on': isHotPopulationShow}" @click='getHotPopulationFn(2)'></i>
      
      <!-- 足迹 -->
      <div class="footprint" @click="pointStatus = !pointStatus">
        <svg-icon icon-class="footprint"></svg-icon>
      </div>
      
      <!-- 行程路线 -->
      <div class="router" @click="openRoute">
        <svg-icon :icon-class="routeSwitch ? 'routeIconActive' : 'routeIcon'"></svg-icon>
      </div>
      <!--日期-->
      <div class="datepicker" @click="calendarShow = !calendarShow">
        <svg-icon icon-class="datePicker"></svg-icon>
      </div>
      <!-- 定位 -->
<!--      <div class="position">-->
<!--        <svg-icon icon-class="operate-location"></svg-icon>-->
<!--      </div>-->
    </div>

    <!--地图点位展示-->
    <div class='points-display'>
      <div class='title'>
        <h3 class='family' :class="{'on': points.isFamilyShow }" @click="togglePointsFn('isFamilyShow', 1)">
          <i>网点</i>
        </h3>
        <h3 class='competitive' :class="{'on': points.isCompetingShow }" @click="togglePointsFn('isCompetingShow', 1)">
          <i>竞品</i>
        </h3>
        <h3 class='baseplate' :class="{'on': points.isBpShow }" @click="togglePointsFn('isBpShow', 1)">
          <i>基盘</i>
        </h3>
      </div>
      <div class='cont'>
        <div v-show='points.isFamilyShow'>
          <div class='category'>
            <button v-for='(item, i) in familyListShadow' :key='i' :disabled='item.storeListNum == 0 || !item.isAllOn'
                    :class='item.isOn ? "on" : ""' @click='triggerArrBtnFn(familyListShadow, i, item)'>
              {{ item.layerName }}({{ item.storeListNum }})
            </button>
          </div>
          <van-switch class='toggle-btn' v-model='isFamilyChecked' size='29px' id=""
                      @change="triggerArrBtnFn(familyListShadow)"/>
        </div>
        <div v-show='points.isCompetingShow'>
          <div class='category'>
            <button v-for='(item, i) in competingListShadow' :key='i'
                    :disabled='item.storeListNum == 0 || !item.isAllOn' :class='item.isOn ? "on" : ""'
                    @click='triggerArrBtnFn(competingListShadow, i, item)'>{{ item.layerName }}({{ item.storeListNum }})
            </button>
          </div>
          <van-switch class='toggle-btn' v-model='isCompetingChecked' size='29px' id=""
                      @change="triggerArrBtnFn(competingListShadow)"/>
        </div>
        <div v-show='points.isBpShow'>
          <div class='category'>
            <button v-for='(item, i) in jListShadow' :key='i' :disabled='item.storeListNum == 0 || !item.isAllOn'
                    :class='item.isOn ? "on" : ""' @click='triggerArrBtnFn(jListShadow, i, item)'>
              基盘({{ item.storeListNum }})
            </button>
          </div>
          <van-switch class='toggle-btn' v-model='isBpChecked' size='29px' id=""
                      @change="triggerArrBtnFn(jListShadow)"/>
        </div>
      </div>
    </div>

    <!-- 搜索框 -->
    <Search :showSearchPage="isSearch" :pickerInfo="pickerInfo" @handleSearchPageClose="handleSearchPageClose"></Search>

    <!-- 门店、基盘、竞品详情-->
    <StoreDetail :id="baseInfoId" :baseInfoType="baseInfoType" :baseInfoShow="baseInfoShow" @handleBaseInfoDetailClose="handleBaseInfoDetailClose"></StoreDetail>

    <!-- 网格详情 -->
    <GridInfoDetail :gridInfoDetailShow="gridInfoDetailShow" :itemGridInfo="itemGridInfo" @handleGridInfoDetailClose="handleGridInfoDetailClose"></GridInfoDetail>

    <!-- 位置信息弹框 -->
    <PlanPositionPop
        :planPositionShow="planPositionShow"
        :positionData="pickerInfo"
        @handlePlanPositionPopClose="handlePlanPositionPopClose"
        @handleMunicipalPlanCreateShow="municipalPlanCreateShow = true,createType=0">
    </PlanPositionPop>

    <!-- 弹出层 历史记录及组织 -->
    <van-popup v-model="footprintStatus" position="bottom" closeable :style="{ height: '70%' }" :round="true">
      <organize :sessionKeyName="'journey'"/>
    </van-popup>

    <!-- loading -->
    <div class="loading-box" v-show="isLoading">
      <van-loading size="24px" color='#19BE6B'>定位中，请稍后...</van-loading>
    </div>
    <!-- 计划 和 实际   -->
    <van-popup v-model="pointStatus" position="bottom" :style="{ height: '100%',width: '100%' }" @open="getChildData">
      <pointList ref="pointChild" :timeRange="dateRange" @closePoint="closePoint"/>
    </van-popup>
    <!-- 日期组件 -->
    <van-calendar v-model="calendarShow" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate"/>
  </main>
</template>
<script>
// import { mGeolocation, mPositionPicker } from '@/utils/map.js';
import Vue from 'vue';
import {mGeolocation} from '@/utils/map.js';
import {Notify, Toast} from 'vant';
import moment from 'moment';

moment.locale('zh-cn')
Vue.use(Notify);
import pointList from "./components/pointList.vue"
import Search from './Search';
import organize from "./components/organize"
import StoreDetail from '@/components/StoreDetail';
import GridInfoDetail from '@/components/GridInfoDetail';
import PlanPositionPop from '@/components/PlanPositionPop';
import {mapGetters} from "vuex";
import MUNICIPAL_PLANNING_API from "../../../api/municipal_planning_api";

// 打卡入口图标
import clockIn from '../../../public/img/clockIn.png'
import routerMixins from "./mixins/router";
import JourNeyApi from "@api/journey_api";
export default {
  name: 'NetworkPlanningIndex',
  subtitle() {
    return 'Disco'
  },
  leftIcon() {
    return 'arrow-left'
  },
  // leftTitle () {
  //     return '关闭'
  // },
  // rightTitle () {
  //     return 'YYDS'
  // },
  rightIcon () {
      return clockIn
  },
  onLeft() {
    history.go(-1);
  },
  onRight () {
    return this.$router.push('/check-in/index')
  },
  components: {
    Search,
    organize,
    StoreDetail,
    GridInfoDetail,
    PlanPositionPop,
    pointList
  },
  mixins: [routerMixins],
  data() {
    return {
      dateRange: {planStartDate: '', planEndDate: ''},
      // 定位loading 控制
      isLoading: false,
      userInfo: {},
      isSearch: false,
      isPrincipal: false,
      footprintStatus: false,
      createType: '',
      //地图
      map: {},
      circle: {},
      centerMarker: {},
      geolocation: {},
      pickerInfo: {},
      status: 1, //页面状态：1.网点、竞品、基盘、商圈、网格展示，热力图隐藏； 2.热力图展示，网点、竞品、基盘、商圈、网格隐藏；

      //网点、竞品、基盘
      points: {
        isFamilyShow: false,
        isCompetingShow: false,
        isBpShow: false
      },
      isFamilyChecked: true,
      isCompetingChecked: true,
      isBpChecked: true,
      pointsList: [],
      tmpList: {},
      familyListShadow: [],
      competingListShadow: [],
      jListShadow: [],
      bgColorJson: {
        '基盘': {bgColor: 'hsla(270, 100%, 80%, 0.7)', borderColor: 'hsla(270, 100%, 80%, 0.7)'},
        '门店': {bgColor: 'hsla(340, 100%, 80%, 0.7)', borderColor: 'hsla(340, 100%, 80%, 0.7)'},
        '竞品': {bgColor: 'hsla(140, 100%, 70%, 0.7)', borderColor: 'hsla(140, 100%, 70%, 0.7)'}
      },
      mCluster: {},

      //商圈
      isBizDistrictShow: false,
      isHaveBizDistrictShow: false,
      bSList: [
        {code: '1', isOn: false, name: '小'},
        {code: '2', isOn: false, name: '中'},
        {code: '3', isOn: false, name: '大'},
        {code: '4', isOn: false, name: '担当'}
      ],
      bsObj: {},
      bsStyleArr: [
        {size: 1, style: {fillColor: 'rgba(169, 203, 240, 0.3)', strokeColor: 'rgba(169, 203, 240, 1)'}}, //蓝色 小商圈
        {size: 2, style: {fillColor: 'rgba(0, 255, 0, 0.3)', strokeColor: 'rgba(0, 255, 0, 1)'}},  //绿色 中商圈
        {size: 3, style: {fillColor: 'rgba(255, 0, 0, 0.3)', strokeColor: 'rgba(255, 0, 0, 1)'}}, //红色 大商圈
        {size: 4, style: {fillColor: 'rgba(245, 247, 13, 0.3)', strokeColor: 'rgba(245, 247, 13, 1)'}},  //黄色 担当商圈
      ],
      // getTextStyle(n) {
      //     return {
      //         size: n,
      //         style: {
      //             backgroundColor: 'rgba(0, 0, 0, 0.5)',
      //             border: 'none',
      //             color: '#fff',
      //             fontSize: '14PX',
      //             transform: 'scale(1)'
      //         }
      //     }
      // },

      //网格
      isGridShow: false,
      bufferPolygon: {},
      bufferArrObj: {},
      itemGridInfo: {}, //单个网格信息
      gridInfoDetailShow: false, //网格详情信息显示和隐藏

      //人口热力图
      isHotPopulationShow: false,
      heatmapObj: {},

      //页面跳转
      isPJumpShow: false,

      //其他
      baseInfoShow: false, // 基本信息pop显示和隐藏
      baseInfoId: '', // 基本信息id
      baseInfoType: '', // 基本信息Type
      planPositionShow: false, // 位置信息显示和隐藏
      municipalPlanCreateShow: false, // 市政规划反馈
      organizeObj: {},
      //市政规划点位
      municipalMarker: [], //市政规划点位实例集合
      municipalMarkerArr: [], //市政规划点位海量点实例集合
      municipalType: "", //市政规划类型 1:icon进入;2:列表进入
      iconUrl:"",   //图片地址
      // 行程开关
      routeSwitch: false
    }
  },
  created() {
    window.sessionStorage.removeItem('pickerInfo')
  },
  computed: {
    ...mapGetters('Itinerary', ['chooseTakeResponsibilityID', 'chooseTakeResponsibilityName', 'chooseTakeResponsibilityParenID'])
  },
  mounted() {

    this.map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 5,
      // center: [120.581807, 31.292088],//苏州
    });
    // todo 定位方法暂时注释
    this.geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000,
      buttonPosition: 'LB',
      buttonDom: '<img class="back-position" src="/img/network-planning-views/backPosition.png" />',
      buttonOffset: new AMap.Pixel(10, 50),
      zoomToAccuracy: true,
    });
    this.map.addControl(this.geolocation);
    this.map.addControl(new AMap.Scale());
    this.map.addControl(new AMap.ToolBar({liteStyle: true}));
    this.mapGeolocationFn();
    this.getCurrentWeek();

  },
  methods: {
    getCurrentWeek() {
      let weekDay = moment().format('E')
      this.dateRange.planStartDate = moment().subtract(weekDay, 'days').format('YYYY-MM-DD')
      this.dateRange.planEndDate = moment().add(6 - weekDay, 'days').format('YYYY-MM-DD')
    },
    mapGeolocationFn() {
      this.isLoading = true;
      mGeolocation(this.geolocation).then(res => {
        if (res.status != 'complete') {
          Notify({type: 'warning', message: res.result.message, duration: 1000});
        }
        this.mapPositionPickerFn();
      })
    },
    mapPositionPickerFn() {
      AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
        this.map.on('zoomend', () => {
          var zoom = this.map.getZoom();
          this.$store.commit("set_zoom", zoom);
        });
        var positionPicker = new PositionPicker({
          mode: 'dragMap',
          map: this.map,
          iconStyle: {
            url: '/img/network-planning-views/position-picker.png',
            size: [0, 0], //该marker没有点击事件 暂时隐藏
            ancher: [20, 20],
          }
        });
        positionPicker.on('success', res => {
          this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo')) || this.userInfo;

          const {position, regeocode} = res;
          const {formattedAddress} = regeocode;
          const {adcode, city, citycode, province} = regeocode.addressComponent;
          this.$store.commit("set_cityName", city ? city : province);
          this.$store.commit("set_cityCode", adcode);

          let cityName = city || province;
          this.pickerInfo = {
            adcode,
            citycode,
            city,
            province,
            position,
            formattedAddress,
          }
          this.addCenterMarker();

          let pi = window.sessionStorage.getItem('pickerInfo');
          let s = pi ? JSON.parse(pi) : null;
          // console.log("this.pickerInfo.citycode:", this.pickerInfo.citycode);
          // console.log("s.citycode:", s.citycode);
          this.isLoading = false;
          // if (!this.pickerInfo.fmCityCode) return;
          if (s == null || (s && this.pickerInfo.citycode != s.citycode)) {
            console.log('执行了');
            // setTimeout(() => {
            this.getFmTypeFn();
            this.getCompeterTypeFn();

            this.points = {
              isFamilyShow: false,
              isCompetingShow: false,
              isBpShow: false
            };
            this.isFamilyChecked = true;
            this.isCompetingChecked = true;
            this.isBpChecked = true
            this.tmpList = {}
            this.getChnlLocationByUserFn(); //加载网点、竞品、基盘数据
            // }, 10000)
            this.getBizSizeFn(); //加载商圈数量种类
            this.getBizFn(); //参数不传时，清空已有商圈
            this.isGridShow = false;
            this.status = 1;
          }
          if (this.isGridShow && this.status == 1) {
            this.getGridFn();
          }

          window.sessionStorage.setItem('pickerInfo', JSON.stringify(this.pickerInfo));
        });
        positionPicker.on('fail', err => {
          this.isLoading = false;
          // Notify({ type: 'warning', message: 'err PositionPicker', duration: 1000 });
          console.log('err PositionPicker:', err);
        });
        positionPicker.start();
      })
    },

    //中心点marker及半透明圆
    addCenterMarker() {
      let {lng, lat} = this.pickerInfo.position

      if (this.centerMarker) {
        this.map.remove(this.centerMarker)
      }
      if (this.circle) {
        this.map.remove(this.circle)
      }
      this.centerMarker = new AMap.Marker({
        position: [lng, lat],
        zIndex: 1301,
        icon: new AMap.Icon({
          size: new AMap.Size(35, 35),
          image: '/img/network-planning-views/centerLocation.png',
          imageSize: new AMap.Size(35, 35),
        }),
        offset: new AMap.Pixel(-16, -25)
      });
      this.centerMarker.on('click', () => {
        this.planPositionShow = true
        // this.municipalPlanCreateShow = true;
      })
      this.circle = new AMap.Circle({
        center: [lng, lat],
        zIndex: 1299,
        radius: 200, //半径
        fillColor: 'rgba(169, 203, 240, 0.3)', //填充颜色及透明度
        strokeColor: 'rgba(18, 150, 251, 1)', //线颜色及透明度
        strokeWeight: 0.5, //线粗细度
      });
      this.map.add([this.centerMarker, this.circle]);
    },

    //历史记录及组织
    openFootprint() {
      this.footprintStatus = !this.footprintStatus
    },

    //商圈
    getBizDistrictFn(status = 0) {
      if (status != 0) {
        this.status = status;
        // this.isBizDistrictShow = this.bSList.some(item => {return item.isOn}) ? true : !this.isBizDistrictShow;//如果分类有选中，则不能关闭
      }
      // else {
      this.isBizDistrictShow = !this.isBizDistrictShow;
      // }

      if (!this.isBizDistrictShow && this.status == 2) {
        this.getBizFn();
      }
    },
    getBizSizeFn() {
      this.$fetch.get(`/api/dev/biz/query/biz/size?tuId=${this.userInfo.tuId}`).then(res => {
        const {code, data, message} = res;
        if (code != 200 || !data) {
          Notify({type: 'warning', message, duration: 1000});
          return;
        }
        this.bSList.map(item => {
          data.map(o => {
            if (item.code == o.code) {
              item.count = o.count
            }
          })
        })
      })
    },
    // setText (data, style) {
    //     let jsons = [];
    //     if (data.gdLat && data.gdLng) {
    //         jsons.push (data.gdLng, data.gdLat);
    //     } else {
    //         return null;
    //     }
    //     let textInfo = new AMap.Text ({
    //         map: this.map,
    //         position: jsons,
    //         text: !data.tradeAreaName || data.tradeAreaName == 'null' ? '' : data.tradeAreaName,
    //     });
    //     textInfo.setStyle (style)
    //     return textInfo;
    // },
    setPolygon(data) {
      if (!data.gdGeom) return;
      let gdGeom = data.gdGeom;
      if (!gdGeom.features || !gdGeom.features[0].geometry) {
        console.log('没有商圈周边信息')
        return
      }
      return new AMap.Polygon({
        map: this.map,
        path: gdGeom.features[0].geometry.coordinates[0],
        cursor: 'pointer',
      });
    },
    getBizFn(tAlevel = -1) {
      this.isHaveBizDistrictShow = false;
      var oLevel = 0;
      this.bSList.map(item => {
        if (item.isOn) {
          oLevel = item.code
          item.isOn = !item.isOn
        }
        if (oLevel == tAlevel) {
          item.isOn = false;
        } else {
          item.isOn = item.code == tAlevel;
        }
      })

      Object.keys(this.bsObj).map(i => {
        this.map.remove(this.bsObj[i]);
        setTimeout(() => delete this.bsObj[i], 0);
      });

      if (this.bSList.filter(item => item.isOn).length) {
        this.isHaveBizDistrictShow = true;
        this.$fetch.get(`/api/dev/biz/query/biz?type=${tAlevel}&sales=${this.userInfo.tuId}`, {//type 是否就是 code
        }).then(res => {
          const { code, data, message } = res;
          if (code !== 200) {
            Notify({type: 'warning', message, duration: 1000});
            return
          }
          if (data.length == 0) {
            Notify({type: 'warning', message: '暂无数据', duration: 1000});
            return
          }
          if (!data[0].gdGeom) {
            Notify({type: 'warning', message: '商圈图层数据缺失', duration: 1000});
            return
          }
          let getStyleVal = this.bsStyleArr.filter(i => i.size == tAlevel)[0].style;
          // let getTextStyle = this.getTextStyle (tAlevel).style;
          // let arr1 = [], arr2 = [];
          let arr1 = [];
          data.map(item => {
            let p = this.setPolygon(item);
            // let t = this.setText (item, getTextStyle);
            if (p) {
              arr1.push(p);
            }
            // if (t) { arr2.push (t); }
          })

          let pf = new Date().getTime() + '_polygonOG';
          // let tf = new Date().getTime() + '_textArrOG';

          let {strokeColor, fillColor} = getStyleVal;
          this.bsObj[pf] = new AMap.OverlayGroup(arr1);
          this.bsObj[pf].setOptions({
            strokeColor: strokeColor || 'rgba(234, 222, 3, 0.8)',
            fillColor: fillColor || 'rgba(250, 251, 178, 0.5)',
            strokeWeight: 1.5,
            strokeStyle: 'solid',
            zIndex: 100
          })

          // this.bsObj[tf] = new AMap.OverlayGroup (arr2);
          // this.bsObj[tf].setOptions ({
          //     strokeStyle: getTextStyle.strokeStyle || 'solid',
          //     anchor: 'center',
          //     zIndex: 120
          // })

          setTimeout(() => {
            this.map.add(this.bsObj[pf]);
            // this.map.add (this.bsObj[pf], this.bsObj[tf]);
          }, 0);
          //  this.map.setFitView();
        })
      }
    },

    //网格
    getGridOperFn(status = 0) {
      if (status != 0) {
        this.status = status;
      }
      this.isGridShow = !this.isGridShow;

      Object.keys(this.bufferPolygon).map(i => {
        this.map.remove(this.bufferPolygon[i]);
        // this.bufferPolygon[i].setMap(null);
        setTimeout(() => delete this.bufferPolygon[i], 50);
      });

      if (this.isGridShow && this.status == 1) {
        this.getGridFn();
      }
    },
    getGridFn() {
      Object.keys(this.bufferPolygon).map(i => {
        this.map.remove(this.bufferPolygon[i]);
        // this.bufferPolygon[i].setMap(null);
        setTimeout(() => delete this.bufferPolygon[i], 50);
      });

      const {R, Q} = this.pickerInfo.position;
      this.$fetch.get(`/api/dev/grid/query/grid?lat=${Q}&lng=${R}`
      ).then(res => {
        let {code, data, message} = res;
        // let { code, data, message } = gridRes;
        if (code != 200 || !data) {
          Notify({type: 'warning', message, duration: 1000});
          return;
        }
        const tm = new Date().getTime();
        this.$set(this.bufferArrObj, tm, []);
        data.map((item, i) => {
          this.bufferPolygon[`${tm}_${i}`] = this.getGeoJSON(item, tm);
          this.map.add(this.bufferPolygon[`${tm}_${i}`]);
          // this.bufferPolygon[`${tm}_${i}`].setMap(this.map);
        });
        // console.log('this.bufferPolygon:', this.bufferPolygon);
      });
    },
    getGeoJSON(item, tm) {
      return new AMap.GeoJSON({
        geoJSON: item ? item.boundary : '', // GeoJSON对象
        getPolygon: (geoJson, lnglats) => {
          let gridPolygon = new AMap.Polygon({
            path: lnglats,
            anchor: 'middle-center',
            fillOpacity: 0.7,
            fillColor: item.color || '#d9c48e',
            // fillColor: '#d9c48e',
            strokeColor: '#FFF',
            strokeOpacity: 1,
            strokeWeight: 0.7,
            zIndex: 1300,
            cursor: 'pointer'
          })
          gridPolygon.on('click', () => {
            console.log('grid click !', item)
            this.itemGridInfo = {
              tileCode: item.gridId,
              type: item.level
            }
            this.gridInfoDetailShow = true
          })
          this.bufferArrObj[tm].push(gridPolygon);
          // console.log('this.bufferArrObj[tm]:', tm, this.bufferArrObj[tm]);
          return this.bufferArrObj[tm];
        }
      })
    },

    //人口热力图
    getHotPopulationFn(status = 0) {
      if (status != 0) {
        this.status = status;
      }
      this.isHotPopulationShow = !this.isHotPopulationShow;

      Object.keys(this.heatmapObj).map(i => {
        this.heatmapObj[i].setMap(null);
        setTimeout(() => delete this.heatmapObj[i], 0);
      });

      if (this.isHotPopulationShow) {
        // this.$fetch.get(`/api/dev/grid/query/phm?cityCode=${this.pickerInfo.fmCityCode}`, {}).then(
        this.$fetch.get(`/api/dev/grid/query/phm`, {}).then(
            res => {
              const { code, message, data } = res;
              if (code != 200 || !data) {
                Notify({type: 'warning', message, duration: 1000});
                return;
              }
              let heatmap;
              this.map.plugin(["AMap.Heatmap"], () => {
                heatmap = new AMap.Heatmap(this.map, {
                  // radius: 45, //给定半径
                  opacity: [0, 0.6],
                });
                heatmap.setDataSet({data, max: 100});
              });
              let tm = new Date().getTime();
              this.heatmapObj[tm] = heatmap;
              this.heatmapObj[tm].setMap(this.map);
            })
      }
    },

    //全家/竞品/基盘
    getFmTypeFn() {
      this.$fetch.get(`/api/dev/biz/query/store/type?tuId=${this.userInfo.tuId}`).then(res => {
        const {code, data, message} = res;
        if (code != 200 || !data) {
          Notify({type: 'warning', message, duration: 1000});
          return;
        }
        this.familyListShadow = [];
        data.map(o => {
          const {count, name} = o;
          let s = {layerName: name, storeListNum: count, isOn: false, isAllOn: true};
          this.familyListShadow.push(s);
        });
      });
    },
    getCompeterTypeFn() {
      this.$fetch.get(`/api/dev/biz/query/brand?tuId=${this.userInfo.tuId}`).then(res => {
        const {code, data, message} = res;
        if (code != 200 || !data) {
          Notify({type: 'warning', message, duration: 1000});
          return;
        }
        this.competingListShadow = [];
        data.map(o => {
          const {count, name} = o;
          let s = {layerName: name, storeListNum: count, isOn: false, isAllOn: true};
          this.competingListShadow.push(s);
        });
      });
    },

    makeClusterFn(title, type, list, pTitle) {
      // console.log('title, type, list, pTitle:', title, type, list, pTitle);
      const resArr = [];
      let idx = 0;
      if (title == '全家网点') {
        idx = 11;
        title = '门店';
      } else if (title == '竞品网点') {
        idx = 10;
        title = '竞品';
      } else if (title == '基盘') {
        idx = 9;
      }
      list.map(subItem => {
        let g = subItem.pointIcon ? subItem.pointIcon.split('/') : [];
        let imgName = g[g.length - 1];
        let iconItem = new AMap.Icon({
          size: new AMap.Size(20, 20),
          image: imgName ? `/img/network-planning-views/icon/${imgName}` : `/img/network-planning-views/icon/MCNCT000099.png`,
          imageSize: new AMap.Size(20, 20),
          imageOffset: new AMap.Pixel(0, 0)
        });
        let newitem = new AMap.Marker({
          position: [subItem.gdLng, subItem.gdLat],
          icon: iconItem,
          offset: new AMap.Pixel(-10, -10),
          zIndex: idx,
          extData: subItem
        })
        newitem.on('click', () => {
          // console.log('subItem:', subItem);
          this.baseInfoId = subItem.pointCode // 用作请求详情信息 subItem.pointCode '2'
          this.baseInfoType = subItem.pointType // 1基盘、2竞品、3本品
          this.baseInfoShow = true;
        })
        resArr.push(newitem);
      })
      if (resArr.length > 0) {
        let _renderClusterMarker = this.renderClusterMarker(resArr, title)
        this.map.plugin(["AMap.MarkerClusterer"], () => {
          let tm = pTitle + '_' + type + '_' + new Date().getTime();
          this.mCluster[tm] = new AMap.MarkerClusterer(
              this.map,
              resArr,
              {
                gridSize: 120,
                renderClusterMarker: _renderClusterMarker,
                maxZoom: 16
              }
          );
          // console.log('this.mCluster:', this.mCluster);
        })
      }
    },
    renderClusterMarker(markersArr, markerName) {
      if (markersArr && markersArr.length > 0) {
        let bgColorJson = this.bgColorJson[markerName]
        let count = markersArr.length
        let _renderClusterMarker = function (context) {
          var factor = Math.pow(context.count / count, 1 / 18);
          var div = document.createElement('div');
          var Hue = 180 - factor * 180;
          var bgColor = bgColorJson.bgColor;
          var fontColor = 'hsla(' + Hue + ',100%,20%,1)';
          var borderColor = bgColorJson.borderColor;
          var shadowColor = 'hsla(' + Hue + ',100%,50%,1)';
          div.style.backgroundColor = bgColor;
          var size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20);
          div.style.width = div.style.height = markerName.length * 15 * 2 + 'px';
          div.style.border = 'solid 1px ' + borderColor;
          div.style.borderRadius = size * markerName.length / 2 + 'px';
          div.style.boxShadow = '0 0 1px ' + shadowColor;
          div.innerHTML += markerName;
          div.innerHTML += context.count;
          div.style.lineHeight = markerName.length * 15 * 2 + 'px';
          div.style.color = fontColor;
          div.style.fontSize = '14px';
          div.style.textAlign = 'center';
          context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
          context.marker.setContent(div)
        }
        return _renderClusterMarker
      }
    },
    getChnlLocationByUserFn() {
      this.jListShadow = [];
      Object.keys(this.mCluster).map(i => {
        this.mCluster[i].setMap(null)
      });
      setTimeout(() => {
        Object.keys(this.mCluster).map(i => {
          delete this.mCluster[i]
        });
      }, 50);

      this.$fetch.get(`/api/dev/biz/query/store/sales?module=0&sales=${this.userInfo.tuId}&type=`).then(res => {//module=3 模块 0全部, 1基盘, 2竞品, 3网点
        const {code, data, message} = res;
        if (code != 200 || !data) {
          Notify({type: 'warning', message, duration: 1000});
          return;
        }
        this.pointsList = data;
        this.pointsList.map(s => {
          if (s.layerCategoryCode == '3' || s.layerCategoryCode == '2' || s.layerCategoryCode == '1') {
            this.makeClusterFn(s.layerCategoryName, s.subClassify.layerCode, s.subClassify.storeList, s.layerCategoryCode);
          }
        })

        this.pointsList.map(item => {
          const {layerCode, layerName, storeList} = item.subClassify;

          function getDataFn(arr) {
            arr.map(m => {
              if (m.layerName == layerName) {
                m.layerCode = layerCode;
                m.storeListNum = storeList.length;
                m.isOn = storeList.length > 0;
                m.layerCategoryCode = item.layerCategoryCode
              }
            })
          }

          if (item.layerCategoryCode == '3') {
            getDataFn(this.familyListShadow);
          } else if (item.layerCategoryCode == '2') {
            getDataFn(this.competingListShadow);
          } else if (item.layerCategoryCode == '1') {
            let o = {
              layerCode,
              layerName,
              storeListNum: storeList.length,
              isAllOn: true,
              layerCategoryCode: item.layerCategoryCode
            }
            o.isOn = storeList.length > 0;
            this.jListShadow.push(o);
          }
        })

      })
    },
    togglePointsFn(type, status = 0) {
      if (status != 0) {
        this.status = status;
      }

      let isTypeOn = false;
      Object.keys(this.points).map(item => {
        if (this.points[item] == true) {
          if (item == type) {
            isTypeOn = true;
          }
          this.points[item] = false;
        }
      });
      if (!isTypeOn) {
        // this.points[type] = true;
        this.points[type] = !this.points[type];
      }
    },
    triggerArrBtnFn(arr, idx = '-1', o = {}) {
      // console.log("arr, idx = '-1', o = {}:", arr, idx, o);
      if (idx >= 0) {
        arr.map((item, i) => {
          if (idx == i) {
            item.isOn = !item.isOn
          }
        })
        // console.log('arr:', arr);
        Object.keys(this.mCluster).map(i => {
          if (i.includes(o.layerCode)) {
            if (o.isOn) {
              this.mCluster[i].setMap(this.map);
            } else {
              this.mCluster[i].setMap(null);
            }
          }
        });
      } else {
        let layerCategoryCode = '';
        let isAllOn = '';
        var arr1 = [];
        console.log('传入数组：', arr);
        arr.map((item) => {
          if (item.layerCategoryCode == '3') {
            item.isAllOn = this.isFamilyChecked;
          } else if (item.layerCategoryCode == '2') {
            item.isAllOn = this.isCompetingChecked;
          } else if (item.layerCategoryCode == '1') {
            item.isAllOn = this.isBpChecked;
          }
          if (!layerCategoryCode) {
            layerCategoryCode = item.layerCategoryCode;
            isAllOn = item.isAllOn;
          }
          console.log('layerCategoryCode:', layerCategoryCode);
          if (item.isOn) {
            arr1.push(item.layerCode);
          }
        })

        this.tmpList[layerCategoryCode] = arr1
        console.log('this.tmpList:', this.tmpList);
        const arr2 = arr.filter(o => this.tmpList[layerCategoryCode].includes(o.layerCode))

        Object.keys(this.mCluster).map(i => {
          arr2.map(s => {
            if (i.includes(`${s.layerCategoryCode}_${s.layerCode}`)) {
              if (isAllOn) {
                this.mCluster[i].setMap(this.map);
              } else {
                this.mCluster[i].setMap(null);
              }
            }
          })
        });
      }
    },

    async handleBaseInfoDetailClose() {
      this.baseInfoShow = false
    },
    async handleGridInfoDetailClose() {
      this.gridInfoDetailShow = false
    },
    async handlePlanPositionPopClose() {
      this.planPositionShow = false
      // this.getChnlLocationByUserFn();//加载网点、竞品、基盘数据
      // this.map.setCenter()
    },
    handleSearchPageClose(o) {
      this.isSearch = false
      if (o && o.location) {
        this.map.setCenter(o.location.split(','))
      }
    },
    setText1(data, name) {
      let jsons = [];
      if (data.lat && data.lng) {
        jsons.push(data.lng, data.lat);
      } else {
        return null;
      }
      let textInfo = new AMap.Text({
        map: this.map,
        position: jsons,
        text: name,
      });
      // textInfo.setStyle (style)
      return textInfo;
    },
    // 关闭弹出层
    closeOrganize() {
      this.footprintStatus = false
      // todo 清除地图 根据选择担当 获取数据
      if (!this.chooseTakeResponsibilityID) return;
      const {planEndDate, planStartDate} = this.dateRange;
      let tuIds = Array.isArray(this.chooseTakeResponsibilityID) ? this.chooseTakeResponsibilityID
          : [{tuId: this.chooseTakeResponsibilityID, tuName: this.chooseTakeResponsibilityName}];

      Object.keys(this.organizeObj).map(i => {
        this.organizeObj[i].setMap(null);
        setTimeout(() => delete this.organizeObj[i], 100);
      });
      this.$fetch.post('/api/opt/plan/getRouteInfo', {planEndDate, planStartDate, tuIds}
      ).then(({code, data, message}) => {
        if (code != 200) {
          Notify({type: 'warning', message, duration: 1000});
          return;
        }
        if (!data || data.length == 0) {
          Notify({type: 'warning', message: '该担当暂无数据', duration: 1000});
          return;
        }

        let getCenterPosition = false;
        let position = {};
        let arr1 = [], arr2 = [];

        data.map(O => {
          if (!O.routeGeomBo) return;
          O.routeGeomBo.map(o => {
            if (!getCenterPosition && o.lng && o.lat) {
              getCenterPosition = true
              position = o
            }
            // if (!o.tuGdGeom || !o.tuGdGeom.features || o.tuGdGeom.features.length == 0) return;
            const gem = JSON.parse(o.tuGdGeom).features[0]
            if (gem) {
              // let c = this.getGeoJSON1(gem, O.tuColor);
              let c = new AMap.Polygon({
                // map: this.map,
                path: gem.geometry.coordinates[0],
                cursor: 'pointer',
                fillColor: O.tuColor,
                fillOpacity: 0.3,
              });
              arr1.push(c);
              let t = this.setText1(o, O.tuName);
              arr2.push(t);
            }
          })
        })
        let pf = new Date().getTime();
        this.organizeObj[`c_${pf}`] = new AMap.OverlayGroup(arr1);
        this.organizeObj[`t_${pf}`] = new AMap.OverlayGroup(arr2);

        setTimeout(() => {
          this.map.add(this.organizeObj[`c_${pf}`], this.organizeObj[`t_${pf}`]);
          // this.map.setCenter([position.lng, position.lat]);
          this.map.setZoomAndCenter(9, [position.lng, position.lat]);
          // setTimeout(() => { this.map.setFitView() }, 3000);
        }, 0);

        if (!getCenterPosition) {
          Notify({type: 'warning', message: '暂未获取到该担当数据', duration: 1000});
        }
      });
    },
    // 确认选中的时间
    onConfirm(date) {
      this.calendarShow = !this.calendarShow;
      let weekDay = moment(date).format('d')
      let startTime = moment(date).subtract(weekDay, 'days').format('YYYY-MM-DD')
      let endTime = moment(date).add(6 - weekDay, 'days').format('YYYY-MM-DD')
      this.dateRange.planStartDate = startTime
      this.dateRange.planEndDate = endTime

      //  更新页面部分数据
      this.footprintStatus = false
      // 行程
      if (this.routeSwitch) {
        // 清除地图
        this.clearAll()
        // 根据选择担当 获取路线 数据
        this.getRouteData()
      }
    },
    // 开启/关闭 路线
    openRoute() {
      // 行程路线 开关状态切换
      this.routeSwitch = !this.routeSwitch;
      if(this.routeSwitch) {
        this.getRouteData()
      } else {
        // 清除地图 行程路线
        this.clearAll()
        // todo 是否要开启其他
      }
    },
    // 获取路线信息
    getRouteData() {
      /**
       * todo 开启行程路线
       * 1： 清空地图上当前非行程部分绘制
       * 2： 获取当前用户行程路线数据
       */
      if (!this.chooseTakeResponsibilityID) {
        this.$notify({
          message: '请选择当担后进行查看',
          type: "warning"
        })
        return
      }
      JourNeyApi.getRouteInfo({
        // "endDate": this.dateRange.planEndDate,
        // "startDate": this.dateRange.planStartDate,
        // "reqType": '1',
        // "orgId": this.chooseTakeResponsibilityParenID,
        // "workUserNo": this.chooseTakeResponsibilityID
        "endDate": "2021-12-17",
        "orgId": "AA114010800000000",
        "reqType": "1",
        "startDate": "2021-12-17",
        "workUserNo":  Array.isArray(this.chooseTakeResponsibilityID)? this.chooseTakeResponsibilityID : [].concat(this.chooseTakeResponsibilityID)
      })
          .then(res => {
            if (res.code === 200) {
              this.routeDataOrganize = res.data
              this.startDrawMap()
            } else {
              this.$notify({
                type: 'warning',
                message: res.message,
              })
            }
          })
          .catch(err => console.error('请求路线信息数据报错', err))
    }

  },
  watch: {
    chooseTakeResponsibilityID: {
      immediate: true,
      handler: function () {
        console.info('选中担当', this.chooseTakeResponsibilityID)
        // 关闭组织选择弹层
        this.footprintStatus = false
        // todo 地址栏是否切换成 当担名称
        // this.title = this.chooseTakeResponsibilityName
      }
    },
    status(val) {
      console.log('status:', val);
      if (val == 1 && this.isHotPopulationShow) {
        //热力图隐藏
        this.getHotPopulationFn();
        console.log('热力图隐藏');
      }
      if (val == 2) {
        //网点、竞品、基盘隐藏
        if (this.points.isFamilyShow) {
          this.togglePointsFn('isFamilyShow');
        }
        if (this.points.isCompetingShow) {
          this.togglePointsFn('isCompetingShow');
        }
        if (this.points.isBpShow) {
          this.togglePointsFn('isBpShow');
        }
        if (this.isFamilyChecked) {
          this.isFamilyChecked = !this.isFamilyChecked;
          this.triggerArrBtnFn(this.familyListShadow);
        }
        if (this.isCompetingChecked) {
          this.isCompetingChecked = !this.isCompetingChecked;
          this.triggerArrBtnFn(this.competingListShadow);
        }
        if (this.isBpChecked) {
          this.isBpChecked = !this.isBpChecked;
          this.triggerArrBtnFn(this.jListShadow);
        }
        //商圈隐藏
        if (this.isBizDistrictShow) {
          this.getBizDistrictFn(); //执行商圈函数
        }
        //网格隐藏
        if (this.isGridShow) {
          this.getGridOperFn(); //执行网格函数
        }
        console.log('网点、竞品、基盘隐藏 商圈隐藏 网格隐藏');
      }
    },
  },
}
</script>
<style lang='scss'>
.municipal-plan-create-wrapper.pos-edit{
  top: 0;
}
.iconcreate{
  top:0;
}
main {
  position: relative;
  display: flex;
  height: 100vh;

  .search-box {
    z-index: 1;
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    padding: 8PX 0;
    height: 35px;
    background: #fff;

    i.icon-location {
      float: left;
      margin: 6px 0 0 10px;
      font-size: 18px;
      color: #930CA0;
    }

    p {
      float: left;
      padding-left: 5px;
      width: 270px;
      height: 32px;
      line-height: 32px;
      font-size: 18px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333;
    }

    i.icon-search,
    i.icon-principal {
      float: right;
      display: block;
      margin: 6px 15px 0 2px;
      width: 22px;
      height: 22px;
      background: url("/img/network-planning-views/search.png") no-repeat 0 0;
      background-size: 100% 100%;
      text-indent: -9999px;
    }

    i.icon-principal {
      margin: 6px 5px 0 2px;
      background: url("/img/network-planning-views/principal.png") no-repeat 0 0;
      background-size: 100% 100%;
    }
  }

  #container {
    flex: 1;
    flex-direction: row;
    width: 100%;
  }

  .effect-display {
    .to-biz-district {
      display: block;
      position: absolute;
      top: 125PX;
      right: 10PX;
      width: 36PX;
      height: 36PX;
      background: url('/img/network-planning-views/bizDistrict.png') no-repeat 0 0;
      background-size: 100% 100%;
    }

    .to-biz-district.on {
      background: url('/img/network-planning-views/bizDistrictOn.png') no-repeat 0 0;
      background-size: 100% 100%;
    }

    .biz-district-div {
      display: block;
      position: fixed;
      top: 125PX;
      right: 56PX;
      height: 36PX;
      background: #fff;

      button {
        width: 35px;
        height: 35px;
        border: 1PX solid #DDDEE1;
        border-right: 0 none;
        background: #fff;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #495060;
      }

      button.on {
        background: #19BE6B;
        color: #fff;
      }

      button:last-child {
        border-right: 1PX solid #DDDEE1;
      }

      button:disabled {
        color: #BBBEC4;
      }
    }

    .to-grid,
    .to-heat-map {
      display: block;
      position: absolute;
      top: 174PX;
      right: 10PX;
      width: 36PX;
      height: 36PX;
      background: url('/img/network-planning-views/grid.png') no-repeat 0 0;
      background-size: 100% 100%;
    }

    .to-grid.on {
      background: url('/img/network-planning-views/gridOn1.png') no-repeat 0 0;
      background-size: 100% 100%;
    }

    .to-heat-map {
      top: 220PX;
      background: url('/img/network-planning-views/heatMap.png') no-repeat 0 0;
      background-size: 100% 100%;
    }

    .to-heat-map.on {
      background: url('/img/network-planning-views/heatMapOn.png') no-repeat 0 0;
      background-size: 100% 100%;
    }
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
    %common {
      position: fixed;
      z-index: 10;
    }
    .footprint {
      @extend %common;
      @extend %icon;
      right: 10px;
      top: 270px;
      svg {
        display: inline-block;
        width: 36px;
        height: 36px;
      }
    }
    .datepicker {
      @extend %common;
      @extend %icon;
      top: 120px;
      left: 10px;
    }
    .router{
      @extend %common;
      @extend %icon;
      right: 10px;
      top: 315px;
    }
  }

  .points-display {
    position: fixed;
    z-index: 200;
    bottom: 0;
    left: 3%;
    width: 94%;
    border-radius: 2px;
    background: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);

    .title {
      width: 100%;
      display: flex;

      h3 {
        flex: 1;
        height: 36px;

        i {
          margin: 8px auto;
          display: block;
          width: 54px;
          height: 20px;
          text-indent: -9999px;
        }
      }

      h3.family i {
        background: url("/img/network-planning-views/pointsFamily.png") no-repeat 0 0;
        background-size: 100% 100%;
      }

      h3.family.on i {
        background: url("/img/network-planning-views/pointsFamilyOn.png") no-repeat 0 0;
        background-size: 100% 100%;
      }

      h3.competitive i {
        background: url("/img/network-planning-views/pointsCompetitive.png") no-repeat 0 0;
        background-size: 100% 100%;
      }

      h3.competitive.on i {
        background: url("/img/network-planning-views/pointsCompetitiveOn.png") no-repeat 0 0;
        background-size: 100% 100%;
      }

      h3.baseplate i {
        background: url("/img/network-planning-views/pointsBaseplate.png") no-repeat 0 0;
        background-size: 100% 100%;
      }

      h3.baseplate.on i {
        background: url("/img/network-planning-views/pointsBaseplateOn.png") no-repeat 0 0;
        background-size: 100% 100%;
      }
    }

    .cont {
      width: 100%;
      display: display;

      div {
        .category {
          padding: 0 10px 10px;
          height: 135px;
          border-top: 1PX solid #E9EAEC;
          border-bottom: 1PX solid #E9EAEC;
          overflow: scroll;

          button {
            float: left;
            margin: 10px 5px 0;
            width: 98px;
            height: 32px;
            color: #495060;
            font-size: 12px;
            background: #E9EAEC;
            border-radius: 16px;
            border: 1PX solid #E9EAEC;
          }

          button.on {
            color: #19BE6B;
            background: #E1FAED;
            border: 1PX solid #19BE6B;
          }

          button:disabled {
            color: #495060;
            background: #E9EAEC;
            border: 1PX solid #E9EAEC;
          }
        }

        .toggle-btn {
          float: right;
          margin: 9px 7px 8px 0;
        }

        .van-switch--on {
          background: #19BE6B !important;
        }
      }
    }
  }

        .category-filter {
            .to-category-filter {
                display: block;
                position: fixed;
                top: 312PX;
                right: 10PX;
                width: 36PX;
                height: 36PX;
                background: url('/img/network-planning-views/categoryFilter.png') no-repeat 0 0;
                background-size: 100% 100%;
            }
            .category-filter-div {
                width: 90%;
                height: 100%;
                .van-collapse {
                    padding-top: 50px;
                }
                .van-cell__title {
                    span {
                        float: left;
                        padding-left: 20PX;
                        font: 16px PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                        color: #1C2438;
                    }
                }
                .van-collapse-item {
                    border-bottom: 1px solid #F5F5F5;
                    .van-collapse-item__content {
                        overflow: hidden;
                        button {
                            float: left;
                            margin: 5px 3px;
                            width: 95px;
                            height: 31px;
                            background:#E9EAEC;
                            border-radius: 16px;
                            border: 1PX solid #E9EAEC;
                            color: #495060;
                            font-size: 12px;
                        }
                        button.on {
                            background: rgba(147, 12, 160, 0.1);
                            border: 1PX solid #930CA0;
                            color: #930CA0;
                        }
                    }
                }
                ul {
                    overflow-y: scroll;
                    li {
                        h6 {
                            overflow: hidden;
                            width: 100%;
                            height: 50PX;
                            line-height: 50PX;
                            text-align: left;
                            border-bottom: 1PX solid #F5F5F5;
                            span {
                                padding-left: 20PX;
                                font: 16PX PingFangSC-Medium, PingFang SC;
                                font-weight: 500;
                                color: #1C2438;
                            }
                            a {
                                float: right;
                                padding: 16PX 10PX 0 0;
                                font: 12PX PingFangSC-Regular, PingFang SC;
                                font-weight: 400;
                                color: #80848F;
                            }
                        }
                        > div {
                            display: none;
                            overflow: hidden;
                            padding: 0 0 15PX 10PX;
                            border-bottom: 1PX solid #F5F5F5;
                            button {
                                float: left;
                                margin: 10PX 11PX 0 0;
                                width: 98PX;
                                height: 31PX;
                                background:#E9EAEC;
                                border-radius: 16PX;
                                border: 1PX solid #E9EAEC;
                                color: #495060;
                                font-size: 12PX;
                            }
                            button.on {
                                background: rgba(147, 12, 160, 0.1);
                                border: 1PX solid #930CA0;
                                color: #930CA0;
                            }
                        }
                        > div.show {
                            display: block!important;
                        }
                    }
                    li.point {
                        border-bottom: 10PX solid #F5F5F5;
                    }
                }
            }
        }

        .page-jump {
            .to-page-jump {
                display: block;
                position: fixed;
                top: 266PX;
                right: 10PX;
                width: 36PX;
                height: 36PX;
                background: url('/img/network-planning-views/pageJump.png') no-repeat 0 0;
                background-size: 100% 100%;
            }
            .page-jump-div {
                width: 277px;
                height: 168px;
                overflow-y: scroll;
                background: rgba(255, 255, 255, 0.85);
                border-radius: 10px;
                dl {
                    float: left;
                    display: block;
                    padding: 21px 0 0 17px;
                    width: 50xp;
                    dt {
                        margin: 0 auto;
                        width: 44px;
                        height: 44px;
                        background: #fff;
                        .icon-municipal-plan {
                            margin-top: 6px;
                            font-size: 28px;
                        }
                        border-radius: 5px;
                    }
                    dd {
                        padding-top: 12px;
                        height: 16px;
                        font-size: 12px;
                        font-family: 'PingFang SC';
                        font-weight: 500;
                        color: #1C2438;
                        line-height: 16px;
                    }
                }
            }
        }
        .page-jump-show {
            .page-jump-div {
                display: block!important;
            }
        }

  .amap-geolocation-con {
    z-index: 10 !important;
    position: absolute !important;
    bottom: 83PX !important;
    left: 13PX !important;

    .back-position {
      width: 36PX;
      height: 36PX;
    }
  }

  .amap-scalecontrol {
    position: absolute !important;
    bottom: 45PX !important;
    left: 12PX !important;
  }

  .amap-toolbar {
    right: 10PX !important;
    bottom: 130PX !important;
  }

  .loading-box {
    position: absolute;
    z-index: 10000;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);

    .van-loading {
      padding-top: 260px;
    }

    .van-loading__text {
      font-weight: 600 !important;
    }
  }

}

.layout-container-nonav {
  main {
    .search-box {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
}
.store-icon{
  width: 14px;
  height: 14px;
  position: relative;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  border-radius: 50%;
}

</style>
