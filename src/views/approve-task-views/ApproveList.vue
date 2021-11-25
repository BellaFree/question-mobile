<template>
  <!-- 审批列表 -->
  <div class="wrap">
    <!-- 搜索-->
    <div class="search">
      <van-search
          v-model="search"
          shape="round"
          clearable
          clear-trigger="focus"
          placeholder="搜索"
      />
    </div>
    <!-- tab列 -->
    <van-tabs  @click="onClick" color="#0A9B58" v-model="active">
      <van-tab title="未审批">
        <!-----未审批-->
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad(0)"
        >
          <van-cell v-for="(item,index) in nolist" :key="index" @click="goDetail()">
            <div class="title">{{ item.approveUserName }}</div>
            <ul class="text">
              <li class="textTitle">{{ item.approveName }}</li>
              <li v-if='item.workType==="1"'>任务类型：标准访店任务</li>
              <li v-else>任务类型:其他访店任务</li>
              <li>任务时间:{{ item.workStartDate }}至{{ item.workEndDate }}</li>
              <li class="userNameli">
                <span>执行人：</span>
                <!-- 执行人列表--截取循环前四个----------->
                <div class="userName" v-for="(item,index) in workInfo.userList.slice(0,4) " :key="index">
                  <span class="nameList" style="float: left">{{ item.userName }}</span>
                  <span v-if="index!==workInfo.userList.length-1">/</span>
                </div>
                等{{ workInfo.userList.length - 4 }}人
              </li>
              <li>{{ item.createTime }}</li>
            </ul>
          </van-cell>
        </van-list>
      </van-tab>
      <!--  已审批-->
      <van-tab title="已审批">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad(1)"
        >
          <van-cell v-for="(item,index) in yeslist" :key="index">
            <div class="title">{{ item.approveUserName }}</div>
            <ul class="text">
              <li class="textTitle">{{ item.approveName }}</li>
              <li v-if='item.workType==="1"'>任务类型：标准访店任务</li>
              <li v-else>任务类型:其他访店任务</li>
              <li>任务时间:{{ item.workStartDate }}至{{ item.workEndDate }}</li>
              <li class="userNameli">
                <span>执行人：</span>
                <!-- 执行人列表--截取循环前四个----------->
                <div class="userName" v-for="(item,index) in workInfo.userList.slice(0,4) " :key="index">
                  <span class="nameList" style="float: left">{{ item.userName }}</span>
                  <span v-if="index!==workInfo.userList.length-1">/</span>
                </div>
                等{{ workInfo.userList.length - 4 }}人
              </li>
              <li>{{ item.createTime }}</li>
            </ul>
          <!--  拒绝、通过icon-->
            <div class="icon" v-if="item.approveStatus==='3'"><img :src="imgAdopt" alt=""></div>
            <div class="icon" v-else-if="item.approveStatus==='4'"><img :src="imgRefuse" alt=""></div>
          </van-cell>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import Approve_task_API from '@api/approve_task_api'
