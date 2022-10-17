<template>
  <main>
    <!-- 搜索 -->
    <div class='search-box'>
      <van-icon name='location' class='icon-location' @click='openDemo' />
      <p>{{ routeSwitch ? chooseTakeResponsibilityName : pickerInfo.formattedAddress }}</p>
      <i class='icon-search' @click='isSearch = true' />
      <i class='icon-principal' @click='openFootprint()' />
    </div>

    <!-- 高德 -->
    <div id='container' />

    <!-- 区域范围内统计按钮  -->
    <div class="statistics-btn" @click="getViewStoreNum">在此区域内检索</div>

    <!-- 地图效果展示 -->
    <div class='effect-display'>
      <i class='to-biz-district' :class='{ "on" : isHaveBizDistrictShow }' @click='getBizDistrictFn(1)' />
      <div v-show='isBizDistrictShow' class='biz-district-div'>
        <button
          v-for='(item, i) in bSList'
          :key='i'
          :class='item.isOn ? "on" : ""'
          @click='getBizFn(item.code)'>
          {{ item.name }}
        </button>
      </div>

      <i class='to-grid' :class="{'on': isGridShow}" @click='getGridOperFn(1)' />

      <i class='to-heat-map' :class="{'on': isHotPopulationShow}" @click='getHotPopulationFn(2)' />

      <!-- 足迹 -->
      <div class="footprint" @click="pointStatus = !pointStatus">
        <svg-icon icon-class="footprint" />
      </div>

      <!-- 行程路线 -->
      <div class="router" @click="openRoute">
        <svg-icon :icon-class="routeSwitch ? 'routeIconActive' : 'routeIcon'" />
      </div>
      <!--日期-->
      <div class="datepicker" @click="calendarShow = !calendarShow">
        <svg-icon icon-class="datePicker" />
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
          <i><span /><div>本品</div></i>
        </h3>
        <h3 class='competitive' :class="{'on': points.isCompetingShow }" @click="togglePointsFn('isCompetingShow', 1)">
          <!--          竞品-->
          <i />
        </h3>
        <h3 class='baseplate' :class="{'on': points.isBpShow }" @click="togglePointsFn('isBpShow', 1)">
          <!--          基盘-->
          <i />
        </h3>
        <h3 class='businessDistrict' :class="{'on': points.isBzShow }" @click="togglePointsFn('isBzShow', 1)">
          <!--          商圈-->
          <i />
        </h3>
      </div>
      <div class='cont'>
        <div v-show='points.isFamilyShow'>
          <div class='category'>
            <button
              v-for='(item, i) in familyListShadow'
              :key='i'
              :disabled='item.storeListNum == 0 || !item.isAllOn'
              :class='item.isOn ? "on" : ""'
              @click='triggerArrBtnFn(familyListShadow, i, item)'>
              {{ item.layerName }}({{ item.storeListNum }})
            </button>
          </div>
          <van-switch
            id=""
            v-model='isFamilyChecked'
            class='toggle-btn'
            size='29px'
            @change="triggerArrBtnFn(familyListShadow)" />
        </div>
        <div v-show='points.isCompetingShow'>
          <div class='category'>
            <button
              v-for='(item, i) in competingListShadow'
              :key='i'
              :disabled='item.storeListNum == 0 || !item.isAllOn'
              :class='item.isOn ? "on" : ""'
              @click='triggerArrBtnFn(competingListShadow, i, item)'>
              {{ item.layerName }}({{ item.storeListNum }})
            </button>
          </div>
          <van-switch
            id=""
            v-model='isCompetingChecked'
            class='toggle-btn'
            size='29px'
            @change="triggerArrBtnFn(competingListShadow)" />
        </div>
        <div v-show='points.isBpShow'>
          <div class='category'>
            <button
              v-for='(item, i) in jListShadow'
              :key='i'
              :disabled='!item.isAllOn'
              :class='item.isOn ? "on" : ""'
              @click='triggerArrBtnFn(jListShadow, i, item)'>
              推荐基盘网格
              <!-- ({{ jListShadow.storeListNum }}) -->
              ({{ countBp }})
            </button>
          </div>
          <van-switch
            id=""
            v-model='isBpChecked'
            class='toggle-btn'
            size='29px'
            @change="triggerArrBtnFn(jListShadow)" />
        </div>
        <div v-show='points.isBzShow'>
          <div class='category'>
            <button
              v-for='(item, i) in bSCurrentList'
              :key='i'
              :disabled='!isHaveBizDistrictShow || (item.storeListNum == 0 || !item.isAllOn)'
              :class='item.isOn ? "on" : ""'
              @click='triggerArrBtnFn(bSCurrentList, i, item)'>
              {{ item.name }}({{ item.storeListNum }})
            </button>
          </div>
          <van-switch
            id=""
            v-model='isBzChecked'
            class='toggle-btn'
            size='29px'
            :disabled = "isHaveBizDistrictShow != true"
            @change="triggerArrBtnFn(bSCurrentList)" />
        </div>
      </div>
    </div>

    <!-- 搜索框 -->
    <Search :showSearchPage="isSearch" :pickerInfo="pickerInfo" :GdMap="map" @handleSearchPageClose="handleSearchPageClose" />

    <!-- 门店、基盘、竞品详情-->
    <StoreDetail :id="baseInfoId" :baseInfoType="baseInfoType" :baseInfoShow="baseInfoShow" @handleBaseInfoDetailClose="handleBaseInfoDetailClose" />

    <!-- 网格详情 -->
    <GridInfoDetail :gridInfoDetailShow="gridInfoDetailShow" :itemGridInfo="itemGridInfo" @handleGridInfoDetailClose="handleGridInfoDetailClose" />

    <!-- 位置信息弹框 -->
    <PlanPositionPop
      :planPositionShow="planPositionShow"
      :positionData="pickerInfo"
      @handlePlanPositionPopClose="handlePlanPositionPopClose"
      @handleMunicipalPlanCreateShow="municipalPlanCreateShow = true,createType=0" />

    <!-- 弹出层 历史记录及组织 -->
    <van-popup v-model="footprintStatus" position="bottom" closeable :style="{ height: '70%' }" :round="true">
      <organize :sessionKeyName="'journey'" />
    </van-popup>

    <!-- loading -->
    <div v-show="isLoading" class="loading-box">
      <van-loading size="24px" color='#19BE6B'>定位中，请稍后...</van-loading>
    </div>
    <!-- 计划 和 实际   -->
    <van-popup v-model="pointStatus" position="bottom" :style="{ height: '100%',width: '100%' }" @open="getChildData">
      <pointList ref="pointChild" :timeRange="dateRange" :pointStatus="pointStatus" @closePoint="closePoint" />
    </van-popup>
    <!-- 日期组件 -->
    <van-calendar
      v-model="calendarShow"
      type="range"
      :default-date='timeVal'
      :min-date="minDate"
      :max-date="maxDate"
      @select="selectTime"
      @confirm="onConfirm" />
    <!-- 商圈信息  -->
    <van-popup v-model="showBusiness" round closeable position="bottom" :style="{ height: '30%' }">
      <div class="business-title">商圈信息</div>
      <div v-if="BusinessData" class="business-message">
        <p class="cityName">{{ BusinessData.businessName?BusinessData.businessName:'--'|ellipsisName(10) }}</p>
        <div class="city-message"><span>城市名称：{{ BusinessData.cityName?BusinessData.cityName:'--' }}</span><span>城市等级：{{ BusinessData.cityLevel?BusinessData.cityLevel:'--' }}</span></div>
        <div class="city-message"><span class="sq">商圈业态：{{ BusinessData.typeName }}</span></div>
        <div class="city-show">
          <div class="city-show-list">
            <div class="num">{{ BusinessData.level?BusinessData.level:'--' }}</div>
            <div class="word">竞争力级别</div>
          </div>
          <div class="city-show-list">
            <div class="num">{{ BusinessData.storeNumber?BusinessData.storeNumber:'--' }}</div>
            <div class="word">可开店数</div>
          </div>
          <div class="city-show-list">
            <div class="num">{{ BusinessData.number?BusinessData.number:'--' }}</div>
            <div class="word">竞品数量</div>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="cityName">暂无数据</p>
      </div>
    </van-popup>
  </main>
