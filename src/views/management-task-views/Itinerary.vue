<template>
  <!-- 行程日常 -->
  <div class="wrap">
<!--     选择-->
    <div class="nav-choice">
      <!-- 选择 人-->
      <van-field
          v-model="currentExecutor.name"
          is-link
          arrow-direction="down"
          readonly
          @click="openExecutor"
      />
      <!-- 选择 地区  -->
      <van-field
          :value="value"
          is-link
          clickable
          placeholder="请选择"
          arrow-direction="down"
          readonly
          @click="showPicker = true"
      />
    </div>

    <div class="main">
      <div class="calendar">
        <div class="calendar-wrap" style="position:relative">
          <div class="month-year">{{ showYear }}年{{ showMonth + 1 }}月</div>
          <van-icon class="arrow" @click="adMonth" name="arrow"/>
          <van-icon class="arrow-left" @click=" deMonth" name="arrow-left"/>
          <van-calendar class="calendar" ref="calendar"
                        row-height="40" :min-date="minDate"
                        :max-date="maxDate" :default-date="nowDay"
                        :poppable="false" :show-subtitle="false"
                        :show-title="false" :show-mark="false"
                        :show-confirm="false" :formatter="formatterDay" @select="slecetDay">
            <template #bottom-info="item">
              <span class="mark-green" v-if="item.bottomInfo===1"></span>
              <span class="mark-red" v-if="item.bottomInfo===2"></span>
            </template>
          </van-calendar>
        </div>
      </div>
      <div class="line"></div>
      <div class="optain">
        <div class="optain-time">
          <span>{{ MonDay }} {{ Week }}</span>
        </div>
        <!--        v-for 循环-->
        <div v-if="isDate===1">
          <div class="optain-process" v-for="(item,index) in dataTask" :key="index" @click="goTaskDetail(item)" >
            <div>
              <div class="process-time">
                <div>09:00</div>
                <div>18:00</div>
              </div>
            </div>
            <div class="process-task">
              <div class="optain-task">{{item.executeName |ellipsisName(14)}}</div>
              <div>
                <span v-if="item.executeStatus==='进行中'" class="state">进行中</span>
                <span v-else-if="item.executeStatus==='已逾期'" class="stateAct">已逾期</span>
                <span v-else class="notStarted">未开始</span>
                <span class="task" >{{item.workType }}</span>
            </div>
            <van-icon name="arrow" />
          </div>
        </div>
        </div>
        <!-- 无数据展示-->
        <div v-else class="noDate">
          <img :src="noData" alt="">
        </div>
      </div>
    </div>
    <!--头部筛选组件-->
    <organzieAndTime ref="organizeChild" @changeTime="changeTime" @changeExecutor="changeExecutor" :backUrl="backUrl"/>
<!--    组织选择-->
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
          :default-index="0"
          show-toolbar
          value-key="storeName"
          :columns="columns"
          @cancel="showPicker = false"
          @confirm="onConfirm"
      />
    </van-popup>

  </div>
</template>
<script>
import MANAGEMENT_TASK_API from "@api/management_task_api";
import minxinTime from "@/views/statistical-report-views/minxins/organizeTime";
import {mapGetters} from "vuex";

