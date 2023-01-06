<template>
  <div class="approval-warp">
    <!-- 审批状态 -->
    <div class="approval-div">
      <h3>
        审批状态：
        <!-- <em v-if='info.approveStatus == 1'>审批中</em> -->
        <em v-if='info.approveStatus == 0'>已撤销</em>
        <em v-else-if='info.approveStatus == 1'>待审批</em>
        <em v-else-if='info.approveStatus == 2' class="success">审批通过</em>
        <em v-else class="fail">驳回</em>
      </h3>
      <ul>
        <li class="txt">发起人：{{ info.createUserName }}</li>
        <li class="txt">发起时间：{{ info.createTime }}</li>
        <li v-if="info.approveUserName" class="txt">审批人：{{ info.approveUserName }}</li>
        <!-- <li class="txt">审批时间：{{ info.dicosManualMapBpApproveLogVOList[0].operateTime }}</li> -->
        <li v-if="false" class="evaluation">
          <p>主管及业主现场评估（照片）</p>
          <div>
            <img src="https://t10.baidu.com/it/u=1376751934,193161953&fm=30&app=106&size=f242,162&n=0&g=0n&f=JPEG?s=AE84854BCA5616CC5AA8BCBA03005000&sec=1672885981&t=b392d9fccb0957cecd945c9822c8ebcb" alt="">
            <img src="https://t10.baidu.com/it/u=1376751934,193161953&fm=30&app=106&size=f242,162&n=0&g=0n&f=JPEG?s=AE84854BCA5616CC5AA8BCBA03005000&sec=1672885981&t=b392d9fccb0957cecd945c9822c8ebcb" alt="">
          </div>
        </li>
      </ul>
    </div>
    <div>
      <div class='base-address-div'>
        <h4>
          <van-icon name='location' class='icon-location' />
          <span class="tit">基盘位置：</span>
          <span class="text">{{ bpInfo.bpAddress }}</span>
        </h4>
        <span class="lngAndlag"><em>经度:{{ bpInfo.longitude }}</em><em>纬度:{{ bpInfo.longitude }}</em></span>
      </div>
      <div class='basic-base-info'>
        <ul>
          <li>
            基盘名称
            <span class="text">{{ bpInfo.bpName }}</span>
          </li>
          <li>
            门店面积(m²)
            <span class="text">{{ bpInfo.storeArea }}</span>
          </li>
          <li>
            楼层
            <span class="text">{{ bpInfo.floorName }}</span>
          </li>
          <li>
            面宽(m)
            <span class="text">{{ bpInfo.storeWidth }}</span>
          </li>
          <li>
            租金(元/月)
            <span class="text">{{ bpInfo.rental }}</span>
          </li>
          <li class='t'>
            物业条件(上下水，电力，排烟等)
            <span class="text">{{ bpInfo.estate }}</span>
          </li>
          <li class='t'>
            500m商圈内的竞品情况
            <span class="text">{{ bpInfo.fiveHundredBusiness }}</span>
          </li>
        </ul>
      </div>
      <div class='basic-business-info'>
        <h5>城市与商圈信息</h5>
        <ul>
          <li>
            城市名称
            <span class="text">{{ bpInfo.provinceName }} {{ bpInfo.cityName }} {{ bpInfo.districtName }}</span>
          </li>
          <li>
            城市类别
            <span class="text">{{ bpInfo.cityTypeName }}</span>
          </li>
          <li>
            所属商圈类型
            <span class="text">{{ bpInfo.businessTypeName }}</span>
          </li>
          <li>
            商圈级别
            <span class="text">{{ bpInfo.businessLevelName }}</span>
          </li>
          <li>
            门店立地判断
            <span class="text">{{ bpInfo.storeLocationName }}</span>
          </li>
        </ul>
      </div>
      <div class='basic-photo-info'>
        <h5><van-icon name='location' class='icon-photo' /><span>照片<em>（必须是全景照片）</em></span></h5>
        <ul>
          <li v-for="(item, i) of imgInfos" :key="i">
            <i>{{ i + 1 }}.</i>
            <h4>
              <span>{{ item.picDate }}</span><span>{{ item.picWeather }}</span>
            </h4>
            <div class="chose-column">
              <div class="upload-img">
                <img :src="item.picture1" alt="">
                <span class="desc">{{ item.desc1 }}</span>
              </div>
              <div class="upload-img">
                <img :src="item.picture2" alt="">
                <span class="desc">{{ item.desc2 }}</span>
              </div>
            </div>
          </li>
        </ul>
      <!-- <van-calendar type="single" v-model="calendarShow" @confirm="onConfirmDate" /> -->
      </div>
    </div>
    <div class="operate-div">
      <div v-if='info.approveStatus == 1 || info.approveStatus == 0 && info.createUserId == this.userId'>
        <van-button v-if="info.approveStatus == 1" class="leader-operate1" round type="info" @click="showRevokeDialog=true">撤销</van-button>
        <van-button class="leader-operate2" round type="info" @click="showModifyDialog=true">修改</van-button>
      </div>
      <div v-if='info.approveStatus == 1 && info.createUserId != this.userId'>
        <van-button class="Sponsor-operate1" round type="info" @click="showDisagreeDialog=true">驳回</van-button>
        <van-button class="Sponsor-operate2" round type="info" @click="showApproveDialog=true">通过</van-button>
      </div>
      <!-- <div>
        <van-button class="success-operate" round type="info">修改</van-button>
      </div>
      <div>
        <van-button class="fail-operate" round type="info">修改</van-button>
      </div> -->
    </div>
    <!--通过审批-->
    <van-dialog
      v-model="showApproveDialog"
      title="通过审批"
      confirmButtonText="确认通过"
      confirmButtonColor="#10AC64"
      show-cancel-button
      @confirm="confirmApproveDialog">
      <div class="disagree-div">
        <p>主管及业主现场评估</p>
      </div>
    </van-dialog>
    <!--驳回-->
    <van-dialog
      v-model="showDisagreeDialog"
      title="驳回"
      confirmButtonText="确认驳回"
      confirmButtonColor="#D0021B"
      show-cancel-button
      @confirm="confirmDisagreeDialog">
      <div class="disagree-div">
        <p>驳回原因：</p>
        <textarea id="" class name="" cols="30" rows="10" />
      </div>
    </van-dialog>
    <!--修改-->
    <van-dialog
      v-model="showModifyDialog"
      title="修改"
      confirmButtonText="继续修改"
      confirmButtonColor="#F5A623"
      show-cancel-button
      @confirm="confirmModifyDialog" />
    <!--撤销-->
    <van-dialog
      v-model="showRevokeDialog"
      title="撤销"
      confirmButtonText="确认撤销"
      confirmButtonColor="#F5A623"
      show-cancel-button
      @confirm="confirmRevokeDialog">
      <div class="disagree-div">
        <p v-if="info.approveStatus == 1">是否确认撤销?</p>
        <p v-if="info.approveStatus == 2 || info.approveStatus == 3">审批已完成，撤销需要再次审批</p>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import BasicPlantInfo from '@/components/BasicPlantInfo';
