<template>
  <div class="demo">
      <!-- <van-uploader :after-read="afterRead" v-model="fileList" multiple /> -->
        <a href="/wtw3s5g.pdf" style="display: block; width: 100px; height: 50px; border: 1px solid red; color:red; float: right;" download="1.pdf">--./wtw3s5g.pdf</a>
        <a href="https://gaia-1221-pdf.dicos.com.cn/pdf-file/2021-12-30/wtw3s5g.pdf" style="display: block; width: 100px; height: 50px; border: 1px solid red; color:red; float: right;" download="1.pdf">all</a>
        <div @click="toLoadO()" style="display: block; width: 100px; height: 50px; border: 1px solid red; color:red;">a标签</div>
        <div @click="toLoadW()" style="display: block; width: 100px; height: 50px; border: 1px solid red; color:red;">href</div></div>
      <!-- <van-uploader 
          v-model="fileList" 
          :after-read="afterRead" 
          :max-size="5012 * 1024" 
          :before-delete='beforeDeleteBack' 
          upload-text=""
          multiple
          :max-count="3"
          deletable = true
          @oversize="onOversize"
          capture="camera" accept="image" 
	    /> -->

  </div>
</template>

<script>
import Vue from 'vue';
import { Uploader } from 'vant';
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
        // { url: 'https://img.yzcdn.cn/vant/leaf.jpg' },
        // Uploader 根据文件后缀来判断是否为图片文件
        // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明
        // { url: 'https://cloud-image', isImage: true }
      ]
    }
  },
  
  beforeMount () {
  },
  mounted() {

  },
  methods: {
    toLoadO(){
        let dom = document.createElement('a')
        dom.setAttribute('target',"_blank")
        dom.setAttribute('href',"https://gaia-1221-pdf.dicos.com.cn/pdf-file/2021-12-30/wtw3s5g.pdf")
        document.body.appendChild(dom)
        dom.click()
    },
    toLoadW(){
      setTimeout(
	      function(){
	        window.location.href = "https://gaia-1221-pdf.dicos.com.cn/pdf-file/2021-12-30/wtw3s5g.pdf";
        }, 0);
    },
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
    },
    beforeDeleteBack() {
      console.log('3');
    },
    onOversize() {
      console.log('onOversize');
    }
  },
}
</script>
<style lang="scss" scoped>
  .demo {
    padding-top: 100px;
  }
</style>>
