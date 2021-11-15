<template>
  <div class="wrap">
    <div class="main">
    <div class="title">本月任务进度 · 事业部</div>
      <el-table
          :header-cell-style="headClass"
          :data="tableData"
          border
          style="width: 100%"
          :default-sort = "{prop: 'a', order: 'descending'}"
      >
        <el-table-column
            prop="name"
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
            <span class="plan">{{scope.row.a}}</span>/<span class="act">{{scope.row.b}}</span>
          </template>
        </el-table-column>
        <el-table-column
            prop="address"
            label="完成进度"
            sortable
            align="center"
            :formatter="formatter">
          <template slot-scope="scope">
            <div class="progress-lable">{{scope.row.address}}%</div>
            <el-progress :show-text="false" :stroke-width="9" :percentage="scope.row.address"></el-progress>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Division',
  subtitle() {
    return '事业部';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    window.history.go(-1);
  },
  data(){
    return{
      //表头样式
      headClass(){
      return 'background: #F0F5E2;font-size: 13px;\n' + 'font-weight: 500;\n' +'color: #333333;'
      },
      tableData: [{
        a: '56',
        b:'54',
        name: '王小虎',
        address: 100,
      }, {
        a: '56',
        b:'54',
        name: '王小虎',
        address: '90'
      }, {
        a: '56',
        b:'54',
        name: '王小虎',
        address: '80'
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
   min-height:720px;
   overflow: hidden;
   margin: 10px auto;
   border-radius: 10px;
   background: #FFFFFF;
   box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.13);

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
.el-table{
  //进度条 lable
  .progress-lable{
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    text-align: left;
  }
  //进度条背景色
  ::v-deep .el-progress-bar__inner{
    background:linear-gradient(270deg, #7ACC2C 0%, #0A9B58 100%) ;
  }
  //计划任务、完成任务数据
  .plan,.act{
    font-size: 14px;
    font-weight: 600;
    color: #F7B500;
  }
  .act{
    color: #0A9B58 ;
  }
}

</style>