</template>
<script>
// import { mGeolocation, mPositionPicker } from '@/utils/map.js';
import Vue from 'vue';
import { mGeolocation } from '@/utils/map.js';
import { Notify, Toast } from 'vant';
import moment from 'moment';

moment.locale('zh-cn');
Vue.use(Notify);
import pointList from './components/pointList.vue';
import Search from './Search';
import organize from './components/organize';
import StoreDetail from '@/components/StoreDetail';
import GridInfoDetail from '@/components/GridInfoDetail';
import PlanPositionPop from '@/components/PlanPositionPop';
import { mapGetters } from 'vuex';
import MUNICIPAL_PLANNING_API from '../../../api/municipal_planning_api';

// 打卡入口图标
import clockIn from '../../../public/img/clockIn.png';
import routerMixins from './mixins/router';
import JourNeyApi from '@api/journey_api';
export default {
  name: 'NetworkPlanningIndex',
  subtitle() {
    return 'Dicos';
  },
  leftIcon() {
    return 'arrow-left';
  },
  // leftTitle () {
  //     return '关闭'
  // },
  // rightTitle () {
  //     return 'YYDS'
  // },
  rightIcon() {
    return clockIn;
  },
  onLeft() {
    history.go(-1);
  },
  onRight() {
    return this.$router.push('/check-in/index');
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
      zoom: 15,
      dateRange: { planStartDate: '', planEndDate: '' },
      // 定位loading 控制
      isLoading: false,
      userInfo: {},
      isSearch: false,
      isPrincipal: false,
      footprintStatus: false,
      createType: '',
      // 地图
      map: {},
      circle: {},
      centerMarker: {},
      geolocation: {},
      pickerInfo: {},
      status: 1, // 页面状态：1.网点、竞品、基盘、商圈、网格展示，热力图隐藏； 2.热力图展示，网点、竞品、基盘、商圈、网格隐藏；

      // 网点、竞品、基盘
      aggList: [],
      geoGridsObj: {},
      points: {
        isFamilyShow: false,
        isCompetingShow: false,
        isBpShow: false,
        isBzShow: false,
      },
      countBp: 0,
      isFamilyChecked: true,
      isCompetingChecked: true,
      isBpChecked: true,
      isBzChecked: true,
      pointsList: [],
      tmpList: {},
      familyListShadow: [],
      competingListShadow: [],
      jListShadow: [{ layerName: '基盘', code: 'BP', storeListNum: 0, layerCategoryName: '基盘', layerCategoryCode: 'BP', isOn: true, isAllOn: true }],
      bzListShadow: [],
      bgColorJson: {
        // '基盘': {bgColor: 'hsla(270, 100%, 80%, 0.7)', borderColor: 'hsla(270, 100%, 80%, 0.7)'},
        // '门店': {bgColor: 'hsla(340, 100%, 80%, 0.7)', borderColor: 'hsla(340, 100%, 80%, 0.7)'},
        // '竞品': {bgColor: 'hsla(140, 100%, 70%, 0.7)', borderColor: 'hsla(140, 100%, 70%, 0.7)'}

        基盘: { background: 'hsla(270, 100%, 80%, 0.7)', borderColor: 'hsla(270, 100%, 80%, 0.7)' },
        本品网点: { background: 'hsla(340, 100%, 80%, 0.7)', borderColor: 'hsla(340, 100%, 80%, 0.7)' },
        竞品网点: { background: 'hsla(140, 100%, 70%, 0.7)', borderColor: 'hsla(140, 100%, 70%, 0.7)' }
      },
      mCluster: {},

      // 商圈
      isBizDistrictShow: false,
      isHaveBizDistrictShow: false,
      showBusiness: false,
      BusinessData: [],
      allBzList: [],
      bSList: [],
      bSCurrentList: [],
      bsObj: {},
      bsStyleArr: [
        { size: 1, style: { fillColor: 'rgba(95,172,252, 0.3)', strokeColor: 'rgba(95,172,252, 1)' } },
        { size: 2, style: { fillColor: 'rgba(10,173,92, 0.3)', strokeColor: 'rgba(10,173,92, 1)' } },
        { size: 3, style: { fillColor: 'rgba(181,107,4, 0.3)', strokeColor: 'rgba(181,107,4, 1)' } },
        { size: 4, style: { fillColor: 'rgba(255,1,38, 0.3)', strokeColor: 'rgba(255,1,38, 1)' } },
        { size: 5, style: { fillColor: 'rgba(142,7,163, 0.3)', strokeColor: 'rgba(142,7,163, 1)' } },
        { size: 6, style: { fillColor: 'rgba(48,91,204, 0.3)', strokeColor: 'rgba(48,91,204, 1)' } },
        { size: 7, style: { fillColor: 'rgba(10,115,0, 0.3)', strokeColor: 'rgba(10,115,0, 1)' } },
        { size: 8, style: { fillColor: 'rgba(103,83,14, 0.3)', strokeColor: 'rgba(103,83,14, 1)' } },
      ],
      bzObj: {},
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

      // 网格
      isGridShow: false,
      bufferPolygon: {},
      bufferArrObj: {},
      itemGridInfo: {}, // 单个网格信息
      gridInfoDetailShow: false, // 网格详情信息显示和隐藏

      // 人口热力图
      isHotPopulationShow: false,
      heatmapObj: {},

      // 页面跳转
      isPJumpShow: false,

      // 其他
      baseInfoShow: false, // 基本信息pop显示和隐藏
      baseInfoId: '', // 基本信息id
      baseInfoType: '', // 基本信息Type
      planPositionShow: false, // 位置信息显示和隐藏
      municipalPlanCreateShow: false, // 市政规划反馈
      organizeObj: {},
      // 市政规划点位
      municipalMarker: [], // 市政规划点位实例集合
      municipalMarkerArr: [], // 市政规划点位海量点实例集合
      municipalType: '', // 市政规划类型 1:icon进入;2:列表进入
      iconUrl: '',   // 图片地址
      // 行程开关
      routeSwitch: false,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2021, 10, 31),
      // 默认选中时间
      timeVal: [],
    };
  },
  created() {
    window.sessionStorage.removeItem('pickerInfo');
  },
  computed: { ...mapGetters('Itinerary', ['chooseTakeResponsibilityID', 'chooseTakeResponsibilityName', 'chooseTakeResponsibilityParenID']) },
  mounted() {
    this.map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 15,
      showIndoorMap: false,
      // center: [120.581807, 31.292088],//苏州
    });
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
    this.map.addControl(new AMap.ToolBar({ liteStyle: true }));
    this.mapGeolocationFn();
    this.getCurrentWeek();

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
  methods: {
    /**
     * 初始化时间 最小区间 - 最大且区间 （前4个月后2个月）
     * @return {[type]} [description]
     */
    initTime() {
      let year = moment().year();
      let month = moment().month() + 1;
      let minDate = moment(new Date(year, month, 1)).subtract(4, 'months').format('YYYY-MM-DD');
      let maxDate =  moment(new Date(year, month, 30)).add(2, 'months').format('YYYY-MM-DD');
      this.minDate = new Date(minDate);
      this.maxDate = new Date(maxDate);
    },
    openDemo() {
      location.href = 'https://dicos-1221-dh-mb-test.parramountain.com/demo';
    },
    getCurrentWeek() {
      let weekDay = moment().format('E');
      this.dateRange.planStartDate = moment().subtract(weekDay, 'days').format('YYYY-MM-DD');
      this.dateRange.planEndDate = moment().add(6 - weekDay, 'days').format('YYYY-MM-DD');
      this.timeVal = [
        new Date(this.dateRange.planStartDate),
        new Date(this.dateRange.planEndDate)
      ];
      this.initTime();
    },
    mapGeolocationFn() {
      this.isLoading = true;
      mGeolocation(this.geolocation).then(res => {
        this.map.setZoom(15);
        console.log('高德定位信息：', this.map.getZoom());
        if (res.status != 'complete') {
          Notify({ type: 'warning', message: res.result.message, duration: 1000 });
        }
        this.mapPositionPickerFn();
      });
    },
    mapPositionPickerFn() {
      AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
        this.map.on('zoomend', () => {
          var zoom = this.map.getZoom();
          this.zoom = this.map.getZoom();
          this.$store.commit('set_zoom', zoom);
          setTimeout(() => {
            // this.getChnlLocationByUserFn(); //加载网点、竞品、基盘数据
            this.choosePointType();
          }, 300);
        });
        var positionPicker = new PositionPicker({
          mode: 'dragMap',
          map: this.map,
          iconStyle: {
            url: '/img/network-planning-views/position-picker.png',
            size: [0, 0], // 该marker没有点击事件 暂时隐藏
            ancher: [20, 20],
          }
        });
        positionPicker.on('success', res => {
          this.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo')) || this.userInfo;

          const { position, regeocode } = res;
          const { formattedAddress } = regeocode;
          const { adcode, city, citycode, province } = regeocode.addressComponent;
          this.$store.commit('set_cityName', city ? city : province);
          this.$store.commit('set_cityCode', adcode);

          let cityName = city || province;
          this.pickerInfo = {
            adcode,
            citycode,
            city,
            province,
            position,
            formattedAddress,
          };
          this.addCenterMarker();

          let pi = window.sessionStorage.getItem('pickerInfo');
          let s = pi ? JSON.parse(pi) : null;
          // console.log("this.pickerInfo.citycode:", this.pickerInfo.citycode);
          // console.log("s.citycode:", s.citycode);
          this.isLoading = false;
          // if (!this.pickerInfo.fmCityCode) return;
          // if (s == null || (s && this.pickerInfo.citycode != s.citycode)) {
          if (s == null) {
            setTimeout(() => {
              this.init();

            }, 1000);
            this.isGridShow = false;
            this.status = 1;
          }
          if (s == null || s && this.pickerInfo.citycode != s.citycode) {
            this.getBizFn(); // 参数不传时，清空已有商圈
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
      });
    },

    // 中心点marker及半透明圆
    addCenterMarker() {
      let { lng, lat } = this.pickerInfo.position;

      if (this.centerMarker) {
        this.map.remove(this.centerMarker);
      }
      if (this.circle) {
        this.map.remove(this.circle);
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
        this.planPositionShow = true;
        // this.municipalPlanCreateShow = true;
      });
      this.circle = new AMap.Circle({
        center: [lng, lat],
        zIndex: 1299,
        radius: 200, // 半径
        fillColor: 'rgba(169, 203, 240, 0.3)', // 填充颜色及透明度
        strokeColor: 'rgba(18, 150, 251, 1)', // 线颜色及透明度
        strokeWeight: 0.5, // 线粗细度
      });
      this.map.add([this.centerMarker, this.circle]);
    },

    // 历史记录及组织
    openFootprint() {
      this.footprintStatus = !this.footprintStatus;
    },
    init() {
      this.getBizSizeFn(); // 加载商圈数量种类
      this.getFmTypeFn();
      this.getCompeterTypeFn();
      this.getBpFn();

      this.points = {
        isFamilyShow: false,
        isCompetingShow: false,
        isBpShow: false,
        isBzShow: false
      };
      this.isFamilyChecked = true;
      this.isCompetingChecked = true;
      this.isBpChecked = true;
      this.isBzChecked = true;
      // this.tmpList = {}
      this.getChnlLocationByUserFn(); // 加载网点、竞品、基盘数据
    },
    // 商圈
    getBizSizeFn() {
      this.bSList = [];
      // this.$fetch.get(`/api/dev/biz/query/biz/size?cityCode=${this.pickerInfo.adcode}&tuId=${this.userInfo.tuId}`).then(res => { // 510100
        // const { code, data, message } = res;
        // if (code != 200 || !data) {
        //   Notify({ type: 'warning', message, duration: 1000 });
        //   return;
        // }
        // data.map(item => {
        //   let s = { name: item.name.split('')[0], code: item.code, brandList: item.brandList, count: item.brandList.filter(s => s.count > 0).length, list: [], isOn: false };
        //   s.brandList.map(sItem => {
        //     let w = { code: sItem.code, name: sItem.name, pName: '商圈', pCode: item.code, storeListNum: sItem.count, count: sItem.count, isOn: false, isAllOn: true };
        //     s.list.push(w);
        //   });
        //   this.bSList.push(s);
        // });
        // this.bSCurrentList = this.bSList[0].list;
      // });
      this.$fetch.get(`/api/dev/biz/business/type?cityCode=${this.pickerInfo.adcode}&tuId=${this.userInfo.tuId}`).then(res => { // 510100
        const { code, data, message } = res;
        if (code != 200 || !data) {
          Notify({ type: 'warning', message, duration: 1000 });
          return;
        }
        this.allBzList = data;
        this.bSCurrentList = [];
        Object.keys(data.typelist).forEach((key) => {
          let s = { name: key, code: key, list: [], isOn: true }
          data.typelist[key].map(o => {
            let w = { code: o.businessCode, name: o.businessType, pName: o.businessLevel, pCode: '', storeListNum: o.businessTypeCount, count: o.businessTypeCount, isOn: true, isAllOn: true };
            s.list.push(w);
          });
          this.bSList.push(s);
        })
        // console.log('this.bSList OK:', this.bSList);
        data.allList.map(o => {
          let w = { code: o.businessCode, name: o.businessType, pName: '商圈', pCode: '1', storeListNum: o.businessTypeCount, count: o.businessTypeCount, isOn: true, isAllOn: true };
          this.bSCurrentList.push(w);
        });
        // console.log('this.bSCurrentList OK:', this.bSCurrentList);
      });
    },

    getBizDistrictFn(status = 0) {
      if (this.isBizDistrictShow && !this.bSList.some(item => {return item.isOn})) {
        this.isBizDistrictShow = false;
        return false;
      }
      if (status != 0) {
        this.status = status;
        this.getBizFn();
        // this.isBizDistrictShow = this.bSList.some(item => {return item.isOn}) ? true : !this.isBizDistrictShow;//如果分类有选中，则不能关闭
      }
      // else {
      this.isBizDistrictShow = !this.isBizDistrictShow;
      // }

      if (!this.isBizDistrictShow && this.status == 2) {
        this.getBizFn();
      }
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
    setPolygon(data, fillColor = '', strokeColor = '') {
      if (!data.gdGeom) {
        return;
      }
      let gdGeom = data.gdGeom;
      if (!gdGeom.features || !gdGeom.features[0].geometry) {
        console.log('没有商圈周边信息');
        return;
      }
      return new AMap.Polygon({
        map: this.map,
        path: gdGeom.features[0].geometry.coordinates[0],
        cursor: 'pointer',
        strokeColor,
        fillColor,
      });
    },
    getBizFn(tAlevel = '', subCode = '') {
      var subCodeStr = '';
      if (tAlevel != '') {
        var arrBMod = [];
        this.bSList.map(s => {
          if (s.name == tAlevel) { s.isOn = !s.isOn; }
          if (s.isOn == true) { arrBMod.push(s.code); }
        })
        const arrBStr = arrBMod.join();
        tAlevel = arrBStr;

        var arrMod = [];
        this.bSCurrentList.map(a => {
          if (a.isOn == true) { arrMod.push(a.code); }
        })
        subCodeStr = arrMod.join();

        // this.bSCurrentList = this.bSList.filter(item => item.code == tAlevel)[0].list;
        const bSCurrentList = JSON.parse(JSON.stringify(this.bSCurrentList));
        bSCurrentList.map(t => {
          t.storeListNum = 0;
        });
        if (arrBMod.length > 0) {
          arrBMod.map(w => {
            this.allBzList.typelist[w].map(q => {
              bSCurrentList.map(t => {
                if (q.businessType == t.name) {
                  t.storeListNum += q.businessTypeCount;
                }
              });
              console.log('bSCurrentList:', bSCurrentList);
            })
          })
        }
        this.bSCurrentList = JSON.parse(JSON.stringify(bSCurrentList));
      } else {
        this.bSCurrentList.map(s => { s.storeListNum = 0 });
        this.bSList.map(item => {
          item.isOn = true;
          // item.list.map(s => {
          //   s.isOn = true;
          //   s.isAllOn = item.isOn;
          // })

            this.allBzList.typelist[item.name].map(q => {
              this.bSCurrentList.map(t => {
                if (q.businessType == t.name) {
                  t.storeListNum += q.businessTypeCount;
                }
              });
              
            })
        });
        console.log('this.bSList:::', this.bSList);
      }
      this.isHaveBizDistrictShow = this.bSList.some(item => {return item.isOn}) && this.status == 1;//如果分类有选中，则不能关闭

      Object.keys(this.bsObj).map(i => {
        this.map.remove(this.bsObj[i]);
        setTimeout(() => delete this.bsObj[i], 50);
      });

      if (this.bSList.filter(item => item.isOn).length 
          && this.bSCurrentList.filter(item => item.isOn).length
          && this.bSCurrentList.filter(item => item.isAllOn).length
          && this.status == 1) {
        this.$fetch.get(`/api/dev/biz/query/biz?cityCode=${this.pickerInfo.adcode}&model=${tAlevel}&sales=${this.userInfo.tuId}&type=${subCodeStr}`, {}).then(res => {
          const { code, data, message } = res;
          if (code !== 200) {
            Notify({ type: 'warning', message, duration: 1000 });
            return;
          }
          if (data.length == 0) {
            Notify({ type: 'warning', message: '暂无数据', duration: 1000 });
            return;
          }
          var markerArr = [];
          Object.keys(data).map(item => {
            data[item].map(sitem => {
              var marker = new AMap.Marker({
                content: `<img style="width: 22px; height: 27px;" src="/img/network-planning-views/icon/districtIcon_${sitem.confirmStatus}.png" />`,
                position: [sitem.lng, sitem.lat],//[116.418481, 39.90833],//,//[116.418481, 39.90833], // 基点位置//new AMap.LngLat(lng, lat),
                offset: new AMap.Pixel(0, 0), // 设置点标记偏移量
              });
              // console.log('marker:',sitem, marker);
              marker.on('click', () => {
                // this.showBusiness = true;
                // if (event) {
                //   event.preventDefault();
                // }
                // let code = sitem.cityCode;
                // let name = sitem.bpName;//sitem.tradeAreaName;
                // this.$fetch.post('/api/store/dev/map/business/info', { code, name }).then(res => {
                //   this.BusinessData = res.data;
                // });
                this.baseInfoId = sitem.bpCode; // 用作请求详情信息 subItem.pointCode '2'
                this.baseInfoType = 1; // 1基盘、2竞品、3本品
                this.baseInfoShow = true;
              });
              markerArr.push(marker);
              let pf = new Date().getTime();
              this.bsObj[pf] = markerArr;
            })
          })

          setTimeout(() => {
            this.map.add(markerArr);
            // this.map.setFitView();
          }, 0);
        });
      }
    },

    // 网格
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

      const { R, Q } = this.pickerInfo.position;
      this.$fetch.get(`/api/dev/grid/query/grid?lat=${Q}&lng=${R}`
      ).then(res => {
        let { code, data, message } = res;
        // let { code, data, message } = gridRes;
        if (code != 200 || !data) {
          Notify({ type: 'warning', message, duration: 1000 });
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
          });
          gridPolygon.on('click', () => {
            console.log('grid click !', item);

            this.itemGridInfo = {
              tileCode: item.geohashValue,
              type: item.level
            };
            this.gridInfoDetailShow = true;
          });
          this.bufferArrObj[tm].push(gridPolygon);
          // console.log('this.bufferArrObj[tm]:', tm, this.bufferArrObj[tm]);
          return this.bufferArrObj[tm];
        }
      });
    },

    // 人口热力图
    getHotPopulationFn(status = 0, zoomChange = false) {
      if (status != 0) {
        this.status = status;
      }
      if (!zoomChange) {
        this.isHotPopulationShow = !this.isHotPopulationShow;
      }

      Object.keys(this.heatmapObj).map(i => {
        this.heatmapObj[i].setMap(null);
        setTimeout(() => delete this.heatmapObj[i], 0);
      });

      if (this.isHotPopulationShow) {
        // this.$fetch.get('/api/dev/grid/query/phm', {
        //   cityCode: this.pickerInfo.adcode,//this.pickerInfo.city || this.pickerInfo.province,
        //   precision: this.map.getZoom()
        this.$fetch.get('/api/dicosViSignIn/heatmap', {
          cityName: this.pickerInfo.city || this.pickerInfo.province,
          // orgId: JSON.parse(window.sessionStorage.getItem ('userInfo')).orgId,// 'AA100000000000000',
          // precision: this.map.getZoom()
        }).then(res => {
          const { code, message, data } = res;
          if (code != 200 || !data) {
            Notify({ type: 'warning', message, duration: 1000 });
            return;
          }
          let heatmap;
          this.map.plugin(['AMap.Heatmap'], () => {
            let radius = 100;
            if (this.zoom < 10) {
              radius = 50;
            }
            heatmap = new AMap.Heatmap(this.map, {
              radius, // 给定半径
              opacity: [0, 0.6],
            });
            // console.log('当前zoom:', this.zoom);
            heatmap.setDataSet({ data, max: 8000 });
          });
          let tm = new Date().getTime();
          this.heatmapObj[tm] = heatmap;
          this.heatmapObj[tm].setMap(this.map);
        });
      }
    },

    // 全家/竞品/基盘
    getFmTypeFn() {
      this.$fetch.get(`/api/dev/biz/query/store/type?tuId=${this.userInfo.tuId}`).then(res => {
        const { code, data, message } = res;
        if (code != 200 || !data) {
          Notify({ type: 'warning', message, duration: 1000 });
          return;
        }
        this.familyListShadow = [];
        if (!data.brandList) {
          Notify({ type: 'warning', message: '本品种类 数据为空', duration: 1000 });
          return;
        }
        data.brandList.map(o => {
          const { count, name } = o;
          let s = { layerName: name, code: o.code, storeListNum: count, layerCategoryCode: data.layerCategoryCode, layerCategoryName: data.layerCategoryName, isOn: true, isAllOn: true };
          this.familyListShadow.push(s);
        });
        console.log('this.familyListShadow:', this.familyListShadow);
      });
    },
    getCompeterTypeFn() {
      this.$fetch.get(`/api/dev/biz/query/brand?tuId=${this.userInfo.tuId}`).then(res => {
        const { code, data, message } = res;
        if (code != 200 || !data) {
          Notify({ type: 'warning', message, duration: 1000 });
          return;
        }
        this.competingListShadow = [];
        if (!data.brandList) {
          Notify({ type: 'warning', message: '竞品种类 数据为空', duration: 1000 });
          return;
        }
        data.brandList.map(o => {
          const { count, name } = o;
          let s = { layerName: name, code: o.code, storeListNum: count, layerCategoryCode: data.layerCategoryCode, layerCategoryName: data.layerCategoryName, isOn: true, isAllOn: true };
          this.competingListShadow.push(s);
        });
        console.log('this.competingListShadow:', this.competingListShadow);
      });
    },
    getBpFn() {
      this.$fetch.get(`/api/dev/biz/bp/count?userId=${this.userInfo.tuId}`).then(res => {
        const { code, data, message } = res;
        if (code != 200 || !data) {
          Notify({ type: 'warning', message, duration: 1000 });
          return;
        };
        this.countBp = data.count || this.countBp;
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
          image: imgName ? `/img/network-planning-views/icon/${imgName}` : '/img/network-planning-views/icon/MCNCT000099.png',
          imageSize: new AMap.Size(20, 20),
          imageOffset: new AMap.Pixel(0, 0)
        });
        let newitem = new AMap.Marker({
          position: [subItem.gdLng, subItem.gdLat],
          icon: iconItem,
          offset: new AMap.Pixel(-10, -10),
          zIndex: idx,
          extData: subItem
        });
        newitem.on('click', () => {
          // console.log('subItem:', subItem);
          this.baseInfoId = subItem.pointCode; // 用作请求详情信息 subItem.pointCode '2'
          this.baseInfoType = subItem.pointType; // 1基盘、2竞品、3本品
          this.baseInfoShow = true;
        });
        resArr.push(newitem);
      });
      if (resArr.length > 0) {
        let _renderClusterMarker = this.renderClusterMarker(resArr, title);
        this.map.plugin(['AMap.MarkerClusterer'], () => {
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
        });
      }
    },
    renderClusterMarker(markersArr, markerName) {
      if (markersArr && markersArr.length > 0) {
        let bgColorJson = this.bgColorJson[markerName];
        let count = markersArr.length;
        let _renderClusterMarker = function(context) {
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
          context.marker.setContent(div);
        };
        return _renderClusterMarker;
      }
    },
    getChnlLocationByUserFn(mode = 'normal', typeStr = '') {
      this.jListShadow[0].storeListNum = 0;
      // Object.keys(this.mCluster).map(i => {
      //   this.mCluster[i].setMap(null)
      // });
      // setTimeout(() => {
      //   Object.keys(this.mCluster).map(i => {
      //     delete this.mCluster[i]
      //   });
      // }, 50);
      Object.keys(this.geoGridsObj).map(i => {
        console.log('i:', i);
        console.log('i this.geoGridsObj[i]:', this.geoGridsObj[i]);
        if (this.geoGridsObj[i]) {
          // this.geoGridsObj[i].setMap(null)
          this.map.remove(this.geoGridsObj[i]);
        }
      });
      setTimeout(() => {
        Object.keys(this.geoGridsObj).map(i => {
          delete this.geoGridsObj[i];
        });
      }, 20);
      Object.keys(this.bzObj).map(i => {
        console.log('i:', i);
        console.log('i this.bzObj[i]:', this.bzObj[i]);
        if (this.bzObj[i]) {
          // this.bzObj[i].setMap(null)
          this.map.remove(this.bzObj[i]);
        }
      });
      setTimeout(() => {
        Object.keys(this.bzObj).map(i => {
          delete this.bzObj[i];
        });
      }, 40);
      if (mode == 'clear') {
        return;
      }
      var b = this.map.getBounds();
      const topLeft = '' + b.northeast.lng + ',' + b.northeast.lat;
      const topRight = '' + b.northeast.lng + ',' + b.southwest.lat;
      const bottomLeft = '' + b.southwest.lng + ',' + b.northeast.lat;
      const bottomRight = '' + b.southwest.lng + ',' + b.southwest.lat;

      // this.$fetch.get(`/api/dev/biz/query/store/sales?module=0&sales=${this.userInfo.tuId}&type=`).then(res => {//module=3 模块 0全部, 1基盘, 2竞品, 3网点
      this.$fetch.get('/api/dev/biz/query/store/agg', {
        module: 0,
        sales: this.userInfo.tuId,
        type: typeStr,
        bottomLeft,
        bottomRight,
        topLeft,
        topRight,
        precision: this.map.getZoom()
      }).then(res => {
        const { code, data, extData, message } = res;
        if (code != 200 || !data) {
          Notify({ type: 'warning', message, duration: 1000 });
          return;
        }
        const tm = new Date().getTime();
        const zoom = this.map.getZoom();
        if (extData) {
          this.geoGridsObj[tm] = [];
          this.aggList = data;
          let that = this;
          this.aggList.map(item => {
            if (!item.geoGrids) {
              return;
            }
            item.geoGrids.map(o => {
              let jsons = [];
              if (o.lat && o.lng) {
                jsons.push(o.lng, o.lat);
              } else {
                return null;
              }
              // if (!o.lat || !o.lng) return;
              let textInfo = new AMap.Text({
                position: jsons,
                text: item.layerName + o.count,
              });
              let bgColorJson = this.bgColorJson[item.layerName];
              const style = {
                display: 'block',
                height: '70px',
                width: '70px',
                lineHeight: '70px',
                borderRadius: '50%',
                ...bgColorJson,
              };
              textInfo.setStyle(style);
              textInfo.on('click', function() {
                that.map.setZoom(zoom + 1);
                this.zoom = zoom + 1;
              });
              this.geoGridsObj[tm].push(textInfo);
            });
          });
          // console.log('this.geoGridsObj:', this.geoGridsObj);
          this.map.add(this.geoGridsObj[tm]);
        } else {
          this.bzObj[tm] = [];
          // console.log('start this.bzObj[tm]:', this.bzObj[tm]);
          this.aggList = data;
          this.aggList.map(d => {
            if (!d.storeList) {
              return;
            }
            if (d.layerCode == 'BP') {
              this.$set(this.jListShadow, 'storeListNum', d.storeList.length || 0)
            }
            d.storeList.map(subItem => {
              if (!subItem) {
                return;
              }
              // if (d.layerCode == 'BP') {
              //     this.jListShadow[0].storeListNum =  this.jListShadow[0].storeListNum + subItem.count
              // }
              let iconItem = new AMap.Icon({
                size: new AMap.Size(20, 20),
                image: subItem.pointIcon ? `/img/network-planning-views/icon/${subItem.pointIcon}` : '/img/network-planning-views/icon/MCNCT000099.png',
                imageSize: new AMap.Size(20, 20),
                imageOffset: new AMap.Pixel(0, 0)
              });
              let newitem = new AMap.Marker({
                position: [subItem.gdLng, subItem.gdLat],
                icon: iconItem,
                offset: new AMap.Pixel(-10, -10),
                zIndex: 10,
                extData: subItem
              });
              newitem.on('click', () => {
                console.log('subItem:', subItem);
                this.baseInfoId = subItem.pointCode; // 用作请求详情信息 subItem.pointCode '2'
                this.baseInfoType = subItem.pointType; // 1基盘、2竞品、3本品
                this.baseInfoShow = true;
              });
              this.bzObj[tm].push(newitem);
            });
          });
          // console.log('end this.bzObj[tm]:', this.bzObj[tm]);
          if (this.bzObj[tm].length > 0) {
            this.map.add(this.bzObj[tm]);
          }
        }

        return;
        this.pointsList = data;
        this.pointsList.map(s => {
          if (s.layerCategoryCode == '3' || s.layerCategoryCode == '2' || s.layerCategoryCode == '1') {
            this.makeClusterFn(s.layerCategoryName, s.subClassify.layerCode, s.subClassify.storeList, s.layerCategoryCode);
          }
        });

        this.pointsList.map(item => {
          const { layerCode, layerName, storeList } = item.subClassify;

          function getDataFn(arr) {
            arr.map(m => {
              if (m.layerName == layerName) {
                m.layerCode = layerCode;
                m.storeListNum = storeList.length;
                m.isOn = storeList.length > 0;
                m.layerCategoryCode = item.layerCategoryCode;
              }
            });
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
            };
            o.isOn = storeList.length > 0;
            this.jListShadow.push(o);
          }
        });

      });
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
    choosePointType() {
      let typeStr = '';
      let familyListStr = '';
      let competingListStr = '';
      let jListStr = '';
      this.familyListShadow.map(item => {
        if (!item.isAllOn) {
          return;
        }
        if (item.isAllOn && item.isOn && item.storeListNum != 0) {
          familyListStr = '' + familyListStr + item.code + ',';
        }
      });
      console.log('familyListStr:', familyListStr);
      this.competingListShadow.map(item => {
        if (!item.isAllOn) {
          return;
        }
        if (item.isAllOn && item.isOn && item.storeListNum != 0) {
          competingListStr = '' + competingListStr + item.code + ',';
        }
      });
      console.log('competingListStr:', competingListStr);
      this.jListShadow.map(item => {
        if (!item.isAllOn) {
          return;
        }
        if (item.isAllOn && item.isOn) {
          jListStr = item.code + ',';
        }
      });
      console.log('jListStr:', jListStr);
      typeStr = familyListStr + competingListStr + jListStr;
      let mode = typeStr ? 'normal' : 'clear';
      this.getChnlLocationByUserFn(mode, typeStr);
    },
    triggerArrBtnFn(arr, idx = '-1', o = {}) {
      console.log('arr, idx = \'-1\', o = {}:', arr, idx, o);
      if (idx >= 0) {
        arr.map((item, i) => {
          if (idx == i) {
            item.isOn = !item.isOn;
          }
        });
        if (arr[0].pName) {
          if (arr.filter(o => o.isOn == true).length == 0) {
            setTimeout(() => {
              this.getBizFn();
            }, 100);
          } else {
            setTimeout(() => {
              var arrMod = [];
              arr.map(a => {
                if (a.isOn == true) {
                  arrMod.push(a.code);
                }
              })
              const arrStr = arrMod.join();

              var arrBMod = [];
              this.bSList.map(s => {
                if (s.isOn == true) {
                  arrBMod.push(s.code);
                }
              })
              const arrBStr = arrBMod.join();

              this.getBizFn(arrBStr, arrStr);
            }, 100);
          }
        } else {
          this.choosePointType();
        }
        // Object.keys(this.mCluster).map(i => {
        //   if (i.includes(o.layerCode)) {
        //     if (o.isOn) {
        //       this.mCluster[i].setMap(this.map);
        //     } else {
        //       this.mCluster[i].setMap(null);
        //     }
        //   }
        // });
      } else {
        // 点击全关
        arr.map((item) => {
          if (item.layerCategoryCode == '3') {
            item.isAllOn = this.isFamilyChecked;
          } else if (item.layerCategoryCode == '2') {
            item.isAllOn = this.isCompetingChecked;
          } else if (item.layerCategoryCode == 'BP') {
            item.isAllOn = this.isBpChecked;
          } else if (item.pCode == '1') {
            item.isAllOn = this.isBzChecked;
          }
        });
        if (arr[0].pName) {
          if (!arr[0].isAllOn) {
            setTimeout(() => {
              this.getBizFn();
            }, 100);
          } else {
            setTimeout(() => {
              this.getBizFn(arr[0].pCode);
            }, 100);
          }
        } else {
          this.choosePointType();
        }
        return;
        let layerCategoryCode = '';
        let isAllOn = '';
        var arr1 = [];
        arr.map((item) => {
          if (item.layerCategoryCode == '3') {
            item.isAllOn = this.isFamilyChecked;
          } else if (item.layerCategoryCode == '2') {
            item.isAllOn = this.isCompetingChecked;
          } else if (item.layerCategoryCode == '1') {
            item.isAllOn = this.isBpChecked;
          } else if (item.pCode == '1') {
            item.isAllOn = this.isBzChecked;
          }
          if (!layerCategoryCode) {
            layerCategoryCode = item.layerCategoryCode;
            isAllOn = item.isAllOn;
          }
          console.log('layerCategoryCode:', layerCategoryCode);
          if (item.isOn) {
            arr1.push(item.layerCode);
          }
        });

        this.tmpList[layerCategoryCode] = arr1;
        console.log('this.tmpList:', this.tmpList);
        const arr2 = arr.filter(o => this.tmpList[layerCategoryCode].includes(o.layerCode));

        Object.keys(this.mCluster).map(i => {
          arr2.map(s => {
            if (i.includes(`${s.layerCategoryCode}_${s.layerCode}`)) {
              if (isAllOn) {
                this.mCluster[i].setMap(this.map);
              } else {
                this.mCluster[i].setMap(null);
              }
            }
          });
        });
      }
    },

    async handleBaseInfoDetailClose() {
      this.baseInfoShow = false;
    },
    async handleGridInfoDetailClose() {
      this.gridInfoDetailShow = false;
    },
    async handlePlanPositionPopClose() {
      this.planPositionShow = false;
      // this.getChnlLocationByUserFn();//加载网点、竞品、基盘数据
      // this.map.setCenter()
    },
    handleSearchPageClose(o) {
      this.isSearch = false;
      if (o && o.location) {
        this.map.setCenter(o.location.split(','));
      }
    },
    setText1(data, name, style = {}) {
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
      if (style != {}) {
        textInfo.setStyle(style);
      }
      return textInfo;
    },
    // 关闭弹出层
    closeOrganize() {
      this.footprintStatus = false;
      // todo 清除地图 根据选择担当 获取数据
      if (!this.chooseTakeResponsibilityID) {
        return;
      }
      const { planEndDate, planStartDate } = this.dateRange;
      let tuIds = Array.isArray(this.chooseTakeResponsibilityID) ? this.chooseTakeResponsibilityID
        : [{ tuId: this.chooseTakeResponsibilityID, tuName: this.chooseTakeResponsibilityName }];

      Object.keys(this.organizeObj).map(i => {
        this.organizeObj[i].setMap(null);
        setTimeout(() => delete this.organizeObj[i], 100);
      });
      this.$fetch.post('/api/opt/plan/getRouteInfo', { planEndDate, planStartDate, tuIds }
      ).then(({ code, data, message }) => {
        if (code != 200) {
          Notify({ type: 'warning', message, duration: 1000 });
          return;
        }
        if (!data || data.length == 0) {
          Notify({ type: 'warning', message: '该督导暂无数据', duration: 1000 });
          return;
        }

        let getCenterPosition = false;
        let position = {};
        let arr1 = [], arr2 = [];

        data.map(O => {
          if (!O.routeGeomBo) {
            return;
          }
          O.routeGeomBo.map(o => {
            if (!getCenterPosition && o.lng && o.lat) {
              getCenterPosition = true;
              position = o;
            }
            // if (!o.tuGdGeom || !o.tuGdGeom.features || o.tuGdGeom.features.length == 0) return;
            const gem = JSON.parse(o.tuGdGeom).features[0];
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
          });
        });
        let pf = new Date().getTime();
        this.organizeObj[`c_${pf}`] = new AMap.OverlayGroup(arr1);
        this.organizeObj[`t_${pf}`] = new AMap.OverlayGroup(arr2);

        setTimeout(() => {
          this.map.add(this.organizeObj[`c_${pf}`], this.organizeObj[`t_${pf}`]);
          // this.map.setCenter([position.lng, position.lat]);
          this.map.setZoomAndCenter(9, [position.lng, position.lat]);
          this.zoom = 9;
          // setTimeout(() => { this.map.setFitView() }, 3000);
        }, 0);

        if (!getCenterPosition) {
          Notify({ type: 'warning', message: '暂未获取到该督导数据', duration: 1000 });
        }
      });
    },
    // 确认选中的时间
    onConfirm(date) {
      this.calendarShow = !this.calendarShow;
      let startTime = moment(date && date[0]).format('YYYY-MM-DD');
      let endTime = moment(date && date[1]).format('YYYY-MM-DD');
      this.dateRange.planStartDate = startTime;
      this.dateRange.planEndDate = endTime;

      //  更新页面部分数据
      this.footprintStatus = false;
      // 行程
      if (this.routeSwitch) {
        // 清除地图
        this.clearAll();
        // 根据选择担当 获取路线 数据
        this.getRouteData();
      }
    },
    // 当前选择时间
    selectTime(time) {
      let selectTimes = time && time[0]; // 当前已选中的时间
      // 根据当前选中的时间计算当前周
      let weekDay = moment(selectTimes).format('E');
      let startTimeStamp = moment(selectTimes)
        .subtract(weekDay, 'days')
        .format('YYYY-MM-DD');
      let endTimeStamp = moment(selectTimes)
        .add(6 - weekDay, 'days')
        .format('YYYY-MM-DD');
      this.timeVal = [
        new Date(startTimeStamp),
        new Date(endTimeStamp)
      ];
    },
    // 开启/关闭 路线
    openRoute() {
      // 行程路线 开关状态切换
      this.routeSwitch = !this.routeSwitch;
      if (this.routeSwitch) {
        this.clearAll();
        this.getRouteData();
      } else {
        // 清除地图 行程路线
        this.clearAll();
        // todo 是否要开启其他
      }
    },
    // 获取路线信息
    getRouteData() {
      /**
       * 1： 清空地图上当前非行程部分绘制
       * 2： 获取当前用户行程路线数据
       */
      if (!this.chooseTakeResponsibilityID) {
        this.$notify({
          message: '请选择督导进行查看',
          type: 'warning'
        });
        return;
      }
      JourNeyApi.getRouteInfo({
        endDate: this.dateRange.planEndDate,
        startDate: this.dateRange.planStartDate,
        reqType: '1',
        orgId: this.chooseTakeResponsibilityParenID,
        workUserNo: Array.isArray(this.chooseTakeResponsibilityID) ? this.chooseTakeResponsibilityID : [].concat(this.chooseTakeResponsibilityID)
      })
        .then(res => {
          if (res.code === 200) {
            this.routeDataOrganize = res.data;
            this.startDrawMap();
          } else {
            this.$notify({
              type: 'warning',
              message: res.message,
            });
          }
        })
        .catch(err => console.error('请求路线信息数据报错', err));
    },
    // 获取窗口视区内的门店数量
    getViewStoreNum() {
      let b = this.map.getBounds();
      const topLeft = '' + b.northeast.lng + ',' + b.northeast.lat;
      const topRight = '' + b.northeast.lng + ',' + b.southwest.lat;
      const bottomLeft = '' + b.southwest.lng + ',' + b.northeast.lat;
      const bottomRight = '' + b.southwest.lng + ',' + b.southwest.lat;
      MUNICIPAL_PLANNING_API.getStoreNum({
        topLeft: topLeft,
        topRight: topRight,
        bottomLeft: bottomLeft,
        bottomRight: bottomRight,
        tuId: this.userInfo.tuId
      })
        .then(res => {
          this.countBp = 0;
          // 竞品 基盘
          let competitiveProduct, baseData, storeData;
          res.data && res.data.map(item => {
            if (item.layerCategoryName === '竞品网点') {
              competitiveProduct = item.brandList;
            }
            if (item.layerCategoryName === '基盘') {
              baseData = item.brandList;
              item.brandList.map(s => {
                if (s.count) {
                  this.countBp += s.count;
                }
              })
            }
            if (item.layerCategoryName === '本品网点') {
              storeData = item.brandList;
            }
          });
          // 匹配竞品
          this.competingListShadow && this.competingListShadow.map(item => {
            competitiveProduct && competitiveProduct.map(childItem => {
              if (item.code === childItem.code) {
                this.$set(item, 'storeListNum', childItem.count);
              }
            });
          });
          // 匹配本品
          if (this.familyListShadow && this.familyListShadow.length > 0) {
            this.familyListShadow && this.familyListShadow.map(item => {
              storeData && storeData.map(childItem => {
                if (item.code === childItem.code) {
                  this.$set(item, 'storeListNum', childItem.count);
                }
              });
            });
          }
        })
        .catch(err => console.error(err));
    }

  },
  watch: {
    chooseTakeResponsibilityID: {
      immediate: false,
      handler: function() {
        console.info('选中担当', this.chooseTakeResponsibilityID);
        // 关闭组织选择弹层
        this.footprintStatus = false;
        if (this.routeSwitch) {
          this.getRouteData();
        }
        this.clearAll();
        // todo 地址栏是否切换成 当担名称
        // this.title = this.chooseTakeResponsibilityName
      }
    },
    zoom(val) {
      if (this.isHotPopulationShow) {
        this.getHotPopulationFn(this.status, true);
      }
    },
    status(val) {
      console.log('status:', val);
      if (val == 1 && this.isHotPopulationShow) {
        // 热力图隐藏
        this.getHotPopulationFn();
        console.log('热力图隐藏');
      }
      if (val == 1) {
        this.init();
      }
      if (val == 2) {
        // 网点、竞品、基盘隐藏
        if (this.points.isFamilyShow) {
          this.togglePointsFn('isFamilyShow');
        }
        if (this.points.isCompetingShow) {
          this.togglePointsFn('isCompetingShow');
        }
        if (this.points.isBpShow) {
          this.togglePointsFn('isBpShow');
        }
        if (this.points.isBzShow) {
          this.togglePointsFn('isBzShow');
        }
        if (this.isFamilyChecked) {
          this.isFamilyChecked = !this.isFamilyChecked;
          this.triggerArrBtnFn(this.familyListShadow);
        }
        if (this.isCompetingChecked) {
          this.isCompetingChecked = !this.isCompetingChecked;
          setTimeout(() => {
            this.triggerArrBtnFn(this.competingListShadow);
          }, 1000);
        }
        if (this.isBpChecked) {
          this.isBpChecked = !this.isBpChecked;
          this.triggerArrBtnFn(this.jListShadow);
        }
        if (this.isBzChecked) {
          this.isBzChecked = !this.isBzChecked;
          this.triggerArrBtnFn(this.bSCurrentList);
        }
        // 商圈隐藏
        if (this.points.isBzShow || this.isBizDistrictShow) {
        // if (this.isBizDistrictShow) {
          this.getBizDistrictFn(); // 执行商圈函数
          // this.getBizFn();
          this.isBizDistrictShow = false;
        }
        // 网格隐藏
        if (this.isGridShow) {
          this.getGridOperFn(); // 执行网格函数
        }
        console.log('网点、竞品、基盘隐藏 商圈隐藏 网格隐藏');
      }
    },
  },
};
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
      text-align: left;
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
          font-style: normal;
          //text-indent: -9999px;
        }
      }

      h3.family i {
        div{
          float: left;
        }
        span{
          width: 20px;
          height: 20px;
          float: left;
          margin-right: 5px;
          background: url("/img/network-planning-views/point.png") no-repeat 0 0;
          background-size: 100% 100%;
        }

      }

      h3.family.on i {
        div{
          float: left;
        }
        span{
          width: 20px;
          height: 20px;
          float: left;
          margin-right: 5px;
          background: url("/img/network-planning-views/pointon.png") no-repeat 0 0;
          background-size: 100% 100%;
        }
        color: #19BE6B;
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

      h3.businessDistrict i {
        background: url("/img/network-planning-views/pointsBusinessDistrict.png") no-repeat 0 0;
        background-size: 100% 100%;
      }

      h3.businessDistrict.on i {
        background: url("/img/network-planning-views/pointsBusinessDistrictOn.png") no-repeat 0 0;
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
//商圈信息
.business-title{
  font-size: 16px;
  height: 40px;
  padding-top: 18px;
  font-weight: 600;
  border-bottom: 1px solid #e6e6e6;
}
.business-message{
  width: 355px;
  margin:11px auto;
  .cityName{
    text-align: left;
    //width: 102px;
    //height: 22px;
    font-size: 20px;
    font-weight: 600;
    color: #10AC64;
    //line-height: 22px;
  }
  .city-message{
    margin-top: 14px;
    text-align: left;
    span{
      margin-right: 54px;
      font-size: 14px;
      font-weight: 500;
      color: #666666;
    }
    .sq{
      margin: 0;
    }
  }
  .city-show{
    width: 355px;
    height: 65px;
    margin-top: 13px;
    display: flex;
    justify-content: center;
    background: #F8F8F9;
    border-radius: 7px;
    .city-show-list{
      width: 33.3%;
      margin: 10px 0;
      text-align: center;
      .num{
        //width: 18px;
        //height: 22px;
        font-size: 18px;
        font-weight: 600;
        color: #495060;
        //line-height: 22px;
      }
      .word{
        //width: 70px;
        //height: 22px;
        font-size: 14px;
        font-weight: 600;
        color: #80848F;
        //line-height: 22px;
      }
    }
  }
}
.statistics-btn{
  color: #2d2dc2;
  border-radius: 10px;
  background-color: #fff;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  position: absolute;
  top: 110px;
  left: 50%;
  transform: translateX(-50%);
}

</style>
