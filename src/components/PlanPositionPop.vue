<template>
  <van-popup
    v-model="baseInfoVisible"
    class="plan-position-pop-wrapper"
    closeable
    position="bottom"
    round
    :lazy-render="false"
    :duration="0.1"
    @close="handleClose"
    style="height: 50%"
  >
    <div class="header-box">
      <div class="title">位置</div>
    </div>
    <div class="content-box">
      <p class="text">{{ positionData.formattedAddress }}</p>
      <!-- <div class="bottom-buttons">
        <van-button type="primary" plain @click="planFeekback"
          >市政规划反馈</van-button
        >
        <van-button type="primary" @click="addToBase">
          <van-icon name="/img/network-planning-views/addIcon.png"></van-icon>
          添加为基盘
        </van-button>
      </div> -->
    </div>
    
  </van-popup>
</template>

<script>

export default {
  name: "PlanPositionPop",
  props: ["planPositionShow", "positionData"],
  data() {
    return {
      baseInfoVisible: false,
    };
  },
  watch: {
    planPositionShow(val) {
      setTimeout(() => {
        this.baseInfoVisible = val;
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
      this.handleClose();
    },
  },
};
</script>

<style lang="scss" scoped>
.plan-position-pop-wrapper {
  display: flex;
  flex-direction: column;
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
</style>
