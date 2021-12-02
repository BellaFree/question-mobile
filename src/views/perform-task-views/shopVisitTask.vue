<template>
  <div class="perform-wrap">
    <!-- 任务类型 && 任务时间   -->
    <div class="task-type">
      <p class="task-type-item">
        <label>任务类型:</label>
        <span>{{taskInfo && taskMap[taskInfo.workType]}}</span>
      </p>
      <p class="task-type-item task-type-time">
        <label>任务时间:</label>
        <span>{{taskInfo && taskInfo.startDate}}至{{taskInfo && taskInfo.endDate}}</span>
      </p>
    </div>
    <!-- 任务内容主体  -->
    <div class="task-content">
      <!-- 任务 大类  -->
      <div class="task-class">
        <div v-for="(item, index) of taskClassOptions"
             :key="item.id"
             @click="chooseTaskType(item)"
             :class="{'task-class-item': true, 'active': item.name === handleTaskType}">{{index + 1}}.{{item.name}}</div>
      </div>
      <!-- 任务 项 -->
      <div class="task-item">
        <!-- 任务 分值 -->
        <div class="task-point">
          <p class="task-point-title">门店评分:</p>
          <van-rate
              v-model="viewData.storeScore"
              :size="25"
              allow-half
              color="#ffd21e"
              void-icon="star"
              void-color="#eee"
              @change="rateChange"
          />
        </div>
        <!-- 任务 具体 -->
        <template v-for="(item, index) of viewData.list">
          <taskItem :list="item" :index="index" :key="item.workContentNo"
                    :handleTaskType="handleTaskType"
                    :editStatus="editStatus"
                    @openTimeChoose="openTimeChoose"
                    @addChildItem="addChildItem"
                    @deleteItem="deleteItem"
                    @updateHandleIndex="updateHandleIndex"
                    @updateFile="updateFile"/>
        </template>
      </div>
    </div>
    <!-- 任务提交  -->
    <div v-if="!subordinateTask && editStatus" class="footer">
      <button @click="subShow = !subShow">立即提交</button>
    </div>
    <!-- 任务提交  -->
    <div v-if="subordinateTask" class="footer footer-subordinate">
      <button @click="readTask('2')">已阅</button>
      <button @click="readTask('1')">催办</button>
      <button @click="endTask">结案</button>
    </div>
    <!-- 弹层： 时间  -->
    <van-popup v-model="timeShow" position="bottom">
        <van-datetime-picker v-model="currentTime" type="date" :min-date="minDate" :max-date="maxDate"   @confirm="popupDateConfirm" />
    </van-popup>
    <!-- 成功    -->
    <success v-if="false"/>
    <!-- 提示弹层    -->
    <van-popup v-model="subShow">
      <div class="sub-popup">
        <p>是否将改善内容作为任务发送给店长?</p>
        <div class="sub-popup-footer">
          <button @click="cancelSubShopManager">取消</button>
          <button @click="confirmSubShopManager">确认</button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
