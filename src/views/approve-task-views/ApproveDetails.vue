<template>
  <div class="wrap">
    <!--  任务标题-->
    <div class="title">
      <div class="header">{{ ApproveData.approveUserName }}</div>
      <ul>
        <li>{{ ApproveData.approveName }}</li>
        <li>{{ ApproveData.createTime }}</li>
      </ul>
    </div>
    <!-- 任务详情--执行人、地址    -->
    <div class="main">
      <!--v-if 判断icon状态 3通过 4拒绝 1未审批  5中止任务-->
      <div class="icon">
        <img v-if="ApproveData.approveStatus==3" :src="imgAdopt" alt="">
        <img v-else-if="ApproveData.approveStatus==4" :src="imgRefuse" alt="">
        <img v-else-if="ApproveData.approveStatus==5" :src="imgSuspension" alt="">
      </div>
      <div v-if="ApproveData.workType==1">任务类型：标准访店任务</div>
      <div v-else>任务类型：其他访店任务</div>
      <div style="margin-top: 5px">任务时间：{{ ApproveData.workStartDate }}至{{ ApproveData.workEndDate }}</div>
      <ul class="location">
        <li class="user" v-for="(item,index) in ApproveData.workInfo.userList " :key="index">执行人:{{ item }}
          <!-- 根据数据length判断是否需要-- / 等几人        -->
          <span v-if="index!==ApproveData.workInfo.userList.length-1&&ApproveData.workInfo.userList.length>1">/</span>
          <span v-if="ApproveData.workInfo.userList.length>3">等{{ ApproveData.workInfo.userList.length - 4 }}人</span>
        </li>
        <li class="location-shop">任务地点：
          <div class="shop" v-for="(item,index) in ApproveData.workInfo.storeList"
               :key="index">
            <p>{{ item }}</p>
          </div>
        </li>
        <li class="seeDetail" @click="goDetail()">查看详情</li>
      </ul>
      <div class="msg">{{ ApproveData.approveUserName }}创建的访店任务需通过管理员审核。请管理员尽快审核通过。</div>
    </div>
    <div class="process">
      <div class="process-title">流程:</div>
      <!--  流程-->
      <div v-for="(item,index) in ApproveData.approveStream" :key="index">
        <div class="process-start">
          <!--   流程--头像、icon-->
          <div class="header">
            {{ item.userList[0].userName }}
            <svg-icon v-if="item.userList[0].status==='3'" icon-class="yes" class-name="yes"></svg-icon>
            <svg-icon v-else-if="item.userList[0].status==='4'" icon-class="no" class-name="no"/>
          </div>
          <ul class="process-left">
            <!--  判断审批状态-->
            <li class="process-act">
              <div class="process-action" v-if="item.userList[0].status==='0'">发起</div>
              <div class="process-action" v-else-if="item.userList[0].status==='1'">审批人{{ item.level }}(未审批)</div>
              <div class="process-action" v-else-if="item.userList[0].status==='3'">审批人{{ item.level }}(通过)</div>
              <div class="process-action" v-else-if="item.userList[0].status==='4'">审批人{{ item.level }}(拒绝)</div>
              <div class="process-action" v-else>审批人{{ item.level }}</div>
              <div class="process-time">{{ item.userList[0].approveTime }}</div>
            </li>
            <li class="process-username" v-for="(user,index ) in item.userList " :key="index">
              <div>{{ user.userName }}<span class="Slash" v-if="index!==item.userList.length-1">/</span></div>
            </li>
          </ul>
        </div>
        <div class="line" v-if="index!==ApproveData.approveStream.length-1"></div>
      </div>
      <div class="process-reason" v-if="reason">
       拒绝理由：{{ reason }}
      </div>
    </div>
    <!-- 当审批状态为3或4时 底部按钮切换为已审批状态  -->
    <div class="footer" v-if="ApproveData.approveStatus==4">
      <div class="refuse" @click="revoke">撤销申请</div>
      <div class="pass" @click="goCreateTask">重新提交</div>
    </div>
    <div class="footer" v-else-if="ApproveData.approveStatus==1||ApproveData.approveStatus==null">
      <div class="refuse" @click="show=true">拒绝申请</div>
      <div class="pass" @click="pass">审核通过</div>
    </div>
    <div class="footers" v-else>
      <!--      <div class="refuse" @click="show=true">拒绝申请</div>-->
      <!--      <div class="pass" @click="pass">审核通过</div>-->
    </div>
    <!--  拒绝弹窗  -->
    <van-dialog v-model="show" title="请填写拒绝理由" width="332px" show-cancel-button :before-close="beforeClose">
      <textarea v-model="reason" placeholder="请输入拒绝理由，不超过200字" class="dialog-input" style="resize: none;"
                maxlength='200'/>
    </van-dialog>
  </div>
