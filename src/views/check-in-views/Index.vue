<template>
  <div class='check-in-div'>
      <div class='step1' v-show='step == 1'>
          <div id='container'></div>
          <div class='check-in-info'>
<!--            <div class='pos-info'>-->
<!--              <p><em>最近门店：</em><span class='cont'>{{ nearStore.storeName }}</span></p>-->
<!--              <span>{{ nearStore.storeAddress }}</span>-->
<!--            </div>-->
            <div class='pos-info pos-info-now'>
              <p><em>现在位置</em></p>
              <span>{{ positionInfo.formattedAddress }}</span>
            </div>
            <div class='check-in-btn'>
              <a v-if='!nearStore.signTime' href='javascript:void(0);' @click='takeCard'>
                <em>到店打卡</em>
                <i>{{ nowDateTime }}</i>
              </a>
              <a v-if='nearStore.signTime' href='javascript:void(0);' @click='takeCard'>
                <em>离店打卡</em>
                <i>{{ nowDateTime }}</i>
              </a>
              <span v-if='nearStore.signTime'>到店打卡：{{ nearStore.signTime }}</span>
            </div>
          </div>
      </div>
      <div class='step2' v-show='step == 2'>
          <p><em>打卡时间：</em><span>{{ takeCardObj.time }}</span></p>
          <div class='info'>
<!--              <p class='near'><em>最近门店：</em><span>{{ nearStore.storeName }} 距离{{ nearStore.pointLen }}米</span></p>-->
              <p class='pos'><em>打卡位置：</em><span>{{ positionInfo.formattedAddress }}</span></p>
          </div>
          <div>
              <p class='photo'><em>拍摄照片：</em><em v-if='nearStore.signTime'>(建议拍摄1-3张门头照片)</em><em v-else>(建议拍摄1-3张店内照片)</em></p>
              <van-uploader :before-read="beforeRead" :after-read="afterRead" :before-delete="beforeDelete" capture='camera' v-model="fileList" accept='image/*' multiple />
          </div>
          <footer>
              <a href='javascript:void(0);' @click='takeCardConfrim'>确认打卡</a>
          </footer>
      </div>
  </div>
</template>
<script>
import Vue from "vue";
import moment from "moment";
import { Notify, Uploader } from 'vant';
// import { uploadImgFn } from '@/utils/index.js'
import { formatTime } from '@/utils/usual.js'
import { geolocation, mGeolocation } from '@/utils/map.js'

