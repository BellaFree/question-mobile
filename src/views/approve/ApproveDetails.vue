<template>
  <div class="wrap">
    <div class="title">
      <div class="header">头像</div>
      <ul>
        <li>张亮亮创建的德克士多家访店任务待审核…</li>
        <li>2020-10-27 12:23:34</li>
      </ul>
    </div>
    <div class="main">
      <div>任务类型：标准访店任务</div>
      <div style="margin-top: 5px">任务时间：2020-06-11至2020</div>
      <ul class="location">
        <li class="user">执行人 ：张亮亮/阿曼达/李美丽/吴京</li>
        <li>任务地点：德克士(火车站店)<ul class="shop"><li> 德克士(新客站封闭路段）</li><li>德克士(宝山路地铁站)</li><li>德克士(1788店)</li></ul></li>
        <li class="seeDetail" @click="goDetail()">查看详情</li>
      </ul>
      <div class="msg">张亮亮创建的访店任务需通过管理员审核。请管理员尽快审核通过。</div>
    </div>
    <div class="process">
      <div class="process-title">流程:</div>
      <div></div>
    </div>
    <div class="footer">
      <div class="refuse">拒绝申请</div><div class="pass">审核通过</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ApproveDetails',
  data() {
    return {}
  },
  methods: {
    goDetail(){
      this.$router.push('locationDetails')
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  background: #F3F3F3;
}

//任务标题
.title {
  overflow: hidden;
  padding: 18px 18px 11px 15px;
  background: #FFFFFF;
  //头像
  .header {
    width: 40px;
    height: 40px;
    float: left;
    color: #FFFFFF;
    border-radius: 50%;
    background: #0A9B58;
    text-align: center;
    line-height: 40px;
  }
  ul {
    float: left;
    text-align: left;
    margin-left: 7px;
    :nth-child(1) {
      font-size: 15px;
      font-weight: 600;
      color: #424242;
    }
    :last-child {
      margin-top: 5px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(8, 103, 181, 0.49);
    }
  }
}
//任务详情
.main{
  margin-top: 10px;
  padding:15px;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  overflow: hidden;
  background: #FFFFFF;
  //颜色区域
  .location{
    margin-top: 13px;
    color: #333333;
    font-size: 14px;
    font-weight: 600;
    border-radius: 10px;
    padding: 14px 17px 12px 14px;
    background: rgba(10, 155, 88, 0.07);
    .user{
      margin-bottom:9px;
    }
    //德克士门店
    .shop{
      margin-left:69px;
    }
    //查看详情
    .seeDetail{
      font-size: 14px;
      font-weight: 400;
      color: #0A9B58;
      margin-top: 9px;
      text-align: right;
    }
  }
  //信息提示
  .msg{
    margin-top: 13px;
    font-size: 14px;
    font-weight: 400;
    color: #495060;
  }
}
//流程
.process{
  height: 255px;
  color: #333333;
  overflow: hidden;
  background: #FFFFFF;
  margin-top: 10px;
  padding: 14px 17px 12px 14px;
  .process-title{
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    color: #495060;
  }
}
//底部按钮
.footer{
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
  background: #FFFFFF;
  overflow: hidden;
  margin-top: 14px;
  padding: 5px 20px 5px 20px;
  .refuse{
    width: 160px;
    height: 44px;
    float: left;
    text-align: center;
    line-height: 44px;
    background: #FA6400;
    border-radius: 22px;
    border: 1px solid #979797
  }
  .pass{
    width: 160px;
    height: 44px;
    float: left;
    margin-left: 12px;
    text-align: center;
    line-height: 44px;
    background: #4ACD79;
    border-radius: 22px;
  }
}
</style>