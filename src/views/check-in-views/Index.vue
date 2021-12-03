<template>
  <div class='check-in-div'>
      <div class='step1' v-show='step == 1'>
          <div id='container'></div>
          <div class='check-in-info'>
            <div class='pos-info'>
              <p>最近门店：德克士(火车站店)</p>
              <span>静安区曹家渡万航渡路海森国际大厦894号</span>
            </div>
            <div class='pos-info pos-info-now'>
              <p>现在位置：距离最近 711米</p>
              <span>静安区曹家渡万航渡路海森国际大厦894号</span>
            </div>
            <div class='check-in-btn'>
              <a href='javascript:void(0);'>
                <em>到店打卡</em>
                <i>10:27:30</i>
              </a>
              <a href='javascript:void(0);'>
                <em>离店打卡</em>
                <i>12:33:30</i>
              </a>
              <span>到店打卡：10:27</span>
            </div>
          </div>
      </div>
      <div class='step2' v-show='step == 2'>
          <p><em>打卡时间：</em><span>10:27</span></p>
          <div class='info'>
              <p class='near'><em>最近门店：</em><span>德克士(火车站店) 距离711米</span></p>
              <p class='pos'><em>打卡位置：</em><span>静安区曹家渡万航渡路海森国际大厦894号</span></p>
          </div>
          <div>
              <p class='photo'><em>拍摄照片：</em></p>
          </div>
          <footer>
              <a href='javascript:void(0);'>确认打卡</a>
          </footer>
      </div>
  </div>
</template>
<script>
export default {
  name: "IndexView",
  subtitle() {
    return '打卡签到'
  },
  leftIcon() {
      return 'arrow-left'
  },
  onLeft() {
      // window.location.href = 'http://103.13.247.70:8091/gisApp/page/home/home.html?timestamp=' + new Date().getTime()
      history.go(-1);
  },
  data() {
    return {
      step: 2
    }
  },
  mounted() {
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
.check-in-div {
    // background: gray;
    #container {
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
                height: 24px;
                font-size: 17px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #333;
            }
            span {
                padding-top: 6px;
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
}

</style>
