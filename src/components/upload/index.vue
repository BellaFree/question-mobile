<template>
  <div class="upload-wrapper">
    <div v-if="elseFileList.length > 0 || pictureList.length > 0" class="files file-list">
      <template v-for="(item, index) of elseFileList">
        <div :key="index" class="file">
          <div class="file-close" @click="removeFile(item, index)" />
          <img v-if="verifySuffix(item.name, ['gif', 'jpg', 'jpge', 'png'])" :src="item.url" style="width: 100%;height: 100%">
          <div v-else-if="verifySuffix(item.name, ['xls', 'xlsx'])" class="file-icon file-excel" />
          <div v-else-if="verifySuffix(item.name, ['doc', 'docx'])" class="file-icon file-word" />
          <div v-else-if="verifySuffix(item.name, ['ppt', 'pptx'])" class="file-icon file-ppt" />
        </div>
        <!-- <p :key="index" class="file-item-text">{{ item.name }} <span v-if="$attrs.editStatus" @click="removeFile(item, index)">删除</span></p> -->
      </template>
      <template v-for="(item, index) of pictureList">
        <div :key="index" class="file">
          <div class="file-close" @click="removeFile(item, index)" />
          <img v-if="verifySuffix(item.name, ['gif', 'jpg', 'jpge', 'png'])" :src="item.url" style="width: 100%;height: 100%">
        </div>
        <!-- <p :key="index" class="file-item-text">{{ item.name }} <span v-if="$attrs.editStatus" @click="removeFile(item, index)">删除</span></p> -->
      </template>
      <!-- <van-uploader v-model="pictureList" :deletable="$attrs.editStatus" class="upload-disabled" @delete="deletePicture" /> -->
    </div>
    <el-upload
      :disabled="!$attrs.editStatus"
      class="upload-demo"
      :action="uploadUrl"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      multiple>
      <div class="upload"><svg-icon icon-class="upload-icon" /></div>
    </el-upload>
  </div>
</template>
<script setup>
import performTaskViewApi from '@api/perform_task_view_api';

export default {
  name: 'upload',
  props: {
    file: {
      type: String,
      require: false
    },
    fileName: {
      type: String,
      require: false
    },
    index: {
      type: Object,
      require: false
    },
    updateKey: { type: Number, }
  },
  data() {
    return {
      // 远程服务 接口地址
      uploadUrl: '',
      // 上传后的文件地址
      fileList: [],
      // 上传后的图片资源
      pictureList: [],
      // 上传后非图片资源
      elseFileList: []
    };
  },
  created() {
    this.uploadUrl = performTaskViewApi.getUploadUrl();
  },
  watch: {
    updateKey() {
      this.defaultValue();
    }
  },
  methods: {
    // 默认值 （编辑情景）
    defaultValue() {
      if (!this.file) {
        return;
      }
      let fileList = this.file.split(',');
      let fileNameList = this.fileName.split(',');
      this.pictureList = [];
      this.elseFileList = [];
      for (let i = 0; i < fileList.length; i++) {
        let item = fileList[i];
        if (item) {
          if (item.endsWith('jpg')) {
            this.pictureList.push({
              name: fileNameList[i],
              url: item,
              status: 'success',
              message: '',
            });
          } else {
            this.elseFileList.push({
              name: fileNameList[i],
              url: item
            });
          }
        }

      }
    },
    // 上传前处理
    beforeUpload() {
      // 访店任务中使用
      console.info(this.index, this.$listeners, this.$attrs);
      if (this.$listeners && this.$listeners.updateHandleIndex) {
        this.$listeners.updateHandleIndex(this.index);
      }
    },
    // 通知数据更新
    notify() {
      if (this.$listeners && this.$listeners.updateFile) {
        let data = this.getFileData();
        this.$listeners.updateFile(data);
      }
    },
    // 文件上传
    uploadSuccess(response, file) {
      this.filterFile(file);
      this.notify();
    },
    // 删除上传文件
    removeFile(item, index) {
      this.elseFileList.splice(index, 1);
      this.notify();
    },
    // 过滤文件
    filterFile(file) {
      let { elseFileList, pictureList } = this;
      if (!file || file.status !== 'success') {
        return;
      }
      if (file.raw.type === 'image/jpeg') {
        pictureList.push({
          name: file.name,
          url: file.response.extData,
          status: 'success',
          message: '',
        });
      } else {
        elseFileList.push({
          name: file.name,
          url: file.response.extData
        });
      }
    },
    // 获取上传的文件资源
    getFileData() {
      let data = this.pictureList.concat(this.elseFileList);
      if (!data || data.length <= 0) {
        return null;
      }
      let filesUrl = '';
      let filesName = '';
      for (let item of data) {
        filesUrl += `${item.url},`;
        filesName += `${item.name},`;
      }
      return {
        filesUrl,
        filesName
      };
    },
    // 获取文件名
    getFileName(fileUrl) {
      // http://121.36.254.219:9998/image/演示文稿1.pptx,
      if (!fileUrl) {
        return null;
      }
      let data = fileUrl.split('/');
      return  data[data.length - 1];
    },
    // 删除文件
    deletePicture() {
      this.notify();
    },
    // 判断文件
    verifySuffix(fileName, suffix) {
      let reg = /.+\.(gif|jpg|jpge|png|doc｜docx|xls|xlsx)$/i;
      let result = fileName.match(reg);
      if (result || result[1]) {
        let sx = result[1].toLowerCase();
        if (typeof suffix === 'string') {
          return suffix === sx;
        }
        for (let i = 0; i < suffix.length; i++) {
          if (suffix[i] === sx) {
            return true;
          }
        }
        return false;
      }
      return false;
    }
  },

};