//组件 提交成功
import success from "./success";
//组件 任务子项
import taskItem from "./components/taskItem";
// 接口
import performTaskViewApi from '@api/perform_task_view_api'
// 时间格式化
import moment from "moment";
// 编辑图标
import imgIconUpdate from '../../../public/img/create_task/icon_task_update.png';
// 导出图标
import exportIcon from '../../../public/img/store_visit/exportIcon.png'
// vuex
import { mapGetters } from "vuex";
export default {
  name: "IndexView",
  subtitle() {
    return this.$route.query.name
  },
  leftIcon() {
    return 'arrow-left'
  },
  exportIcon() {
    return exportIcon
  },
  onLeft() {
    window.history.back()
  },
  rightIcon(){
    return this.imgIconUpdate
  },
  onRight() {
    return this.editVisitStore()
  },
  onExport() {
    return this.exportPdf()
  },
  components: {
    success,
    taskItem
  },
  data() {
    return {
      // 任务类型 对应后端 枚举值
      taskMap: {
        '1': '访店任务',
        '2': '其他任务',
        '3': '改善任务'
      },
      // 任务类型 options
      taskClassOptions:[
        {
          name: '业绩争创',
          id: 1,
          // 接口中的类型option的key
          typeKey: 'performanceStrivingBlankLists',
          valueKey: 'performanceStrivingLists'
        },
        {
          name: '费用管理',
          id: 2,
          // 接口中的类型option的key
          typeKey: 'costManagementBlankLists',
          valueKey: 'costManagementLists'
        },
        {
          name: '人员发展',
          id: 3,
          // 接口中的类型option的key
          typeKey: 'personnelDevelopmentBlankLists',
          valueKey: 'personnelDevelopmentLists'
        },
        {
          name: '活动执行',
          id: 4,
          // 接口中的类型option的key
          typeKey: 'activityExecutionBlankLists',
          valueKey: 'activityExecutionLists'
        },
        {
          name: '楼面管理',
          id: 5,
          // 接口中的类型option的key
          typeKey: 'floorManagementBlankLists',
          valueKey: 'floorManagementLists'
        },
        {
          name: '顾客评价',
          id: 6,
          // 接口中的类型option的key
          typeKey: 'customerEvaluationBlankLists',
          valueKey: 'customerEvaluationLists'
        },
        {
          name: 'QSC指标',
          id: 7,
          // 接口中的类型option的key
          typeKey: 'qscTargetBlankLists',
          valueKey: 'qscTargetLists'
        },
        {
          name: '其他',
          id: 8,
          // 接口中的类型option的key
          typeKey: 'otherBlankLists',
          valueKey: 'otherLists'
        }
      ],
      // 选择操作的任务类型 默认第一个
      handleTaskType: '',
      handleTaskItem: '',
      // 参数
      params: {
        executeNo: '',
        workNo: ''
      },
      // dataMap
      dataMap: new Map(),
      // 当前展示的数据
      viewData: {
        //  改善项
        list: [],
        // 门店评分
        storeScore: 0
      },
      // 时间选择器
      timeShow: false,
      // 当前操作的下标
      handleIndex: '',
      // 任务详情
      taskInfo: '',
      // 任务名称
      taskName: '',
      // 时间区间
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2010, 0, 31),
      // 当前选择的时间
      currentTime: '',
      // 提交弹层 状态控制
      subShow: false,
      // 是否可编辑
      editStatus: true,
      // 图片
      imgIconUpdate: '',
      // 当前任务是否是下属任务
      subordinateTask: false,
      // 任务状态
      taskStatus: ''
    }
  },
  computed: {
    ...mapGetters(['userId', 'userName'])
  },
  mounted() {
    this.defaultSetVal()
  },
  methods: {
    // 默认赋值
    defaultSetVal() {
      if(this.$route && this.$route.query) {
        this.params = this.$route.query
        this.getTaskDetailInfo()
      }
    },
    // 开启编辑
    editVisitStore() {
      this.editStatus = !this.editStatus
    },
    // 选择任务 大类 类型
    chooseTaskType(taskObj) {
      let { dataMap } = this
      // 老值留存
      if(dataMap.has(this.handleTaskType)) {
        let value = dataMap.get(this.handleTaskType)
        value = {
          ...value,
          storeScore: this.viewData.storeScore,
          list: this.viewData.list
        }
        dataMap.set(this.handleTaskType, value)
      }
      // new Type 类型切换
      this.handleTaskType = taskObj.name
      this.handleTaskItem = taskObj

      let whetherData = dataMap.has(taskObj.name)
      // 若大类Map数据中查询不到 该数据出现异常 大类找不到/子类找不到
      if(!whetherData) {
        console.error('数据出错')
        return
      }
      let currentData = dataMap.get(taskObj.name)
      // 切换显示数据源
      if(currentData.list && currentData.list.length > 0) {
        this.viewData.list = JSON.parse(JSON.stringify(currentData.list))
        this.viewData.storeScore = currentData.storeScore
      }
    },
    // 默认子项
    childItem(item) {
      let data = {
        ...item,
        // 改善内容
        improveContent: '',
        // 改善时间
        improveDate: '',
        // 附件
        filesUrl: '',
        // 执行编码
        executeNo: this.params.executeNo,
        // 任务编码
        workNo:  this.params.workNo,
        // 时间选择器 显示
        timeShow: false,
        // 开始时间
        startTime: '',
        // 结束时间
        endTime: '',
        // 操作状态 删除前端传D 其它操作传A
        status: 'A'

      }
      delete data.children
      return data
    },
    // 获取 任务详情
    getTaskDetailInfo() {
      performTaskViewApi.getImplementTask({
        executeNo: this.params.executeNo,
        workNo: this.params.workNo,
        userNo: this.userId
      })
      .then(res => {
        console.info('获取 任务详情', res)
        if(res.code === 200) {
          let dataMap = new Map()
          this.taskInfo = res.data
          this.taskName = res.data.workName
          this.minDate = new Date(res.data.startDate)
          this.maxDate = new Date(res.data.endDate)

          // 已执行时 出现编辑 按钮
          if(res.data.exeStatus === 'n') {
            // 未执行
            this.editStatus = true
            this.imgIconUpdate = ''
            this.$notice.$emit('navigation',{rightIcon: ''})
          }
          if(res.data.exeStatus === 'y') {
            // 已执行
            /**
             * 下属任务时 可以催办/结案/已阅
             * 非下属任务时 可再次提交
             */
            this.editStatus = true
            this.subordinateTask = this.$route.query.subordinateTask === 'true' ? true : false
            if(!this.subordinateTask)  this.$notice.$emit('navigation',{rightIcon: imgIconUpdate})
            if(this.subordinateTask)  this.editStatus = false
          }
          if(res.data.exeStatus === 'f') {
            // 已结案
            this.editStatus = false
            this.imgIconUpdate = ''
          }

          /**
           * 任务状态
           *  结案状态时 无法编辑/催办/已阅 只能导出pdf
           */
          this.taskStatus = res.data.exeStatus
          // 数据处理
          for(let item of this.taskClassOptions) {
            let listItemData = []
            let blankList =  res.data[item.typeKey]
            let valueList = res.data[item.valueKey] ? res.data[item.valueKey] : []
            for(let item of blankList) {
              item['children'] = []
              if(valueList && valueList.length > 0) {
                for(let valueItem of valueList) {
                  if(!valueItem.status) valueItem.status = 'A'
                  // 接口详情部分获取
                  if(valueItem.workContentNo === item.workContentNo) {
                    item['children'].push(valueItem)
                  }
                }
                if(item['children'].length === 0) {
                  item['children'].push(this.childItem(item))
                }
              } else {
                item['children'].push(this.childItem(item))
              }

              listItemData.push(item)
            }
            dataMap.set(item.name, {
              typeOptions: res.data[item.typeKey],
              list: listItemData,
              storeScore: listItemData[0] ? Number(listItemData[0].children[0]['storeScore']) : 0,
              subKey: item.valueKey
            })
          }
          this.dataMap = dataMap
          this.handleTaskItem = {
            name: '业绩争创',
            id: 1,
            // 接口中的类型option的key
            typeKey: 'performanceStrivingBlankLists',
            valueKey: 'performanceStrivingLists'
          }
          // 默认开启
          this.chooseTaskType( this.handleTaskItem )
          this.handleIndex = {
            parentIndex: 0,
            childIndex: 0
          }
        }
      })
    },
    // 确认时间
    popupDateConfirm(date) {
      this.timeShow = !this.timeShow
      this.viewData.list[this.handleIndex.parentIndex].children[this.handleIndex.childIndex]['improveDate'] = moment(date).format('YYYY-MM-DD')
    },
    // 开启时间选择器
    openTimeChoose(index, childIndex) {
      this.timeShow = !this.timeShow
      this.handleIndex = {
        parentIndex: index,
        childIndex: childIndex
      }
    },
    // 添加改善项
    addChildItem(index) {
      console.info('添加改善项', index, this.viewData.list[index])
      let data = this.viewData.list[index].children
      if(!data) {
        return
      }
      this.viewData.list[index].children.push(this.childItem(this.viewData.list[index]))
    },
    // 删除改善项
    deleteItem(index, childIndex) {
      console.info( this.viewData.list[index].children[childIndex] )
      // this.viewData.list[index].children.splice(childIndex, 1)
      this.viewData.list[index].children[childIndex]['status']  = 'D'
      // console.info( this.viewData.list[index], childIndex )
      console.info( this.viewData.list[index].children[childIndex] )
    },
    // 更新数据
    updateFile(fileData) {
      this.viewData.list[this.handleIndex.parentIndex].children[this.handleIndex.childIndex]['filesUrl'] = fileData.filesName
      this.viewData.list[this.handleIndex.parentIndex].children[this.handleIndex.childIndex]['filesRealUrl'] = fileData.filesUrl
    },
    // 更新下标数据
    updateHandleIndex(indexData) {
      this.handleIndex = {
        parentIndex: indexData.index,
        childIndex: indexData.childIndex
      }
    },
    // 数据过滤
    dataFiltering(){
      let data = {}
      for(let value of this.dataMap.values()) {
        data[value.subKey] = []
        /**
         * @date 2021-11-24 17:35:23
         * @describe: 跳过当前操作的类型 避免数据重复
         */
        if(value.subKey !== this.handleTaskItem.valueKey) {
          console.info(value.subKey)
          for(let item of value.list) {
            data[value.subKey] = item.children && item.children.length > 0 ? data[value.subKey].concat(item.children) : []
          }
        }
      }
      for(let item of this.viewData.list) {
        data[this.handleTaskItem.valueKey] =  data[this.handleTaskItem.valueKey].concat(item.children)
      }
      for(let key in data) {
        // 只保留 改善内容存在的
        data[key] = data[key].filter(item => item.improveContent)
      }
      return data
    },
    // 改善评分
    rateChange(value) {
      if(this.dataMap.has(this.handleTaskItem.name)) {
        let data = this.viewData
        data.storeScore = value
        data.list.map(item => {
          item.children.map(childItem => {
            childItem.storeScore = value
          })
        })
      }
    },
    // 立即提交
    submitData(flag) {
      performTaskViewApi.submitWorkData({
        ...this.dataFiltering(),
        'endDate': this.taskInfo.endDate,
        'executeNo': this.taskInfo.executeNo,
        'startDate':  this.taskInfo.startDate,
        'workName': this.taskInfo.workName,
        'workNo': this.taskInfo.workNo,
        'workType': this.taskInfo.workType,
        'flag': flag,
        'createUserNo': this.userId,
        'createUserName': this.userName
      })
      .then(res => {
        console.info(res)
        this.subShow = !this.subShow
        if(res.code === 200) {
          this.$notice.$emit('navigation', {navShowStatus: false})
          this.$router.push('/perform-task/success')
        } else{
          this.$notify({
            type: 'warning',
            message: '任务提交失败，请检查填写数据！',
          });
        }
      })
      .catch(err => console.error(err))
    },
    // 取消提交 改善任务 给店长
    cancelSubShopManager() {
        this.submitData('0')
    },
    // 确认提交 改善任务 给店长
    confirmSubShopManager() {
      this.submitData('1')
    },
    // 催办/已阅 任务
    readTask(opType) {
      performTaskViewApi.readExecute({
        executeNo: this.params.executeNo,
        opType: opType,
        userNo: this.userId,
        workNo: this.params.workNo
      })
      .then(res => {
        if(res.code === 200) {
          // todo 催办/已阅 任务
          // this.$router.push('/management-task/index')
        }
        console.info(res)
      })
    },
    // 结案 任务
    endTask() {
      performTaskViewApi.finalExecute({
        executeNo: this.params.executeNo,
        userNo: this.userId,
        workNo: this.params.workNo
      })
          .then(res => {
            if(res.code === 200) {
              // this.$router.push('/management-task/index')
            }
          })
      .catch(err => console.error(err))
    },
    // 导出pdf
    exportPdf() {
      console.info('导出pdf')
      let url = performTaskViewApi.downPdf({
        executeNo: this.params.executeNo,
        userNo: this.userId,
        workNo: this.params.workNo
      })
      console.info(url)
      let downFile = document.createElement('a')
      downFile.href = url
      downFile.click()
      document.body.remove(downFile)

      // downMethod
      // let iframe = document.createElement("iframe")
      // iframe.style.display = "none"
      // iframe.style.height = 0
      // iframe.src = url
      // document.body.appendChild(iframe)
      // setTimeout(() => {
      //   iframe.remove()
      // }, 5 * 60 * 1000)
    }
  }
};
</script>
<style lang="scss" scoped>
.perform-wrap{
  height: 100%;
  padding: 15px;
  background-color: #FAFAFA;
  ::v-deep{
    .van-calendar__day--end, .van-calendar__day--start{
      background-color: rgba(10, 155, 88, .9);
    }
    .van-calendar__day--middle{
      background-color: rgba(10, 155, 88, .4);
      color: #343333;
    }
    .van-calendar__confirm{
      background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
      border: 1px solid #0A9B58;
    }
  }
  ::v-deep{
    .van-popup{
      border-radius: 20px;
      background-color: rgba(255,255,255,.9);
    }
  }
}
.task-type{
  height: 105px;
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
.task-content{
  display: flex;
  background-color: #FAFAFA;
  margin-top: 18px;
  padding-bottom: 100px;
  .task-class{
    width: 94px;
    min-height: 727px;
    background: #FAFAFA;
    box-shadow: 0 2px 5px 2px rgba(0,0,0,0.05);
    &-item{
      width: 100%;
      height: 45px;
      line-height: 45px;
      font-size: 14px;
      font-weight: 600;
      color: #3A3A3A;
      text-align: left;
      text-indent: 10px;
    }
    .active{
      position: relative;
      background-color: #fff;
      &:before{
        width: 6px;
        height: 27px;
        background: #0A9B58;
        content:'';
        position: absolute;
        top: 8px;
        left: 0;
      }
    }
  }
  .task-item{
    width: 252px;
    .task-point{
      display: flex;
      align-items: center;
      width: 252px;
      height: 64px;
      background: #FFFFFF;
      box-shadow: 0 2px 5px 2px rgba(0,0,0,0.05);
      border-radius: 5px;
      position: relative;
      z-index: 10;
      &-title{
        font-size: 14px;
        font-weight: 600;
        color: #333333;
        margin-left: 10px;
        margin-right: 10px;
      }
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
.sub-popup{
  width: 300px;
  height: 200px;
  border-radius: 20px;
  position: relative;
  p{
    font-size: 18px;
    padding: 50px 20px 0 20px;
    font-weight: 600;
  }
  &-footer{
    width: 300px;
    position: absolute;
    bottom: 20px;
    left: 50%;
    margin-left: -150px;
    button{
      width: 80px;
      height: 40px;
      border: none;
      outline: none;
      background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
      border-radius: 22px;
      font-size: 16px;
      font-weight: 600;
      color: #FFFFFF;
      margin: 0 10px;
    }
  }
}
.footer-subordinate{
  button{
    margin: 0 6px;
    background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
    border-radius: 22px;
    &:nth-child(3n + 1){
      background: linear-gradient(180deg, #FCCF00 0%, #F7A100 100%);
      border-radius: 22px;
    }
    &:last-child{
      background: linear-gradient(180deg, #FC9E10 0%, #ED3F14 100%);
      border-radius: 22px;
    }
  }
}
</style>
