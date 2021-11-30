<template>
  <div class="demo">
      <van-uploader :after-read="afterRead" v-model="fileList" multiple />
  </div>
</template>

<script>
import Vue from 'vue';
import { Uploader } from 'vant';
// import { sendMessageToXinx } from '@/utils/interact.js'
Vue.use(Uploader);
export default {
  name: 'Demo',
  navClass() {
    return ''
  },
  subtitle() {
    return '拍照demo'
  },
  leftIcon() {
    return 'arrow-left'
  },
  onLeft() {
      history.go(-1);
  },
  data() {
    return {
      fileList: [
        { url: 'https://img.yzcdn.cn/vant/leaf.jpg' },
        // Uploader 根据文件后缀来判断是否为图片文件
        // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
        { url: 'https://cloud-image', isImage: true }
      ]
    }
  },
  
  beforeMount () {
    // sendMessageToXinx ('FFFFFF').then(() => {
    //     console.log('FFFFFF DEMO 颜色发好了');
    // })
  },
  mounted() {

  },
  methods: {
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
    }
  },
}
</script>
<style lang="scss" scoped>
  .demo {
    padding-top: 100px;
  }
</style>>
