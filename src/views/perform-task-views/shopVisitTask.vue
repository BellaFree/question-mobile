<template>
  <div class="perform-wrap">
    <!-- 任务类型 && 任务时间   -->
    <div class="task-type">
      <p class="task-type-item">
        <label>任务类型:</label>
        <span>标准访店任务</span>
      </p>
      <p class="task-type-item task-type-time">
        <label>任务时间:</label>
        <span>2021-09-19至2021-09-22</span>
      </p>
    </div>
    <!-- 任务内容主体  -->
    <div class="task-content">
      <!-- 任务 大类  -->
      <div class="task-class">
        <div v-for="(item, index) of taskClassOptions"
             :key="item.id"
             @click="chooseTaskType(item)"
             :class="{'task-class-item': true, 'active': item.id === handleTaskType}">{{index + 1}}.{{item.name}}</div>
      </div>
      <!-- 任务 项 -->
      <div class="task-item">
        <!-- 任务 分值 -->
        <div class="task-point">
          <p class="task-point-title">门店评分:</p>
          <van-rate
              v-model="rateValue"
              :size="25"
              allow-half
              color="#ffd21e"
              void-icon="star"
              void-color="#eee"
          />
        </div>
        <!-- 任务 具体 -->
        <taskItem/>
      </div>
    </div>
    <!-- 任务提交  -->
    <div class="footer">
      <button>立即提交</button>
    </div>
    <success v-if="false"/>
  </div>
</template>
<script>
//组件 提交成功
import success from "./components/success";
//组件 任务子项
import taskItem from "./components/taskItem";
export default {
  name: "IndexView",
  subtitle() {
    return '德克士(火车站店)访店任务'
  },
  leftIcon() {
    return 'arrow-left'
  },
  onLeft() {
    window.location.href = 'http://103.13.247.70:8091/gisApp/page/home/home.html?timestamp=' + new Date().getTime()
  },
  components: {
    success,
    taskItem
  },
  data() {
    return {
      // 任务类型 options
      taskClassOptions:[
        {
          name: '业绩争创',
          id: 1
        },
        {
          name: '费用管理',
          id: 2
        },
        {
          name: '人员发展',
          id: 3
        },
        {
          name: '活动执行',
          id: 4
        },
        {
          name: '楼面管理',
          id: 5
        },
        {
          name: '顾客评价',
          id: 6
        },
        {
          name: 'QSC指标',
          id: 7
        },
        {
          name: '其他',
          id: 8
        }
      ],
      // 选择操作的任务类型 默认第一个
      handleTaskType: 2,
      // 评分值
      rateValue: 0
    }
  },
  mounted() {
  },
  methods: {
    // 选择任务 大类 类型
    chooseTaskType(taskObj) {
      this.handleTaskType = taskObj.id
    }
  }
};
</script>
<style lang="scss" scoped>
.perform-wrap{
  height: 100%;
  padding: 15px;
  background-color: #FAFAFA;
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
    height: 727px;
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
</style>
