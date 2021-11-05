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
    <van-tabs @click="onClick" color="#0A9B58">
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
export default {
  name: 'ApproveList',
  data() {
    return {
      search:'',
      nolist: [],
      yeslist: [],
      loading: false,
      finished: false,
    }
  },
  methods: {
    //切换tab
    onClick() {

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
      }, 1000);
    },
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  background: #F3F3F3;
  //搜索
  .van-search {
    width: 100%;
    height: 35px;
    margin: 0 auto;
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

</style>