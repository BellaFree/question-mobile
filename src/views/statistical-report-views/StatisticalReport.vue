<template>
  <div class="wrap">
    <!--  tab切换-->
    <div class="tab">
      <van-tabs @click="onClick" background="#F5F5F5">
        <van-tab title="组织架构">
          <div class="choice" @click="openExecutor">
            <div class="label">筛选组织架构可到人</div>
            <div class="choice-word">{{ currentExecutor && currentExecutor.name }}
              <van-icon name="arrow"/>
            </div>
          </div>
          <div class="choice" @click="openTimePopup">
            <div class="label">选择报表时间节点</div>
            <div class="choice-word">
              {{ currentDate.startTime }}至{{ currentDate.endTime }}
              <van-icon name="arrow"/>
            </div>
          </div>
          <button class="query" @click="queryOrganization">查询</button>
        </van-tab>
        <van-tab title="门店餐厅">
          <div class="choice" @click="showPicker = true">
            <div class="label">选择门店区域</div>
            <div class="choice-word">{{ value }}
              <van-icon name="arrow"/>
            </div>
          </div>
          <div class="choice" @click="openTimePopup">
            <div class="label">选择报表时间节点</div>
            <div class="choice-word">
              {{ currentDate.startTime }}至{{ currentDate.endTime }}
              <van-icon name="arrow"/>
            </div>
          </div>
          <button class="query" @click="queryOrganization">查询</button>
        </van-tab>
      </van-tabs>
    </div>
    <!--报表明细-->
    <div class="report">
      <h3>报表明细</h3>
      <el-table
          :span-method="objectSpanMethod"
          :header-cell-style="headClass"
          :data="tableData"
          border
          height="250"
          style="width: 100%"
      >
        <el-table-column
            prop="workTime"
            label="时间"
            sortable
            align="center"
            width="90">
        </el-table-column>
        <el-table-column
            :prop="tab===0?'orgName':'storeName'"
            :label="tab===0?'组织架构':'门店餐厅'"
            align="center"
            width="93">
          <template slot-scope="scope">
            <u @click="goDivisionDetail(scope.row)">{{ scope.row.orgName || scope.row.storeName }}</u>
          </template>

        </el-table-column>
        <el-table-column
            prop="data"
            label="计划任务/完成任务"
            align="center"
            width="160">
          <el-table-column align="center" label="完成率" width="160">
            <template slot-scope="scope">
              <span class="plan">{{ scope.row.planTask }}</span>/<span class="act">{{ scope.row.reportTask }}</span>
              <el-progress :stroke-width="9" :percentage="scope.row.schedule"></el-progress>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
            prop="times"
            label="到店时长"
            width="84"
            align="center"
        >
        </el-table-column>
      </el-table>

    </div>
    <!--头部筛选组件-->
    <organzieAndTime ref="organizeChild" @changeTime="changeTime" @changeExecutor="changeExecutor" :backUrl="backUrl"/>
    <!--组织选择  -->
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
          :default-index="0"
          show-toolbar
          :columns="columns"
          value-key="storeName"
          @cancel="showPicker = false"
          @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
import STATISTICAL_REPORT_API from '@api/statistical_report_api'
import organizeTime from "@/views/statistical-report-views/minxins/organizeTime";
import {mapGetters} from "vuex";

