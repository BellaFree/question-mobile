<template>
  <div class="wrap">
    <div class="main">
      <div class="title">2020-02-11 · 事业一部</div>
      <el-table
          :default-sort = "{prop: 'per', order: 'ascending'}"
          :header-cell-style="headClass"
          :data="tableData"
          border
          style="width: 100%"
      >
        <el-table-column
            prop="name"
            label="执行人"
            align="center"
            width="90">
        </el-table-column>
        <el-table-column
            label="计划任务/完成任务"
            width="160">
          <el-table-column align="center" label="完成率"  prop="per" sortable :formatter="formatter">
            <template slot-scope="scope">
              <span class="plan">{{ scope.row.a }}</span>/<span class="act">{{ scope.row.b }}</span>
              <el-progress  width="84" :stroke-width="9" :percentage="scope.row.per"></el-progress>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
            prop="address"
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
export default {
  name: 'StatisticalReport',
  subtitle() {
    return '事业一部';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    window.history.go(-1);
  },
  data() {
    return {
      //表头样式
      headClass() {
        return 'background: #F0F5E2;font-size: 13px;font-weight: 500;color: #333333;padding:0'
      },
      tableData: [{
        a: '56',
        b: '54',
        per: 90,
        name: '梦浓',
        address: '32h10min',
      }, {
        a: '56',
        b: '54',
        per: 80,
        name: '长风',
        address: '32h30min'
      },
        {
          a: '56',
          b: '54',
          per: 10,
          name: '长风',
          address: '34h30min'
        },{
        a: '56',
        b: '54',
        per: 70,
        name: '昭仪',
        address: '32h50min'
      }]

    }
  }
}
</script>
<style lang="scss" scoped>
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
    box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.13);
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
    ::v-deep.el-progress-bar{
      padding-right:30px;
    }
    //进度条 百分比文字
    ::v-deep.el-progress__text{
      margin-left: 30px;
      position: relative;
      font-size: 10px!important;
    }
  }
  //进度条背景色
  ::v-deep .el-progress-bar__inner {
    background: #8DB71C ;
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