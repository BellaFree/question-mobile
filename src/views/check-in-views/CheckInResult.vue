<template>
    <div class='check-in-result'>
        <div class='state'>
            <img src="/img/check-in/result.png" alt="">
            <p>到店打卡成功</p>
        </div>
        <div class='cont'>
            <p><em>打卡时间：</em><span>到店10:27</span></p>
            <div class='info'>
                <p class='near'><em>最近门店：</em><span>收到 距离77米</span></p>
                <p class='pos'><em>打卡位置：</em><span>fff</span></p>
            </div>
            <div>
                <p class='photo'><em>拍摄照片：</em></p>
                <ul>
                    <li>
                        <img src="" alt="" />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
export default {
  name: 'Home',
  navClass() {
    return 'shop-inspect-nav'
  },
  subtitle() {
    return '到店打卡成功'
  },

  leftIcon() {
    return 'arrow-left'
  },
  onLeft() {
      changeStatusBar ('0A9B58').then (() => {
          history.go(-1)
      })
  },
  beforeMount () {
    changeStatusBar ('0A9B58').then(() => {
        console.log('0A9B58 HOME statusBarColor');
    })
  },
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
        }
    }
</style>