export default {
  name: 'StatisticalReport',
  subtitle() {
    return '统计报表';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    return this.onClickLeft()
  },
  navClass() {
    return 'shop-inspect-nav'
  },
  mixins: [organizeTime],
  data() {
    return {
      //选择器
      value:'',
      showPicker: false,
      columns: [],
      storeNo:'',
      //表头样式
      headClass() {
        return 'background: #F0F5E2;font-size: 13px;font-weight: 500;color: #333333;padding:0'
      },
      //0报表显示组织架构，1显示门店餐厅
      tab: 0,
      tableData: [],
      // 回退地址
      backUrl: '/workbench'
    }
  },
  mounted() {
    // this.getTime();默认当前年月日
    this.getStoreList();//获取门店列表
    this.getStatisticalReport();//获取组织架构/门店餐厅默认数据
  },
  computed: {
    ...mapGetters(['userInfo', 'userId', 'userName'])
  },
  methods: {
    updateData() {
      this.queryOrganization()
    },
    //获取组织架构默认数据
    async getStatisticalReport( storeNo ) {
      console.log(storeNo)
      let params = {
        start_date: this.currentDate.startTime,
        end_date: this.currentDate.endTime,
        org_id: this.userInfo.orgId,
        tab_type: this.tab,
        store_id:storeNo
      }
      let result = await STATISTICAL_REPORT_API.getStatisticalReport(params)
      console.log(result.data,'组织架构默认数据')
      this.tableData = result.data
    },
    //获取门店列表
    async getStoreList() {
      let params = {orgId:this.userInfo.orgId, searchStr: ''}
      let result = await STATISTICAL_REPORT_API.getStoreList(params)
      this.columns = result.data
      this.value= result.data && result.data.length > 0 ? result.data[0].storeName : ''
    },
    //picker-弹出层
    onConfirm(value) {
      this.value = value.storeName;
      this.storeNo=value.storeNo
      console.log(value.storeNo)
      this.showPicker = false;
    },
    //tab点击切换触发
    onClick(name) {
      this.tab = name
      //切换tab时若为门店餐厅则发送请求
      if (this.tab===1){
        this.getStatisticalReport(this.columns[0].storeNo)
      }else{
        this.getStatisticalReport()
      }
    },
    //查询
    queryOrganization() {
      //0组织架构否则附带门店id参数
      if (this.tab===0){
        this.getStatisticalReport()
      }else{
        this.getStatisticalReport(this.storeNo)
      }
    },
    //获取默认当前年月日
    // getTime() {
    //   const startDate = this.$moment().month(this.$moment().month()).startOf('month').valueOf()
    //   const endDate = this.$moment().month(this.$moment().month()).endOf('month').valueOf();
    //   this.startTime = this.$moment(startDate).format('YYYY-MM-DD')
    //   this.endTime = this.$moment(endDate).format('YYYY-MM-DD')
    // },
    //表格行合并
    getTableData() {
      let spanOneArr = [],
          spanTwoArr = [],
          concatOne = 0
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
          spanTwoArr.push(1);
        } else {
          if (item.workTime === this.tableData[index - 1].workTime) { //第一列需合并相同内容的判断条件
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }
        }
      });
      return {
        one: spanOneArr,
        two: spanTwoArr
      }
    },
    //el自带行合并函数
    objectSpanMethod({row, column, rowIndex, columnIndex}) {
      console.log(column, row)
      if (columnIndex === 0) {
        const _row = (this.getTableData(this.JZPFData).one)[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    //跳转报表详情页
    goDivisionDetail(row) {
      console.log(row.workTime, row.orgName)
      //当为组织架构时跳转
      this.$router.push({
        path: 'DivisionDetail',
        query: {workTime: row.workTime, orgName: row.orgName, orgId: row.orgId}
      })
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
  overflow: hidden;
  background: #0A9B58;

  .tab {
    //margin: 8px 74px 8px 8px;
    width: 355px;
    margin: 8px auto;
    box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.05);
  }

  //tab组件样式
  .van-tabs {
    ::v-deep .van-tabs__wrap {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    ::v-deep.van-tabs__line {
      top: 25px;
      width: 56px;
      height: 7px;
      background: linear-gradient(270deg, rgba(200, 223, 64, 0.6) 0%, #0A9B58 100%);
      border-radius: 3px;
    }

    ::v-deep.van-tab--active {
      background: #FFFFFF;
    }

    .van-tab__pane {
      background: #FFFFFF;
      padding-bottom: 1px;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    //选择div样式
    .choice {
      width: 269px;
      height: 43px;
      margin: 0 auto;
      padding-top: 5px;
      border-bottom: 1px solid #D8D7D7;

      .label {
        text-align: left;
        font-size: 10px;
        font-weight: 400;
        color: #80807F;
      }

      .choice-word {
        text-align: left;
        font-size: 14px;
        font-weight: 600;
        color: #424242;
      }

      .van-icon {
        float: right;
        right: 20px;
        width: 6px;
        height: 11px;
      }
    }

    //查询按钮
    .query {
      width: 269px;
      height: 33px;
      margin: 10px auto;
      line-height: 33px;
      border-radius: 18px;
      font-size: 13px;
      font-weight: 600;
      color: #FFFFFF;
      background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
    }
  }

  //报表明显
  .report {
    width: 355px;
    margin: 0 auto;
    overflow: hidden;
    background: #FFFFFF;
    box-shadow: 0 2px 4px 2px rgba(0, 0, 0, 0.13);
    border-radius: 8px;

    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #424242;
      margin: 10px auto;
    }

    ::v-deep.el-table {
      min-height: 558px !important;

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
        text-align: left;
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
  }
}
</style>