export default {
  name: 'index',
  components: { BasicPlantInfo },
  subtitle() {
    return `${this.bpInfo.bpName}基盘审批`;
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    history.go(-1);
  },
  data() {
    return {
      showApproveDialog: false,
      showDisagreeDialog: false,
      showRevokeDialog: false,
      showModifyDialog: false,
      show: false,
      a: '333',
      info: {},
      bpInfo: { bpName: '' },
      imgInfos: [
        {
          idx: '1',
          picDate: '',
          picWeather: '',
          desc1: '从街道对面看门店',
          desc2: '从门店看街道对面',
          pictureList1: [],
          pictureList2: [],
          picture1: '',
          picture2: '',
          picDateShow: false,
        },
        {
          idx: '2',
          picDate: '',
          picWeather: '',
          desc1: '从街道同侧的左侧50米处看门店',
          desc2: '从街道同侧的左侧50米处看对面',
          pictureList1: [],
          pictureList2: [],
          picture1: '',
          picture2: '',
          picDateShow: false,
        },
        {
          idx: '3',
          picDate: '',
          picWeather: '',
          desc1: '从街道同侧的左侧100米处看门店',
          desc2: '从街道同侧的左侧100米处看对面',
          pictureList1: [],
          pictureList2: [],
          picture1: '',
          picture2: '',
          picDateShow: false,
        },
        {
          idx: '4',
          picDate: '',
          picWeather: '',
          desc1: '从街道对面的左侧50米处看门店',
          desc2: '从街道对面的左侧50米处看对面',
          pictureList1: [],
          pictureList2: [],
          picture1: '',
          picture2: '',
          picDateShow: false,
        },
        {
          idx: '5',
          picDate: '',
          picWeather: '',
          desc1: '从街道对面的左侧100米处看门店',
          desc2: '从街道对面的左侧100米处看对面',
          pictureList1: [],
          pictureList2: [],
          picture1: '',
          picture2: '',
          picDateShow: false,
        },
        {
          idx: '6',
          picDate: '',
          picWeather: '',
          desc1: '从街道同侧的右侧50米处看门店',
          desc2: '从街道对面的右侧50米处看对面',
          pictureList1: [],
          pictureList2: [],
          picture1: '',
          picture2: '',
          picDateShow: false,
        },
        {
          idx: '7',
          picDate: '',
          picWeather: '',
          desc1: '从街道同侧的右侧100米处看门店',
          desc2: '从街道同侧的右侧100米处看对面',
          pictureList1: [],
          pictureList2: [],
          picture1: '',
          picture2: '',
          picDateShow: false,
        },
        {
          idx: '8',
          picDate: '',
          picWeather: '',
          desc1: '从街道对面的右侧50米处看门店',
          desc2: '从街道对面的右侧50米处看对面',
          pictureList1: [],
          pictureList2: [],
          picture1: '',
          picture2: '',
          picDateShow: false,
        },
        {
          idx: '9',
          picDate: '',
          picWeather: '',
          desc1: '从街道对面的右侧100米处看门店',
          desc2: '从街道对面的右侧100米处看对面',
          pictureList1: [],
          pictureList2: [],
          picture1: '',
          picture2: '',
          picDateShow: false,
        },
      ],
      userId: JSON.parse(window.sessionStorage.getItem('userInfo')).tuId,
    };
  },
  beforeMount() {
    this.getDetail();
  },
  methods: {
    getDetail() {
      this.$fetch.get('/api/addDp/queryApproveDetail', { approveId: this.$route.query.id }).then(res => {
        const { code, data, message } = res;
        if (code != 200 || !data) {
          Notify({ type: 'warning', message, duration: 1000 });
          return;
        }
        this.info = data;
        this.bpInfo = this.info.dicosManualMapBpVO;
        this.imgInfos.map((item, i) => {
          this.imgInfos[i] = { ...this.imgInfos[i], ...this.bpInfo.picList[i] };
        });
      });
    },
    confirmApproveDialog() {
      this.$fetch.get('/api/addDp/operateApprove', {
        approveId: this.$route.query.id,
        type: 3, // 1：撤销， 2：驳回， 3：通过
        updateTime: '2023-01-06 12:00:00',
        remark: '123',
        userId: this.userId
      }).then(res => {
        console.log('res:', res);
      });
    },
    confirmDisagreeDialog() {
      this.$fetch.get('/api/addDp/operateApprove', {
        approveId: this.$route.query.id,
        type: 2, // 1：撤销， 2：驳回， 3：通过
        updateTime: '2023-01-06 12:00:00',
        remark: '123',
        userId: this.userId
      }).then(res => {
        console.log('res:', res);
      });
    },
    confirmRevokeDialog() {
      this.$fetch.get('/api/addDp/operateApprove', {
        approveId: this.$route.query.id,
        type: 1, // 1：撤销， 2：驳回， 3：通过
        updateTime: '2023-01-06 12:00:00',
        remark: '',
        userId: this.userId
      }).then(res => {
        // console.log('res 1：撤销，:', res);
        const { code, data, message } = res;
        if (code != 200) {
          Notify({ type: 'warning', message, duration: 1000 });
          return;
        }
        Notify({ type: 'success', message: message, duration: 1000 });
        setTimeout(() => {
          window.location.reload();
        }, 500);
      });
    },
    confirmModifyDialog() {
      // 编辑基盘弹窗
      window.location.href = `/operation/index?currentOwnBpId=${this.bpInfo.id}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.approval-warp {
  background: #FAFAFA;
      .disagree-div {
        box-sizing: border-box;
        width: 100%;
        padding: 20px;
        p {
          margin-bottom: 10px;
          width: 100%;
          height: 20px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
          text-align: left;
        }
        textarea {
          width: 100%;
          height: 58px;
          background: #FFFFFF;
          border-radius: 4px;
          border: 1px solid #DBDBDB;
        }
      }
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
  }
  ul li.t {
    height: 90px;
    span.text {
      float: left;
      width: 100%;
      line-height: 20px;
    }
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
          margin-top: 17px;
          width: 100%;
          border-bottom: 1px solid #ddd;
          i {
            float: left;
            margin-left: 15px;
            font-size: 14px;
            font-weight: bold;
            font-style: normal;
          }
          h4 {
            text-align: left;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: bold;
            color: #333333;
            line-height: 20px;
            span {
              margin-left: 20px;
            }
          }
          img {
            margin: 0 auto 8px;
            display: block;
            width: 74px;
            height: 74px;
            border: 1px dashed #333;
          }
          .chose-column {
            width: 100%;
            overflow: hidden;
          }

          .upload-img {
            float: left;
            margin: 13px;
            width: 160px;
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
  margin: 30px 0;
  width: 342px;
  height: 44px;
  background: #F5A623;
  border-radius: 22px;
  border: 0 none;
}
.fail-operate {
  margin: 30px 0;
  width: 342px;
  height: 44px;
  background: #10AC64;
  border-radius: 22px;
  border: 0 none;
}
.leader-operate1,
.leader-operate2 {
  margin: 30px 0;
  width: 153px;
  height: 44px;
  background: #F5A623;
  border-radius: 22px;
  border: 0 none;
}
.leader-operate2 {
  background: #10AC64;
}
.Sponsor-operate1,
.Sponsor-operate2 {
  margin: 30px 0;
  width: 153px;
  height: 44px;
  background: #F5A623;
  border-radius: 22px;
  border: 0 none;
}
.Sponsor-operate2 {
  background: #10AC64;
}

</style>
