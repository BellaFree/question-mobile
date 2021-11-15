<template>
  <!-- 审批列表 -->
  <div class="wrap">
    <!-- 搜索-->
    <van-search
        v-model="search"
        shape="round"
        clearable
        clear-trigger="focus"
        placeholder="搜索"
    />
    <!-- tab列 -->
    <van-tabs sticky  @click="onClick"  color="#0A9B58" v-model="active" >
      <van-tab title="未审批">
        <!--list列表-->
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
          <van-cell v-for="item in nolist" :key="item" @click="goDetail()">
            <div class="title">头像</div>
            <ul class="text">
              <li>张亮亮创建的德克士多家访店任务待审…</li>
              <li>任务类型：标准访店任务</li>
              <li>任务时间</li>
              <li>执行人：张亮亮/阿曼达/李美丽/吴京</li>
              <li>2021-11-05</li>
            </ul>


          </van-cell>
        </van-list>
      </van-tab>
      <van-tab title="已审批">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
          <van-cell v-for="item in yeslist" :key="item" :title="item"/>
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
      search:'',
      active:0, //0已审批，1为审批，同时为tab默认页
      nolist: [],//未审批数据
      yeslist: [],//已审批数据
      loading: false,
      finished: false,
    }
  },
  methods: {
    //切换tab
    onClick() {
        if(this.active===1){
          // alert('已审批')
          let params={pageNum:1,pageSize:10,status:0,userNo:'UW001'}
       let result= Approve_task_API.getApproveList(params)
          console.log(result.data)
        }else{
          // alert('未审批')
        }
    },
    //跳转审批详情
    goDetail(){
      this.$router.push('ApproveDetails')
    },
    onLoad() {
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.nolist.push(this.nolist.length + 1);
        }
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 2000);
    },
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  overflow: hidden;
  background: #F3F3F3;
  //搜索
  .van-search {
    width: 100%;
    height: 35px;
    margin: 0 auto;
    ::v-deep.van-cell{
      margin-top: 0;
    }
  }
  .van-cell{
    margin-top: 10px;
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
    .text{
      float: left;
      margin-left: 7px;
      li{
        font-size: 13px;
        font-weight: 400;
        color: #A6A6A6;
      }
      //任务名称
      :nth-child(1){
        font-size: 15px;
        font-weight: 600;
        color: #424242;
      }
      :last-child{
        color: rgba(8, 103, 181, 0.49);
      }
    }
  }
}
//tab 下标栏颜色
.van-tabs{
  ::v-deep.van-tabs__line {
    top:25px;
    width: 67px;
    height: 10px;
    background: linear-gradient(270deg, rgba(200, 223, 64,60%) 0%, #0A9B58 100%);
    box-shadow: 0px 2px 3px 0px rgba(0,0,0,0.06);
    border-radius: 5px;
  }
  ::v-deep .van-tab__text{
    z-index: 555;
  }
}


</style>