<template>
    <div class='check-in-result'>
        <div class='state'>
            <img src="/img/check-in/result.png" alt="">
            <p v-if='checkInResult.signType == "0"'>到店打卡成功</p>
            <p v-if='checkInResult.signType == "1"'>离店打卡成功</p>
        </div>
        <div class='cont'>
            <p><em>打卡时间：</em><span>到店 {{ checkInResult.signTimeStart }}</span><span v-if='checkInResult.signType == "1"'>离店 {{ checkInResult.signTimeEnd }}</span></p>
            <div class='info'>
<!--                <p class='near'><em>最近门店：</em><span>{{ checkInResult.storeName }}</span><span>距离{{ checkInResult.pointLen }}米</span></p>-->
                <p class='pos'><em>打卡位置：</em><span>{{ checkInResult.signAddress }}</span></p>
            </div>
            <div>
                <p class='photo'><em>拍摄照片：</em></p>
                <ul v-if='imgs.length > 0'>
                    <li v-for='(item, i) in imgs' :key='i' >
                        <img :src="item" alt="" />
                    </li>
                </ul>
            </div>
        </div>
        <footer>
            <a href='javascript:void(0);' @click='backHome'>返回首页</a>
        </footer>
    </div>
</template>
<script>
import moment from "moment";
import { changeStatusBar } from '@/utils/interact.js'
export default {
  name: 'Home',
  navClass() {
    return 'shop-inspect-nav'
  },
  subtitle() {
      if (this.checkInResult.signType == "0") {
        return '到店打卡成功'
      } else {
        return '离店打卡成功'
      }
  },

  leftIcon() {
    return 'arrow-left'
  },
  onLeft() {
      changeStatusBar ('FFFFFF').then (() => {
          history.go(-1)
      })
  },
  data () {
      return {
        checkInResult: {},
        imgs: [],
    }
  },
  beforeMount () {
    changeStatusBar ('0A9B58').then(() => {
        console.log('0A9B58 HOME statusBarColor');
    })
  },
  mounted () {
      this.checkInResult = JSON.parse(window.sessionStorage.getItem('takeCardResult'))
      this.checkInResult.signTimeStart = moment(this.checkInResult.signTimeStart).format('HH:mm');
      this.checkInResult.signTimeEnd = moment(this.checkInResult.signTimeEnd).format('HH:mm');
      let imgs = this.checkInResult.filesUrl.substr(0, this.checkInResult.filesUrl.length - 1);
      const imgs1 = imgs.split(',');
      let arr = [];
      imgs1.map(item => {
          if (item !== '') {
            arr.push(item);
          }
      })
      this.imgs = arr;
      console.log('this.imgs:', this.imgs);
  },
  methods: {
      backHome () {
        history.go(-1)
      }
  }
}
</script>
<style lang="scss" scoped>
    nav.shop-inspect-nav {
        background: #0A9B58;
        background-size: 100% auto;
        border-bottom: 0 none;
        color: #fff;
    }
    .check-in-result {
        padding-top: 3px;
        padding-bottom: 96px;
        width: 100%;
        text-align: center;
        background: url('/img/outer/bg.png') no-repeat 0 -50px;
        background-size: 100% auto;
        .state {
            img {
                margin: 0 auto 7px;
                display: block;
                width: 97px;
                height: 106px;
            }
            p {
                margin-bottom: 14px;
                height: 27px;
                line-height: 27px;
                font-size: 19px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #FFF;
            }
        }
        .cont {
            padding-bottom: 20px;
            margin: 0 auto;
            width: 345px;
            background: #FFF;
            box-shadow: 1px 2px 6px 2px rgba(0, 0, 0, 0.06);
            border-radius: 10px;
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
                    width: 70px;
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
            ul {
                // display: flex;
                width: 100%;
                overflow: hidden;
                li {
                    float: left;
                    padding: 12px 0 10px 10px;
                    // justify-content: space-around;
                    width: 74px;
                    height: 74px;
                    img {
                        border-radius: 4px;
                        display: block;
                        width: 100%;
                        height: 100%;
                    }
                }
            }
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
</style>
