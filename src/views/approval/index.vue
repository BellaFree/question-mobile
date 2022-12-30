<template>
  <div class="approval-warp"></div>
</template>

<script>
export default {
  name: "index",
  subtitle () {
    return '审批'
  },
  leftIcon () {
    return 'arrow-left'
  },
  onLeft () {
    history.go(-1);
  },
}
</script>

<style scoped>

</style>