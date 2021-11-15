<template>
  <div class="wrap">
    <!--  tab切换-->
    <div class="tab">
      <van-tabs @click="onClick" background="#F5F5F5">
        <van-tab title="组织架构">
          <div class="choice" @click="show = true">
            <div class="label">筛选组织架构可到人</div>
            <div class="choice-word">{{ fieldValue }}
              <van-icon name="arrow"/>
            </div>
          </div>
          <div class="choice">
            <div class="label">选择报表时间节点</div>
            <div class="choice-word">
              {{ startTime }}至{{endTime}}
              <van-icon name="arrow"/>
            </div>
          </div>
          <button class="query" @click="queryOrganization">查询</button>
        </van-tab>
        <van-tab title="门店餐厅">
          <div class="choice">
            <div class="label">选择门店区域</div>
            <div class="choice-word">上海市-静安区
              <van-icon name="arrow"/>
            </div>
          </div>
          <div class="choice">
            <div class="label">选择报表时间节点</div>
            <div class="choice-word">
              {{ startTime }}至{{endTime}}
              <van-icon name="arrow"/>
            </div>
          </div>
          <div class="query">查询</div>
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
            width="71">
        </el-table-column>
        <el-table-column
            prop="orgName"
            :label="tab===0?'组织架构':'门店餐厅'"
            align="center"
            width="73">
          <template slot-scope="scope">
            <u  @click="goDivisionDetail">{{ scope.row.orgName}}</u>
          </template>

        </el-table-column>
        <el-table-column
            prop="data"
            label="计划任务/完成任务"
            align="center"
            width="160">
          <el-table-column align="center" label="完成率">
            <template slot-scope="scope">
              <span class="plan">{{ scope.row.planTask}}</span>/<span class="act">{{ scope.row.reportTask }}</span>
              <el-progress :stroke-width="9" :percentage="scope.row.schedule"></el-progress>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
            prop="times"
            label="到店时长"
            width="74"
            align="center"
        >
        </el-table-column>
      </el-table>

    </div>
    <!--  级联弹出层-->
    <van-popup v-model="show" round position="bottom">
      <van-cascader
          v-model="cascaderValue"
          title="请选择所在地区"
          :options="options"
          @close="show = false"
          @finish="onFinish"
      />
    </van-popup>
  </div>
</template>
<script>

export default {
  name: 'StatisticalReport',
  subtitle() {
    return '统计报表';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    window.history.go(-1);
  },
  data() {
    return {
      show: false,
      fieldValue: '事业部',
      cascaderValue: '',
      //表头样式
      headClass() {
        return 'background: #F0F5E2;font-size: 13px;font-weight: 500;color: #333333;padding:0'
      },
      //0报表显示组织架构，1显示门店餐厅
      tab: 0,
      startTime:'',
      endTime:'',
      // 选项列表，children 代表子选项，支持多级嵌套
      options: [
        {text: '浙江省',value: '330000', children: [{text: '杭州市', value: '330100'}]},
        {text: '江苏省',value: '320000',children: [{text: '南京市', value: '320100'}]},
      ],

  //     [
  //         {a: '56', b: '54', per: 90, name: '梦浓', address: '32h10min'},
  //   {a: '56', b: '54',per: 80,name: '长风',address: '32h30min'},
  //   {a: '56',b: '54',per: 70,name: '昭仪',address: '32h50min'}
  // ]
      tableData:

             [
              {
                "workTime": "2021-11-04",
                "orgId": null,
                "orgName": 123,
                "storeNo": "S001",
                "storeName": "ybtfl_test_门店",
                "userId": null,
                "nickName": null,
                "planTask": "1",
                "reportTask": "1",
                "schedule": 100,
                "times": "30min"
              },
              {
                "workTime": "2021-11-04",
                "orgId": null,
                "orgName": 123,
                "storeNo": "S001",
                "storeName": "ybtfl_test_门店",
                "userId": null,
                "nickName": null,
                "planTask": "1",
                "reportTask": "1",
                "schedule": 90,
                "times": "30min"
              },
               {
                 "workTime": "2021-11-05",
                 "orgId": null,
                 "orgName": 123,
                 "storeNo": "S001",
                 "storeName": "ybtfl_test_门店",
                 "userId": null,
                 "nickName": null,
                 "planTask": "1",
                 "reportTask": "1",
                 "schedule": 80,
                 "times": "30min"
               },
               {
                 "workTime": "2021-11-06",
                 "orgId": null,
                 "orgName": 123,
                 "storeNo": "S001",
                 "storeName": "ybtfl_test_门店",
                 "userId": null,
                 "nickName": null,
                 "planTask": "1",
                 "reportTask": "1",
                 "schedule": 70,
                 "times": "30min"
               },
               {
                 "workTime": "2021-11-06",
                 "orgId": null,
                 "orgName": 123,
                 "storeNo": "S001",
                 "storeName": "ybtfl_test_门店",
                 "userId": null,
                 "nickName": null,
                 "planTask": "1",
                 "reportTask": "1",
                 "schedule": 60,
                 "times": "30min"
               },
               {
                 "workTime": "2021-11-07",
                 "orgId": null,
                 "orgName": 123,
                 "storeNo": "S001",
                 "storeName": "ybtfl_test_门店",
                 "userId": null,
                 "nickName": null,
                 "planTask": "1",
                 "reportTask": "1",
                 "schedule": 50,
                 "times": "30min"
               },


            ]

    }
  },
  mounted() {
    this.getTime()
  },
  methods: {
    //tab点击切换触发
    onClick(name, title) {
      this.tab = name
      console.log(name)
      console.log(title)
    },
    onFinish({selectedOptions}) {
      this.show = false;
      this.fieldValue = selectedOptions.map((option) => option.text).join('/');
    },
    //查询
    queryOrganization() {

    },
    //获取默认当前年月日
    getTime() {
      const startDate= this.$moment().month(this.$moment().month()).startOf('month').valueOf()
      const endDate =this.$moment().month(this.$moment().month()).endOf('month').valueOf();
      this.startTime= this.$moment(startDate).format('YYYY-MM-DD')
      this.endTime= this.$moment(endDate).format('YYYY-MM-DD')
      console.log( this.endTime)
    },
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log( row, column, rowIndex, columnIndex )
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
    goDivisionDetail(){
      //当为组织架构时跳转
      if(this.tab===0){
        this.$router.push('DivisionDetail')
      }
    }


  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  overflow: hidden;
  background: #0A9B58;

  .tab {
    margin: 8px 74px 8px 8px;
    box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.05);
  }

  //tab组件样式
  .van-tabs {
    ::v-deep .van-tabs__wrap {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    ::v-deep.van-tabs__line{
      top:25px;
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
    width: 293px;
    height: 445px;
    overflow: hidden;
    margin-left: 8px;
    background: #FFFFFF;
    box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.13);
    border-radius: 8px;

    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #424242;
      margin: 10px auto;
    }

    ::v-deep.el-table {
      width: 348px !important;
      height: 390px !important;
      left: 20px;
      position: absolute;


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
          padding-right: 30px;
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