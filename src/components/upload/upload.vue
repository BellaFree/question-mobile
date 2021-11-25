<template>
  <div class="upload-wrapper">
    <input type='file' :before-read="beforeRead" class="uploader__input"/>
    <slot></slot>
  </div>
</template>
<script setup>
/**
 * todo 格式校验
 *      上传服务器 - 接收服务器传输回的字段展示
 *
 */
export default {
  name: 'upload',
  methods: {
    beforeRead(file) {
      console.info(file)
    },
    afterReadFailed(file) {
      console.info(file)
    }
  }
}


</script>

<style scoped lang="scss">
.upload-wrapper{
  position: relative;
}
.uploader__input{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden; // to clip file-upload-button
  cursor: pointer;
  opacity: 0;
}
</style>
