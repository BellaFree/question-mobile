<template>
  <div class="wrap">
    <!--选择器    -->
    <div class="filter-box">
      <!-- 筛选 人 -->
      <p class="filter-user" @click="openExecutor">
        <span>{{ currentExecutor && currentExecutor.name }}</span>
        <svg t="1636353469658" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
             p-id="2479" width="16" height="16">
          <path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z" p-id="2480"></path>
        </svg>
      </p>
      <!-- 筛选 时间 -->
      <p class="filter-time" @click="openTimePopup">
        <span>{{ currentDate.startTime }}至{{ currentDate.endTime }}</span>
        <svg t="1636353469658" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
             p-id="2479" width="16" height="16">
          <path d="M511.999488 819.413462 72.8374 204.586538 951.1626 204.586538Z" p-id="2480"></path>
        </svg>
      </p>
    </div>
<!--list列表 -->
<!-- 判断存入数据的长度是否大于0-->
    <div v-if="[this.dataList].length>0&&this.dataList!=null" >
    <div class="lists" v-for="(value, key,index) in dataList" :key="index">
      <div class="lists-time">{{ key }}</div>
      <div class="lists-main" v-for="(item,index) in value" :key="index">
        <div class="header">{{ item.signUser }}</div>
        <div class="lists-main-shops">
          <div class="lists-main-shops-title">{{ item.storeName }}</div>
          <div class="lists-main-address">
            <van-icon name="location-o"/>
            {{ item.storeAddress }}
          </div>
          <div class="lists-main-point">
            <span class="point"></span> <span class="lists-main-point-word">到店打卡{{ item.startTime }} </span>
            <span class="point"></span> <span class="lists-main-point-word">离店打卡 {{ item.endTime }}</span><br>
            <div class="pointThr">
              <span class="point"></span> <span class="lists-main-point-word">在店时长 {{ item.times }} </span>
            </div>
          </div>
          <div class="line"></div>
        </div>
      </div>
    </div>
    </div>
<!-- 无数据展示-->
    <div v-else class="dataMiss">
      <div class="imgMiss"><img :src="imgMiss"><div>暂无数据</div></div>
    </div>
    <!--头部筛选组件-->
    <organzieAndTime ref="organizeChild" @changeTime="changeTime" @changeExecutor="changeExecutor" :backUrl="backUrl"/>

  </div>
</template>
<script>
import STATISTICAL_REPORT_API from '@api/statistical_report_api'
// 头部筛选组件 方法
import organizeTime from "@/views/statistical-report-views/minxins/organizeTime";
import {mapGetters} from "vuex";
import moment from "moment";
export default {
  name: 'ListDetails',
  subtitle() {
    return '列表详情';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    return this.onClickLeft()
  },
  mixins: [ organizeTime],
  data() {
    return {
      dataList: [],
      imgMiss: require("/src/assets/img/miss.png"),//无数据显示
      // name
      titleName: '列表详情',
      // 回退地址
      backUrl: '/statistical-report/visit-record'
    }
  },
  computed: {
    ...mapGetters(['userId', 'userName', 'userInfo'])
  },
  mounted() {
    if(this.$route.query) {
      const {startTime, endTime,  userName, userID, orgID, url} = this.$route.query
      if(userName && userID && orgID) {
        this.currentExecutor = {
          name:userName,
          id: userID,
          type: 0,
          orgId:orgID,
        }
      }
      this.currentDate.startTime = moment(startTime).format('YYYY-MM-DD')
      this.currentDate.endTime = moment(endTime).format('YYYY-MM-DD')
      this.backUrl = `${this.backUrl}?url=${url}`
    }
    this.getListDetails();//接口
  },
  methods: {
    updateData() {
      this.getListDetails()
    },
    //接口
    async getListDetails() {
      let params = {
        startDate:this.currentDate.startTime,
        endDate: this.currentDate.endTime,
        workUserNo:this.currentExecutor && this.currentExecutor.id,
        reqType: 0,
        orgId:  this.currentExecutor && this.currentExecutor.orgId,
      }
      let result = await STATISTICAL_REPORT_API.getListDetails(params)
      this.dataList = result.data
      if (this.dataList){
        console.log([this.dataList])
      }else {
        console.log(false)
      }
      console.log(this.dataList,'数据')
    },
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  padding-top: 36px;
  background: #FAFAFA;
  overflow: hidden;
}
//无数据展示
.dataMiss{
  min-height: 600px;
  .imgMiss{
    width:250px;
    height: 165px;
    margin:138px auto;
    img{
      width: 100%;
      height: 100%;
    }
    div{
      margin-top:22px;
      font-size: 20px;
      font-weight: 600;
      color: #333333;
    }
  }
}

//筛选栏
.filter-box {
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  background: #FFFFFF;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.09);
  border-radius: 0 0 5px 5px;
  position: fixed;
  top:50px;
  z-index: 10;
  svg {
    display: inline-block;
    width: 8px;
    position: relative;
    top: 3px;
    left: 3px;
  }

  .filter-user {
    width: 160px;
    font-size: 14px;
    font-weight: 600;
    color: #424242;
    position: relative;
  }

  .filter-time {
    font-size: 14px;
    font-weight: 600;
    color: #424242;
    padding-left: 8px;

    span {
      margin-right: 5px;
    }
  }
}
//list列表
.lists {
  width: 100%;
  overflow: hidden;
  .lists-time {
    margin: 10px 0;
    font-size: 17px;
    text-align: left;
    text-indent: 1em;
    font-weight: 600;
    color: #4C4C4C;
  }

  .lists-main {
    width: 100%;
    overflow: hidden;
    position: relative;
    background: #FFFFFF;
    //头像
    .header {
      width: 40px;
      height: 40px;
      left: 17px;
      position: absolute;
      color: #FFFFFF;
      border-radius: 50%;
      background: #0A9B58;
      text-align: center;
      line-height: 40px;
    }
  }
}

//访店列表
.lists-main-shops {
  width: 294px;
  margin-left: 65px;
  //访第一家店
  .lists-main-shops-title {
    font-size: 14px;
    text-align: left;
    font-weight: 600;
    color: #424242;
  }

  //地点
  .lists-main-address {
    font-size: 13px;
    text-align: left;
    line-height: 20px;
    margin: 4px 0 11px 0;
    font-weight: 400;
    color: #999999;
    .van-icon {
      margin-top: 2px;
      float: left;
    }
  }

  .lists-main-point {
    text-align: left;

    .point {
      width: 8px;
      height: 8px;
      display: inline-block;
      border-radius: 50%;
      background: #6DD400;
    }

    .lists-main-point-word {
      margin-right: 30px;
    }

    .point:nth-child(2) {
      background: #FA6400;
    }

    .pointThr {
      margin-top: 9px;

      .point {
        background: #F7B500;
      }
    }
  }
//分割线
  .line {
    width: 100%;
    height: 1px;
    margin: 14px 0;
    border-top: 1px solid #E0E6ED;
  }
}
</style>