Vue.use(Notify);
Vue.use(Uploader);
export default {
  name: "IndexView",
  subtitle () {
    return '打卡签到'
  },
  leftIcon () {
      return 'arrow-left'
  },
  onLeft () {
      history.go(-1);
  },
  data () {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')) || '',
      step: 1,
      map: {},
      nearStore: {},
      nowDateTime: '',
      WholeNowDateTime: '',
      positionInfo: {},
      takeCardObj: {
        time: ''
      },
      fileList: [],
    }
  },
  created () {
      this.currentTime ();
  },
  mounted () {
      this.map = new AMap.Map ('container', {
            resizeEnable: true,
            // zoom: 5,
            // center: [120.581807, 31.292088],//苏州
        });
      this.map.addControl (geolocation);
      mGeolocation(geolocation).then(res => {
          if (res.status != 'complete') return;
          this.positionInfo = res.result;
          console.log('this.positionInfo:', this.positionInfo);
          const { lat, lng } = this.positionInfo.position;
          // this.getStoreInfoFn (lat, lng);
      })
  },
  methods: {
    // 打卡签到-获取距离最近门店
    getStoreInfoFn (lat, lng) {
          this.$fetch.get(`/api/dicosViSignIn/sign-in/distance/store-info`, {
            lat,
            lng,
            work_user_no: this.userInfo.userNo
          }, {
            isHeaderFormUrlencoded : true
          }).then ( res => {
              if ( res.code != 200 ) {
                  Notify({ type: 'warning', message: res.message, duration: 1000 });
                  return;
              }
              this.nearStore = res.data;
              if (this.nearStore) {
                  this.addMarker ('pos', lat, lng);
                  const { storeLat, storeLng } = this.nearStore;
                  this.addMarker ('store', parseFloat(storeLat), parseFloat(storeLng));

                  setTimeout(() => {
                      this.map.setFitView();
                  }, 1000);
              }
        })
    },
    addMarker (type = 'pos', lat, lng) {
        const marker = new AMap.Marker ({
            position: [lng, lat],
            zIndex: 1301,
            icon: new AMap.Icon ({
                size: new AMap.Size (25, 25),
                image: type == 'store' ? '/img/check-in/discoIcon.png' : '/img/check-in/position-picker.png',
                imageSize: new AMap.Size (25, 25),
            }),
            offset: new AMap.Pixel (-12, -37)
        });
        marker.on ('click', () => {
            console.log('click');
        })
        this.map.add ([marker]);
    },
    // 获取当前时间
    currentTime () {
        setInterval (() => {
            this.WholeNowDateTime = formatTime();
            this.nowDateTime = moment(this.WholeNowDateTime).format('HH:mm:ss');
        }, 500);
    },
    // 打卡
    takeCard () {
        const time = moment(this.WholeNowDateTime).format('HH:mm');
        const wholeTime = this.WholeNowDateTime;
        this.takeCardObj = {
          wholeTime,
          time
        }
        this.step = 2
    },
    beforeRead(file, detail) {
    //   if (file.type !== 'image/jpeg') {
    //     Notify({ type: 'warning', message: '请上传jpg格式图片', duration: 1000 });
    //     return false;
    //   }
      return true;
    },
    afterRead(file) {
      this.uploadImgFn (file.file);
      console.log('this.fileList:', this.fileList);
    },

    beforeDelete(file) {
        this.fileList.map((o, i) => {
            if (o.imageUrl == file.imageUrl) {
                this.fileList.splice(i, 1);
            }
        });
    },

    uploadImgFn (img) {
        let form_data = new FormData()
        form_data.append("multfile", img)

        this.$fetch.post('/api/upload', form_data, false, true).then(res => {
            const { code, data, message } = res;
            if (code != 200) {
                Notify ({ type: 'warning', message, duration: 1000 });
                return false;
            }
            if (data.imageUrl) {
                this.fileList[this.fileList.length - 1].imageUrl = data.imageUrl;
                return false;
            } else {
                return false;
            }
        })
    },
    takeCardConfrim () {
        let filesUrl = '';
        this.fileList.map(item => { filesUrl += item.imageUrl + ','; });
        const { lat, lng } = this.positionInfo.position;
        const takeCardResult = {
            executeNo: this.nearStore.executeNo,
            filesUrl,
            gdLat: lat,
            gdLng: lng,
            signAddress: this.positionInfo.formattedAddress,
            signInNo: this.nearStore.signInNo,
            signTime: this.takeCardObj.wholeTime,
            signType: this.nearStore.signTime ? '1' : '0',
            signUser: this.userInfo.tuName,
            signUserNo: this.userInfo.tuId,
            storeLat: this.nearStore.storeLat,
            storeLng: this.nearStore.storeLng,
            storeNo: this.nearStore.storeNo,
            workNo: this.nearStore.workNo,
            orgId: this.userInfo.parentId,
        }
        console.log('filesUrl:', filesUrl);
        const signTimeStart = this.nearStore.signTime || this.takeCardObj.wholeTime;
        const signTimeEnd = this.nearStore.signTime ? this.takeCardObj.wholeTime : '';
        const storeName = this.nearStore.storeName;
        const pointLen = this.nearStore.pointLen
        const setTakeCardResult = Object.assign({}, takeCardResult, {
            signTimeStart,
            signTimeEnd,
            storeName,
            pointLen
        })
        this.$fetch.post(`/api/dicosViSignIn/task/sign-in`, takeCardResult).then ( res => {
            const { code, data, message } = res;
            if ( code != 200 ) {
                Notify({ type: 'warning', message, duration: 1000 });
                return;
            }
            if (message != '签到成功') {
                Notify({ type: 'warning', message, duration: 1000 });
                return;
            }
            window.sessionStorage.setItem('takeCardResult', JSON.stringify(setTakeCardResult))
            setTimeout(() => {
                location.href = '/check-in/result'
            }, 500)
        })
    }
  }
};
</script>
<style lang="scss">
.check-in-div {
    #container {
        width: 100%;
        height: 50vh;
    }
    .check-in-info {
        background: #fff;
        border-radius: 10px 10px 0px 0px;
        .pos-info {
          position: relative;
            padding: 15px 0 0 37px;
            line-height: 1;
            text-align: left;
            p {
                overflow: hidden;
                line-height: 24px;
                font-size: 17px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #333;
                em {
                    font-style: normal;
                    width: 125px;
                }
                span.cont {
                    float: right;
                    width: 250px;
                    padding-top: 0;
                }
            }
            > span {
                padding-top: 6px;
                line-height: 24px;
            }
        }
        .pos-info:before, .pos-info-now:before {
            position: absolute;
            top: 14px;
            left: 18px;
            margin-right: 4px;
            content: '.';
            text-indent: -9999px;
            width: 16px;
            height: 19px;
            display: inline-block;
            background: url('/img/check-in/pos1.png') no-repeat 0 0;
            background-size: 100% 100%;
        }
        .pos-info-now:before {
            background: url('/img/check-in/pos2.png') no-repeat 0 0;
            background-size: 100% 100%;
        }
        .check-in-btn {
            margin: 0 auto;
            height: 50%;
            line-height: 1;
            a {
                margin: 33px auto;
                display: block;
                width: 121px;
                height: 121px;
                border-radius: 50%;
                background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
                box-shadow: 0px 2px 10px 3px rgba(166, 232, 81, 0.76);
                text-align: center;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #FFF;
                > em, > i {
                    float: left;
                    width: 100%;
                    font-style: normal;
                }
                em {
                    padding-top: 40px;
                    height: 27px;
                    font-size: 19px;
                }
                i {
                    padding-top: 6px;
                    height: 21px;
                    font-size: 15px;
                }
            }
            span {
                height: 20px;
                font-size: 8px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #565656;
            }
        }
    }
    .check-in-info:before {
        display: inline-block;
        content: '.';
        text-indent: -9999px;
        margin-top: 10px;
        width: 35px;
        height: 5px;
        background: #D8D8D8;
        border-radius: 4px;
    }
    .step2 {
      p {
          position: relative;
          margin: 0 auto;
          width: 299px;
          padding: 17px 12px 13px 34px;
          line-height: 20px;
          text-align: left;
          display: flex;
          font-family: PingFangSC-Semibold, PingFang SC;
          em {
            font-size: 14px;
            font-weight: 600;
            color: #4C4C4C;
            font-style: normal;
          }
          span {
            flex: 1;
            font-size: 15px;
            font-weight: 600;
            color: #333;
          }
      }
      p:before {
          position: absolute;
          top: 16px;
          left: 10px;
          display: block;
          width: 19px;
          height: 19px;
          content: '.';
          text-indent: -9999px;
          background: url('/img/check-in/time.png') no-repeat 0 0;
          background-size: 100% 100%;
      }
      .info {
          margin: 0 auto;
          width: 345px;
          background: #fff;
          border-top: 1PX solid #DBDBDB;
          box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.06);
          border-radius: 0px 0px 5px 5px;
      }
      p.near:before {
          background: url('/img/check-in/near.png') no-repeat 0 0;
          background-size: 100% 100%;
      }
      p.pos:before {
          background: url('/img/check-in/pos.png') no-repeat 0 0;
          background-size: 100% 100%;
      }
      p.photo:before {
          background: url('/img/check-in/photo.png') no-repeat 0 0;
          background-size: 100% 100%;
      }
      footer {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        background: #FFF;
        box-shadow: 0px -3px 5px 0px rgba(0, 0, 0, 0.06);
          a {
              margin: 3px auto 0;
              display: block;
              width: 340px;
              height: 44px;
              line-height: 44px;
              background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
              border-radius: 22px;
              font-size: 15px;
              font-family: PingFangSC-Semibold, PingFang SC;
              font-weight: 600;
              color: #FFF;
            }
      }

    }
    .van-uploader__preview-delete {
        position: absolute;
        top: 0;
        right: 0;
        width: 14px;
        height: 14px;
        background-color: rgba(0,0,0,.7);
        border-radius: 0 0 0 12px;
    }
    .van-uploader__preview-delete-icon {
        position: absolute;
        top: -2px;
        right: -2px;
        color: #fff;
        font-size: 16px;
        -webkit-transform: scale(.5);
        transform: scale(.5);
    }
}
.amap-geolocation-con {
    z-index: 10!important;
    position: absolute!important;
    bottom: 20PX!important;
    left: 13PX!important;
    .back-position {
        width: 20PX;
        height: 20PX;
    }
}
</style>
