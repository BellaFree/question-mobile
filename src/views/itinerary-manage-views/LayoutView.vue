<template>
  <div class="itinerary-manage-layout">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'ItineraryManageLayout',
  title() {
    return '我的行程'
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
.itinerary-manage-layout {
  width: 100%;
  height: 100%;
  padding-top: 50px;
}
</style>
