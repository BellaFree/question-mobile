<template>
  <div class="components-box">
    <!-- 执行人  -->
    <select-approve v-if="componentApprove.show" :componentData="componentApprove" :approveTier="approveTier" @closeSelectApprove="closeSelectApprove"/>
    <!-- 弹层： 时间  -->
    <van-calendar v-model="timeShow" type="range" @confirm="popupDateConfirm" />
  </div>
</template>

<script>
import SelectApprove from './SelectApprove.vue'
export default {
  components: {
    SelectApprove
  },
  data() {
    return {
      // 时间显隐控制
      timeShow: false,
      // 组织显隐控制
      organizeShow: false,
      // 选中的执行人
      executoerList: '',
      approveTier: {},
      componentApprove: {},
    }
  },
  methods: {
    // 时间 确认
    popupDateConfirm(date) {
      const [start, end] = date;
      this.switchTimePopup()
      this.$emit('changeTime', start, end)
    },
    // 时间  取消
    popupDateCancel() {

    },
    // 时间弹层 开关
    switchTimePopup() {
      this.timeShow = !this.timeShow
    },
    closeSelectApprove(data) {
      console.info(data,this.componentApproveType)
      switch (this.componentApproveType) {
        case 1: {
          this.executoerList = data;
          break;
        }
        case 2: {
          break;
        }
      }
      this.componentApprove = {};
      this.componentSelectApproveStatus = false;
      // 将选中的执行人/组织 通知父级
      this.$emit('changeExecutor', data)
    },
    /**
     * @description: 选择执行人
     * @return {*}
     */
    handleCellSelectApprove() {
      this.componentSelectApproveStatus = true;
      this.$notice.$emit('navigation', { title: '执行人' });
      this.componentApproveType = 1;
      this.componentApprove = { show: true, };
    },
  }
}
</script>

<style scoped lang="scss">
  .components-box{
    ::v-deep{
      .van-calendar__day--end, .van-calendar__day--start{
        background-color: rgba(10, 155, 88, .9);
      }
      .van-calendar__day--middle{
        background-color: rgba(10, 155, 88, .4);
        color: #343333;
      }
      .van-calendar__confirm{
        background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
        border: 1px solid #0A9B58;
      }
    }
  }
</style>
