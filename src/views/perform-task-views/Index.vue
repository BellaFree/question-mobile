<template>
  <div>
    <success/>
  </div>
</template>
<script>
import success from "./components/success";
export default {
  name: "IndexView",
  subtitle() {
    return '任务..'
  },
  leftIcon() {
    return 'arrow-left'
  },
  onLeft() {
    window.location.href = 'http://103.13.247.70:8091/gisApp/page/home/home.html?timestamp=' + new Date().getTime()
  },
  components: {
    success
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
