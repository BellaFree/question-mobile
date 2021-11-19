<template>
  <div class="else-task-wrap">
    <!-- 任务类型 && 任务时间 && 任务名称  -->
    <div class="task-type">
      <p class="task-type-item">
        <label>任务类型:</label>
        <span>标准访店任务</span>
      </p>
      <p class="task-type-item task-type-time">
        <label>任务名称:</label>
        <span>2021-09-19至2021-09-22</span>
      </p>
      <p class="task-type-item task-type-time">
        <label>任务时间:</label>
        <span>2021-09-19至2021-09-22</span>
      </p>
    </div>
    <!-- 任务描述  -->
    <div class="task-describe">
      <van-field
          v-model="improveContentVal"
          label="任务描述:"
          autosize
          type="textarea"
          placeholder="请输入改善内容"
      />
    </div>
    <!-- 任务 上传附件  -->
    <div class="task-file">
      <span class="task-file-title">上传附件：</span>
      <el-upload
          class="upload-demo"
          action=""
          multiple>
        <div class="upload"><svg-icon icon-class="upload-icon" /></div>
      </el-upload>
    </div>
    <!-- 任务提交  -->
    <div class="footer">
      <button>立即提交</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "elseTask",
  subtitle() {
    return '德克士(火车站店)访店任务'
  },
  leftIcon() {
    return 'arrow-left'
  },
  onLeft() {
    window.location.href = 'http://103.13.247.70:8091/gisApp/page/home/home.html?timestamp=' + new Date().getTime()
  },
  data() {
    return {
      // 改善地址
      improveContentVal: '',
    }
  }
}
</script>

<style scoped lang="scss">
.else-task-wrap{
  height: 100vh;
  padding: 15px;
  background-color: #FAFAFA;
}
.task-type{
  background: #FFFFFF;
  box-shadow: 0 2px 5px 2px rgba(0,0,0,0.05);
  border-radius: 5px;
  &-item{
    text-align: left;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #DBDBDB;
    &:last-child{
      border: none;
    }
    label{
      font-size: 14px;
      font-weight: 600;
      color: #333333;
      margin-left: 15px;
    }
    span{
      font-size: 16px;
      font-weight: 600;
      color: #0A9B58;
      margin-left: 10px;
    }
  }
  &-time{
    span{
      font-size: 14px;
      font-weight: 600;
      color: #495060;
    }
  }
}
.task-describe{
  height: 55px;
  background: #FFFFFF;
  box-shadow: 0 2px 5px 2px rgba(0,0,0,0.05);
  border-radius: 5px 5px 0 0;
  margin-top: 15px;
  padding:15px;
  ::v-deep{
    .van-cell{
      padding: 0;
    }
    .van-cell__title{
      font-size: 14px;
      font-weight: 600;
      color: #333333;
      width: 70px;
    }
    .van-cell__value{
      flex-shrink: 0;
      width: 154px !important;
    }
    .van-field__body{
      width: 154px !important;
    }
    .van-field--min-height .van-field__control{
      min-height: 50px;
    }
  }
}
.task-file{
  height: 339px;
  background: #FFFFFF;
  box-shadow: 0 2px 5px 2px rgba(0,0,0,0.05);
  border-radius: 0 0 5px 5px;
  padding: 15px;
  text-align: left;
  &-title{
    font-size: 14px;
    font-weight: 600;
    color: #333333;
  }
  .upload{
    margin-top: 10px;
    svg{
      width: 64px;
      height: 64px;
    }
  }
  ::v-deep{
    .van-uploader{
      display: block;
    }
  }
}
.footer{
  display: flex;
  justify-content: center;
  width: 100%;
  height: 50px;
  background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%);
  box-shadow: 0px -3px 5px 0px rgba(0,0,0,0.06);
  padding: 10px 0;
  position: fixed;
  bottom: 0;
  left: 0;
  button{
    height: 44px;
    background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
    border-radius: 22px;
    width: 345px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFF;
  }
}
</style>