export default {
  name: 'ApproveList',
  subtitle() {
    return '审批列表';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    window.history.go(-1);
  },
  data() {
    return {
      search: '',
      active: 0, //0已审批，1为审批，同时为tab默认页
      nolist: [],//未审批数据
      yeslist: [],//已审批数据
      workInfo: {
        userList: [{userName: '张亮亮'}, {userName: '阿曼达'}, {userName: '李美丽'}, {userName: '吴京'}, {userName: '谢毅'},],
        storeList: [null],
      },
      loading: false,
      finished: false,
      imgAdopt: require("/src/assets/img/adopt.png"), //通过icon
      imgRefuse: require("/src/assets/img/refuse.png"),//拒绝icon
    }
  },
  mounted() {
    this.onClick();
  },
  methods: {
    //切换tab
    async onClick() {
      if (this.active === 1) {
        // alert('已审批')
        let params = {pageNum: 1, pageSize: 10, status: 0, userNo: 'UW001'}
        let result = await Approve_task_API.getApproveList(params)
        this.yeslist = result.data.records
        console.log(result.data)
        console.log(this.yeslist)
      } else {
        // alert('未审批')
        let params = {pageNum: 1, pageSize: 10, status: 0, userNo: 'UW001'}
        let result = await Approve_task_API.getApproveList(params)
        this.nolist = result.data.records
        console.log(this.nolist.length)
        console.log(this.nolist)
      }
    },
    //跳转审批详情
    goDetail() {
      this.$router.push('ApproveDetails')
    },
    onLoad(num) {
      //未审批加载
      if (num===0){
        console.log('未审批')
        //如果初始数据不够10条，则不再加载
        if (this.nolist.length<9){
          this.finished = false;
          this.loading = false;
        }else {
          setTimeout(() => {
            this.getApproveList(num)
          }, 2000);
        }
      }else if(num===1){
        console.log('已审批')
        //如果初始数据不够10条，则不再加载
        if (this.nolist.length<9){
          this.finished = false;
          this.loading = false;
        }else {
          setTimeout(() => {
            this.getApproveList(num)
          }, 2000);
        }
      }

    },
    //每次请求10条数据，每次累加
    async getApproveList(num){
      console.log(num,'1111111')
      let i = 1
        let params = {pageNum: i++, pageSize: 10, status: num, userNo: 'UW001'}
        let result = await Approve_task_API.getApproveList(params)
        // 加载状态结束
        this.loading = false;
        //当请求来的数据不够10条，则认为数据全部加载完成
        if (result.data.records.length < 10) {
          this.finished = true;
        }
        //0未审批，1已审批
      if (num===0){
        this.nolist.push(result.data.records)
      }else if (num===1){
        this.yeslist.push(result.data.records)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  overflow: hidden;
  background: #F3F3F3;
  //搜索
  .search{
    width: 100%;
    background: #FFFFFF;
    position: fixed;
    z-index:555;
    .van-search {
      width: 100%;
      height: 35px;
      margin: 5px auto;
      ::v-deep.van-cell {
        margin-top: 0;
      }
    }
  }
//list列表
  .van-list{
    margin-top:100px;
    //单个list样式
    .van-cell{
      margin: 10px auto;
      width: 95%;
      background: #FFFFFF;
      box-shadow: 0 2px 5px 2px rgba(0,0,0,0.03);
      border-radius: 5px;
    }
  }
  //单个list下的各个样式
  .van-cell {
    .icon {
      bottom: 0;
      right: 0;
      width: 72px;
      height: 65px;
      position: absolute;

      img {
        width: 100%;
      }
    }

    //头像样式
    .title {
      width: 40px;
      height: 40px;
      float: left;
      font-size: 13px;
      color: #FFFFFF;
      background: #0A9B58;
      font-weight: 500;
      line-height: 40px;
      border-radius: 50%;
      text-align: center;
    }

    //list列表文本内容
    .text {
      float: left;
      margin-left: 7px;

      li {
        font-size: 13px;
        font-weight: 400;
        color: #A6A6A6;
      }

      //任务名称
      .textTitle {
        width: 100%;
        font-size: 15px;
        font-weight: 600;
        color: #424242;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      //列表--执行人
      .userNameli {
        overflow: hidden;
        //执行人：
        span {
          float: left;
          font-size: 13px;
          font-weight: 400;
          color: #A6A6A6;
        }

        //执行人列表
        .userName {
          float: left;
          font-size: 13px;
          font-weight: 400;
          color: #A6A6A6;
          //斜杠
          span {
            float: right;
          }
        }
      }

      :last-child {
        color: rgba(8, 103, 181, 0.49);
      }
    }
  }
}

//tab 下标栏颜色
.van-tabs {
  ::v-deep.van-tabs__wrap{
    width: 100%;
    position: fixed;
    top: 95px;
    z-index: 555;
    background: #FFFFFF;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,0.06);
  }
  ::v-deep.van-tabs__line {
    top: 25px;
    width: 67px;
    height: 10px;
    background: linear-gradient(270deg, rgba(200, 223, 64, 60%) 0%, #0A9B58 100%);
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.06);
    border-radius: 5px;
  }

  ::v-deep .van-tab__text {
    z-index: 555;
  }
}
</style>