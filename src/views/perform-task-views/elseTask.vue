<template>
  <div class="else-task-wrap">
    <!-- 任务类型 && 任务时间 && 任务名称  -->
    <div class="task-type">
      <p class="task-type-item">
        <label>任务类型:</label>
        <span>{{taskInfo && taskMap[taskInfo.workType]}}</span>
      </p>
      <p class="task-type-item task-type-time">
        <label>任务名称:</label>
        <span>{{taskInfo && taskInfo.workName}}</span>
      </p>
      <p class="task-type-item task-type-time">
        <label>任务时间:</label>
        <span>{{taskInfo && taskInfo.startDate}}至{{taskInfo && taskInfo.endDate}}</span>
      </p>
    </div>
    <!-- 任务描述  -->
    <div class="task-describe">
      <van-field
          v-model="improveContentVal"
          label="任务描述:"
          rows="2"
          maxlength="500"
          type="textarea"
          placeholder="请输入改善内容"
      />
    </div>
    <!-- 任务 上传附件  -->
    <div class="task-file">
      <span class="task-file-title">上传附件：</span>
      <upload ref="uploadChild" :file="uploadUrl"  :fileName="fileName" :editStatus="editStatus"/>
    </div>
    <!-- 任务提交  -->
    <div class="footer">
      <button @click="subData">立即提交</button>
    </div>
  </div>
</template>

<script>
import performTaskViewApi from '@api/perform_task_view_api'
import upload from "@/components/upload/index"

export default {
  name: "elseTask",
  components: {
    upload
  },
  subtitle() {
    return this.$route.query.name
  },
  leftIcon() {
    return 'arrow-left'
  },
  onLeft() {
   // todo 返回至首页
  },
  data() {
    return {
      // 任务描述
      improveContentVal: '',
      // 参数
      params: {
        executeNo: '',
        workNo: ''
      },
      // 任务详情
      taskInfo: '',
      // 任务类型 对应后端 枚举值
      taskMap: {
        '1': '访店任务',
        '2': '其他任务',
        '3': '改善任务'
      },
      // 上传文件地址
      uploadUrl: '',
      // 上传文件的文件名称
      fileName: '',
      // 是否可编辑
      editStatus: true
    }
  },
  mounted() {
    this.defaultSetVal()
  },
  methods: {
    // 默认赋值
    defaultSetVal() {
      if(this.$route && this.$route.query) {
        this.params = this.$route.query
        this.getTaskDetail()
      }
    },
    // 获取任务详情
    getTaskDetail() {
      performTaskViewApi.getImplementTask({
        executeNo: this.params.executeNo,
        workNo: this.params.workNo
      })
      .then(res => {
        console.info(res)
        if(res.code === 506) {
          // todo 是否跳转走到其他页
        }
        if(res.code === 200) {
          this.taskInfo = res.data
          this.improveContentVal = res.data.workContent
          this.uploadUrl = res.data.filesRealUrl
          this.fileName = res.data.filesUrl
          this.$nextTick(() => {
            console.info(this.$refs.uploadChild.file)
            this.$refs.uploadChild.defaultValue()
          })
        }
      })
    },
    // 提交数据
    subData() {
      let fileData = this.$refs.uploadChild.getFileData()
      console.info(this.$refs.uploadChild.getFileData())
      performTaskViewApi.submitWorkData(
          {
            // 任务编码
            "workNo": this.params.workNo,
            // 任务名称
            "workName": this.taskInfo.workName,
            // 任务类型 1 访店任务、2 其他任务、3、改善任务
            "workType": this.taskInfo.workType,
            // 任务开始时间
            "startDate": this.taskInfo.startDate,
            // 任务结束时间
            "endDate": this.taskInfo.endDate,
            // 强提示弹窗内容 0否 1是
            "flag": '0',
            // 任务描述
            "workContent": this.improveContentVal,
            // 附件地址 ,拼接
            "filesUrl": fileData && fileData.filesName,
            //
            "filesRealUrl":  fileData && fileData.filesUrl,
            // 执行编码
            "executeNo": this.params.executeNo,
          }
      )
      .then(res => {
        if(res.code === 200) {
          this.$router.push('/perform-task/success')
        }
      })
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
  //overflow-y:auto;
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
      width: 233px !important;
    }
    .van-field__body{
      width: 233px !important;
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
