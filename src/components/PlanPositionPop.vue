<template>
<!-- <div> -->
  <van-popup
    v-model="baseInfoVisible"
    class="plan-position-pop-wrapper"
    closeable
    position="bottom"
    round
    :lazy-render="false"
    :duration="0.1"
    @close="handleClose"
    :style="{ height: drawSize }"
  >
    <div class="base-info-div" v-if='isBaseInfoShow'>
      <div class="header-box">
        <div class="title">位置</div>
      </div>
      <div class="content-box">
        <p class="text">{{ positionData.formattedAddress }}</p>
        
        <div class="bottom-buttons">
          <!-- <van-button type="primary" plain @click="planFeekback"
            >市政规划反馈</van-button
          > -->
          <van-button type="primary" @click="addToBase">
            <!-- <van-icon name="/img/network-planning-views/addIcon.png"></van-icon> -->
            录入基盘
          </van-button>
        </div>
      </div>
    </div>
    <div class="base-add-div" v-else>
      <div class="header-box">
        <div class="title">录入基盘</div>
      </div>
      <div class="content-box">
        <div class='base-address-div'>
          <h4>
            <van-icon name='location' class='icon-location' />
            <span class="tit">基盘位置：</span>
            <textarea :readonly="isEditAddress" resize="none" v-model="bInfo.bpAddress"></textarea>
            <van-icon name='location' class='icon-location1' />
          </h4>
          <span class="lngAndlag"><em>经度：{{positionData.position.lng}}</em><em>纬度：{{positionData.position.lat}}</em></span>
        </div>

        <div class='basic-base-info'>
          <ul>
            <li>
            <van-field clearable v-model="bInfo.bpName" label="基盘名称" placeholder="请输入(限6字)" input-align="right" />
            <!-- <span>基盘名称</span> -->
            <!-- <input v-model="bInfo.baseName" placeholder="请输入(限6字)" type="text" /> -->
            </li>
            <li>
              <van-field clearable v-model="bInfo.storeArea" label="门店面积(m²)" placeholder="请输入" input-align="right" />
              <!-- <span>门店面积(m²)</span> -->
              <!-- <van-field v-model="number" type="number" label="数字" /> -->
              <!-- <input v-model="bInfo.baseArea" placeholder="请输入" type="text" /> -->
            </li>
            <li>
              <van-field clickable clearable label="楼层" :value="sInfos.floor.currentName" placeholder="请选择" @click="setSelectOnly('floor')"/>
              <van-popup v-model="showPicker.floor" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="sInfos.floor.nameList"
                  @cancel="showPicker.floor = false"
                  @confirm="onSelectConfirmOnly"
                />
              </van-popup>
            </li>
            <li>
              <van-field clearable v-model="bInfo.storeWidth" label="面宽(m)" placeholder="请输入" input-align="right" />
            </li>
            <li>
              <van-field clearable rental v-model="bInfo.rental" label="租金(元/月)" placeholder="请输入" input-align="right" />
            </li>
            <li class='t'>
              <!-- <span>物业条件(上下水，电力，排烟等)</span><br/>
              <textarea v-model="bInfo.baseName" cols="30" rows="10"></textarea> -->
            <van-field
              v-model="bInfo.estate"
              rows="2"
              autosize
              label="物业条件(上下水，电力，排烟等)"
              type="textarea"
              maxlength="50"
              placeholder="请输入"
              show-word-limit
            />
            </li>
            <li class='t'>
              <!-- <span>500m商圈内的竞品情况</span><br/> -->
              <van-field
                v-model="bInfo.fiveHundredBusiness"
                rows="2"
                autosize
                label="500m商圈内的竞品情况"
                type="textarea"
                maxlength="50"
                placeholder="请输入"
                show-word-limit
              />
            </li>
          </ul>
        </div>
        <div class='basic-business-info'>
          <h5>城市与商圈信息</h5>
          <ul>
            <!-- <li><span>城市名称</span><input type="text" />
            </li> -->
            <li>
              <!-- <van-field clickable clearable label="城市名称" placeholder="请输入" input-align="right" /> -->
              <van-field clickable clearable label="城市名称" :value="value1" placeholder="请选择" @click="showPicker1 = true"/>
                <van-popup v-model="showPicker1" position="bottom">
                  <van-picker
                    show-toolbar
                    :columns="columns1"
                    @cancel="showPicker1 = false"
                    @confirm="onConfirm1"
                  />
                </van-popup>
            </li>
            <li>
              <!-- <van-field clickable clearable label="城市类别" placeholder="请输入" input-align="right" /> -->
              <van-field clickable clearable label="城市类别" :value="sInfos.cityType.currentName" placeholder="请选择" @click="setSelectOnly('cityType')"/>
              <van-popup v-model="showPicker.cityType" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="sInfos.cityType.nameList"
                  @cancel="showPicker.cityType = false"
                  @confirm="onSelectConfirmOnly"
                />
              </van-popup>
            
              <!-- <van-field clickable clearable label="楼层" :value="sInfos.floor.currentName" placeholder="请选择" @click="setSelectOnly('floor')"/>
              <van-popup v-model="showPicker.floor" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="sInfos.floor.nameList"
                  @cancel="showPicker.floor = false"
                  @confirm="onSelectConfirmOnly"
                />
              </van-popup> -->
            </li>
            <li>
              <!-- //businessType  businessLevel  storeLocation  weather -->
              <van-field clickable clearable label="所属商圈类型" :value="sInfos.businessType.currentName" placeholder="请选择" @click="setSelectOnly('businessType')"/>
              <van-popup v-model="showPicker.businessType" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="sInfos.businessType.nameList"
                  @cancel="showPicker.businessType = false"
                  @confirm="onSelectConfirmOnly"
                />
              </van-popup>
            </li>
            <li>
              <van-field clickable clearable label="商圈级别" :value="sInfos.businessLevel.currentName" placeholder="请选择" @click="setSelectOnly('businessLevel')"/>
              <van-popup v-model="showPicker.businessLevel" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="sInfos.businessLevel.nameList"
                  @cancel="showPicker.businessLevel = false"
                  @confirm="onSelectConfirmOnly"
                />
              </van-popup>
            </li>
            <li>
              <van-field clickable clearable label="门店立地判断" :value="sInfos.storeLocation.currentName" placeholder="请选择" @click="setSelectOnly('storeLocation')"/>
              <van-popup v-model="showPicker.storeLocation" position="bottom">
                <van-picker
                  show-toolbar
                  :columns="sInfos.storeLocation.nameList"
                  @cancel="showPicker.storeLocation = false"
                  @confirm="onSelectConfirmOnly"
                />
              </van-popup>
            </li>
          </ul>
        </div>
        <div class='basic-photo-info'>
          <h5><van-icon name='location' class='icon-photo' /><span>照片<em>（必须是全景照片）</em></span></h5>
          <ul>
            <li  v-for="(item, i) of imgInfos" :key="i" >
              <i>{{item.idx}}.</i>
              <div class="chose-column">
                <div class="choose-item"><input type="text" v-model="item.picDate" placeholder="请选择日期" @click="setDateFn(item.idx)" /></div>
                <div class="choose-item choose-item2"><input type="text" v-model="item.picWeather" placeholder="请选择天气" @click="setWeather(item.idx)" /></div>
                <van-popup v-model="showPickerWeather" position="bottom">
                  <van-picker
                    show-toolbar
                    :columns="sInfos.weather.nameList"
                    @cancel="showPickerWeather = false"
                    @confirm="onConfirmWeather"
                  />
                </van-popup>
      <!-- valueWeather: '',
      showPickerWeather: false,
      columnsWeather: ['杭州', '宁波', '温州', '嘉兴', '湖州'], -->

              </div>
              <div class="chose-column">
                <div class="upload-img">
                  <van-uploader :after-read="afterRead" accept='image/*' v-model="item.pictureList1" />
                  <span class="desc">{{item.desc1}}</span>
                </div>
                <div class="upload-img">
                  <van-uploader :after-read="afterRead" accept='image/*' v-model="item.pictureList2" />
                  <span class="desc">{{item.desc2}}</span>
                </div>
              </div>
            </li>
          </ul>
          <van-calendar v-model="calendarShow" @confirm="onConfirmDate" />
        </div>
              
        <div class="bottom-buttons">
          <van-button class="submit-btn" type="primary" @click="setBaseFn()">
            提交
          </van-button>
        </div>
      </div>
    </div>
  </van-popup>
