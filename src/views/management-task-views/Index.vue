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
      <div v-for="item of taskTypeOption" :key="item.id" :class="{'task-type-item': true, 'active': taskType === item.id}"><span>{{item.name}}</span></div>
    </div>
    <!-- 任务状态栏 -->
    <div class="task-status">
      <van-tabs>
        <van-tab v-for="item in taskStatusOptions" :title= "item.name" :key="item.id"/>
      </van-tabs>
    </div>
    <!-- 任务列表 -->
    <div class="task-list">
      <!-- 排序 -->
      <div class="sort">
        <svg-icon icon-class="sort-up"/>
        <span>开始时间</span>
      </div>
      <!-- 列表 -->
      <div class="list-item">
        <!-- 日期 -->
        <p class="list-item-date">09月10日</p>
        <!-- 任务项 -->
        <div class="task-content">
          <!-- 任务 衔接线 -->
          <div class="task-line">
            <svg-icon icon-class="taskItem"/>
            <i/>
          </div>
          <!-- 任务 详细-->
          <div class="task-detail">
            <!-- 任务 名称-->
            <p class="task-detail-title">德克士(火车站店)</p>
            <!-- 任务 执行人-->
            <p class="task-detail-executor">执行人：张亮亮/张美丽/吴京/马…</p>
            <!-- 任务 截止时间-->
            <p class="task-detail-end-time">10月27日18:00任务截止</p>
            <!-- 任务 状态-->
            <p class="task-detail-status">进行中</p>
            <!-- 任务 类型/审批状态-->
            <div class="task-detail-type">
              <div class="task-item-type">其他任务</div>
              <div class="task-approve-status">审核通过</div>
            </div>
          </div>
        </div>
        <div class="task-content">
          <!-- 任务 衔接线 -->
          <div class="task-line">
            <svg-icon icon-class="taskItem"/>
            <i/>
          </div>
          <!-- 任务 详细-->
          <div class="task-detail">
            <!-- 任务 名称-->
            <p class="task-detail-title">德克士(火车站店)</p>
            <!-- 任务 执行人-->
            <p class="task-detail-executor">执行人：张亮亮/张美丽/吴京/马…</p>
            <!-- 任务 截止时间-->
            <p class="task-detail-end-time">10月27日18:00任务截止</p>
            <!-- 任务 状态-->
            <p class="task-detail-status">进行中</p>
            <!-- 任务 类型/审批状态-->
            <div class="task-detail-type">
              <div class="task-item-type">其他任务</div>
              <div class="task-approve-status">审核通过</div>
            </div>
          </div>
        </div>
        <div class="task-content">
          <!-- 任务 衔接线 -->
          <div class="task-line">
            <svg-icon icon-class="taskItem"/>
            <i/>
          </div>
          <!-- 任务 详细-->
          <div class="task-detail">
            <!-- 任务 名称-->
            <p class="task-detail-title">德克士(火车站店)</p>
            <!-- 任务 执行人-->
            <p class="task-detail-executor">执行人：张亮亮/张美丽/吴京/马…</p>
            <!-- 任务 截止时间-->
            <p class="task-detail-end-time">10月27日18:00任务截止</p>
            <!-- 任务 状态-->
            <p class="task-detail-status">进行中</p>
            <!-- 任务 类型/审批状态-->
            <div class="task-detail-type">
              <div class="task-item-type">其他任务</div>
              <div class="task-approve-status">审核通过</div>
            </div>
          </div>
        </div>
      </div>
      <div class="list-item">
        <!-- 日期 -->
        <p class="list-item-date">09月10日</p>
        <!-- 任务项 -->
        <div class="task-content">
          <!-- 任务 衔接线 -->
          <div class="task-line">
            <svg-icon icon-class="taskItem"/>
            <i/>
          </div>
          <!-- 任务 详细-->
          <div class="task-detail">
            <!-- 任务 名称-->
            <p class="task-detail-title">德克士(火车站店)</p>
            <!-- 任务 执行人-->
            <p class="task-detail-executor">执行人：张亮亮/张美丽/吴京/马…</p>
            <!-- 任务 截止时间-->
            <p class="task-detail-end-time">10月27日18:00任务截止</p>
            <!-- 任务 状态-->
            <p class="task-detail-status">进行中</p>
            <!-- 任务 类型/审批状态-->
            <div class="task-detail-type">
              <div class="task-item-type">其他任务</div>
              <div class="task-approve-status">审核通过</div>
            </div>
          </div>
        </div>
        <div class="task-content">
          <!-- 任务 衔接线 -->
          <div class="task-line">
            <svg-icon icon-class="taskItem"/>
            <i/>
          </div>
          <!-- 任务 详细-->
          <div class="task-detail">
            <!-- 任务 名称-->
            <p class="task-detail-title">德克士(火车站店)</p>
            <!-- 任务 执行人-->
            <p class="task-detail-executor">执行人：张亮亮/张美丽/吴京/马…</p>
            <!-- 任务 截止时间-->
            <p class="task-detail-end-time">10月27日18:00任务截止</p>
            <!-- 任务 状态-->
            <p class="task-detail-status">进行中</p>
            <!-- 任务 类型/审批状态-->
            <div class="task-detail-type">
              <div class="task-item-type">其他任务</div>
              <div class="task-approve-status">审核通过</div>
            </div>
          </div>
        </div>
        <div class="task-content">
          <!-- 任务 衔接线 -->
          <div class="task-line">
            <svg-icon icon-class="taskItem"/>
            <i/>
          </div>
          <!-- 任务 详细-->
          <div class="task-detail">
            <!-- 任务 名称-->
            <p class="task-detail-title">德克士(火车站店)</p>
            <!-- 任务 执行人-->
            <p class="task-detail-executor">执行人：张亮亮/张美丽/吴京/马…</p>
            <!-- 任务 截止时间-->
            <p class="task-detail-end-time">10月27日18:00任务截止</p>
            <!-- 任务 状态-->
            <p class="task-detail-status">进行中</p>
            <!-- 任务 类型/审批状态-->
            <div class="task-detail-type">
              <div class="task-item-type">其他任务</div>
              <div class="task-approve-status">审核通过</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 弹层 任务筛选 -->
    <van-popup v-model="taskFilterShow" position="bottom" :style="{ height: '50%' }" closeable round>
      <p class="popup-title">查看任务筛选</p>
      <!-- 任务筛选  时间-->
      <div class="popup-time">
        <label>任务时间:</label>
        <p>2021-06-22至2021-07-22</p>
      </div>
      <!-- 任务筛选  组织-->
      <div class="popup-organization">
        <label>任务架构:</label>
        <p>督导</p>
      </div>
      <!-- 任务筛选  执行人-->
      <div class="popup-executor">
        <label>执行人:</label>
        <span class="add-icon"><svg-icon icon-class="add"/></span>
      </div>
      <!-- 任务筛选  确认-->
      <div class="confirm-btn">确认筛选</div>
    </van-popup>
  </div>
