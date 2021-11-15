<template>
  <div class="approve-task-layout">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'TaskApprovalLayoutView',
  title() {
    return ''
  },
  data() {
    return {}
  },
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.approve-task-layout{
  width: 100%;
  padding-top: 50px;
}
</style>
