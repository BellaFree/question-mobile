<template>
  <div class="wrap">
    <div class="main">
      <div class="title">{{workTime}}·{{ orgName }}</div>
      <el-table
          :default-sort="{prop: 'schedule', order: 'ascending'}"
          :header-cell-style="headClass"
          :data="tableData"
          border
          style="width: 100%"
      >
        <el-table-column
            prop="nickName"
            label="执行人"
            align="center"
            width="90">
        </el-table-column>
        <el-table-column
            label="计划任务/完成任务"
            width="160">
          <el-table-column align="center" label="完成率" prop="schedule" sortable :formatter="formatter">
            <template slot-scope="scope">
              <span class="plan">{{ scope.row.planTask}}</span>/<span class="act">{{ scope.row.reportTask }}</span>
              <el-progress width="84" :stroke-width="9" :percentage="scope.row.schedule"></el-progress>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
            prop="times"
            label="到店时长"
            sortable
            width="100"
            align="center"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import STATISTICAL_REPORT_API from '@api/statistical_report_api'

export default {
  name: 'StatisticalReport',
  subtitle() {
      return ''

  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    window.history.go(-1);
  },
  navClass(){
    return 'shop-inspect-nav'
  },
  data() {
    return {
      //表头样式
      headClass() {
        return 'background: #F0F5E2;font-size: 13px;font-weight: 500;color: #333333;padding:0'
      },
      tableData: [],
      orgName:'',
      workTime:'',

    }
  },
  mounted() {
    this.getDivisionDetail();//获取数据
    this.getTitle();//获取页面标题
  },
  methods: {
    async getDivisionDetail() {
      //请求接口
      let params = {org_id:this.$route.query.orgId,report_time:this.$route.query.workTime}
      let result = await STATISTICAL_REPORT_API.getDivisionDetail(params)
      console.log(result.data)
      this.tableData=result.data
    },
    //页面标题
    getTitle(){
      //标题
      this.orgName=this.$route.query.orgName;
      this.workTime=this.$route.query.workTime;
      this.$notice.$emit('navigation', { title: this.orgName });

    }
  }
}
</script>
<style lang="scss" scoped>
nav.shop-inspect-nav{
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
    //标题样式
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

//表格内样式
.el-table {
  //进度条 lable
  .progress-lable {
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    text-align: left;
  }

  //进度条
  .el-progress {
    margin-top: 5px;
    //调整进度条宽度
    ::v-deep.el-progress-bar {
      padding-right: 35px;
    }

    //进度条 百分比文字
    ::v-deep.el-progress__text {
      margin-left: 24px;
      position: relative;
      font-size: 10px !important;
    }
  }

  //进度条背景色
  ::v-deep .el-progress-bar__inner {
    background: #8DB71C;
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