</template>
<script>
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
      searchKey: '',
      // 任务类型
      taskTypeOption:[
        {
          name: '全部任务',
          id: 'all'
        },
        {
          name: '我的任务',
          id: 'mine'
        },
        {
          name: '下属任务',
          id: 'subordinate'
        }
      ],
      // 默认任务类型
      taskType: 'subordinate',
      // 任务状态
      taskStatusOptions: [
        {
          name: '全部',
          id: 1
        },
        {
          name: '催办',
          id: 2
        },
        {
          name: '已逾期',
          id: 3
        },
        {
          name: '进行中',
          id: 4
        },
        {
          name: '未开始',
          id: 5
        },
        {
          name: '已完成',
          id: 6
        },
        {
          name: '已阅',
          id: 7
        },
        {
          name: '已终止',
          id: 8
        },
        {
          name: '审核中',
          id: 9
        },
        {
          name: '审核中',
          id: 10
        },
        {
          name: '审核失败',
          id: 11
        },
        {
          name: '审核通过',
          id: 11
        }
      ],
      // 任务状态默认值
      taskStatus: '1',
      // 任务筛选 弹层 控制
      taskFilterShow: false
    }
  },
  mounted() {
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
.taskManage-wrap{
  height: 100vh;
  background: #ECF6DF;
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
          height: 99px;
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
        $left: 40px;
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
}
.popup-executor{
  @extend .popup-time;
  .add-icon{
    display: inline-block;
    width: 40px;
    height: 40px;
    margin-left: 25px;
    svg{
      display: inline-block;
      width: 100%;
      height: 100%;
    }
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
</style>
