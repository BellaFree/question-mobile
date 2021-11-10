<template>
  <div class="perform-wrap">
    /index
  </div>
</template>
<script>
export default {
  name: "IndexView",
  subtitle() {
    return '德克士(火车站店)访店任务'
  },
  leftIcon() {
    return 'arrow-left'
  },
  onLeft() {
    window.location.href = 'http://103.13.247.70:8091/gisApp/page/home/home.html?timestamp=' + new Date().getTime()
  }
};
</script>
<style lang="scss" scoped>
</style>
