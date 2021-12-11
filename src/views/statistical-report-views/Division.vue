<template>
  <div class="wrap">
    <div class="main">
      <div class="title">本月任务进度 · {{ this.userInfo.orgname }}</div>
      <el-table
          :header-cell-style="headClass"
          :default-sort = "{prop: '', order: ''}"
          @sort-change="handleSortChange"
          :data="tableData"
          border
          @cell-click="goManageTask"
          style="width: 100%"
      >
        <el-table-column
            prop="nickName"
            label="执行人"
            align="center"
            width="90">
        </el-table-column>
        <el-table-column
            prop="data"
            label="计划任务/完成任务"
            align="center"
            width="140">
          <template slot-scope="scope">
            <span class="plan">{{ scope.row.planTask }}</span>/<span class="act">{{ scope.row.reportTask }}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="schedule"
            label="完成进度"
            sortable
            align="center"
        >
          <template slot-scope="scope">
            <div class="progress-lable">{{ scope.row.schedule }}%</div>
            <el-progress :show-text="false" :stroke-width="9" :percentage="scope.row.schedule"></el-progress>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import STATISTICAL_REPORT_API from '@api/statistical_report_api'
import {mapGetters} from "vuex";

export default {
  name: 'Division',
  subtitle() {
    return `${this.userInfo.orgname}`;
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    window.history.go(-1);
  },
  navClass() {
    return 'shop-inspect-nav'
  },
  data() {
    return {
      //表头样式
      headClass() {
        return 'background: #F0F5E2;font-size: 13px;\n' + 'font-weight: 500;\n' + 'color: #333333;'
      },
      tableData: [],
      sort:'1',
    }
  },
  mounted() {
    //接口
    this.getDivision();
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    //接口
    async getDivision() {
      console.log(this.userInfo.tuid, this.userInfo.orgname)
      let params = {work_user_no: this.userInfo.tuid,sort:this.sort}
      let result = await STATISTICAL_REPORT_API.getDivision(params)
      console.log(result.data.reportLists)
      this.tableData = result.data.reportLists
    },
    //排序
    handleSortChange(){
      this.sort='0';
      alert('dsa')
      this.getDivision();
    },
    //跳转至 任务管理
    goManageTask(row) {
      this.$router.push({path: '/management-task/index', query: {userId:row.userId, userName: row.nickName}})
    }
  }

}
</script>
<style lang="scss" scoped>
nav.shop-inspect-nav {
  //background: url("/img/outer/bg.png") no-repeat 0 0;
  background-size: 100% auto;
  border-bottom: 0 none;
  color: #fff;
}

.wrap {
  width: 100%;
  background: #0A9B58;
  overflow: hidden;

  .main {
    width: 355px;
    min-height: 720px;
    overflow: hidden;
    margin: 10px auto;
    border-radius: 10px;
    background: #FFFFFF;
    box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.13);

    .title {
      font-size: 17px;
      margin: 15px auto;
      font-weight: 600;
      color: #424242;
    }

    ::v-deep.el-table {
      width: 328px !important;
      margin: 0 auto;
    }
  }
}

.el-table {
  //进度条 lable
  .progress-lable {
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    text-align: left;
  }

  //进度条背景色
  ::v-deep .el-progress-bar__inner {
    background: linear-gradient(270deg, #7ACC2C 0%, #0A9B58 100%);
  }

  //计划任务、完成任务数据
  .plan, .act {
    font-size: 14px;
    font-weight: 600;
    color: #F7B500;
  }

  .act {
    color: #0A9B58;
  }
}

</style>
