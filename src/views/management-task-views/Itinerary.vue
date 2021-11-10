<template>
  <!-- 行程日常 -->
  <div class="wrap">

<!-- 选择 人-->
    <van-field
        v-model="fieldValue"
        is-link
        arrow-direction="down"
        readonly
        @click="show = true"
    />
<!-- 选择 地区  -->
    <van-field
        v-model="fieldValueOne"
        is-link
        arrow-direction="down"
        readonly
        @click="showOne = true"
    />
    <div class="main">
      <div class="calendar">
        <div class="calendar-wrap" style="positon:relative">
          <div class="month-year">{{ showYear }}年{{ showMonth + 1 }}月</div>
          <van-icon class="arrow" @click="adMonth" name="arrow"/>
          <van-icon class="arrow-left" @click=" deMonth" name="arrow-left"/>
<!--          <van-icon class="arrow-year" @click="deYear" name="arrow"/>-->
<!--          <van-icon class="arrow-year-1" @click="deYear" name="arrow"/>-->
<!--          <van-icon class="arrow-left-year-1" @click="adYear" name="arrow-left"/>-->
<!--          <van-icon class="arrow-left-year" @click="adYear" name="arrow-left"/>-->
          <van-calendar class="calendar" ref="calendar"
                        row-height="40" :min-date="minDate"
                        :max-date="maxDate" :default-date="nowDay"
                        :poppable="false" :show-subtitle="false"
                        :show-title="false" :show-mark="false"
                        :show-confirm="false" :formatter="formatterDay" @select="slecetDay"
          >
            <template #bottom-info="item">
              <span class="mark-green" v-if="item.bottomInfo==1"></span>
              <span class="mark-red" v-if="item.bottomInfo==2"></span>
            </template>
          </van-calendar>
        </div>
      </div>
      <div class="line"></div>
      <div class="optain">
        <div class="optain-time"><span>{{MonDay}} {{Week}}</span></div>
<!--        v-for 循环-->
        <div v-if="isDate===1">
          <div class="optain-process">
            <div>
              <div class="process-time">
                <div>09:00</div>
                <div>18:00</div>
              </div>
            </div>
            <div class="process-task">
              <div class="optain-task">德克士(火车站店)访店任务</div>
              <div><span v-if="taskState===1" class="state">进行中</span><span v-else class="stateAct">已逾期</span><span class="task">访店任务</span></div>
            </div>
            <van-icon name="arrow" @click="goTaskDetail" />
          </div>

          <div class="optain-process">
            <div>
              <div class="process-time">
                <div>09:00</div>
                <div>18:00</div>
              </div>
            </div>
            <div class="process-task">
              <div class="optain-task">德克士(火车站店)访店任务</div>
              <div><span class="state">进行中</span><span class="task">访店任务</span></div>
            </div>
            <van-icon name="arrow"/>
          </div>

          <div class="optain-process">
            <div>
              <div class="process-time">
                <div>09:00</div>
                <div>18:00</div>
              </div>
            </div>
            <div class="process-task">
              <div class="optain-task">德克士(火车站店)访店任务</div>
              <div><span class="state">进行中</span><span class="task">访店任务</span></div>
            </div>
            <van-icon name="arrow"/>
          </div>

        </div>
        <!-- 无数据展示-->
        <div v-else class="noDate">
            <img :src="noData" alt="">
        </div>
      </div>

    </div>
<!--级联选择器-->
    <van-popup v-model="show" round position="bottom">
      <van-cascader
          v-model="cascaderValue"
          title="请选择"
          :options="options"
          @close="show = false"
          @finish="onFinish"
      />
    </van-popup>
<!-- 门店-->
    <van-popup v-model="showOne" round position="bottom">
      <van-cascader
          v-model="cascaderValue"
          title="请选择"
          :options="options"
          @close="showOne = false"
          @finish="onFinish"
      />
    </van-popup>
  </div>
