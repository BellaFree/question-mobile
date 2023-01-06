<template>
  <div>
    <div class='base-address-div'>
      <h4>
        <van-icon name='location' class='icon-location' />
        <span class="tit">基盘位置：</span>
        <textarea :readonly="!isEditAddress" resize="none" :class="{'edit-textarea' : isEditAddress}" v-model="bInfo.bpAddress" maxlength="60" ></textarea>
        <van-icon name="edit" class='icon-edit' @click="isEditAddress=!isEditAddress" />
      </h4>
      <span v-if="state == 1" class="lngAndlag"><em>经度:{{positionData.position.lng}}</em><em>纬度:{{positionData.position.lat}}</em></span>
      <span v-else class="lngAndlag"><em>经度:{{bInfo.longitude}}</em><em>纬度:{{bInfo.latitude}}</em></span>
      <!-- <span class="lngAndlag"><em>经度:{{positionData.position.lng}}</em><em>纬度:{{positionData.position.lat}}</em></span> -->
    </div>

    <div class='basic-base-info'>
      <ul>
        <li>
          <van-field clearable v-model="bInfo.bpName" label="基盘名称" placeholder="请输入（限6字）" maxlength=“6 :formatter="formatter1" input-align="right" />
        </li>
        <li>
          <van-field clearable v-model="bInfo.storeArea" label="门店面积(m²)" type="number" placeholder="请输入" :formatter="formatter2" input-align="right" />
        </li>
        <li>
          <van-field clearable :value="sInfos.floor.currentName" label="楼层" placeholder="请选择" @click="setSelectOnly('floor')"/>
          <van-popup v-model="showPicker.floor" position="bottom">
            <van-picker
              show-toolbar
              :columns="sInfos.floor.nameList"
              @cancel="onSelectCancelOnly"
              @confirm="onSelectConfirmOnly"
            />
          </van-popup>
        </li>
        <li>
          <van-field clearable v-model="bInfo.storeWidth" type="number" label="面宽(m)" placeholder="请输入" :formatter="formatter2" input-align="right" />
        </li>
        <li>
          <van-field clearable rental v-model="bInfo.rental" type="number" label="租金(元/月)" placeholder="请输入" :formatter="formatter2" input-align="right" />
        </li>
        <li class='t'>
          <van-field v-model="bInfo.estate" rows="2" autosize label="物业条件(上下水，电力，排烟等)" type="textarea" maxlength="50" placeholder="请输入" />
        </li>
        <li class='t'>
          <van-field v-model="bInfo.fiveHundredBusiness" rows="2" autosize label="500m商圈内的竞品情况" type="textarea" maxlength="50" placeholder="请输入" />
        </li>
      </ul>
    </div>

    <div class='basic-business-info'>
      <h5>城市与商圈信息</h5>
      <ul>
        <li>
          <van-field clearable clickable label="城市名称" :value="areaNameStr" placeholder="请选择" @click="showCityNamePopup = true"/>
          <van-popup v-model="showCityNamePopup" position="bottom">
            <van-area
              :area-list="areaList"
              :columns-placeholder="['请选择', '请选择', '请选择']"
              @change="areaChange"
              @confirm="areaConfirm"
              @cancel="areaCancel"
              title="标题"
            />
          </van-popup>
        </li>
        <li>
          <van-field clearable clickable label="城市类别" :value="sInfos.cityType.currentName" placeholder="请选择" @click="setSelectOnly('cityType')"/>
          <van-popup v-model="showPicker.cityType" position="bottom">
            <van-picker
              show-toolbar
              :columns="sInfos.cityType.nameList"
              @cancel="onSelectCancelOnly"
              @confirm="onSelectConfirmOnly"
            />
          </van-popup>
        </li>
        <li>
          <van-field clearable clickable label="所属商圈类型" :value="sInfos.businessType.currentName" placeholder="请选择" @click="setSelectOnly('businessType')"/>
          <van-popup v-model="showPicker.businessType" position="bottom">
            <van-picker
              show-toolbar
              :columns="sInfos.businessType.nameList"
              @cancel="onSelectCancelOnly"
              @confirm="onSelectConfirmOnly"
            />
          </van-popup>
        </li>
        <li>
          <van-field clearable clickable label="商圈级别" :value="sInfos.businessLevel.currentName" placeholder="请选择" @click="setSelectOnly('businessLevel')"/>
          <van-popup v-model="showPicker.businessLevel" position="bottom">
            <van-picker
              show-toolbar
              :columns="sInfos.businessLevel.nameList"
              @cancel="onSelectCancelOnly"
              @confirm="onSelectConfirmOnly"
            />
          </van-popup>
        </li>
        <li>
          <van-field clearable clickable label="门店立地判断" :value="sInfos.storeLocation.currentName" placeholder="请选择" @click="setSelectOnly('storeLocation')"/>
          <van-popup v-model="showPicker.storeLocation" position="bottom">
            <van-picker
              show-toolbar
              :columns="sInfos.storeLocation.nameList"
              @cancel="onSelectCancelOnly"
              @confirm="onSelectConfirmOnly"
            />
          </van-popup>
        </li>
      </ul>
    </div>
    <div class='basic-photo-info'>
      <h5><van-icon name='location' class='icon-photo' /><span>照片<em>（必须是全景照片）</em></span></h5>
      <ul>
        <li v-for="(item, i) of imgInfos" :key="i" >
          <i>{{item.idx}}.</i>
          <div class="chose-column">
            <div class="choose-item"><input type="text" v-model="item.picDate" placeholder="请选择日期" :min-date="minDate" :max-date="maxDate" @click="setDateFn(item.idx)" /></div>
            <div class="choose-item choose-item2"><input type="text" v-model="item.picWeather" placeholder="请选择天气" @click="setWeather(item.idx)" /></div>
            <van-popup v-model="showPickerWeather" position="bottom">
              <van-picker
                show-toolbar
                :columns="sInfos.weather.nameList"
                @cancel="showPickerWeather = false"
                @confirm="onConfirmWeather"
              />
            </van-popup>
          </div>
          <div class="chose-column">
            <div class="upload-img" @click="clickImg(i, '1')">
              <van-uploader :after-read="afterRead" accept='image/*' multiple="false" max-count='1' v-model="item.pictureList1" />
              <span class="desc">{{item.desc1}}</span>
            </div>
            <div class="upload-img" @click="clickImg(i, '2')">
              <van-uploader :after-read="afterRead" accept='image/*' multiple="false" max-count='1' v-model="item.pictureList2" />
              <span class="desc">{{item.desc2}}</span>
            </div>
          </div>
        </li>
      </ul>
      <van-calendar type="single" v-model="calendarShow" @confirm="onConfirmDate" />
    </div>
    <div class="bottom-buttons">
      <van-button class="submit-btn" type="primary" @click="setBaseFn()">
        提交
      </van-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Area, Field, Notify, Uploader, Calendar } from 'vant';
