<template>
  <div>
    <!-- 弹层： 执行人  -->
    <van-popup v-model="organizeShow">内容</van-popup>
    <!-- 弹层： 时间  -->
    <van-calendar v-model="timeShow" type="range" @confirm="popupDateConfirm" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 时间显隐控制
      timeShow: false,
      // 组织显隐控制
      organizeShow: false,

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
    }
  }
}
</script>

<style scoped>

</style>
