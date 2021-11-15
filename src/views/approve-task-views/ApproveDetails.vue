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
<!--v-if 判断icon状态 -->
      <div class="icon"><img v-if="ApproveData[0].stack===1" :src="imgAdopt" alt=""><img v-else-if="ApproveData[0].stack===2" :src="imgRefuse" alt=""></div>
      <div>任务类型：标准访店任务</div>
      <div style="margin-top: 5px">任务时间：2020-06-11至2020-08-11</div>
      <ul class="location">
        <li class="user">执行人 ：{{ApproveData[0].workInfoList}}</li>
        <li>任务地点：德克士(火车站店)<ul class="shop"><li> 德克士(新客站封闭路段）</li><li>德克士(宝山路地铁站)</li><li>德克士(1788店)</li></ul></li>
        <li class="seeDetail" @click="goDetail()">查看详情</li>
      </ul>
      <div class="msg">张亮亮创建的访店任务需通过管理员审核。请管理员尽快审核通过。</div>
    </div>
    <div class="process">
      <div class="process-title">流程:</div>
<!--  发起人-->
      <div class="process-start">
         <div class="header">头像</div>
        <ul class="process-left">
          <li class="process-act"><div class="process-action" >发起</div><div class="process-time">2020-10-27 12:23:34</div></li>
          <li class="process-username">张亮亮</li>
        </ul>
      </div>
      <div class="line"></div>
<!--审批人1-->
      <div class="process-start">
        <div class="header">头像  <svg-icon v-if="iconState===1" icon-class="yes" class-name="yes"></svg-icon><svg-icon v-else icon-class="no" class-name="no"/></div>
        <ul class="process-left">
          <li class="process-act"><div class="process-action" >审批人1</div><div class="process-time">2020-10-27 12:23:34</div></li>
          <li class="process-username">李美玲</li>
        </ul>
      </div>
      <div class="line"></div>
<!--  审批人2-->
      <div class="process-start">
        <div class="header">头像 <svg-icon v-if="iconState===1" icon-class="yes" class-name="yes"></svg-icon><svg-icon v-else icon-class="no" class-name="no"/></div>
        <ul class="process-left">
          <li class="process-act"><div class="process-action" >审批人2</div><div class="process-time">2020-10-27 12:23:34</div></li>
          <li class="process-username">赵晓慧</li>
          <li class="process-reason" v-if="reason">拒绝理由：{{reason}}</li>
        </ul>
      </div>
    </div>
    <div class="footer" v-if="ApproveData[0].stack===2">
      <div class="refuse" @click="revoke" >撤销申请</div><div class="pass" @click="goCreateTask" >重新提交</div>
    </div>
    <div class="footer" v-else>
      <div class="refuse" @click="show=true">拒绝申请</div><div class="pass" @click="pass">审核通过</div>
    </div>
<!--  拒绝弹窗  -->
    <van-dialog v-model="show" title="请填写拒绝理由"  width="332px" show-cancel-button :before-close="beforeClose">
      <textarea  v-model="reason" placeholder="请输入拒绝理由，不超过50字" class="dialog-input" style="resize: none;" maxlength='50' />
    </van-dialog>
  </div>
</template>
<script>
import { Toast } from 'vant';
import SvgIcon from "@/components/SvgIcon";
export default {
  name: 'ApproveDetails',
  components: {SvgIcon},
  subtitle() {
    return '审批详情';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
      window.history.go(-1);
  },
  data() {
    return {
      iconState:1,
      imgAdopt:require("/src/assets/img/adopt.png"), //通过icon
      imgRefuse:require("/src/assets/img/refuse.png"),//拒绝icon
      show:false,//弹窗
      ApproveData:[
        {workInfoList:'张亮亮/阿曼达/李美丽/吴京',stack:0}
      ],
      reason:'',//拒绝理由
    }
  },
  methods: {
    //跳转地点详情页
    goDetail(){
      this.$router.push('locationDetails')
    },
    //填写拒绝理由后执行
    beforeClose(action, done){
       if (action==='confirm'){
         this.ApproveData[0].stack=2;
         console.log('确认修改');
         done();
       }else if (action==='cancel'){
         console.log('取消');
         done();
       }
    },
    //通过后执行
    pass(){
      this.ApproveData[0].stack=1;
      Toast.success('审批通过');
      var that = this;
      setTimeout(function () {
        that.$router.push('ApproveList')
      },2000);
    },
    //点击撤销申请后执行
    revoke(){
      Toast.success('撤销成功');
      //调用任务终止接口
    },
    //重新提交
    goCreateTask(){
      //跳转创建任务页面
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
  background: #FFFFFF;
  position: relative;
  //通过/拒绝icon
  .icon{
    width:80px;
    height: 73px;
    z-index: 555;
    right: 0;
    top: 0;
    position: absolute;
    img{
      width: 100%;
      height: 100%;
    }
  }
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
    margin-bottom: 20px;
  }
  .process-start{
    width: 346px;
    overflow: hidden;
    margin: 5px auto;
    //审批人头像
    .header{
      width: 40px;
      height: 40px;
      float: left;
      color: #FFFFFF;
      border-radius: 50%;
      background: #0A9B58;
      text-align: center;
      line-height: 40px;
    }
    .process-left{
      float: left;
      width:285px;
      margin-left: 10px;
      overflow: hidden;
      .process-act{
        overflow: hidden;
        text-align: left;
        .process-action{
          float: left;
          font-size: 13px;
          font-weight: 500;
          color: #333333;
        }
        .process-time{
          float: right;
          font-size: 11px;
          font-weight: 400;
          color: #B8B8B8;
        }
      }
      .process-username{
        text-align: left;
        margin-top: 5px;
        font-size: 13px;
        font-weight: 400;
        color: #999999;
      }
      //拒绝理由
      .process-reason{
        text-align: left;
        margin-top: 5px;
        font-size: 13px;
        font-weight: 400;
        color: red;
      }
    }
  }
  .line{
    width: 1px;
    height: 20px;
    margin-left: 20px;
    border-left: 1px solid #979797 ;
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
//弹窗
.dialog-input{
  width: 306px;
  height: 118px;
  margin-top: 9px;
  background: #F9F9F9;
  border: 1px solid #DFDFDF;
}
//icon
.process-start{
  .header{
    position: relative;
    .svg-icon{
      width: 17px;
      height: 17px;
      left:25px;
      top:25px;
      bottom: 200px;
      position: absolute;
      z-index: 999;
    }
  }

}

</style>