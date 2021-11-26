<template>
  <!--    任务地点详情-->
  <div class="wrap">
    <div class="title">选择执行人，会出现对应的任务门店</div>
    <div class="users">
      <div :class="index===currentIndex?'border':'borderactive'" v-for="(item,index) in userList" :key="index">
        <div class="user" @click="check(index)">{{ item }}</div>
        <div v-show="index===currentIndex" class="san"></div>
      </div>
      <div class="line"></div>
    </div>
    <div class="list" v-for="(item,index) in local " :key="index">
      <div class="img"><img :src="item.storePictureUrl" alt=""></div>
      <ul>
        <li class="shop">{{ item.storeName }}</li>
        <li class="local">
          <van-icon name="location-o"/>
          {{item.storeAddress}}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Approve_task_API from '@api/approve_task_api'
import {mapGetters} from "vuex";

export default {
  name: 'locationDetails',
  subtitle() {
    return '任务地点详情';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    window.history.go(-1);
  },
  data() {
    return {
      currentIndex:0,
      local: [],
      locallist: [
        {
          userNo: "2021051300062",
          userName: '吴京',
          storeList: [
            {
              storeName: '德克士火车站',
              storeAddress: ' 上海市静安区曹家渡万航渡路849号海森国际大厦(康定路)',
              storePictureUrl: null
            },
            {
              storeName: '德克士万达广场店',
              storeAddress: ' 上海市静安区曹家渡万航渡路849号海森国际大厦(康定路)',
              storePictureUrl: null
            }],
        },
        {
          userNo: "2021051300061",
          userName: '亮亮',
          storeList: [
            {
              storeName: '郑州德克士',
              storeAddress: '郑州二七区德化街',
              storePictureUrl: null
            },
            {
              storeName: '碧沙岗德克士',
              storeAddress: '郑州中原区碧沙岗',
              storePictureUrl: null
            }],
        }
      ],
      userList:'',
    }
  },
  mounted() {
    this.getLocalDetail();//接口
    this.getRouteQuery();//获取路径传递的值
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    //点击头像获取信息---假数据
    check(index) {
      this.currentIndex = index;
      for (let i=0;i<this.locallist.length;i++){
        if (this.userList[index].userNo === this.locallist[i].userNo) {
          this.local = this.locallist[i].storeList
        }
      }
    },
    //接口 this.userInfo.tuid
    async getLocalDetail() {
      let params = {userNo:'YC200302154396', workNo: this.$route.query.workNO}
      let result = await Approve_task_API.getLocalDetail(params)
      console.log(result.data)
      this.locallist=result.data
      console.log(this.userList)
      for (let i=0;i<this.locallist.length;i++){
        console.log(this.userList[0])
        console.log(this.locallist[i].userName)
        console.log(this.userList[0]===this.locallist[i].userName)
        if (this.userList[0] === this.locallist[i].userName) {
          this.local = this.locallist[i].storeList
        }
      }
      console.log(result.data)
    },
    //JSON.parse()处理接收query路径传值防止刷新丢失数据
    getRouteQuery(){
      this.userList=JSON.parse(this.$route.query.res)
      console.log(this.userList)
    },
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  background: #FAFAFA;
  overflow: hidden;
}

.title {
  font-size: 14px;
  font-weight: 500;
  color: #495060;
  margin: 12px 0;
}

/*执行人列表*/
.users {
  width: 344px;
  height: 80px;
  margin: 0 auto;
  padding-left: 11px;
  background: #FFFFFF;
  box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.03);
  border-radius: 5px;
  overflow: hidden;
  /*点击后样式*/
  .borderactive {
    width: 50px;
    height: 50px;
    float: left;
    border-radius: 50%;
    position: relative;
    margin: 11px 9px 15px 5px;
    border: 2px solid #FFFFFF;
  }

  .border {
    width: 50px;
    height: 50px;
    float: left;
    position: relative;
    margin: 11px 9px 15px 5px;
    border-radius: 50%;
    border: 2px solid #F7B500;
  }
//执行人列表---右边框
  .line {
    width: 13px;
    height:100%;
    float: right;
    background: #FFFFFF;
    box-shadow: -1px 0px 5px 0px rgba(0, 0, 0, 0.1);
    border-radius: 0 5px 5px 0;
  }
}

//执行人样式
.user {
  width: 40px;
  height: 40px;
  margin: 5px;
  font-size: 12px;
  font-weight: 500;
  color: #FFFFFF;
  text-align: center;
  line-height: 40px;
  border-radius: 50%;
  background: #0A9B58;
}

//点击后三角形
.san {
  width: 0;
  height: 0;
  left: 18px;
  top: 55px;
  position: absolute;
  border-right: 8px solid transparent;
  border-left: 8px solid transparent;
  border-bottom: 8px solid #F7B500;

}

//门店列表
.list {
  overflow: hidden;
  width: 355px;
  height: 89px;
  margin: 10px auto;
  background: #FFFFFF;
  box-shadow: 0 2px 5px 2px rgba(0, 0, 0, 0.03);
  border-radius: 5px;

  .img {
    width: 99px;
    height: 68px;
    margin: 10px 0 10px 10px;
    float: left;
    img{
      width: 100%;
      height: 100%;
    }
  }

  ul {
    float: left;
    margin: 10px 10px 14px 10px;

    .shop {
      text-align: left;
      font-size: 15px;
      font-weight: 600;
      color: #424242;
    }

    .local {
      width: 224px;
      margin-top: 7px;
      text-align: left;
      font-size: 13px;
      font-weight: 400;
      color: #999999;
    }
  }
}

</style>