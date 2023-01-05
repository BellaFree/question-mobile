<template>
  <div class="approval-warp">
    <!-- 审批状态：//发起人审批人的数据接口给，一目了然 -->
    <div class="approval-div">
      <h3>审批状态：
        <em>审批中</em>
        <em>待审批</em>
        <em class="success">审批通过</em>
        <em class="fail">驳回</em>
      </h3>
      <ul>
        <li class="txt">发起人：这里是发起人姓名</li>
        <li class="txt">发起时间：2022-12-11 13:52:22</li>
        <li class="txt">审批人：这里是审批人姓名</li>
        <li class="txt">审批时间：2022-12-12 15:53:43</li>
        <li class="evaluation">
          <p>主管及业主现场评估（照片）</p>
          <div>
            <img src="https://t10.baidu.com/it/u=1376751934,193161953&fm=30&app=106&size=f242,162&n=0&g=0n&f=JPEG?s=AE84854BCA5616CC5AA8BCBA03005000&sec=1672885981&t=b392d9fccb0957cecd945c9822c8ebcb" alt="" />
            <img src="https://t10.baidu.com/it/u=1376751934,193161953&fm=30&app=106&size=f242,162&n=0&g=0n&f=JPEG?s=AE84854BCA5616CC5AA8BCBA03005000&sec=1672885981&t=b392d9fccb0957cecd945c9822c8ebcb" alt="" />
          </div>
          </li>
      </ul>
    </div>
    <div>

    
    <div class='base-address-div'>
      <h4>
        <van-icon name='location' class='icon-location' />
        <span class="tit">基盘位置：</span>
        <span class="text">上海市黄浦区南京东路街道西藏中路223号</span>
      </h4>
      <span class="lngAndlag"><em>经度:</em><em>纬度:</em></span>
    </div>
    <div class='basic-base-info'>
      <ul>
        <li>
          基盘名称
          <span class="text">222</span>
        </li>
        <li>门店面积(m²)
          <span class="text"></span>
        </li>
        <li>
          楼层
          <span class="text"></span>
        </li>
        <li>
          面宽(m)
          <span class="text"></span>
        </li>
        <li>
          租金(元/月)
          <span class="text"></span>
        </li>
        <li class='t'>
          物业条件(上下水，电力，排烟等)
          <span class="text"></span>
        </li>
        <li class='t'>
          500m商圈内的竞品情况
          <span class="text"></span>
        </li>
      </ul>
    </div>
    <div class='basic-business-info'>
      <h5>城市与商圈信息</h5>
      <ul>
        <li>城市名称
          <span class="text"></span>
        </li>
        <li>城市类别
          <span class="text"></span>
        </li>
        <li>所属商圈类型
          <span class="text"></span>
        </li>
        <li>商圈级别
          <span class="text"></span>
        </li>
        <li>门店立地判断
          <span class="text"></span>
        </li>
      </ul>
    </div>
    <div class='basic-photo-info'>
      <h5><van-icon name='location' class='icon-photo' /><span>照片<em>（必须是全景照片）</em></span></h5>
      <ul>
        <li v-for="(item, i) of imgInfos" :key="i" >
          <i>{{item.idx}}.</i>
          <h4>
            <span>2022-03-01</span><span>晴</span>
          </h4>
          <div class="chose-column">
            <div class="upload-img">
              <img src="" alt="" />
              <span class="desc">{{item.desc1}}</span>
            </div>
            <div class="upload-img">
              <img src="" alt="" />
              <span class="desc">{{item.desc2}}</span>
            </div>
          </div>
        </li>
      </ul>
      <van-calendar type="single" v-model="calendarShow" @confirm="onConfirmDate" />
    </div>
    </div>
    <div class="operate-div">
      <div>
        <van-button class="Sponsor-operate1" round type="info">驳回</van-button>
        <van-button class="Sponsor-operate2" round type="info">通过</van-button>
      </div>
      <div>
        <van-button class="leader-operate1" round type="info">撤销</van-button>
        <van-button class="leader-operate2" round type="info">修改</van-button>
      </div>
      <div>
        <van-button class="success-operate" round type="info">修改</van-button>
      </div>
      <div>
        <van-button class="fail-operate" round type="info">修改</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import BasicPlantInfo from '@/components/BasicPlantInfo'
export default {
  name: "index",
  components: {BasicPlantInfo},
  subtitle () {
    return '审批'
  },
  leftIcon () {
    return 'arrow-left'
  },
  onLeft () {
    history.go(-1);
  },
  data() {
    return {
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
    }
  },
}
</script>

<style lang="scss" scoped>
.approval-warp {
  background: #FAFAFA;
}
//审批状态
.approval-div {
  box-sizing: border-box;
  padding: 17px 15px;
  width: 100%;
  background: #FAFAFA;
  text-align: left;
  h3 {
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #4C4C4C;
    em {
      font-style: normal;
      color: #F5A623;
    }
    .success {
      color: #19BE6B;
    }
    .fail {
      color: #D0021B;
    }
  }
  ul {
    margin-top: 5px;
    li.txt,
    li.evaluation {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4C4C4C;
      line-height: 24px;
    }
    li.evaluation {
      div {
        margin-top: 4px;
        img {
          margin-right: 16px;
          display: inline-block;
          width: 74px;
          height: 74px;
          border-radius: 4px;
        }
      }
    }
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
  span.text {
    float: left;
    width: 200px;
    font-size: 14px;
    padding: 3px 0 0 0;
    line-height: 22px;
    color: #333;
    text-align: left;
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
  background: #fff;
  ul li {
    box-sizing: border-box;
    padding: 0 15px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    border-bottom: 1PX solid #ddd;
    color: #333;
    font-size: 14px;
    text-align: left;
    span {
      float: right;
      font-size: 14px;
    }
    // input {
    //   float: right;
    // }
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
            width: 100%;
            overflow: hidden;
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
.success-operate {
  width: 342px;
  height: 44px;
  background: #F5A623;
  border-radius: 22px;
}
.fail-operate {
  width: 342px;
  height: 44px;
  background: #10AC64;
  border-radius: 22px;
}
.leader-operate1,
.leader-operate2 {
  width: 153px;
  height: 44px;
  background: #F5A623;
  border-radius: 22px;
}
.leader-operate2 {
  background: #10AC64;
}
.Sponsor-operate1,
.Sponsor-operate2 {
  width: 153px;
  height: 44px;
  background: #F5A623;
  border-radius: 22px;
}
.Sponsor-operate2 {
  background: #10AC64;
}
</style>