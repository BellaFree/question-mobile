<template>
  <div>
    /approve-task/index
  </div>
</template>
<script>
export default {
  name: "IndexView",
  subtitle() {
    return '任务审批'
  },
  leftIcon() {
    return 'arrow-left'
  },
  onLeft() {
    window.location.href = 'http://103.13.247.70:8091/gisApp/page/home/home.html?timestamp=' + new Date().getTime()
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
</style>