<!-- </div> -->
</template>

<script>
import Vue from 'vue';
import { Field, Notify, Uploader, Calendar } from 'vant';
Vue.use(Notify);
Vue.use(Uploader);
Vue.use(Calendar);

// Vue.use(Field);
export default {
  name: "PlanPositionPop",
  props: ["planPositionShow", "positionData"],
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
        "bpAddress": "ddd",
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
        "picList": [
          {
            "picDate": "2022-12-15",
            "picWeather": "SUNNY",
            "picture1": "https://dicos-1221-mobile-dev.parramountain.com/img/outer/user.png",
            "picture2": "https://dicos-1221-mobile-dev.parramountain.com/img/outer/list1.png"
          },
          {
            "picDate": "2022-12-15",
            "picWeather": "SUNNY",
            "picture1": "https://dicos-1221-mobile-dev.parramountain.com/img/outer/list2.png",
            "picture2": "https://dicos-1221-mobile-dev.parramountain.com/img/outer/list1.png"
          }
        ],
        "provinceCode": "",
        "provinceName": "",
        "rental": "",
        "storeArea": "",
        "storeLocationName": "",
        "storeWidth": "10"
      },

      value1: '',
      showPicker1: false,
      columns1: ['杭州', '宁波', '温州', '嘉兴', '湖州'],

      valueWeather: '',
      showPickerWeather: false,
      columnsWeather: ['杭州', '宁波', '温州', '嘉兴', '湖州'],

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
          "idx": '5',
          "picDate": "",
          "picWeather": "",
          "desc1": "从街道同侧的右侧50米处看门店",
          "desc2": "从街道同侧的右侧50米处看对面",
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
        floor: false
      },
    };
  },
  watch: {
    planPositionShow(val) {
      setTimeout(() => {
        console.log('positionData:', this.positionData);
        this.getDataFn();
        this.getCityFn();
        this.baseInfoVisible = val;
        this.isBaseInfoShow = true;

        this.bInfo.bpAddress = this.positionData.formattedAddress;
        this.bInfo.latitude = this.positionData.position.lat;
        this.bInfo.longitude = this.positionData.position.lng;
      }, 100);
    },
  },
  methods: {
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
    getDataFn() {
      Object.keys(this.sInfos).map((key) => {
        this.$fetch.get('/api/addDp/getBaseDataList', {type: this.sInfos[key].type}).then(res => {
          if (res.code == 200) {
            this.sInfos[key].classification = res.data;
            console.log('key:', key);
            console.log('this.sInfos[key].classification:', key, this.sInfos[key].classification);
          }
        })
      });
    },
    getCityFn() {
      this.$fetch.get('/api/addDp/getRegionList', {parentId: '1b077cfc-e6f6-43ea-b8b6-edae64eeb1b2'}).then(res => {
        console.log('city res:', res);
      })
    },
    setBaseFn() {
      Object.keys(this.sInfos).map(o => {
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
      })
      // console.log("this.bInfo:", this.bInfo);
      this.$fetch.post('/api/addDp/saveDp', this.bInfo
      // {
      //   "bpAddress": "ddd",
      //   "bpCode": "dd",
      //   "bpName": "332",
      //   "businessLevelName": "d",
      //   "businessTypeName": "d",
      //   "cityCode": "34",
      //   "cityName": "44",
      //   "cityTypeName": "33",
      //   "districtCode": "33",
      //   "districtName": "33",
      //   "estate": "33",
      //   "fiveHundredBusiness": "",
      //   "floorCode": "RESTAURANTFLOOR1",
      //   "floorName": "1F",
      //   "latitude": "31.241706",
      //   "longitude": "121.482644",
      //   "picList": [
      //     {
      //       "picDate": "2022-12-15",
      //       "picWeather": "SUNNY",
      //       "picture1": "https://dicos-1221-mobile-dev.parramountain.com/img/outer/user.png",
      //       "picture2": "https://dicos-1221-mobile-dev.parramountain.com/img/outer/list1.png"
      //     },
      //     {
      //       "picDate": "2022-12-15",
      //       "picWeather": "SUNNY",
      //       "picture1": "https://dicos-1221-mobile-dev.parramountain.com/img/outer/list2.png",
      //       "picture2": "https://dicos-1221-mobile-dev.parramountain.com/img/outer/list1.png"
      //     }
      //   ],
      //   "provinceCode": "",
      //   "provinceName": "",
      //   "rental": "",
      //   "storeArea": "",
      //   "storeLocationName": "",
      //   "storeWidth": "10"
      // }
      ).then(res => {
        console.log('res:', res);
        if (res.code != 200) {
          Notify({ type: "warning", message: res.message, duration: 1000 });
          return;
        }
        
      })
    },
    onConfirm1(value) {
      this.value1 = value;
      this.showPicker1 = false;
    },
    //打开天气
    setWeather(idx) {
      this.sInfos.weather.nameList = [];
      this.currentPhoto = idx - 1;
      this.sInfos.weather.classification.map(item => {
        this.sInfos.weather.nameList.push(item.name);
      })
      console.log('this.sInfos.weather.nameList:', this.sInfos.weather.nameList);
      console.log('setDateFn:', idx);
      this.showPickerWeather = true;
    },
    setSelectOnly(TYPE) {
      this.sInfos[TYPE].nameList = [];
      this.currentType = TYPE;
      console.log('this.sInfos[TYPE].classification:', this.sInfos[TYPE].classification);
      this.sInfos[TYPE].classification.map(item => {
        this.sInfos[TYPE].nameList.push(item.name);
      })
      this.showPicker[TYPE] = true;
    },
    onSelectConfirmOnly(value) {
      this.sInfos[this.currentType].currentName = value;

      var code = this.sInfos[this.currentType].classification.filter(o => o.name == value)[0].code;
      this.sInfos[this.currentType].currentCode = code;
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
      console.log('setDateFn:', idx);
      this.currentPhoto = idx - 1;
      this.date = this.imgInfos[this.currentPhoto].picDate;
      console.log('this.date:', this.date);
      this.imgInfos[this.currentPhoto].picDateShow = true;
      this.calendarShow = this.imgInfos[this.currentPhoto].picDateShow;
    },
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
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
        form_data.append("multfile", img)
        this.uploadStatus = 1;
        // this.$fetch.post('/uploadApi/upload', form_data, false, true).then(res => {
        this.$fetch.post('/visit-api/upload', form_data, false, true).then(res => {
            const { code, data, message } = res;
            this.uploadStatus = 2
            if (code != 200) {
                Notify ({ type: 'warning', message, duration: 1000 });
                return false;
            }
            if (data.imageUrl) {
                // this.fileList[this.fileList.length - 1].imageUrl = data.imageUrl;
                return false;
            } else {
                return false;
            }
        })
    },
    afterRead(file) {
      this.uploadImgFn (file.file);
      // console.log('this.fileList:', this.fileList);
    },
  }
};
</script>
<style lang="scss">
.van-field__control {
  text-align: right!important;
}
</style>
<style lang="scss" scoped>
.plan-position-pop-wrapper {
  display: flex;
  flex-direction: column;
  .base-info-div {
    height: auto;
  .header-box {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    text-align: center;
    position: relative;
    border-bottom: 1px solid #e6e6e6;
    .title {
      font-size: 16px;
      height: 40px;
      padding-top: 5px;
    }
  }
  .content-box {
    flex: 1;
    height: 200px;
    overflow: hidden;
    text-align: left;
    position: relative;
    p.text {
      margin: 20px 10px;
      font-size: 14px;
    }
    .bottom-buttons {
      width: 100%;
      height: 67px;
      padding-top: 13px;
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: center;
      border-top: 1px solid #e6e6e6;
      display: flex;
      justify-content: space-around;
    }
  }
  }
  .base-add-div {
    width: 100%;
  .header-box {
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    text-align: center;
    position: relative;
    border-bottom: 1px solid #e6e6e6;
    .title {
      font-size: 16px;
      height: 40px;
      padding-top: 5px;
    }
  }
  .content-box {
    flex: 1;
    overflow: hidden;
    text-align: left;
    position: relative;
    .bottom-buttons {
      width: 100%;
      height: 67px;
      padding-top: 13px;
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: center;
      // border-top: 1px solid #e6e6e6;
      display: flex;
      justify-content: space-around;
    }
  }
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
      }
      i.icon-location1 {
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
        padding: 5px 0;
        width: 100%;
        height: 35px;
        border-bottom: 1px solid #ddd;
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
      padding-bottom: 75px;
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
      .submit-btn {
        width: 300px;
        border-radius: 20px;
      }
}

}
</style>