</template>
<script>
export default {
  name: 'Itinerary',
  subtitle() {
    return '行程日程';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    window.history.go(-1);
  },
  data() {
    return {
      minDate: new Date(),
      maxDate: new Date(),
      defaultDate: new Date(),
      monthCont: 0,
      yearCont: 0,
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      now:'',
      nowDay: new Date(),
      showYear: new Date().getFullYear(),
      showMonth: new Date().getMonth(),
      //所选当前日期
      Week:'',
      MonDay:'',
      //是否有数据
      isDate: 1,
      //逾期2进行1
      taskState:2,
      noData: require("/src/assets/img/nodata.png"),
      //级联选择器
      show: false,
      showOne: false,
      fieldValue: '张亮亮',
      fieldValueOne: '德克士（火车站点）',
      cascaderValue: '',
      // 选项列表，children 代表子选项，支持多级嵌套
      options: [
        {
          text: '浙江省',
          value: '330000',
          children: [{ text: '杭州市', value: '330100' }],
        },
        {
          text: '江苏省',
          value: '320000',
          children: [{ text: '南京市', value: '320100' }],
        },
      ],
    }
  },
  watch: {
    defaultDate(val) {
      console.log(val)
      this.setMinMaxDay();
    }
  },
  mounted() {
    this.getCalendar();
    this.slecetDay(new Date())
  },
  methods: {
    //级联选折器
      onFinish({ selectedOptions }) {
        this.show = false;
        this.fieldValue = selectedOptions.map((option) => option.text).join('-');
      },
    //加载请求日历初始数据
    getCalendar() {
      let dateLimit = new Date();
      let year = dateLimit.getFullYear();
      let month = dateLimit.getMonth() + 1;
      let d = new Date(year, month, 0);
      let enddate = d.getDate();
      this.minDate = new Date(this.$moment(dateLimit).format('YYYY/MM/') + '01');
      this.maxDate = new Date(this.$moment(dateLimit).format('YYYY/MM/') + enddate);
    },
    //日历格式
    formatterDay(day) {
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();
      this.now= this.$moment().date()
      if (month === 11) {
        if (date === 5) {
          day.topInfo = <div class="point"></div>;
        } else if (date === 4) {
          day.topInfo = <div class="point" style="background:green"></div>;
        } else if (date === this.now) {
          day.text = <div class="nowDay">{this.now}</div>;
        }
      }

      return day;
    },
    //选中日后执行
    slecetDay(day) {
      this.getWeeK(day)
      this.getMonDay(day)
      this.Week=this.getWeeK(day)




    },
    //获取几月几日
    getMonDay(day){
        this.MonDay=this.$moment(day).format("MM-DD")
    },
    //获取星期几
    getWeeK(day){
      let week=this.$moment(day).day()
      switch (week){
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
    // 当前年上一个年
    deYear() {
      this.yearCont--;
      this.defaultDate = new Date(
          this.year + this.yearCont,
          this.month,
          1
      );

    },
    // 当前年下一个年
    adYear() {
      this.yearCont++;
      this.defaultDate = new Date(
          this.year + this.yearCont,
          this.month,
          1
      );
    },
    setMinMaxDay() {
      this.showYear = this.defaultDate.getFullYear();
      this.showMonth = this.defaultDate.getMonth();
      var firstDay = new Date(this.defaultDate);
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
    },
    //跳转任务详情
    goTaskDetail(){
      this.$router.push('TaskDetails')
    }

  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 812px;
  overflow: hidden;
  background: #0A9B58;
  padding-bottom: 100px;
}
//级联选折器
.van-field{
  width: 140px;
  height: 33px;
  float: left;
  background: #FFFFFF;
  margin: 10px 0px 10px 12px;
  box-shadow: 0px 2px 5px 2px rgba(0,0,0,0.19);
  border-radius: 17px;
  ::v-deep input{
    margin-top: -5px;
  }
  ::v-deep i{
    margin-top: -5px;
    margin-left: 0px;
  }
}
//级联选择器--门店
.van-field:nth-child(2){
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
  box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.19);
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
    margin: 0 auto;
    overflow: hidden;
    //无数据img
    .noDate{
      width: 203px;
      height: 121px;
      margin: 40px auto;
      img{
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
        //执行中--样式
        .state {
          background: rgba(247, 181, 0, 0.11);
          border-radius: 4px;
          padding: 2px;
          border: 1px solid #F7B500;
          font-size: 11px;
          font-weight: 500;
          color: #F7B500;
        }
        //已逾期--样式
        .stateAct{
          background: rgba(250, 100, 0, 0.2);
          border-radius: 4px;
          padding: 2px;
          border: 1px solid #F7B500;
          font-size: 11px;
          font-weight: 500;
          color: #FA6400;
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
  .van-calendar__header{
    box-shadow:none!important;
  }
  .van-calendar__month-title {
    display: none;
  }
  .van-calendar__selected-day{
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
  .month-year{
    font-size: 20px!important;
    font-weight: 600;
    color: #333333;
  }
  //日历--当前年月标题-右箭头
  .arrow {
    position: absolute;
    top: 18px;
    right:100px;
    color: #0A9B58;
  }
  //日历--当前年月标题--左箭头
  .arrow-left {
    position: absolute;
    top: 18px;
    left: 100px;
    color: #0A9B58;
  }
  .arrow-year {
    position: absolute;
    top: 15px;
    right: 30px;
  }
  .arrow-left-year {
    position: absolute;
    top: 15px;
    left: 30px;
  }
  .arrow-year-1 {
    position: absolute;
    top: 15px;
    right: 35px;
  }
  .arrow-left-year-1 {
    position: absolute;
    top: 15px;
    left: 35px;
  }

  //当前日-样式
  .nowDay {
    width: 38px;
    height: 38px;
    line-height: 38px;
    border-radius: 50%;
    background: rgba(247, 181, 0, 0.23);
  }
  //日历head样式
  .van-calendar::v-deep.van-calendar__header{
    box-shadow:none!important;
  }
}
</style>