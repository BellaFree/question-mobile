<template>
  <van-popup
    v-model="baseInfoVisible"
    class="plan-position-pop-wrapper"
    :style="{ height: drawSize }"
    :closeable="isBaseInfoShow"
    :lazy-render="false"
    :duration="0.1"
    position="bottom"
    round
    @close="handleClose">
    <!--位置-->
    <div class="base-info-div" v-if='isBaseInfoShow'>
      <div class="header-box">
        <div class="title">位置</div>
      </div>
      <div class="content-box">
        <p class="text">{{ positionData.formattedAddress }}</p>
        <div class="bottom-buttons">
          <!-- <van-button type="primary" plain @click="planFeekback">市政规划反馈</van-button> -->
          <van-button class="create-btn" type="primary" @click="addToBase">录入基盘</van-button>
        </div>
      </div>
    </div>
    <!--录入基盘-->
    <div class="base-add-div" v-else>
      <div class="header-box">
        <van-icon class="return-base-info" name="arrow-left" @click="returnBaseInfo" />
        <div class="title">录入基盘</div>
      </div>
      <div class="content-box">
        <!-- 录入基盘信息 -->
        <BasicPlantInfo :state="1" :positionData="positionData" @setBp="setBp" />
      </div>
    </div>
  </van-popup>
</template>

<script>
import BasicPlantInfo from './BasicPlantInfo'

import Vue from 'vue';
import { Area, Field, Notify, Uploader, Calendar } from 'vant';
Vue.use(Area);
Vue.use(Calendar);
Vue.use(Field);
Vue.use(Notify);
Vue.use(Uploader);

export default {
  name: 'PlanPositionPop',
  props: ['planPositionShow', 'positionData'],
  components: { BasicPlantInfo },
  data() {
    return {
      baseInfoVisible: false,
      drawSize: "50%",
      isBaseInfoShow: true,
    };
  },
  watch: {
    planPositionShow(val) {
      setTimeout(() => {
        // console.log('positionData:', this.positionData);
        this.baseInfoVisible = val;
        this.drawSize = "50%";
        this.isBaseInfoShow = true;
      }, 100);
    },
  },
  methods: {
    setBp(val) {
      // var v = { useId: window.sessionStorage.getItem('userInfo').tuId,}
      // console.log('setBp');
      // console.log('val:', val);
      this.$fetch.post('/api/addDp/saveDp', val
      ).then(res => {
        // console.log('res:', res);
        if (res.code != 200) {
          Notify({ type: "warning", message: res.message, duration: 1000 });
          return;
        }
        Notify({ type: "success", message: res.message, duration: 1000 });
        this.baseInfoVisible = false;
      })
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
    
    // //创建基盘
    // setBaseFn() {
    //   this.$fetch.post('/api/addDp/saveDp', this.bInfo
    //   ).then(res => {
    //     console.log('res:', res);
    //     if (res.code != 200) {
    //       Notify({ type: "warning", message: res.message, duration: 1000 });
    //       return;
    //     }
    //     Notify({ type: "success", message: res.message, duration: 1000 });
    //     this.baseInfoVisible = false;
    //   })
    // },
  }
};
</script>
<style lang="scss">
.van-field__control {
  text-align: right!important;
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
.plan-position-pop-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  .base-info-div,
  .base-add-div {
    display: flex;
    flex-direction: inherit;
    height: 100%;
    overflow-y: scroll;
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
      overflow: scroll;
      text-align: left;
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
    }
  }
  .base-info-div {
    .content-box {
      // overflow: hidden;
      position: relative;
      p.text {
        margin: 20px 10px;
        font-size: 14px;
      }
      .bottom-buttons {
        position: absolute;
        bottom: 0;
        left: 0;
      }
    }
  }
  .base-add-div {
    .header-box {
      .return-base-info {
        position: absolute;
        top: 15px;
        left: 15px;
      }
    }
  }
}
</style>