Vue.use(Area);
Vue.use(Calendar);
Vue.use(Field);
Vue.use(Notify);
Vue.use(Uploader);

export default {
  name: 'PlanPositionPop',
  props: ['positionData', 'state', 'bpData'],
  data() {
    return {
      baseInfoVisible: false,
      sInfos: { 
        floor: {
          type: 'RESTAURANT_FLOOR',
          classification: [
            // {
            //   "code": "Floor1",
            //   "id": "",
            //   "name": "一楼"
            // },
            // {
            //   "code": "Floor2",
            //   "id": "",
            //   "name": "二楼"
            // },
          ],
          nameList: [],
          currentName: '',
          currentCode: '',
        },
        cityType: {
          type: 'CITY_TYPE',
          classification: [
            // {"code": "CITY_TYPE1",
            //   "id": "",
            //   "name": "城市类别1"
            // },
            // {
            //   "code": "CITY_TYPE2",
            //   "id": "",
            //   "name": "城市类别2"
            // },
          ],
          nameList: [],
          currentName: '',
          currentCode: '',
        },
        businessType: {
          type: 'BUSINESS_TYPE',
          classification: [
            // {
            //   "code": "BUSINESS_TYPE1",
            //   "id": "",
            //   "name": "商圈类型1"
            // },
            // {
            //   "code": "BUSINESS_TYPE2",
            //   "id": "",
            //   "name": "商圈类型2"
            // },
          ],
          nameList: [],
          currentName: '',
          currentCode: '',
        },
        businessLevel: {
          type: 'BUSINESS_LEVEL',
          classification: [
            // {"code": "BUSINESS_LEVEL1",
            //   "id": "",
            //   "name": "商圈级别1"
            // },
            // {
            //   "code": "BUSINESS_LEVEL2",
            //   "id": "",
            //   "name": "商圈级别1"
            // },
          ],
          nameList: [],
          currentName: '',
          currentCode: '',
        },
        storeLocation: {
          type: 'STORE_LOCATION',
          classification: [
            // {"code": "CITY_TYPE1",
            //   "id": "",
            //   "name": "门店立地判断1"
            // },
            // {
            //   "code": "CITY_TYPE2",
            //   "id": "",
            //   "name": "门店立地判断2"
            // },
          ],
          nameList: [],
          currentName: '',
          currentCode: '',
        },
        weather: {
          type: 'WEATHER',
          classification: [
            // {
            //   "code": "WEATHER1",
            //   "id": "",
            //   "name": "Sunny"
            // },
            // {
            //   "code": "WEATHER2",
            //   "id": "",
            //   "name": "Rainy"
            // },
          ],
          nameList: [],
          currentName: '',
          currentCode: '',
        }
      },
      drawSize: "50%",
      isBaseInfoShow: true,
      isEditAddress: false,
      bInfo: { 
        "bpAddress": "",
        "bpCode": "",
        "bpName": "",
        "businessLevelName": "",
        "businessTypeName": "",
        "cityCode": "",
        "cityName": "",
        "cityTypeName": "",
        "districtCode": "",
        "districtName": "",
        "estate": "",
        "fiveHundredBusiness": "",
        "floorCode": "",
        "floorName": "",
        "latitude": "",
        "longitude": "",
        "picList": [],
        "provinceCode": "",
        "provinceName": "",
        "rental": "",
        "storeArea": "",
        "storeLocationName": "",
        "storeWidth": "",
      },
      showPickerWeather: false,
      imgInfos: [
        {
          "idx": '1',
          "picDate": "",
          "picWeather": "",
          "desc1": "从街道对面看门店",
          "desc2": "从门店看街道对面",
          "pictureList1": [],
          "pictureList2": [],
          "picture1": "",
          "picture2": "",
          "picDateShow": false,
        },
        {
          "idx": '2',
          "picDate": "",
          "picWeather": "",
          "desc1": "从街道同侧的左侧50米处看门店",
          "desc2": "从街道同侧的左侧50米处看对面",
          "pictureList1": [],
          "pictureList2": [],
          "picture1": "",
          "picture2": "",
          "picDateShow": false,
        },
        {
          "idx": '3',
          "picDate": "",
          "picWeather": "",
          "desc1": "从街道同侧的左侧100米处看门店",
          "desc2": "从街道同侧的左侧100米处看对面",
          "pictureList1": [],
          "pictureList2": [],
          "picture1": "",
          "picture2": "",
          "picDateShow": false,
        },
        {
          "idx": '4',
          "picDate": "",
          "picWeather": "",
          "desc1": "从街道对面的左侧50米处看门店",
          "desc2": "从街道对面的左侧50米处看对面",
          "pictureList1": [],
          "pictureList2": [],
          "picture1": "",
          "picture2": "",
          "picDateShow": false,
        },
        {
          "idx": '5',
          "picDate": "",
          "picWeather": "",
          "desc1": "从街道对面的左侧100米处看门店",
          "desc2": "从街道对面的左侧100米处看对面",
          "pictureList1": [],
          "pictureList2": [],
          "picture1": "",
          "picture2": "",
          "picDateShow": false,
        },
        {
          "idx": '6',
          "picDate": "",
          "picWeather": "",
          "desc1": "从街道同侧的右侧50米处看门店",
          "desc2": "从街道对面的右侧50米处看对面",
          "pictureList1": [],
          "pictureList2": [],
          "picture1": "",
          "picture2": "",
          "picDateShow": false,
        },
        {
          "idx": '7',
          "picDate": "",
          "picWeather": "",
          "desc1": "从街道同侧的右侧100米处看门店",
          "desc2": "从街道同侧的右侧100米处看对面",
          "pictureList1": [],
          "pictureList2": [],
          "picture1": "",
          "picture2": "",
          "picDateShow": false,
        },
        {
          "idx": '8',
          "picDate": "",
          "picWeather": "",
          "desc1": "从街道对面的右侧50米处看门店",
          "desc2": "从街道对面的右侧50米处看对面",
          "pictureList1": [],
          "pictureList2": [],
          "picture1": "",
          "picture2": "",
          "picDateShow": false,
        },
        {
          "idx": '9',
          "picDate": "",
          "picWeather": "",
          "desc1": "从街道对面的右侧100米处看门店",
          "desc2": "从街道对面的右侧100米处看对面",
          "pictureList1": [],
          "pictureList2": [],
          "picture1": "",
          "picture2": "",
          "picDateShow": false,
        },
      ],
      calendarShow: false,
      date: '',
      currentPhoto: 0,
      showPicker: {
        floor: false,
        cityType: false,
        businessType: false,
        businessLevel: false,
        storeLocation: false,
      },
      areaInfo: [],
      areaNameStr: '',
      showCityNamePopup: false,
      getAreaList: {},
      areaList: {
        province_list: {
          // 110000: '北京市',
          // 120000: '天津市'
        },
        city_list: {
          // 110100: '北京市',
          // 110200: '县',
          // 120100: '天津市',
          // 120200: '县'
        },
        county_list: {
          // 110101: '东城区',
          // 110102: '西城区',
          // 110105: '朝阳区',
          // 110106: '丰台区',
          // 120101: '和平区',
          // 120102: '河东区',
          // 120103: '河西区',
          // 120104: '南开区',
          // 120105: '河北区',
        }
      },
      currentUpLoadIdx: [],
      minDate: new Date(2023, 0, 1),
      maxDate: new Date()
    };
  },
  beforeMount() {
    this.getDataFn();
    this.getCityFn();
    
    if (this.state == 1) {
      this.getCurrentGrid();
      console.log('positionData:::', this.positionData);
      this.bInfo.bpAddress = this.positionData.formattedAddress;
      this.bInfo.latitude = this.positionData.position.lat + '';
      this.bInfo.longitude = this.positionData.position.lng + '';



      
    } else {
      console.log('bpData:', this.bpData);
      this.bInfo = JSON.parse(JSON.stringify(this.bpData));
      this.imgInfos.map((item, idx) => {
        this.imgInfos[idx] = {...item, ...this.bInfo.picList[idx]};
        this.imgInfos[idx].pictureList1[0] = {url: this.imgInfos[idx].picture1};
        this.imgInfos[idx].pictureList2[0] = {url: this.imgInfos[idx].picture2};
      });
      console.log('this.imgInfos:', this.imgInfos);
      // this.imgInfos = this.bInfo.picList.map();
    }
  },
  watch: {
    // planPositionShow(val) {
    //   setTimeout(() => {
    //     console.log('positionData:', this.positionData);
    //     this.getDataFn();
    //     this.getCityFn();
    //     this.getCurrentGrid();
    //     this.baseInfoVisible = val;
    //     this.drawSize = "50%";
    //     this.isBaseInfoShow = true;

    //     this.bInfo.bpAddress = this.positionData.formattedAddress;
    //     this.bInfo.latitude = this.positionData.position.lat;
    //     this.bInfo.longitude = this.positionData.position.lng;
    //   }, 100);
    // },
  },
  methods: {
    clickImg(idx1, idx2) {
      this.currentUpLoadIdx = [idx1, idx2];
    },
    getCurrentGrid() {
      const { R, Q } = this.positionData.position;
      this.$fetch.get(`/api/dev/grid/query/grid?lat=${Q}&lng=${R}`
      ).then(res => {
        let { code, data, message } = res;
        if (code != 200 || !data) {
          Notify({ type: 'warning', message, duration: 1000 });
          return;
        }
        const h = data[8].geohashValue;
        console.log('h:', h);
        this.bInfo.bpCode = h;
      });
    },
    //格式化
    formatter1(value) {
      // 仅支持文字、字母、数字
      return value.replace(/[^a-zA-Z0-9\u40E0-\u9FA5]/g, '');
    },
    formatter2(value) {
      // 支持一位小数
      return value.replace(/[^0-9.+(\.\d+)?]/g, '');
    },

    returnBaseInfo() {
      this.drawSize = "50%";
      this.isBaseInfoShow = true;
    },
    handleClose() {
      this.$emit("handlePlanPositionPopClose", false);
    },
    planFeekback() {
      this.handleClose();
      // 调用市政规划反馈页面
      this.$emit('handleMunicipalPlanCreateShow', true)
    },
    addToBase() {
      // 调用添加为基盘接口
      // this.handleClose();
      this.drawSize = "93%";
      this.isBaseInfoShow = false;
    },

    //调用枚举接口
    getDataFn() {
      Object.keys(this.sInfos).map((key) => {
        this.$fetch.get('/api/addDp/getBaseDataList', {type: this.sInfos[key].type}).then(res => {
          if (res.code == 200) {
            this.sInfos[key].classification = res.data;
            // console.log('key:', key);
            // console.log('this.sInfos[key].classification:', key, this.sInfos[key].classification);
          }
        })
      });
    },
    //调用省市接口
    getCityFn(code = '', idx = 0) {
      var ID = '';
      if (code) {
        if (idx == 0 && this.getAreaList.province_list) {
          ID = this.getAreaList.province_list.filter(item => item.code == code)[0].id;
        } else if (idx == 1 && this.getAreaList.city_list) {
          ID = this.getAreaList.city_list.filter(item => item.code == code)[0].id;
        }
      }
      if (code == '' && this.getAreaList.province_list) {
        return;
      };
      this.$fetch.get('/api/addDp/getRegionList', {parentId: ID}).then(res => {
        if (res.code != 200) {
          Notify({ type: "warning", message: res.message, duration: 1000 });
          return;
        }
        const list = res.data;
        if (code == '') {
          // console.log('province_list');
          this.getAreaList.province_list = list;
          this.areaList.province_list = [];
          list.map(item => {
            this.areaList.province_list[item.code] = item.name;
          });
        } else if (idx == 0) {
          // console.log('city_list');
          this.getAreaList.city_list = list;
          this.areaList.city_list = [];
          list.map(item => {
            this.areaList.city_list[item.code] = item.name;
          });
        } else if (idx == 1) {
          // console.log('county_list');
          this.getAreaList.county_list = list;
          this.areaList.county_list= [];
          list.map(item => {
            this.areaList.county_list[item.code] = item.name;
          });
        }
        console.log('this.areaList):', this.areaList);
      })
    },
    //创建基盘
    setBaseFn() {
      Object.keys(this.sInfos).map(o => {
        if (this.sInfos[o]) {
          if (o == 'floor') {
            this.bInfo.floorCode = this.sInfos[o].currentCode;
            this.bInfo.floorName = this.sInfos[o].currentName;
          } else if (o == 'businessLevel') {
            this.bInfo.businessLevelName = this.sInfos[o].currentName;
          } else if (o == 'businessType') {
            this.bInfo.businessTypeName = this.sInfos[o].currentName;
          } else if (o == 'cityType') {
            this.bInfo.cityTypeName = this.sInfos[o].currentName;
          } else if (o == 'storeLocation') {
            this.bInfo.storeLocationName = this.sInfos[o].currentName;
          }
        }
      })
      if (this.areaInfo[0]) {
        this.bInfo.provinceCode = this.areaInfo[0].code;
        this.bInfo.provinceName = this.areaInfo[0].name;
      }

      if (this.areaInfo[1]) {
        this.bInfo.cityCode = this.areaInfo[1].code;
        this.bInfo.cityName = this.areaInfo[1].name;
      }

      if (this.areaInfo[1]) {
        this.bInfo.districtCode = this.areaInfo[2].code;
        this.bInfo.districtName = this.areaInfo[2].name;
      }
      this.bInfo.picList = [];
      if (this.imgInfos) {
        this.imgInfos.map(o => {
          const { picDate, picWeather, picture1, picture2 } = o;
          const obj = { picDate, picWeather, picture1, picture2 };
          this.bInfo.picList.push(obj);
        })
      }
      // this.bInfo = {"userId": JSON.parse(window.sessionStorage.getItem('userInfo')).tuId, "isLoading":true,"bpAddress":"上海市黄浦区南京东路街道南京西路77号人民公园","bpCode":"wtw3sjt","bpName":"230105","businessLevelName":"A","businessTypeName":"社区商业","cityCode":"310100","cityName":"市辖区","cityTypeName":"五类","districtCode":"310101","districtName":"黄浦区","estate":"dj","fiveHundredBusiness":"d","floorCode":"RESTAURANTFLOOR1","floorName":"1F","latitude":"31.231706","longitude":"121.472644","picList":[{"picDate":"2023-01-05","picWeather":"晴","picture1":"https://dicos-1221-dh-mb-dev.parramountain.com/image/bdd38c7f3e7e464cb9b7332f232dedbf.png","picture2":"https://dicos-1221-dh-mb-dev.parramountain.com/image/a9150dc487794e289f76772473aa444c.png"},{"picDate":"2023-01-05","picWeather":"晴","picture1":"https://dicos-1221-dh-mb-dev.parramountain.com/image/af465dbfb865419bbc99e2b6125167bd.png","picture2":"https://dicos-1221-dh-mb-dev.parramountain.com/image/1ab3c323318d4248bf90ed3dc644a004.png"},{"picDate":"2023-01-05","picWeather":"晴","picture1":"https://dicos-1221-dh-mb-dev.parramountain.com/image/347c7d7dadd5440196dfca437bd98147.png","picture2":"https://dicos-1221-dh-mb-dev.parramountain.com/image/57472e3ddc744184948dc8d0a133a13a.png"},{"picDate":"2023-01-05","picWeather":"晴","picture1":"https://dicos-1221-dh-mb-dev.parramountain.com/image/2d789c859900402da0e70b8a43cc8d89.png","picture2":"https://dicos-1221-dh-mb-dev.parramountain.com/image/d90e08fd2f8e4abc82cea6fc68e234ba.png"},{"picDate":"2023-01-05","picWeather":"晴","picture1":"https://dicos-1221-dh-mb-dev.parramountain.com/image/1cacdb3bfb1746ddb799852af057ca1b.png","picture2":"https://dicos-1221-dh-mb-dev.parramountain.com/image/f825471c2d0748ed9079f14dfa348281.png"},{"picDate":"2023-01-05","picWeather":"晴","picture1":"https://dicos-1221-dh-mb-dev.parramountain.com/image/6c01231c8a644ab2b6f795762f592cf6.png","picture2":"https://dicos-1221-dh-mb-dev.parramountain.com/image/5f10e9c53403419189be8ffeef8b02bb.png"},{"picDate":"2023-01-05","picWeather":"晴","picture1":"https://dicos-1221-dh-mb-dev.parramountain.com/image/4d9c24c1e6df46879384cbc55127e1ff.png","picture2":"https://dicos-1221-dh-mb-dev.parramountain.com/image/371bbce7e6ea4d9a9ca6fcd28d8b8e96.png"},{"picDate":"2023-01-05","picWeather":"晴","picture1":"https://dicos-1221-dh-mb-dev.parramountain.com/image/41f77167036b45a4825159253279dac4.png","picture2":"https://dicos-1221-dh-mb-dev.parramountain.com/image/52f6f14e8be3444f9a1ab6bd87a269f8.png"},{"picDate":"2023-01-05","picWeather":"晴","picture1":"https://dicos-1221-dh-mb-dev.parramountain.com/image/39ca45c6df474fe7b18541075577e1d9.png","picture2":"https://dicos-1221-dh-mb-dev.parramountain.com/image/c821c6093ce14caebbd2d2d1479cf7d6.png"}],"provinceCode":"310000","provinceName":"上海市","rental":"19000","storeArea":"50","storeLocationName":"B","storeWidth":"8"};
      console.log("this.bInfo:", this.bInfo);
      setTimeout(() => {
        if (this.state == 1) {
          this.bInfo.userId = JSON.parse(window.sessionStorage.getItem('userInfo')).tuId;
          setTimeout(() => {
            this.$emit('setBp', this.bInfo);
          }, 500)
        } else {
          this.$emit('setBp', this.bpData);
        }
        
      }, 500);
    },
    //打开天气
    setWeather(idx) {
      this.sInfos.weather.nameList = [];
      this.currentPhoto = idx - 1;
      this.sInfos.weather.classification.map(item => {
        this.sInfos.weather.nameList.push(item.name);
      })
      console.log('this.sInfos.weather.nameList:', this.sInfos.weather.nameList);
      this.showPickerWeather = true;
    },

    //设置枚举
    setSelectOnly(TYPE) {
      this.sInfos[TYPE].nameList = [];
      this.currentType = TYPE;
      console.log('this.sInfos[TYPE].classification:', this.sInfos[TYPE].classification);
      this.sInfos[TYPE].classification.map(item => {
        this.sInfos[TYPE].nameList.push(item.name);
      })
      this.showPicker[TYPE] = true;
    },
    //确认枚举
    onSelectConfirmOnly(value) {
      this.sInfos[this.currentType].currentName = value;

      var code = this.sInfos[this.currentType].classification.filter(o => o.name == value)[0].code;
      this.sInfos[this.currentType].currentCode = code;
      this.showPicker[this.currentType] = false;
    },
    //取消枚举
    onSelectCancelOnly() {
      this.showPicker[this.currentType] = false;
    },

    //确认天气
    onConfirmWeather(value) {
      console.log('value:', value);
      this.sInfos.weather.classification.map(item => {
        if (item.name == value) {
          this.sInfos.weather.currentCode = item.code;
          this.sInfos.weather.currentName = item.name;
        }
      })
      this.showPickerWeather = false;
      this.imgInfos[this.currentPhoto].picWeather = this.sInfos.weather.currentName;
      console.log('this.imgInfos:', this.imgInfos);
    },
    //打开日期
    setDateFn(idx) {
      this.currentPhoto = idx - 1;
      this.date = this.imgInfos[this.currentPhoto].picDate;
      this.imgInfos[this.currentPhoto].picDateShow = true;
      this.calendarShow = this.imgInfos[this.currentPhoto].picDateShow;
    },
    formatDate(date) {
      var M = '';
      var D = '';
      if (date.getMonth() < 9) {
        M = `0${date.getMonth() + 1}`;
      } else {
        M = `${date.getMonth() + 1}`;
      }
      if (date.getDate() < 9) {
        D = `0${date.getDate()}`;
      } else {
        D = `${date.getDate()}`;
      }
      return `${date.getFullYear()}-${M}-${D}`;
    },
    //确认日期
    onConfirmDate(date) {
      this.calendarShow = false;
      this.date = this.formatDate(date);
      this.imgInfos[this.currentPhoto].picDate = this.formatDate(date);
      this.imgInfos[this.currentPhoto].picDateShow = false;
    },
    uploadImgFn (img) {
        let form_data = new FormData()
        form_data.append("file", img)
        this.$fetch.post('/api/addDp/upload', form_data, false, true).then(res => {
            const { code, data, extData, message } = res;
            if (code != 200) {
                Notify ({ type: 'warning', message, duration: 1000 });
                return false;
            }
            if (this.currentUpLoadIdx[1] === '1') {
              this.imgInfos[this.currentUpLoadIdx[0]].picture1 = extData;
            } else {
              this.imgInfos[this.currentUpLoadIdx[0]].picture2 = extData;
            }
            console.log('this.imgInfos:', this.imgInfos);
        })
    },
    afterRead(file) {
      this.uploadImgFn (file.file);
    },

    //切换城市名称弹窗
    areaChange(picker, value, index) {
      this.getCityFn(value[index].code, index);
    },
    //确认城市名称弹窗
    areaConfirm(values) {
      this.areaInfo = values;
      this.areaNameStr = '';
      this.areaInfo.map(o => {
        this.areaNameStr += (o.name + ' ');
      })
      this.showCityNamePopup = false;
    },
    //取消城市名称弹窗
    areaCancel() {
      this.showCityNamePopup = false;
    }
  }
};
</script>
<style lang="scss">
.van-field__control {
  text-align: right!important;
}
.van-cell {
  padding: 5px 16px!important;
}
.t {
  .van-field__control {
    padding: 6px;
    text-align: left!important;
    border: 1px solid #ddd;
    border-radius: 3px;
  }
  .van-field {
    flex-direction: column;
  }

  .van-cell__title {
    width: 100%;
  }
  .van-cell__value {
    margin-top: 5px;
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
// .plan-position-pop-wrapper {
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   .base-info-div,
//   .base-add-div {
//     display: flex;
//     flex-direction: inherit;
//     height: 100%;
//     overflow-y: scroll;
//     .header-box {
//       height: 48px;
//       line-height: 48px;
//       font-size: 16px;
//       text-align: center;
//       position: relative;
//       border-bottom: 1px solid #e6e6e6;
//       .title {
//         font-size: 16px;
//         height: 40px;
//         padding-top: 5px;
//       }
//     }
//     .content-box {
//       flex: 1;
//       overflow: scroll;
//       text-align: left;
      .bottom-buttons {
        display: flex;
        justify-content: space-around;
        padding: 25px 0;
        width: 100%;
        height: 67px;
        text-align: center;
        border-top: 1px solid #e6e6e6;
        .create-btn,
        .submit-btn {
          width: 300px;
          border-radius: 20px;
          font-size: 16px;
          font-weight: bolder;
        }
      }
//     }
//   }
//   .base-info-div {
//     .content-box {
//       // overflow: hidden;
//       position: relative;
//       p.text {
//         margin: 20px 10px;
//         font-size: 14px;
//       }
//       .bottom-buttons {
//         position: absolute;
//         bottom: 0;
//         left: 0;
//       }
//     }
//   }
//   .base-add-div {
//     .header-box {
//       .return-base-info {
//         position: absolute;
//         top: 15px;
//         left: 15px;
//       }
//     }
//     .content-box {
      .base-address-div {
        position: relative;
        margin: 10px 15px;
        padding: 10px 10px 5px 10px;
        box-sizing: content-box;
        width: 325px;
        background: #fff;
        box-shadow: 0px 1px 2px 1px #ededed;
        overflow: hidden;
        border-radius: 4px;
        i.icon-location {
          float: left;
          margin-right: 10px;
          margin-top: 4px;
          font-size: 18px;
          color: gold;
        }
        span.tit {
          float: left;
          padding-top: 3px;
          line-height: 22px;
          font-size: 14px;
        }
        textarea {
          float: left;
          resize: none;
          width: 200px;
          height: auto;
          font-size: 14px;
          padding: 3px 0 0 0;
          overflow: hidden;
          line-height: 22px;
          border: 0 none;
          color: #333;
        }
        .edit-textarea {
          font-weight: normal;
        }
        i.icon-edit {
          position: absolute;
          top: 14px;
          right: 5px;
          font-size: 18px;
          color: #333;
        }
        .lngAndlag {
          float: left;
          padding-top: 3px;
          line-height: 18px;
          text-indent: 80px;
          font-size: 12px;
          em {
            padding-right: 10px;
            font-style: normal;

          }
        }
      }
      .basic-base-info,
      .basic-business-info {
        ul li {
          // padding: 5px 0;
          width: 100%;
          height: 35px;
          border-bottom: 1PX solid #ddd;
          color: #333;
          font-size: 14px;
          span {
            float: left;
            font-size: 14px;
          }
          input {
            float: right;
          }
        }
        ul li.t {
          height: 90px;
        }
      }
      .basic-business-info {
        h5 {
          padding-top: 10px;
          line-height: 40px;
          height: 40px;
          text-indent: 15px;
          color: #333;
          font-size: 14px;
          text-align: left;
          background: #fafafa;
        }
      }
      .basic-photo-info {
        h5 {
          padding-top: 10px;
          line-height: 40px;
          height: 40px;
          background: #fafafa;
          text-align: left;
            i.icon-photo {
              float: left;
              margin-left: 10px;
              margin-top: 10px;
              font-size: 18px;
              color: gold;
            }
            span {
              color: #333;
              font-size: 14px;
              em {
                font-size: 12px;
                font-style: normal;
              }
            }
        }
        li {
          width: 100%;
          border-bottom: 1px solid #ddd;
          i {
            float: left;
            margin-left: 15px;
            font-size: 14px;
          }
          .chose-column {
            overflow: hidden;
          }
          .choose-item {
            float: left;
            margin: 15px 0 15px 25px;
            padding: 0 10px;
            width: 140px;
            height: 20px;
            border: 1px solid #ddd;
            border-radius: 13px;
            input {
              border: 0 none;
              width: 140px;
              height: 20px;
              font-size: 14px;
            }
            a {
              float: left;
              width: 20px;
              height: 20px;
            }
          }
          .choose-item2 {
            float: left;
            margin: 15px 0 15px 25px;
            width: 120px;
            height: 20px;
            border: 1px solid #ddd;
            border-radius: 13px;
            input {
              border: 0 none;
              width: 100px;
              height: 20px;
            }
          }
          .chose-column {
            width: 100%;
          }
          .upload-img {
            float: left;
            margin: 13px;
            width: 160px;
            height: 160px;
            text-align: center;
            .van-uploader {
              display: block;
              margin: 0 46px 15px;
            }
            span.desc {
              width: 100%;
              height: 20px;
              text-align: center;
              font-size: 14px;
            }
          }
        }
      }
//     }
//   }
// }
</style>
