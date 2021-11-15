<template>
  <div>
    <!-- 弹层： 执行人  -->
    <van-popup v-model="organizeShow">内容</van-popup>
    <!-- 弹层： 时间  -->
    <van-popup v-model="timeShow">
      <van-datetime-picker
          v-model="currentDate"
          @confirm="popupDateConfirm"
          @cancel="popupDateCancel"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          ref="detetimePicker"
      />
    </van-popup>
  </div>
</template>

<script>

export default {
  name: "组织",
  data() {
    return {
      // 时间显隐控制
      timeShow: false,
      // 组织显隐控制
      organizeShow: false,
      // 当前选择时间
      currentDate: '',
    }
  },
  methods: {
    // 时间 确认
    popupDateConfirm() {

    },
    // 时间  取消
    popupDateCancel() {

    }
  }
}
</script>

<style scoped>

</style>
