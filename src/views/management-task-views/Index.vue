<template>
  <div class="taskManage-wrap">
    <!-- 筛选 -->
    <div class="filter-box">
      <van-search
          v-model="searchKey"
          placeholder="请搜索"
          class="filter-input"
          shape="round"
      />
      <span @click="taskFilterShow =!taskFilterShow">
        <svg-icon icon-class="filter" class-name="filter-icon"/>
      </span>
    </div>
    <!-- 任务类型 -->
    <div class="task-type">
      <div v-for="item of taskTypeOption"
           :key="item.id"
           @click="chooseTaskType(item)"
           :class="{'task-type-item': true, 'active': taskType === item.id}">
        <span>{{item.name}}</span>
      </div>
    </div>
    <!-- 任务状态栏 -->
    <div class="task-status">
      <van-tabs v-model="taskStatus" @change="tabChange">
        <van-tab v-for="item in taskStatusOptions" :title= "item.name" :key="item.id"/>
      </van-tabs>
    </div>
    <!-- 任务列表 -->
    <div class="task-list">
      <!-- 排序 -->
      <div class="sort" @click="changeSort">
        <svg-icon :icon-class="iconName"/>
        <span>开始时间</span>
      </div>
      <!-- 列表 -->
      <div v-for="item of taskList"  :key='item.date' class="list-item">
        <!-- 日期 -->
        <p class="list-item-date">{{item.date}}</p>
        <!-- 任务项 -->
        <div v-for="taskItem of item.taskInfoList" :key="taskItem.workNo"  class="task-content">
          <!-- 任务 衔接线 -->
          <div class="task-line">
            <svg-icon icon-class="taskItem"/>
            <i/>
          </div>
          <div class="task-right">
            <!-- 任务 详细-->
            <div class="task-detail">
              <!-- 任务 名称-->
              <p class="task-detail-title">{{taskItem.workName}}</p>
              <!-- 任务 执行人-->
              <p class="task-detail-executor">执行人：{{taskItem.workUserList}}</p>
              <!-- 任务 截止时间-->
              <p class="task-detail-end-time">{{taskItem.endDate}}任务截止</p>
              <!-- 任务 状态-->
              <p class="task-detail-status">{{taskItem.workStatus}}</p>
              <!-- 任务 类型/审批状态-->
              <div class="task-detail-type">
                <div class="task-item-type">{{taskItem.workType}}</div>
                <div class="task-approve-status">{{taskItem.approveStatus}}</div>
              </div>
              <!-- 任务 展开/收起-->
              <div @click="taskItem.open=!taskItem.open" class="task-detail-handle"><svg-icon :icon-class="taskItem.open ? 'default-up': 'default-down'"/></div>
            </div>
            <!-- 任务 执行人-->
            <div v-if="taskItem.open" class="task-executor">
              <div v-for="list of taskItem.executeList" :key="list.workUserNo" class="task-executor-item" >
                <p class="task-executor-item-name">
                  <label>执行人:</label>
                  <span>{{list.workUserName}}</span>
                </p>
                <p class="task-executor-item-store">
                  <label>任务门店:</label>
                  <span>{{list.storeName}}</span>
                </p>
                <p class="task-executor-item-time">
                  <label>任务时间:</label>
                   <span>{{list.startDate}}至{{list.endDate}}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 返回顶部 -->
    <div class="back-top" @click="backToTop">
      <svg-icon icon-class="backTop"></svg-icon>
    </div>
    <!-- 弹层 任务筛选 -->
    <van-popup v-model="taskFilterShow" position="bottom" :style="{ height: '50%' }" closeable round>
      <p class="popup-title">查看任务筛选</p>
      <!-- 任务筛选  时间-->
      <div class="popup-time">
        <label>任务时间:</label>
        <p @click="timeShow = !timeShow">{{this.time.start}}至{{this.time.end}}</p>
      </div>
      <!-- 任务筛选  组织-->
      <div class="popup-organization">
        <label>门  店:</label>
        <p @click="openFilter('store')">2021-06-22至2021-07-22</p>
      </div>
      <!-- 任务筛选  执行人-->
      <div class="popup-executor">
        <label>执行人:</label>
        <div class="executor-box">
          <template  v-for="(item,index) of chooseExecutor">
            <div v-if="index < 4" :key="item.id" class="executor-item">{{nameFilter(item.name)}}</div>
          </template>
          <div v-if="chooseExecutor.length > 4">等{{chooseExecutor.length - 4}}人</div>
          <span @click="openFilter('user')" class="add-icon"><svg-icon icon-class="add"/></span>
        </div>
      </div>
      <!-- 任务筛选  确认-->
      <div class="confirm-btn" @click="confirmFilter">确认筛选</div>
    </van-popup>
    <!-- 弹层 门店/执行人选择 -->
    <van-popup v-model="filterShow" position="bottom" class="filter-dialog" :style="{ height: '80%' }"  round>
      <p class="dialog-title">请选择门店</p>
      <div class="handle-btn-box">
        <button @click="cancelFilterOption">取 消</button>
        <button @click="confirmFilterOption">确 认</button>
      </div>
      <van-checkbox-group v-model="value">
        <van-checkbox v-for="item of filterOptions"  :name="item.userNo + '_' + item.userName" :key="item.userNo"><span v-if="optionType === 'user'" class="name">{{nameFilter(item.userName)}}</span>{{item.userName}}</van-checkbox>
      </van-checkbox-group>
    </van-popup>
    <!-- 弹层： 时间  -->
    <van-calendar v-model="timeShow" type="range" @confirm="popupDateConfirm" />
  </div>
