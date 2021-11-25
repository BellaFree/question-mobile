<template>
  <div class="workbench_wrapper">
    <div class="workbench_wrapper_items">
      <div class="workbench_wrapper_item"
        v-for="workbench in workbenchList" :key="workbench.name"
        @click="handleWorkbench(workbench)">
        <van-image class="workbench_wrapper_item_image" width="36" height="36" :src="workbench.icon" />
        <div class="workbench_wrapper_item_info">
          <div class="workbench_wrapper_item_info_name">{{workbench.name}}</div>
          <div class="workbench_wrapper_item_info_description">{{workbench.description}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Utils from '../../utils/utilsTask';
import iconTask from '@/../public/img/workbench/icon_task.png';
import iconVisit from '@/../public/img/workbench/icon_visit.png';
import iconStatistics from '@/../public/img/workbench/icon_statistics.png';
import iconApprove from '@/../public/img/workbench/icon_approve.png';
export default {
  name: 'WorkbenchIndex',
  subtitle() {
    return '工作台';
  },
  leftIcon() {
    return '';
  },
  onLeft() {
    window.location.href = 'http://103.13.247.70:8091/gisApp/page/home/home.html?timestamp=' + new Date().getTime();
  },
  data() {
    return {
      workbenchList: [
        {
          icon: iconTask,
          name:'任务管理',
          description: '我的所有任务管理',
          path: '/management-task/index',
        },
        {
          icon: iconVisit,
          name:'访店记录',
          description: '访店记录统计列表',
          path: '/statistical-report/visit-record',
        },
        {
          icon: iconStatistics,
          name:'统计报表',
          description: '工作任务统计详情',
          path: '/statistical-report/statistical-report',
        },
        {
          icon: iconApprove,
          name:'审批列表',
          description: '任务审批列表管理',
          path: '/task-Approval/ApproveList',
        },
      ]
    };
  },
  mounted() {
  },
  methods: {
    handleWorkbench(data) {
      let { path } = data;
      this.$router.push({ path });
    }
  }
};
</script>
<style lang="scss" scoped>
$mainColor: #0A9B58;
.workbench_wrapper {
  padding-top: 50px;
  height: calc(100vh - 50px);
  background: $mainColor;
  .workbench_wrapper_items {
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .workbench_wrapper_item {
      display: flex;
      align-items: center;
      margin-right: 10px;
      margin-bottom: 10px;
      width: 168px;
      height: 77px;
      background: #fff;
      border-radius: 5px;
      box-shadow: 0px 2px 5px 2px rgba(0,0,0,0.13);
      box-sizing: border-box;
      &:nth-child(even) {
        margin-right: 0;
      }
      .workbench_wrapper_item_image {
        margin: 0 10px;
      }
      .workbench_wrapper_item_info {
        text-align: left;
        .workbench_wrapper_item_info_name {
          color: #333;
          font-size: 15px;
          font-weight: bold;
        }
        .workbench_wrapper_item_info_description {
          color: #0A9B58;
          font-size: 10px;
        }
      }
    }
  }
}
</style>
