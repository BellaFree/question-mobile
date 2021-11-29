<template>
  <div class="check-in-layout">
    <router-view/>
  </div>
</template>

<script>
import { mixin } from '@/utils';
export default {
  name: 'CheckInLayoutView',
  mixins: [mixin],
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
