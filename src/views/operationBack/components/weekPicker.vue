<template>
  <div>
    <div class="header">
      <div class="btn left">取消</div>
      <div class="center">选择日期</div>
      <div class="btn right">确定</div>
    </div>
    <div class="content">
      <div class="picker-view-column">
        <div class="picker-view-column-wheel">
          <div v-for="index of 20" :key="index" class="picker-view-column-item">
            <div class="picker-view-column-item-label">{{ index }}</div>
          </div>
        </div>
      </div>
      <div class="picker-view-column">
        <div class="picker-view-column-wheel">
          <div v-for="index of 20" :key="index" class="picker-view-column-item">
            <div class="picker-view-column-item-label">{{ index }}</div>
          </div>
        </div>
      </div>
      <div class="picker-view-column">
        <div class="picker-view-column-wheel">
          <div v-for="index of 20" :key="index" class="picker-view-column-item">
            <div class="picker-view-column-item-label">{{ index }}</div>
          </div>
        </div>
      </div>
      <div class="picker-view-mask picker-view-mask-top"></div>
      <div class="picker-view-mask picker-view-mask-bottom"></div>
    </div>
  </div>
</template>

<script>
/**
 * 此组件只计算当前年份为终点倒数2年的数据
 */
import moment from 'moment';
moment.locale('zh-cn')
export default {
  name: "weekPicker",
  data() {
    return {
      date: '',
      show: false,
      yearMap: new Map(),
      yearThreshold: 3
    }
  },
  mounted() {
    this.initYear()
    this.getWeekList(2021,6)
    // console.info(this.yearMap)
  },
  methods: {
    // 初始化年份
    initYear() {
      let currentYear = moment('2021-1-1').year()
      for (let i = 0; i < this.yearThreshold; i++) {
        this.yearMap.set(currentYear - i, {
          month: this.getTargetMonth(currentYear, currentYear - i),
          weekList: []
        })
      }
    },
    // 获取指定年的月份
    getTargetMonth(currentYear, targetYear) {
      let currentMonth = moment().month() + 1 // 获取的月份从0 开始的
      let end = Number(moment().endOf('year').format('MM'))
      let result = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      // 年底
      if (currentMonth === end || currentYear !== targetYear) {
        return result
      } else {
        result = []
        for (let i = 1; i <= currentMonth; i++) {
          result.push(i)
        }
        return result
      }
    },
    // 获取周列表
    getWeekList(targetYear, targetMonth) {
      /**
       * 周列表获取 方法 一周 7天
       * 1：获取当前指定月份的1号是周几 做累加计算即可
       * 2：注意是否是闰年、月份是30天还31天
       */
      console.log(`%c断点监听器 ----------------------`, 'color: #43bb88;font-size: 24px;font-weight: bold;text-decoration: underline;');
      console.log(moment(`${targetYear}/${targetMonth}/1`).format('YYYY-MM-DD'))
      let firstNumberDay = moment(`${targetYear}/${targetMonth}/1`).weekday() + 1 // 每月1号是周几 周1：0 周2: 1
      console.info('当前月的1号是周：', firstNumberDay)
      let diff =  firstNumberDay === 7 ?  0 : 7 - firstNumberDay // 计算出当前周的误差
      console.info('时间周差：', diff)
      let currentTime= `${targetYear}/${targetMonth}/${2 + diff}`
      console.info('每月第一个周周一：',currentTime)
      // let firstWeekStart = moment(currentTime).date() // 当前月的第一周 开始日期
      let firstWeekEnd = moment(currentTime).weekday(6).format('MM.DD')
      let endDay = moment(`${targetYear}/${targetMonth}`).endOf('month').format('YYYY.MM.DD')
      console.info(endDay, firstWeekEnd)
      // let firstWeekEnd = 0
      // while( moment(firstWeekEnd).unix()< moment(endDay).unix()){
      //   firstWeekEnd = moment(currentTime).weekday(7).format('YYYY.MM.DD')
      //   currentTime = moment(`${firstWeekEnd}`).add(1, 'day').format('YYYY-MM-DD')
      //   console.info(firstWeekEnd, currentTime)
      // }

    }
  }
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 60px;

  .btn {
    font-size: 14px;
    font-weight: 400;
    color: #999999;
    padding: 0 20px;
  }

  .center {
    font-size: 18px;
    font-weight: 400;
    color: #333333;
    margin: 0 auto;
  }

  .right {
    color: #19BE6B;

    &:hover {
      color: #19BE6B;
    }
  }
}

.content {
  display: flex;
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;

  .picker-view-column {
    height: 100%;
    flex: 1 1;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    touch-action: none;
    position: relative;
  }

  .picker-view-column-wheel {
    width: 100%;
    cursor: grab;
    position: absolute;
    top: calc(50% - 17px);
    left: 0;
    transform: translate3d(0px, -102px, 0px);

    &:before {
      content: " ";
      display: block;
      position: absolute;
      width: 100%;
      height: 100vh;
      top: -100vh;
    }
  }

  .picker-view-column-item {
    font-size: 16px;
    padding: 0 6px;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .picker-view-column-item-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .picker-view-mask {
    position: absolute;
    left: 0;
    width: 100%;
    height: calc(50% - 12px);
    pointer-events: none;
  }

  .picker-view-mask-top {
    top: -5px;
    border-bottom: 1px solid #E9EAEB;
    background: linear-gradient(
            0deg, hsla(0, 0%, 100%, .7) 50%, #fff);
  }

  .picker-view-mask-bottom {
    bottom: -5px;
    border-top: 1px solid #E9EAEB;
    background: linear-gradient(
            180deg, hsla(0, 0%, 100%, .7) 50%, #fff);
  }
}
</style>
