<template>
  <div class="taskManage-wrap">
    <!-- 筛选 -->
    <div class="filter-box">
      <van-search
        v-model="searchKey"
        placeholder="请搜索"
        class="filter-input"
        shape="round"
        @clear="getList"
        @search="getList" />
      <span @click="taskFilterShow =!taskFilterShow">
        <svg-icon icon-class="filter" class-name="filter-icon" />
      </span>
    </div>
    <!-- 任务类型 -->
    <div class="task-type">
      <div
        v-for="item of taskTypeOption"
        :key="item.id"
        :class="{'task-type-item': true, 'active': taskType === item.id}"
        @click="chooseTaskType(item)">
        <span>{{ item.name }}</span>
      </div>
    </div>
    <!-- 任务状态栏 -->
    <div class="task-status">
      <van-tabs v-model="taskStatus" @change="tabChange">
        <van-tab v-for="item in taskStatusOptions" :key="item.id" :title="item.name" />
      </van-tabs>
    </div>
    <!-- 任务列表 -->
    <div class="task-list">
      <!-- 排序 -->
      <div class="sort" @click="changeSort">
        <svg-icon :icon-class="iconName" />
        <span>开始时间</span>
      </div>
      <!-- 列表 -->
      <template v-if="taskList && taskList.length > 0">
        <div v-for="item of taskList" :key='item.date' class="list-item">
          <!-- 日期 -->
          <p class="list-item-date">{{ item.date }}</p>
          <!-- 任务项 -->
          <div v-for="taskItem of item.taskInfoList" :key="taskItem.workNo" class="task-content">
            <!-- 任务 衔接线 -->
            <div class="task-line">
              <svg-icon icon-class="taskItem" />
              <i />
            </div>
            <div class="task-right">
              <!-- 任务 详细-->
              <div :class="{'task-detail': true, 'end': taskItem.workStatus === '已完成'}" @click.self="locationUrl(taskItem,'main')">
                <!-- 任务 名称-->
                <p class="task-detail-title">{{ taskItem.workName | ellipsisName(13) }}</p>
                <!-- 任务 执行人-->
                <p class="task-detail-executor">执行人：{{ getExecutor(taskItem) }}</p>
                <!-- 任务 截止时间-->
                <p class="task-detail-end-time">{{ taskItem.endDate }}任务截止</p>
                <!-- 任务 状态-->
                <p
                  :class="{'task-detail-status': true,
                           'noBegin': taskItem.workStatus === '未开始',
                           'timeOut': taskItem.workStatus === '已逾期',
                           'conduct': taskItem.workStatus === '进行中'
                  }">
                  {{ taskItem.workStatus }}
                </p>
                <!-- 任务 类型/审批状态-->
                <div class="task-detail-type">
                  <div class="task-item-type" :style="{'background':typeBackColor(taskItem)}">{{ taskItem.workType }}</div>
                  <div
                    v-if="taskItem.approveStatus"
                    :class="{'task-approve-status': true,
                             'Unreviewed': taskItem.approveStatus === '未审核',
                             'Approval': taskItem.approveStatus === '审核中',
                             'approvalFaile': taskItem.approveStatus === '审核失败',
                             'approvalSuccess': taskItem.approveStatus === '审核通过'
                    }">
                    {{ taskItem.approveStatus }}
                  </div>
                </div>
                <!-- 任务 展开/收起-->
                <div
                  v-if="taskItem.executeList && taskItem.executeList.length > 0"
                  class="task-detail-handle"
                  @click="taskItem.open=!taskItem.open">
                  <template v-if="taskItem.workStatus !== '已完成'">
                    <svg-icon :icon-class="taskItem.open ? 'default-up': 'default-down'" />
                  </template>
                  <template v-if="taskItem.workStatus === '已完成'">
                    <svg-icon :icon-class="taskItem.open ? 'end-up': 'end-down'" />
                  </template>
                </div>
              </div>
              <!-- 任务 执行人-->
              <div v-if="taskItem.open" class="task-executor">
                <template v-for="(list, index) of taskItem.executeList">
                  <div
                    :key="list.executeNo"
                    :style="{'z-index': (taskItem.executeList.length - index) *2 }"
                    class="task-executor-item"
                    @click="locationUrl({
                      ...list,
                      ...taskItem
                    }, 'children')">
                    <p class="task-executor-item-name">
                      <label>执行人:</label>
                      <span>{{ list.workUserName }}</span>
                    </p>
                    <p class="task-executor-item-store">
                      <label>任务门店:</label>
                      <span>{{ list.storeName }}</span>
                    </p>
                    <p class="task-executor-item-time">
                      <label>任务时间:</label>
                      <span>{{ list.startDate }}至{{ list.endDate }}</span>
                    </p>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <p>暂无数据</p>
      </template>
    </div>
    <!-- 返回顶部 -->
    <div class="back-top" @click="backToTop">
      <svg-icon icon-class="backTop" />
    </div>
    <!-- 弹层 任务筛选 -->
    <van-popup v-model="taskFilterShow" position="bottom" :style="{ height: '50%' }" closeable round>
      <p class="popup-title">查看任务筛选</p>
      <!-- 任务筛选  时间-->
      <div class="popup-time">
        <label>任务时间:</label>
        <p @click="timeShow = !timeShow">{{ this.time.start }}至{{ this.time.end }}</p>
      </div>
      <!-- 任务筛选  门店-->
      <div class="popup-organization">
        <label>门  店:</label>
        <p @click="openFilter('store')">
          {{ storeName | ellipsisName(20) }}
        </p>
      </div>
      <!-- 任务筛选  执行人-->
      <div class="popup-executor">
        <label>执行人:</label>
        <div class="executor-box">
          <template v-for="(item,index) of chooseExecutor">
            <div v-if="index < 4" :key="item.id" class="executor-item">{{ nameFilter(item.name) }}</div>
          </template>
          <div v-if="chooseExecutor.length > 4">等{{ chooseExecutor.length - 4 }}人</div>
          <span class="add-icon" @click="openFilter('user')"><svg-icon icon-class="add" /></span>
        </div>
      </div>
      <!-- 任务筛选  确认-->
      <div class="confirm-btn" @click="confirmFilter">确认筛选</div>
    </van-popup>
    <!-- 弹层 门店/执行人选择 -->
    <van-popup v-model="filterShow" position="bottom" class="filter-dialog" :style="{ height: '80%' }" round>
      <p class="dialog-title">{{title}}</p>
      <div class="handle-btn-box">
        <button @click="cancelFilterOption">取 消</button>
        <button @click="confirmFilterOption">确 认</button>
      </div>
      <van-checkbox-group v-model="value">
        <van-checkbox v-for="item of filterOptions" :key="item.code" :name="item.code + '&' + item.name">
          <span v-if="optionType === 'user'" class="name">{{ nameFilter(item.name) }}</span>
          {{ item.name }}
        </van-checkbox>
      </van-checkbox-group>
    </van-popup>
    <!-- 弹层： 时间  -->
    <van-calendar v-model="timeShow" type="range" :range-props='rangeProps' :allow-same-day="true" @confirm="popupDateConfirm" />
  </div>
