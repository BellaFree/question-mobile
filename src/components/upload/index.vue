<template>
  <div class="upload-wrapper">
    <div class="file-list">
      <template v-for="(item, index) of elseFileList">
        <p :key="item.uid" class="file-item-text">{{item.name}} <span @click="removeFile(item, index)">删除</span></p>
      </template>
      <van-uploader v-model="pictureList" />
    </div>
    <el-upload
        class="upload-demo"
        :action="uploadUrl"
        :show-file-list="false"
        :on-success="uploadSuccess"
        multiple>
      <div class="upload"><svg-icon icon-class="upload-icon" /></div>
    </el-upload>
  </div>
</template>
<script setup>
import performTaskViewApi from '@api/perform_task_view_api'

export default {
  name: 'upload',
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
    }
  },
  created() {
    this.uploadUrl = performTaskViewApi.getUploadUrl()
  },
  methods: {
    // 文件上传
    uploadSuccess(response, file) {
      this.filterFile(file)
    },
    // 删除上传文件
    removeFile(item, index) {
      this.elseFileList.splice(index, 1)
    },
    // 过滤文件
    filterFile(file) {
      console.info('过滤文件')
      let { elseFileList, pictureList } = this
      if(!file || file.status !== "success") {
        return
      }
      if(file.raw.type === 'image/jpeg') {
        pictureList.push({
          url: file.response.message,
          status: 'success',
          message: '',
        })
      } else {
        elseFileList.push({
          name: file.name,
          uid: file.uid,
          url: file.response.message
        })
      }
    },
    // 获取上传的文件资源
    getFileData() {
      let data = this.pictureList.concat(this.elseFileList)
      console.info(data)
      if(!data || data.length <=0) {
        return null
      }
      let filesUrl = ''
      for(let item of data) {
        filesUrl += `${item.url},`
      }
      return filesUrl
    }
  }
}


</script>

<style scoped lang="scss">
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
