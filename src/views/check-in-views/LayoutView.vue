<template>
  <div class="check-in-layout">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'CheckInLayoutView',
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
.check-in-layout {
  width: 100%;
  padding-top: 50px;
}
</style>
