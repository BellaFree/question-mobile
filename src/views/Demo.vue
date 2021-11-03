<template>
  <div class="demo">demo
    <input type="file" capture="camcorder" accept="image/*" id="filetest" name="filetest">
    <img src="" id="v_photoA" style="width:100%;"/>
    <a href="http://smartgtm.test.server.gaialab.ai:99">跳转http</a>
  </div>
</template>

<script>
export default {
  name: 'Demo',
  beforeMount () {
  },
  mounted() {
    document.querySelector('#filetest').onchange = function () {
      alert(111);
      var fileTag = document.getElementById('filetest');
      console.log();
      var file = fileTag.files[0];
      var fileReader = new FileReader();
      fileReader.onloadend = function () {
          if (fileReader.readyState == fileReader.DONE) {
              document.getElementById('v_photoA').setAttribute('src', fileReader.result);
          }
      };
      fileReader.readAsDataURL(file);
    };
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped>
  .demo {
    padding-top: 100px;
  }
</style>>