</template>
<script>
import MANAGEMENT_TASK_API from '@api/management_task_api'
import moment from "moment";
// 名称处理函数
import {nameFilter} from '@/utils'
import mock from "./mock";
export default {
  name: "IndexView",
  subtitle() {
    return '任务管理'
  },
  leftIcon() {
    return 'arrow-left'
  },
  onLeft() {
    window.location.href = 'http://103.13.247.70:8091/gisApp/page/home/home.html?timestamp=' + new Date().getTime()
  },
  data() {
    return {
      // 检索关键字
      searchKey:'',
      // 任务类型
      taskTypeOption:[
        {
          name: '全部任务',
          id: '0'
        },
        {
          name: '我的任务',
          id: '1'
        },
        {
          name: '下属任务',
          id: '2'
        }
      ],
      // 默认任务类型
      taskType: '0',
      // 任务状态
      taskStatusOptions: [
        {
          name: '全部',
          id: 0
        },
        {
          name: '催办',
          id: 1
        },
        {
          name: '已逾期',
          id: 2
        },
        {
          name: '进行中',
          id: 3
        },
        {
          name: '未开始',
          id: 4
        },
        {
          name: '已完成',
          id: 5
        },
        {
          name: '已阅',
          id: 6
        },
        {
          name: '已终止',
          id: 7
        },
        {
          name: '审核中',
          id: 8
        },
        {
          name: '审核失败',
          id: 9
        },
        {
          name: '审核通过',
          id: 10
        }
      ],
      // 任务状态默认值
      taskStatus: '0',
      // 任务筛选 弹层 控制
      taskFilterShow: false,
      // 任务列表
      taskList: [],
      // 检索中门店
      chooseStore:  [],
      // 检索中执行人
      chooseExecutor: [],
      // 筛选列表
      filterOptions: [],
      // 筛选门店/执行人 弹层
      filterShow: false,
      // 门店 options
      storeOptions: [],
      // 执行人 options
      executorOptions: [
        {
          userNo: '202009010060',
          userName: '钟旻均',
          orgNo: null,
          orgName: null,
          roleNo: null,
          roleName: null,
          deptName: null,
          avatarUrl: null,
          isSelect: null
        },
        {
          userNo: '202011010032',
          userName: '邓稀维',
          orgNo: null,
          orgName: null,
          roleNo: null,
          roleName: null,
          deptName: null,
          avatarUrl: null,
          isSelect: null
        },
        {
          userNo: '202011010050',
          userName: '张琪',
          orgNo: null,
          orgName: null,
          roleNo: null,
          roleName: null,
          deptName: null,
          avatarUrl: null,
          isSelect: null
        },
        {
          userNo: '202011160032',
          userName: '张浩泓',
          orgNo: null,
          orgName: null,
          roleNo: null,
          roleName: null,
          deptName: null,
          avatarUrl: null,
          isSelect: null
        },
        {
          userNo: '202104260005',
          userName: '何泽华',
          orgNo: null,
          orgName: null,
          roleNo: null,
          roleName: null,
          deptName: null,
          avatarUrl: null,
          isSelect: null
        },
        {
          userNo: '202105060023',
          userName: '陈圳锐',
          orgNo: null,
          orgName: null,
          roleNo: null,
          roleName: null,
          deptName: null,
          avatarUrl: null,
          isSelect: null
        },
        {
          userNo: '202110200006',
          userName: '姚俊辉',
          orgNo: null,
          orgName: null,
          roleNo: null,
          roleName: null,
          deptName: null,
          avatarUrl: null,
          isSelect: null
        }
      ],
      // 选择类型
      optionType: 'store',
      // 选中值
      value: [],
      // 时间
      time: {
        start: '2021-12-01',
        end: '2021-12-31'
      },
      // 列表排序规则
      listSort: 'ASC',
      // 排序图标名称
      iconName:'sort-up',
      // 时间弹层显隐控制
      timeShow: false
    }
  },
  mounted() {
    // this.getList()
    this.taskList = mock.list
  },
  methods: {
    nameFilter,
    // 获取任务列表
    getList() {
      MANAGEMENT_TASK_API.getTaskList({
        model: this.taskType,
        userNo: 'YC200302154396',
        begin: this.time.start,
        end: this.time.end,
        sort: this.listSort,
        status: this.taskStatus,
        workName: this.searchKey,
        // todo 接口未定义
        storeList: this.chooseStore,
        executorList: this.paramsHandle(this.chooseExecutor)
      })
      .then(res => {
        if(res.code === 200) {
          this.taskList = res.data
        }
      })
    },
    // 参数处理
    paramsHandle(data) {
      let result = []
      if(data && data.length > 0) {
        for(let item of data) {
          result.push(item.id)
        }
      }
      return result
    },
    // 选择任务类型
    chooseTaskType(item){
      this.taskType = item.id
      this.getList()
    },
    // 开启执行人 弹层
    openFilter(type) {
      this.filterShow = true
      this.optionType = type
      // 重置 避免数据污染
      this.value = []
      if(type === 'store') {
        this.filterOptions = this.storeOptions
      }
      else{
        if( this.chooseExecutor &&  this.chooseExecutor.length > 0) {
          for(let item of  this.chooseExecutor){
            this.value.push(item.id + '_' + item.name)
          }
        }
        console.info(this.value)
        this.filterOptions = this.executorOptions
      }
    },
    // 切换排序
    changeSort(){
      if(this.listSort === 'ASC'){
        this.listSort = 'DESC'
        this.iconName = 'sort-down'
      }else{
        this.listSort = 'ASC'
        this.iconName = 'sort-up'
      }
      this.getList()
    },
    // 任务状态切换
    tabChange() {
      this.getList()
    },
    // 时间确认
    popupDateConfirm(date) {
      const [start, end] = date;
      this.timeShow = !this.timeShow
      this.time.start = moment(start).format('YYYY-MM-DD')
      this.time.end = moment(end).format('YYYY-MM-DD')
    },
    //确认筛选
    confirmFilter(){
      this.value = []
      this.taskFilterShow = false
      this.getList()
    },
    // 取消筛选选择
    cancelFilterOption() {
      this.filterShow = false
    },
    // 确认筛选选择
    confirmFilterOption() {
      if(this.optionType === 'store') {
        this.chooseStore = this.value
      }else{
        this.chooseExecutor = []
        if(this.value && this.value.length > 0) {
          for(let item of this.value) {
            this.chooseExecutor.push({
              id: item.split('_')[0],
              name: item.split('_')[1]
            })
          }
        }
      }
      this.filterShow = false
    },
    // 返回顶部
    backToTop() {
      window.scroll({top: 0, left: 0, behavior: 'smooth' });
    },
  }
};
</script>
<style lang="scss" scoped>
.taskManage-wrap{
  height: 100vh;
  background: #ECF6DF;
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
}
.filter-box{
  display: flex;
  align-items: center;
  height: 35px;
  padding-top:10px;
  padding-left: 5px;
  background-color: #fff;
  .filter-input{
    width: 315px;
    height: 35px;
  }
  .filter-icon{
    display: inline-block;
    width: 21px;
    height: 21px;
  }
}
.task-type{
  display: flex;
  font-size: 15px;
  font-weight: 600;
  color: #424242;
  padding: 15px 0;
  background-color: #fff;
  &-item{
    flex: 1;
    span{
      position: relative;
      z-index: 10;
    }
  }
  .active{
    position: relative;
    z-index: 10;
    &:before{
      content: '';
      width: 64px;
      height: 10px;
      border-radius: 10px;
      background: linear-gradient(270deg, rgba(200, 223, 64, 0.6) 0%, #0A9B58 100%);
      position: absolute;
      bottom: 0;
      left: 50%;
      z-index: 0;
      margin-left: -32px;
    }
  }
}
.task-status{
  ::v-deep {
    .van-tabs--line .van-tabs__wrap{
      height: 30px;
    }
    .van-tab{
      height: 23px;
      background: #EDEDED;
      border-radius: 14px;
      margin-right: 10px;
      color: #A5A5A5;
      flex-shrink: 0;
      flex-basis: auto;
      line-height: 45px;
    }
    .van-tab--active {
      color: #fff;
      background: #0A9B58;
    }

    .van-tabs__line {
      background-color: transparent;
      width: 50px;
    }
  }
}
.task-list{
  position: relative;
  margin-top: 20px;
  .sort{
    display: flex;
    align-items: center;
    position: absolute;
    top: -4px;
    right: 20px;
    svg{
      display: inline-block;
      width: 21px;
      height: 21px;
    }
    span{
      display: inline-block;
      width: 25px;
      font-weight: 500;
      color: #333333;
    }
  }
  .list-item{
    padding: 0 15px;
    background: #ECF6DF;
    &-date{
      font-size: 19px;
      font-weight: 600;
      color: #333333;
      text-align: left;
      margin-bottom: 10px;
    }
    .task-content{
      display: flex;
      margin-bottom: 12px;
      .task-line{
        display: flex;
        width: 20px;
        flex-direction: column;
        justify-items: center;
        margin-right: 5px;
        svg{
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-bottom: 5px;
        }
        i{
          display: inline-block;
          width: 1px;
          height: 100%;
          background-color:#979797 ;
          position: relative;
          left: 9px;
        }
      }
      .task-detail{
        width: 321px;
        height: 115px;
        background: #FFFFFF;
        box-shadow: 0 2px 3px 2px rgba(0,0,0,0.06);
        border-radius: 10px;
        position: relative;
        z-index: 100;
        $left: 20px;
        &-title{
          font-size: 15px;
          font-weight: 600;
          color: #333333;
          position: absolute;
          top: 14px;
          left:  $left;
        }
        &-executor{
          font-size: 12px;
          font-weight: 500;
          color: #495060;
          position: absolute;
          left:  $left;
          top: 37px;
        }
        &-end-time{
          font-size: 12px;
          font-weight: 400;
          color: rgba(10, 92, 172, 0.49);
          position: absolute;
          left:  $left;
          top: 60px;
        }
        &-status{
          font-size: 14px;
          font-weight: 500;
          color: #02DF61;
          position: absolute;
          top: 48px;
          right: 14px;
          &:before{
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 8px;
            background-color:#02DF61;
            position: absolute;
            top: 5px;
            left: -10px;
          }
        }
        &-type{
          display: flex;
          align-items: center;
          position: absolute;
          top: 84px;
          left:  $left;
          div{
            width: 64px;
            height: 20px;
            line-height: 21px;
            border-radius: 13px;
            font-size: 11px;
            font-weight: 600;
            margin-right: 10px;
          }
          .task-item-type{
            background: #0091FF;
            color: #FFFFFF;
          }
          .task-approve-status{
            background: rgba(109, 212, 0, 0.17);
            border-radius: 13px;
            height: 18px;
            border: 1px solid #6DD400;
            color: #6DD400;
          }
        }
        &-handle{
          width: 19px;
          height: 19px;
          position: absolute;
          top: 84px;
          right: 14px;
          svg{
            display: inline-block;
            width: 19px;
            height: 19px;
          }
        }
      }
      .task-executor{
        &-item{
          width: 321px;
          height: 105px;
          background: #FAFAFA;
          box-shadow: 0 2px 3px 2px rgba(0,0,0,0.06);
          border-radius: 10px;
          position: relative;
          top: -8px;
          font-size: 13px;
          font-weight: 400;
          color: #333333;
          text-align: left;
          padding-top: 10px;
          p{
            line-height: 30px;
            margin-left: 20px;
          }
        }
      }
    }
  }
}
.popup-title{
  font-size: 17px;
  font-weight: 600;
  color: #6B6B6B;
  margin-top: 15px;
}
.popup-time{
  height: 38px;
  line-height: 38px;
  font-size: 15px;
  font-weight: 600;
  color: #333333;
  text-align: left;
  padding-left: 15px;
  margin-top: 20px;
  display: flex;
  p{
    width: 265px;
    height: 38px;
    background: #FFFFFF;
    box-shadow: 0 0 5px 2px rgba(0,0,0,0.05);
    border-radius: 18px;
    margin-left: 10px ;
    text-align: center;
  }
}
.popup-organization{
  @extend .popup-time;
  p{
    margin-left: 33px;
  }
}
.popup-executor{
  @extend .popup-time;
  .add-icon{
    display: inline-block;
    width: 40px;
    height: 40px;
    svg{
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
  .executor-box{
    display: flex;
    width: 265px;
    margin-left: 25px;
    flex-wrap: wrap;
  }
  .executor-item{
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background: #0A9B58;
    border-radius: 40px;
    font-size: 12px;
    font-weight: 500;
    color: #FFFFFF;
    margin: 0 5px 5px 5px;
    flex-shrink: 0;
  }
}
.confirm-btn{
  width: 345px;
  height: 44px;
  line-height: 44px;
  background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
  border-radius: 22px;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  position: absolute;
  bottom: 10px;
  left: 10px;
}
.dialog-title{
  font-size: 16px;
  color: #333;
  font-weight: 500;
  padding: 20px;
}
.filter-dialog{
  ::v-deep{
    .van-checkbox{
      width: 375px;
      height: 60px;
      background: #FFFFFF;
      border-bottom: 1px solid rgba(219, 219, 219, 1);
      font-size: 15px;
      font-weight: 400;
      color: #3A3A3A;
    }
    .van-checkbox__icon{
      margin-left: 15px;
      width: 18px;
      height: 18px;
    }
  }
  .name{
    display: inline-block;
    width: 46px;
    height: 46px;
    line-height: 46px;
    background: #0A9B58;
    border-radius: 46px;
    font-size: 15px;
    font-weight: 500;
    color: #FFFFFF;
    text-align: center;
    margin-right: 10px;
  }
  .handle-btn-box{
    display: flex;
    width: 90%;
    justify-content: space-between;
    position: absolute;
    top: 16px;
    left: 50%;
    margin-left: -45%;
    button{
      width: 80px;
      height: 30px;
      border-radius: 20px;
      text-align: center;
      font-weight: 600;
      color: #A5A5A5;
      background-color: #EDEDED;
      &:last-child{
        color: #fff;
        background-color: #0A9B58;
      }
    }
  }
}
.back-top{
  width: 57px;
  height: 57px;
  position: fixed;
  bottom: 37px;
  right: 10px;
  z-index: 100;
  svg{
    width: 100%;
    height: 100%;
  }
}
</style>