export default {
  name: 'Itinerary',
  subtitle() {
    return '行程日程';
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
  mixins: [minxinTime],
  data() {
    return {
      //日历
      defaultName:JSON.parse(window.sessionStorage.userInfo).userName,
      calendarInfo: [],
      dataTask:'',
      minDate: new Date(),
      maxDate: new Date(),
      defaultDate: new Date(),//日历默认时间标题
      monthCont: 0,//切换月
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      now: '', //当前几号
      nowDay: new Date(),//默认选中日期
      showYear: new Date().getFullYear(),//默认当前年
      showMonth: new Date().getMonth(),//默认当前月
      //所选当前日期
      YearMD: '',//所选当前 年-月-日
      YearM: '',//所选当前 年-月
      Week: '',//所选当前星期
      MonDay: '',//所选当前 月-日
      isDate:1,//是否有数据
      taskState: 2,//逾期2进行1
      workType: 3,//任务类型
      noData: require("/src/assets/img/nodata.png"),
      value:'',//选择门店的名字
      storeNo:'',//所选门店ID
      showPicker: false,
      columns: [],//门店列表
      fieldValue: '张亮亮',//选框默认值
      // 回退地址
      backUrl: '/home'
    }
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
  watch: {
    defaultDate(val) {
      console.log(val)
      this.setMinMaxDay();
    },
    currentExecutor(){
     if(this.currentExecutor.name){
       return
     } else {
       location.reload();
     }
    }
  },
   mounted() {
    this.getCalendar();
    this.getStoreList();//门店列表
    this.slecetDay(new Date())//默认选中日期
    this.getItinerary();//行程日程接口
  },
  computed: {
    ...mapGetters(['userInfo','userId', 'userName'])

  },
  methods: {
    updateData() {
      this.getStoreList()
      this.getItinerary()
    },
    //选择器--门店列表接口
    async getStoreList() {
      let params = {orgId: this.userInfo.orgId, searchStr: ''}
      let result = await MANAGEMENT_TASK_API.getStoreList(params)
      console.log(result.data)
      this.columns= result.data
      // this.storeNo=result.data[0].storeNo
    },
    //行程日程接口
    async getItinerary() {
      // console.log(this.YearMD,this.YearM,this.userInfo.tuid,'--',this.storeNo, this.currentExecutor.id,'------------')
      let params = {date:this.YearMD?this.YearMD:'', month:this.YearM, userNo: this.userInfo.tuid, storeNos:this.storeNo?[this.storeNo]:[], self: '0',userNos:[this.currentExecutor.id]}
      let result = await MANAGEMENT_TASK_API.getItinerary(params)
      console.log(result.data,'数据')
      this.calendarInfo=result.data.calendarInfo
      this.dataTask=result.data.taskList
      console.log(result.data.taskList.length<=0,'数据长度')
      //如果请求的数据为0，则显示空状态占位符
      if (result.data.taskList.length<=0){
        this.isDate=0
        console.log(this.isDate)
      }else {
        this.isDate=1
      }
    },
    //picker-弹出层
    onConfirm(value) {
      this.value = value.storeName;
      this.storeNo=value.storeNo
      this.showPicker = false;
      console.log(value)
      this.getItinerary()
    },
    //加载请求日历初始数据
    getCalendar() {
      let dateLimit = new Date();
      let year = dateLimit.getFullYear();
      let month = dateLimit.getMonth() + 1;
      let d = new Date(year, month, 0);
      let endDate = d.getDate();
      this.minDate = new Date(this.$moment(dateLimit).format('YYYY/MM/') + '01');
      this.maxDate = new Date(this.$moment(dateLimit).format('YYYY/MM/') + endDate);
    },
    //日历格式--日历下的小点点
    formatterDay(day) {
      const yeara = this.$moment(day.date).format("YYYY-MM-DD")
      //当前 年-月-日
      this.now = this.$moment().format("YYYY-MM-DD")
      //条件为当前年某月某日
      if (yeara === this.now) {
        day.text = <div class="nowDay">{this.$moment(this.now).format("DD")}</div>;
      }
      //判断是否有任务或任务类型
      for (let i = 0; i < this.calendarInfo.length; i++) {
        if (yeara == this.calendarInfo[i].date) {
          if (this.calendarInfo[i].hasTask === '2') {
            day.topInfo = <div class="point"></div>;
          } else if (this.calendarInfo[i].hasTask === '1') {
            day.topInfo = <div class="point" style="background:green"></div>;
          }
        }
      }
      return day;
    },
    //选中日后执行
    slecetDay(day) {
      this.getWeeK(day)
      this.getMonDay(day)
      this.Week = this.getWeeK(day)
      // console.log(this.$route.query.userId)
      this.getYearMD(day)
      //选中后请求该天数据
      this.getItinerary()
    },
    //获取年-月-日
    getYearMD(day) {
      this.YearMD = this.$moment(day).format("YYYY-MM-DD")
      this.YearM = this.$moment(day).format('YYYY-MM')
    },
    //获取几月几日
    getMonDay(day) {
      this.MonDay = this.$moment(day).format("MM-DD")
    },
    //获取星期几
    getWeeK(day) {
      let week = this.$moment(day).day()
      switch (week) {
        case 1:
          return "星期一"
        case 2:
          return "星期二"
        case 3:
          return "星期三"
        case 4:
          return "星期四"
        case 5:
          return "星期五"
        case 6:
          return "星期六"
        case 0:
          return "星期日"
      }
    },
    // 当前月上一个月
    deMonth() {
      this.monthCont--;
      this.defaultDate = new Date(
          this.year,
          this.month + this.monthCont,
          1
      );
    },
    // 当前月下一个月
    adMonth() {
      this.monthCont++;
      this.defaultDate = new Date(
          this.year,
          this.month + this.monthCont,
          1
      );
    },
    setMinMaxDay() {
      this.showYear = this.defaultDate.getFullYear();
      this.showMonth = this.defaultDate.getMonth();
      let firstDay = new Date(this.defaultDate);
      firstDay.setDate(1)
      var endDay = new Date(this.showYear, this.showMonth + 1, 1);
      this.minDate = new Date(
          this.showYear,
          this.showMonth,
          firstDay.getDate()
      )
      endDay.setDate(0)
      this.maxDate = new Date(
          this.showYear,
          this.showMonth,
          endDay.getDate()
      )
      this.YearMD='';
      this.YearM=this.showYear+'-'+(this.showMonth+1)
      this.getItinerary();
      console.log(this.YearM,'月月')
    },
    //跳转任务详情
    goTaskDetail(item) {
      const taskType = item.workType
      let url = `executeNo=${item.executeNo}&workNo=${item.workNo}&name=${item.executeName? item.executeName : ''}`
      if(taskType === '其他任务') {
        this.$router.push(`/perform-task/else-task?${url}`)
      }
      if(taskType === '访店任务')  {
        this.$router.push(`/perform-task/visit-store?${url}`)
      }
      if(taskType === '改善任务') {
        this.$router.push(`/perform-task/else-task?${url}`)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
//滚动条样式
.optain::-webkit-scrollbar{
  background-color: #FFFFFF;
}
nav.shop-inspect-nav {
  //background: url("/img/outer/bg.png") no-repeat 0 0;
  background-size: 100% auto;
  border-bottom: 0 none;
  color: #fff;
}

.wrap {
  width: 100%;
  min-height: 800px;
  overflow: hidden;
  background: #0A9B58;
}
//级联选折器
.nav-choice {
  width: 345px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;

  .van-field {
    width: 140px;
    height: 33px;
    background: #FFFFFF;
    margin: 10px 0 10px 0;
    box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.19);
    border-radius: 17px;

    ::v-deep input {
      margin-top: -5px;
    }

    ::v-deep i {
      margin-top: -5px;
      margin-left: 0;
    }
  }
}


//级联选择器--门店
.van-field:nth-child(2) {
  width: 195px;
  height: 33px;
}

//日历上圆点样式
.point {
  width: 5px;
  height: 5px;
  margin: 0 auto;
  background: red;
  border-radius: 50%;
}

.main {
  width: 345px;
  padding-bottom: 40px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.19);
  border-radius: 10px;
  background-color: #fff;
  //分割线
  .line {
    width: 319px;
    height: 1px;
    margin: 10px auto;
    border-top: 1px solid gainsboro;
  }

  //底部任务
  .optain {
    width: 319px;
    max-height:230px;
    margin: 0 auto;
    overflow:auto;
    //无数据img
    .noDate {
      width: 203px;
      height: 121px;
      margin: 40px auto;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .optain-time {
      text-align: left;
      margin-top: 10px;
      font-size: 16px;
      font-weight: 600;
      color: #424242;
    }

    .optain-process {
      margin-top: 19px;
      text-align: left;
      overflow: hidden;
      position: relative;

      .process-time {
        float: left;

        div {
          font-size: 12px;
          font-weight: 400;
          color: #868686;
        }

        :nth-child(2) {
          margin-top: 15px;
        }
      }

      .process-task {
        float: left;
        margin-left: 5px;
        padding-left: 5px;
        padding-bottom: 5px;
        border-radius: 1px;
        border-left: 3px solid #0A9B58;

        .optain-task {
          margin-bottom: 5px;
          font-size: 15px;
          font-weight: 600;
          color: #333333;
        }

        .task {
          margin-left: 9px;
          font-size: 12px;
          font-weight: 600;
          color: #0A9B58;
        }

        //进行中--样式
        .state {
          background: #E7F8D4;
          border-radius: 4px;
          padding: 2px;
          border: 1px solid #6DD400;
          font-size: 11px;
          font-weight: 500;
          color: #6DD400;
        }

        //已逾期--样式
        .stateAct {
          background: rgba(250, 100, 0, 0.2);
          border-radius: 4px;
          padding: 2px;
          border: 1px solid #FA6400;
          font-size: 11px;
          font-weight: 500;
          color: #FA6400;
        }
        //未开始样式
        .notStarted {
          background: rgba(247, 181, 0, 0.11);
          border-radius: 4px;
          padding: 2px;
          border: 1px solid #F7B500;
          font-size: 11px;
          font-weight: 500;
          color: #F7B500;
        }
      }

      //任务栏右箭头
      .van-icon {
        top: 15px;
        right: 10px;
        position: absolute;
      }
    }
  }
}

//日历样式
.calendar-wrap::v-deep {
  width: 100%;
  position: relative;

  .van-calendar__header {
    box-shadow: none !important;
  }

  .van-calendar__month-title {
    display: none;
  }

  .van-calendar__selected-day {
    border-radius: 50%;
    background: #F7B500;
  }

  //点的位置
  .van-calendar__top-info {
    top: 30px;
  }

  .mark-red {
    display: block;
    width: 5px;
    height: 5px;
    background-color: #d46b08;
    border-radius: 50%;
    margin: 0 auto;
  }

  .mark-green {
    display: block;
    width: 5px;
    height: 5px;
    background-color: #389e0d;
    border-radius: 50%;
    margin: 0 auto;
  }

  .month-year {
    padding: 10px 0;
    text-align: center;
    font-size: 14px;
  }

  //日历--当前年月标题
  .month-year {
    font-size: 20px !important;
    font-weight: 600;
    color: #333333;
  }

  //日历--当前年月标题-右箭头
  .arrow {
    position: absolute;
    top: 18px;
    right: 100px;
    color: #0A9B58;
  }

  //日历--当前年月标题--左箭头
  .arrow-left {
    position: absolute;
    top: 18px;
    left: 100px;
    color: #0A9B58;
  }

  //.arrow-year {
  //  position: absolute;
  //  top: 15px;
  //  right: 30px;
  //}

  //.arrow-left-year {
  //  position: absolute;
  //  top: 15px;
  //  left: 30px;
  //}

  //.arrow-year-1 {
  //  position: absolute;
  //  top: 15px;
  //  right: 35px;
  //}
  //
  //.arrow-left-year-1 {
  //  position: absolute;
  //  top: 15px;
  //  left: 35px;
  //}

  //当前日-样式
  .nowDay {
    width: 38px;
    height: 38px;
    line-height: 38px;
    border-radius: 50%;
    background: rgba(247, 181, 0, 0.23);
  }

  //日历head样式
  .van-calendar::v-deep.van-calendar__header {
    box-shadow: none !important;
  }
}
</style>
