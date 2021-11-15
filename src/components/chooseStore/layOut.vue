<template>
  <div class="create-task-layout">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'CreateTaskLayout',
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
.create-task-layout {
  width: 100%;
  padding-top: 50px;
}
</style>