</template>
<script>
import {Toast} from 'vant';
import Approve_task_API from '@api/approve_task_api'
import SvgIcon from "@/components/SvgIcon";
import {mapGetters} from "vuex";

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
      iconState: 1,
      imgAdopt: require("/src/assets/img/adopt.png"), //通过icon
      imgRefuse: require("/src/assets/img/refuse.png"),//拒绝icon
      imgSuspension: require("/src/assets/img/suspension.png"),//中止icon
      show: false,//弹窗
      ApproveData: [],
      reason: '',//拒绝理由
      approveNo:'',
    }
  },
  mounted() {
    this.getDate();//获取数据
    this.showReason();//拒绝
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    //初始数据
    async getDate() {
      // this.userInfo.tuid

      let params = {userNo: this.userInfo.tuid, workNo: this.$route.query.res}
      let result = await Approve_task_API.getApproveDetail(params)
      this.ApproveData = result.data
      console.log(result.data, '初始数据')
      console.log(result.data.approveStream[1].approveNo)
      //用户信息
      console.log(this.userInfo)
      //拒绝理由
      console.log(this.ApproveData,'第二部')
      this.ApproveData.approveStream.forEach((item)=>{
        if(item.level>0){
          item.userList.forEach((itemChild)=>{
            this.reason=itemChild.approveMsg
            return
          })
        }
        console.log(item.userList[0].status,'改状态')
      })

    },
    //跳转地点详情页
    goDetail() {
      let queryLists = JSON.stringify(this.ApproveData.workInfo.userList)
      let workNO = this.$route.query.res
      console.log(workNO)
      console.log(queryLists)
      this.$router.push({path: 'locationDetails', query: {res: queryLists, workNO: workNO}})
    },
    //展示拒绝理由
    showReason(){
      console.log('第一步')
      console.log(this.ApproveData)

    },
    //填写拒绝理由后执行
    beforeClose(action, done) {
      if (action === 'confirm') {
        //流程变换为拒绝
       this.ApproveData.approveStream.forEach((item)=>{
         if(item.level>0){
           item.userList[0].status='4'
         }
         console.log(item.userList[0].status,'改状态')
       })
        this.ApproveData.approveStatus = 4;
        //后台改为拒绝
        let params = {
          refuseReason: this.reason,
          status: 2,
          userNo: this.userInfo.tuid,
          workNo: this.$route.query.res,
          approveNo: this.ApproveData.approveStream[1].approveNo,
        }
        console.log(params)
        Approve_task_API.ApproveTask(params).then((res) => {
          if (res.code === 200) {
            Toast.success('拒绝成功');
          }
        })
        console.log('确认修改');
        done();
      } else if (action === 'cancel') {
        this.reason = '';
        console.log('取消');
        done();
      }
    },
    //通过后执行
    pass() {
      this.ApproveData.approveStatus = 3;
      let params = {
        refuseReason: "",
        status: 1,
        userNo: this.userInfo.tuid,
        workNo: this.$route.query.res,
        approveNo: this.ApproveData.approveStream[2]?this.ApproveData.approveStream[2].approveNo:this.ApproveData.approveStream[1].approveNo,
      }
      Approve_task_API.ApproveTask(params).then((res) => {
        if (res.code === 200) {
          Toast.success('审批通过');
        }
      })
      var that = this;
      setTimeout(function () {
        that.$router.push('ApproveList')
      }, 2000);
    },
    //点击撤销申请后执行
    revoke() {
      let params = {userNo: this.userInfo.tuid, workNo: this.$route.query.res}
      Approve_task_API.UndoTask(params).then((res) => {
        if (res.code === 200) {
          Toast.success('撤销成功');
        } else {
          Toast.fail(res.message);
        }
      })
    },
    //重新提交
    goCreateTask() {
      //跳转创建任务页面
      this.$router.push('/create-task')
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
.main {
  margin-top: 10px;
  padding: 15px;
  text-align: left;
  font-size: 14px;
  font-weight: 400;
  color: #333333;
  background: #FFFFFF;
  position: relative;
  //通过/拒绝icon
  .icon {
    width: 80px;
    height: 73px;
    z-index: 555;
    right: 0;
    top: 0;
    position: absolute;

    img {
      width: 100%;
      height: 100%;
    }
  }

  //颜色区域
  .location {
    margin-top: 13px;
    color: #333333;
    font-size: 14px;
    font-weight: 600;
    border-radius: 10px;
    padding: 14px 17px 12px 14px;
    background: rgba(10, 155, 88, 0.07);

    .location-shop {
      min-height: 76px;
    }

    .user {
      margin-bottom: 9px;
    }

    //德克士门店
    .shop {
      min-height: 10px;
      margin: -18px 0 20px 69px;
    }

    //查看详情
    .seeDetail {
      font-size: 14px;
      font-weight: 400;
      color: #0A9B58;
      margin-top: 9px;
      text-align: right;
    }
  }

  //信息提示
  .msg {
    margin-top: 13px;
    font-size: 14px;
    font-weight: 400;
    color: #495060;
  }
}

//流程
.process {
  height: 255px;
  color: #333333;
  overflow: hidden;
  overflow-y: auto;
  background: #FFFFFF;
  margin-top: 10px;
  padding: 14px 17px 12px 14px;

  .process-title {
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    color: #495060;
    margin-bottom: 20px;
  }

  .process-start {
    width: 346px;
    overflow: hidden;
    margin: 5px auto;
    //审批人头像
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

    .process-left {
      float: left;
      width: 285px;
      margin-left: 10px;
      overflow: hidden;

      .process-act {
        overflow: hidden;
        text-align: left;

        .process-action {
          float: left;
          font-size: 13px;
          font-weight: 500;
          color: #333333;
        }

        .process-time {
          float: right;
          font-size: 11px;
          font-weight: 400;
          color: #B8B8B8;
        }
      }

      .process-username {
        float: left;
        margin-top: 5px;
        font-size: 13px;
        font-weight: 400;
        color: #999999;
      }
    }
  }

  .line {
    width: 1px;
    height: 20px;
    margin-left: 20px;
    border-left: 1px solid #979797;
  }

  //拒绝理由
  .process-reason {
    width: 294px;
    text-align: left;
    margin-top: 5px;
    margin-left: 50px;
    font-size: 13px;
    font-weight: 400;
    color: #FA6400;
    word-wrap:break-word;
  }
}

//底部按钮
.footer {
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
  background: #FFFFFF;
  overflow: hidden;
  padding: 5px 20px 5px 20px;
  box-shadow: 0px -2px 3px 1px rgba(0, 0, 0, 0.04);

  .refuse {
    width: 160px;
    height: 44px;
    float: left;
    text-align: center;
    line-height: 44px;
    background: #FA6400;
    border-radius: 22px;
    border: 1px solid #979797
  }

  .pass {
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

.footers {
  width: 100%;
  height: 50px;
  background: #FFFFFF;
  box-shadow: 0px -2px 3px 1px rgba(0, 0, 0, 0.04);
}


//弹窗
.dialog-input {
  width: 306px;
  height: 118px;
  margin-top: 9px;
  background: #F9F9F9;
  border: 1px solid #DFDFDF;
}

//icon
.process-start {
  .header {
    position: relative;

    .svg-icon {
      width: 17px;
      height: 17px;
      left: 25px;
      top: 25px;
      bottom: 200px;
      position: absolute;
      z-index: 999;
    }
  }

}

</style>