</script>

<style scoped lang="scss">
.upload-wrapper {
  .files {
    padding-top: 20px;
    display: flex;
    .file {
      position: relative;
      width:64px;
      height: 64px;
      border:1px solid rgba(0,0,0,0.05);
      border-radius: 4px;
      & + .file {
        margin-left: 12px;
      }
      .file-icon {
        width: 100%;
        height: 100%;
        &.file-excel {
          background: url(/img/icons/excel.png);
          background-size: cover;
        }
        &.file-word {
          background: url(/img/icons/word.png);
          background-size: cover;
        }
        &.file-ppt {
          background: url(/img/icons/ppt.png);
          background-size: cover;
        }
      }
      .file-close {
        position: absolute;
        right: -8px;
        top: -8px;
        width: 16px;
        height: 16px;
        background: url(/img/store_visit/close-img.png);
        background-size: cover;
      }
    }
  }
}
.upload-btn{
  width: 64px;
  height: 64px;
}
.upload{
  margin-top: 10px;
  svg{
    width: 64px;
    height: 64px;
  }
}
.file-list{
  padding: 10px 0;
  .file-item-text{
    font-size: 14px;
    font-weight: 400;
    color: #016EE3;
    padding: 2px 0;
    position: relative;
    span{
      font-size: 13px;
      font-weight: 400;
      color: #A5A5A5;
      position: absolute;
      top:0;
      right: 0;
    }
  }
  img{
    display: inline-block;
    width: 54px;
    height: 54px;
    border-radius: 5px;
  }
  .upload-disabled {
    display: none!important;;
  }
  ::v-deep{
    .van-uploader{
      width: 200px;
      padding-top: 15px;
    }
    .van-uploader__preview-image{
      width: 54px;
      height: 54px;
      border-radius: 5px;
    }
    .van-uploader__upload{
      display: none;
    }
    .van-uploader__preview-delete{
      position: absolute;
      top: -2px;
      right: -2px;
      border-radius: 0;
      background: url("/img/store_visit/close-img.png");
      background-size: contain;
    }
    .van-uploader__preview-delete-icon{
      display: none;
    }
  }
}
</style>