</template>
<script>
import MANAGEMENT_TASK_API from '@api/management_task_api';
import moment from 'moment';
// 名称处理函数
import { nameFilter } from '@/utils';
import { mapGetters } from 'vuex';

export default {
  name: 'IndexView',
  subtitle() {
    return '任务管理';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    return this.$router.push(this.fullPath)
  },
  data() {
    return {
      rangeProps: { 'allow-same-day': true },
      // 检索关键字
      searchKey: '',
      // 任务类型
      taskTypeOption: [
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
      chooseStore: [],
      // 检索中执行人
      chooseExecutor: [],
      // 筛选列表
      filterOptions: [],
      // 筛选门店/执行人 弹层
      filterShow: false,
      // 门店 options
      storeOptions: [],
      // 执行人 options
      executorOptions: [],
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
      iconName: 'sort-up',
      // 时间弹层显隐控制
      timeShow: false,
      // 来源路径
      fullPath: '/',
      // 弹层标题
      title: '选择门店'
    };
  },
  filters: {
    ellipsisName(val, length) {
      if (val) {
        if (val.length > length) {
          return val.substring(0, length) + '...';
        } else {
          return  val;
        }
      }
    }
  },
  computed: {
    ...mapGetters(['userId']),
    storeName() {
      let result  = '';
      if (this.chooseStore && this.chooseStore.length > 0) {
        for (let item of this.chooseStore) {
          result += item.name + ',';
        }
        return result;
      }
      return  result;
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fullPath = from.fullPath
      let blacklist = [
          '/perform-task/else-task',
          '/task-detail',
          '/perform-task/visit-store',
          '/create-task/create',
          '/statistical-report/division',
          '/task-detail'
      ]
      let blackUrlBoolean = false
      for(let item of blacklist) {
        if(vm.fullPath.startsWith(item)) {
          blackUrlBoolean = true
          break
        }
      }
      console.log(vm.fullPath, blackUrlBoolean)
      if(blackUrlBoolean){
        vm.fullPath = '/'
      }
    });
  },
  mounted() {
    // 已选执行人场景处理
    if(this.$route.query) {
      const{userId, userName} = this.$route.query
      if(userId || userName) {
        this.chooseExecutor = [
          {
            id: userId,
            name: userName
          }
        ]
      }
    }
    this.getList()
  },
  methods: {
    nameFilter,
    // 任务状态颜色处理
    typeBackColor(item) {
      if (item.workStatus === '已完成') {
        return null;
      }
      if (item.workType === '改善任务') {
        return '#F7B500';
      }
      if (item.workType === '访店任务') {
        return '#0A9B58';
      }
      if (item.workType === '其他任务') {
        return '#0091FF';
      }
    },
    // 获取任务列表
    getList() {
      MANAGEMENT_TASK_API.getTaskList({
        model: this.taskType,
        userNo: this.userId,
        begin: this.time.start,
        end: this.time.end,
        sort: this.listSort,
        status: this.taskStatus,
        workName: this.searchKey,
        storeNos: this.paramsHandle(this.chooseStore),
        userNos: this.paramsHandle(this.chooseExecutor),
        isLoading: false
      })
        .then(res => {
          if (res.code === 200) {
          // 数据处理
            if (res.data && res.data.length > 0) {
              res.data.map(item => {
                item.taskInfoList.map(taskItem => {
                  taskItem['open'] = false;
                });
              });
            }
            this.taskList = res.data;
            // 数据置空
            this.value = [];
            // 执行人
            this.executorOptions = res.extData ? res.extData[0] ? res.extData[0].useDetail : [] : [];
            // 门店
            this.storeOptions = res.extData ? res.extData[1] ? res.extData[1].useDetail : [] : [];
          }
        });
    },
    // 参数处理
    paramsHandle(data) {
      let result = [];
      if (data && data.length > 0) {
        for (let item of data) {
          result.push(item.id);
        }
      }
      return result;
    },
    // 选择任务类型
    chooseTaskType(item) {
      this.taskType = item.id;
      this.getList();
    },
    // 开启执行人 弹层
    openFilter(type) {
      this.filterShow = true;
      this.optionType = type;
      // 重置 避免数据污染
      this.value = [];
      if (type === 'store') {
        if (this.chooseStore &&  this.chooseStore.length > 0) {
          for (let item of  this.chooseStore) {
            this.value.push(item.id + '&' + item.name);
          }
        }
        this.filterOptions = this.storeOptions;
        this.title = '选择门店'
      } else {
        if (this.chooseExecutor &&  this.chooseExecutor.length > 0) {
          for (let item of  this.chooseExecutor) {
            this.value.push(item.id + '&' + item.name);
          }
        }
        this.filterOptions = this.executorOptions;
        this.title = '选择执行人'
      }
    },
    // 切换排序
    changeSort() {
      if (this.listSort === 'ASC') {
        this.listSort = 'DESC';
        this.iconName = 'sort-down';
      } else {
        this.listSort = 'ASC';
        this.iconName = 'sort-up';
      }
      this.getList();
    },
    // 任务状态切换
    tabChange() {
      this.getList();
    },
    // 时间确认
    popupDateConfirm(date) {
      const [start, end] = date;
      this.timeShow = !this.timeShow;
      this.time.start = moment(start).format('YYYY-MM-DD');
      this.time.end = moment(end).format('YYYY-MM-DD');
    },
    // 确认筛选
    confirmFilter() {
      this.value = [];
      this.taskFilterShow = false;
      this.getList();
    },
    // 取消筛选选择
    cancelFilterOption() {
      this.filterShow = false;
    },
    // 确认筛选选择
    confirmFilterOption() {
      let data = [];
      for (let item of this.value) {
        data.push({
          id: item.split('&')[0],
          name: item.split('&')[1]
        });
      }
      if (this.optionType === 'store') {
        this.chooseStore = data;
      } else {
        this.chooseExecutor = data;
      }
      this.filterShow = false;
    },
    // 返回顶部
    backToTop() {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    },
    // 跳转到 主任务
    locationUrl(item, type) {
      const taskType = item.workType;
      if (type === 'main') {
        if (taskType === '改善任务') {
          let url = `executeNo=${item['executeList'][0].executeNo}&workNo=${item.workNo}&name=${item['executeList'][0].storeName ? item['executeList'][0].storeName : ''}${item.workName}`;
          this.$router.push(`/perform-task/else-task?${url}`);
        } else {
          this.$router.push(`/task-detail/${item.workNo}`);
        }
      } else {
        // 判断任务是否是下属任务
        let subordinateTask = item.currentOrgLevel && item.orgLevel ? item.currentOrgLevel < item.orgLevel : false;
        let url = `executeNo=${item.executeNo}&workNo=${item.workNo}&name=${item.storeName ? item.storeName : ''}${item.workName}&subordinateTask=${subordinateTask}`;
        if (item.workStatus === '进行中' || item.workStatus === '已完成' || item.workStatus === '已逾期') {
          if (taskType === '其他任务') {
            this.$router.push(`/perform-task/else-task?${url}`);
          }
          if (taskType === '访店任务')  {
            this.$router.push(`/perform-task/visit-store?${url}`);
          }
          if (taskType === '改善任务') {
            this.$router.push(`/perform-task/else-task?${url}`);
          }
        }
      }
    },
    // 获取当前主任务执行人
    getExecutor(item) {
      let result = [];
      if (item.executeList && item.executeList.length > 0) {
        for (let childItem of item.executeList) {
          result.push(childItem.workUserName);
        }
      }
      result = new Set(result);
      result = [...result];
      result = result.join(',');
      if (result.length > 20) {
        result = result.substring(0, 20) + '...';
      }
      return result;
    }
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
    .van-calendar__day--end, .van-calendar__day--multiple-middle, .van-calendar__day--multiple-selected, .van-calendar__day--start, .van-calendar__day--start-end{
      background-color: rgba(10, 155, 88, .9);
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
  z-index: 1;
  position: relative;
  margin-top: 20px;
  background: #ECF6DF;
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
        z-index: 1000;
        $left: 20px;
        &-title{
          font-size: 15px;
          font-weight: 600;
          color: #333333;
          position: absolute;
          top: 11px;
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
          top: 12px;
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
        .noBegin{
          color: #FBB700;
          &:before{
            background: #FBB700;
          }
        }
        .timeOut{
          color: #FF6600;
          &:before{
            background: #FF6600;
          }
        }
        .conduct{
          color: #02DF61;
          &:before{
            background: #02DF61;
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
          .Unreviewed{
            background: rgba(109, 212, 0, 0.17);
            border: 1px solid #6DD400;
            color: #6DD400;
          }
          .Approval{
            background: rgba(247, 181, 0, 0.2);
            border-radius: 13px;
            border: 1px solid #F7B500;
            font-weight: 600;
            color: #F7B500;
          }
          .approvalFaile{
            background: rgba(250, 100, 0, 0.14);
            border-radius: 13px;
            border: 1px solid #FA6400;
            font-weight: 600;
            color: #FA6400;
          }
          .approvalSuccess{
            background: rgba(109, 212, 0, 0.17);
            border-radius: 13px;
            border: 1px solid #6DD400;
            font-weight: 600;
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
      .end{
        .task-detail-title{
          color: #B8B8B8;
          text-decoration: line-through;
        }
        .task-detail-executor{ color: #B8B8B8;}
        .task-detail-end-time{ color: #B8B8B8;}
        .task-detail-status{
          color: #B8B8B8;
          &:before{
            background: #B8B8B8;
          }
        }
        .task-item-type{
          background: #B8B8B8;
        }
        .task-approve-status{
          background: #ECECEC;
          font-weight: 600;
          color: #B8B8B8;
          border: 1px solid #B8B8B8;
        }
        .task-detail-handle{
          svg g polyline{
            stroke: #B8B8B8;
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
          &-store{
            label{
              margin-right: 5px;
            }
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
  z-index: 1001;
  svg{
    width: 100%;
    height: 100%;
  }
}
</style>
