<template>
  <div class="demo">
      <!-- <van-uploader :after-read="afterRead" v-model="fileList" multiple /> -->
        <a href="/pdfdownload/2021-12-31/wt3kg81.pdf" style="display: block; width: 100px; height: 50px; border: 1px solid red; color:red; float: right;" download="1.pdf">--./wtw3s5g.pdf</a>
        <a href="https://gaia-1221-dh.dicos.com.cn/pdfdownload/2021-12-31/wt3kg81.pdf" style="display: block; width: 100px; height: 50px; border: 1px solid red; color:red; float: right;" download="1.pdf">all</a>
        <div @click="jump()" style="display: block; width: 100px; height: 50px; border: 1px solid red; color:red;">href 1000</div>

        <div @click="toLoadO()" style="display: block; width: 100px; height: 50px; border: 1px solid red; color:red;">a标签_blank</div>
        <div @click="toLoadW()" style="display: block; width: 100px; height: 50px; border: 1px solid red; color:red;">href</div>
        <div @click="toLoadW1()" style="display: block; width: 100px; height: 50px; border: 1px solid blue; color:red;">$eleForm</div>
        <div @click="toLoadW2()" style="display: block; width: 100px; height: 50px; border: 1px solid blue; color:red;">form</div>
        <div @click="toLoadW3()" style="display: block; width: 100px; height: 50px; border: 1px solid blue; color:red;">iframe</div>
        <div @click="downF1()" style="display: block; width: 100px; height: 50px; border: 1px solid blue; color:red;">web-downloadfile1</div>
        <div @click="downF2()" style="display: block; width: 100px; height: 50px; border: 1px solid blue; color:red;">web-downloadfile2</div>
        <div @click="downF3()" style="display: block; width: 100px; height: 50px; border: 1px solid blue; color:red;">web-downloadfile3</div>
        <div @click="open1()" style="display: block; width: 100px; height: 50px; border: 1px solid blue; color:red;">open1</div>
        <div @click="open2()" style="display: block; width: 100px; height: 50px; border: 1px solid blue; color:red;">open2</div>
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
import { Toast, Uploader } from 'vant';
import { saveFileToLink } from 'web-downloadfile';
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
    downF1(){
      saveFileToLink("http://121.36.254.219:9093/pdf-file/2021-12-28/wtw3s7f.pdf",'test','pdf',this.fn);
    },
    downF2(){
      saveFileToLink("https://gaia-1221-dh.dicos.com.cn/pdfdownload/2021-12-31/wt3kg81.pdf",'test','pdf',this.fn);
    },
    downF3(){
      saveFileToLink("http://dicosvpn.server.gaialab.ai:9093/pdf-file/2021-12-28/wtw3s7f.pdf",'test','pdf',this.fn);
    },
    open1(){
      window.open("http://121.36.254.219:9093/pdf-file/2021-12-28/wtw3s7f.pdf");
    },
    open2(){
      window.open("http://121.36.254.219:9093/pdf-file/2021-12-28/wtw3s7f.pdf", "_blank");
    },
    fn(e){
    console.log("🚀 ~ file: Demo.vue ~ line 70 ~ fn ~ e", e)
      
    },
    toLoadO(){
        let dom = document.createElement('a')
        dom.setAttribute('target',"_blank")
        dom.setAttribute('href',"https://gaia-1221-dh.dicos.com.cn/pdfdownload/2021-12-31/wt3kg81.pdf")
        document.body.appendChild(dom)
        dom.click()
    },
    toLoadW(){
      setTimeout(
	      function(){
	        window.location.href = "https://gaia-1221-dh.dicos.com.cn/pdfdownload/2021-12-31/wt3kg81.pdf";
        }, 0);
    },
    toLoadW1(){
        // var $eleForm = document.createElement("<form method='get'></form>");
        var $eleForm = document.createElement("form");
        $eleForm.setAttribute('method', 'get')
        $eleForm.setAttribute("action", 'https://gaia-1221-dh.dicos.com.cn/pdfdownload/2021-12-31/wt3kg81.pdf');
        document.body.appendChild($eleForm);
        $eleForm.submit();
    },
    toLoadW2(){
        var form = document.createElement('form');
        form.action = "https://gaia-1221-dh.dicos.com.cn/pdfdownload/2021-12-31/wt3kg81.pdf";
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

    },
    toLoadW3(){
         try {
          var elemIF = document.createElement("iframe");
          elemIF.src = "https://gaia-1221-dh.dicos.com.cn/pdfdownload/2021-12-31/wt3kg81.pdf";
          elemIF.style.display = "none";
          document.body.appendChild(elemIF);
        } catch (e) {}


    },
    jump(){
      setTimeout(
	      function(){
	        window.location.href = "https://gaia-1221-dh.dicos.com.cn/pdfdownload/2021-12-31/wt3kg81.pdf";
        }, 1000);
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
  }
}
</script>
<style lang="scss" scoped>
  .demo {
    padding-top: 100px;
  }
</style>>
