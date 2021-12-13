<template>
    <div class="home">
        <div class='user-info' v-if='userInfo'>
            <img :src='userInfo.avatarUrl || "/img/outer/user.png"' alt='' @click='jumpDemo' />
            <div>
                <p><span>{{ userInfo.userName }}</span> ，欢迎登录！</p>
                <span><em>{{ userInfo.deptName }}</em><i>{{ userInfo.orgName }}</i></span><!--店长在前面-->
            </div>
        </div>
        <div class='list' v-if='userInfo'>
            <ul>
                <li v-if='userInfo.deptName != "店长"'>
                    <a href='/check-in/index'>
                        <img src='/img/outer/list1.png' alt='' />
                        <span>签到打卡</span><em v-if='userInfo.deptName == "店长"'>快速签到打卡</em>
                    </a>
                </li>
                <li>
                    <a href='/management-task/index'>
                        <img src='/img/outer/list2.png' alt='' />
                        <!-- <i><i> -->
                        <span>任务管理</span><em v-if='userInfo.deptName == "店长"'>查看任务详情</em>
                    </a>
                </li>
                <li>
                    <a href='/management-task/Itinerary'>
                        <img src='/img/outer/list3.png' alt='' />
                        <span>行程日历</span><em v-if='userInfo.deptName == "店长"'>日历方式览行程</em>
                    </a>
                </li>
                <li v-if='userInfo.deptName != "店长"'>
                    <a href='/statistical-report/visit-record'>
                        <img src='/img/outer/list4.png' alt='' />
                        <span>访店记录</span>
                    </a>
                </li>
            </ul>
            <div class='total' v-if='userInfo.deptName != "店长" && progressNum' @click='toProgressPage'>
                <h3>
                    <span>本月计划任务: <em>{{ progressNum.planned }}</em></span><span>本月完成任务: <em>{{ progressNum.completed }}</em></span>
                    <a href='javascript:void(0);'>更多<van-icon name="arrow" /></a>
                </h3>
                <van-progress :percentage="percentage" pivot-text="." pivot-color="#0A9B58" color="linear-gradient(to right, #0A9B58, #7ACC2C)" />
            </div>
        </div>
        <div class='tasks current-tasks'>
            <h4>
              <span>今日任务</span>
              <a @click='getTodayFn("todaySort")' href='javascript:void(0);'>截止时间</a>
            </h4>
            <ul>
                <li v-for='(item, i) in today' :key='i' class='task-item' :class='(item.exeStatus == "已提交" || item.exeStatus == "已结案") ? "delete" : ""' @click='toDetail(item)'>
                    <h5>{{ item.executeName }}</h5>
                    <p class='overdue' v-if='item.workStatus == "已逾期"'>{{ item.endDate }}任务截止 <span>已逾期</span></p>
                    <p v-else>{{ item.endDate }}任务截止 </p>
                </li>
            </ul>
        </div>
        <div class='tasks feature-tasks'>
            <h4>
              <span>即将开始</span>
              <a @click='getTodayFn("featureSort")' href='javascript:void(0);'>创建时间</a>
            </h4>
            <ul>
                <li v-for='(item, i) in feature' :key='i' class='task-item' :class='(item.exeStatus == "已提交" || item.exeStatus == "已结案") ? "delete" : ""' @click='toDetail(item)'>
                    <h5>{{ item.executeName }}</h5>
                    <p>{{ item.startDate }} - {{ item.endDate }}</p>
                </li>
            </ul>
        </div>
        <FooterBar :option=1 />
    </div>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue';
import moment from "moment";
import { Notify } from 'vant';
import { mixin } from '@/utils'
import { changeStatusBar } from '@/utils/interact.js'
import FooterBar from '@/components/FooterBar.vue'

Vue.use(Notify);
export default {
  name: 'Home',
  navClass() {
    return 'shop-inspect-nav'
  },
  subtitle() {
    return '访店在线'
  },

  leftIcon() {
    return 'arrow-left'
  },
  leftTitle() {
      return '关闭'
  },
  onLeft() {
      changeStatusBar ('FFFFFF').then (() => {
        //   history.go(-1)
        location.href = 'https://yyb.dicos.com.cn/#/application'
      })
  },
  onClose() {
      changeStatusBar ('FFFFFF').then (() => {
          location.href = 'https://yyb.dicos.com.cn/#/application'
      })
  },
  data () {
    return {
      checked: false,
      userInfo: {},
      percentage: 0,
      progressNum: {},
      feature: [],
      today: [],
      featureSort: 'asc',
      todaySort: 'asc'
    }
  },
  components: {
    FooterBar
  },
//   mixins: [mixin],
  beforeMount () {
    changeStatusBar ('0A9B58').then(() => {
        console.log('0A9B58 HOME statusBarColor');
    })
  },
//   watch: {
//       userInfo(val) {
//           console.log('ddddd:', val)
//       }
//   },
  mounted () {
        let userInfo = window.sessionStorage.getItem ('userInfo') ?  JSON.parse(window.sessionStorage.getItem ('userInfo')) : {}
        const userId = this.$route.query.userId || userInfo && userInfo.tuid;
        const SESSION = this.$route.query.SESSION || window.sessionStorage.getItem('SESSION');

        if (!userId || !SESSION) {
            Notify ({ type: 'warning', message: '缺少用户信息', duration: 1000 });
            return
        }
        window.sessionStorage.setItem ('SESSION', SESSION);
        this.$fetch.get (`/api/dicos/user/mine`, {
            userNo: userId
        }, {
            isHeaderFormUrlencoded : true
        }).then (res => {
            const { code, data, message } = res;
            if ( code != 200 || !data ) {
                Notify ({ type: 'warning', message, duration: 1000 });
                return;
            }
            this.userInfo = {
                avatarUrl: '',
                deptName: '',
                orgName: '',
                orgNo: '',
                roleName: '',
                roleNo: '',
                userName: '',
                userNo: '',
            }
            Object.assign (this.userInfo, data);
            this.userInfo.tuid = this.userInfo.userNo;
            this.userInfo.tuidName = this.userInfo.userName;
            this.userInfo.orgId = this.userInfo.orgNo;
            this.userInfo.orgname = this.userInfo.orgName;

            window.sessionStorage.setItem ('userInfo', JSON.stringify(this.userInfo));
            this.getProgressFn ()
            this.getTodayFn ()
        })
  },
  methods: {
    getProgressFn () {
        this.$fetch.get (`/api/dicos/task/progress`, {
             userNo: this.userInfo.userNo
        }, {
            isHeaderFormUrlencoded : true
        }).then(res => {
            const { code, data, message } = res;
            if ( code != 200 || !data ) {
                Notify ({ type: 'warning', message, duration: 1000 });
                return;
            }
            this.progressNum = data;
            this.percentage = (this.progressNum.completed / this.progressNum.planned) * 100;
        });
    },

    getTodayFn (type = '') {
        if (type == 'featureSort') {
            this.featureSort = this.featureSort == 'asc' ? 'desc' : 'asc';
        }
        if (type == 'todaySort') {
            this.todaySort = this.todaySort == 'asc' ? 'desc' : 'asc';
        }

        this.$fetch.get ('/api/dicos/task/today', {
             userNo: this.userInfo.userNo,
             featureSort: this.featureSort,
             todaySort: this.todaySort
        }, {
            isHeaderFormUrlencoded : true
        }).then(res => {
            const { code, data, message } = res;
            if ( code != 200 || !data ) {
                Notify ({ type: 'warning', message, duration: 1000 });
                return;
            }
            if (data.feature) {
                data.feature.map(item => {
                    item.startDate = moment(item.startDate).format('MM月DD日');
                    item.endDate = moment(item.endDate).format('MM月DD日');
                })
            }
            if (data.today) {
                data.today.map(item => {
                    item.endDate = moment(item.endDate).format('MM月DD日');
                })
            }

            this.feature = data.feature;
            this.today = data.today;
        });
    },

    toDetail (item) {
        console.log('toDetail:', item);
        // 判断任务是否是下属任务
        let subordinateTask = item.currentOrgLevel && item.orgLevel ? false : item.currentOrgLevel < item.orgLevel ? true : false
        const taskType = item.workType
        let url = `executeNo=${item.executeNo}&workNo=${item.workNo}&name=${item.storeName ? item.storeName : ''}${item.workName ? item.workName: ''}&subordinateTask=${subordinateTask}`
        if (taskType === '2') {
            this.$router.push(`/perform-task/else-task?${url}`)
        }
        if (taskType === '1')  {
            this.$router.push(`/perform-task/visit-store?${url}`)
        }
        if (taskType === '3') {
            this.$router.push(`/perform-task/else-task?${url}`)
        }
    },

    toProgressPage () {
        location.href = '/statistical-report/division'
    },

    jumpDemo () {
        location.href = '/demo'
    },
  },

}
</script>
<style lang="scss">
nav.shop-inspect-nav {
    background: #0A9B58;
    background-size: 100% auto;
    border-bottom: 0 none;
    color: #fff;
}
.van-progress__pivot {
    padding: 0!important;
    display: block !important;
    width: 26px !important;
    height: 35px !important;
    background: url('/img/outer/progressive.png') no-repeat 0 0 !important;
    background-size: 100% 100% !important;
    text-indent: -9999px !important;
}
.home {
    width: 100%;
    padding-top: 50px;
    padding-bottom: 100px;
    background: url('/img/outer/bg.png') no-repeat 0 0;
    background-size: 100% auto;
    .user-info {
      padding-top: 10px;
      width: 100%;
      overflow: hidden;
        img {
            float: left;
            margin: 0 0 15px 15px;
            display: block;
            width: 70px;
            height: 70px;
        }
        div {
            float: left;
            padding-left: 10px;
            color: #FFF;
            text-align: left;
            p {
                padding-top: 9px;
                height: 27px;
                line-height: 27px;
                font-size: 19px;
                font-weight: bold;
            }
            span {
                em {
                    height: 18px;
                    line-height: 18px;
                    font-size: 13px;
                    font-style: normal;
                }
                i {
                    margin-left: 7px;
                    padding: 0 7px;
                    height: 14px;
                    font-size: 10px;
                    font-style: normal;
                    background: #F7B500;
                    border-radius: 14px;
                    border: 1px solid #FFFE00;
                }
            }
        }
    }
    .list {
        margin: 0 auto;
        width: 345px;
        background: #FFF;
        box-shadow: 1px 2px 6px 2px rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        ul {
            margin: 0 14px;
            padding: 7px 0 12px;
            display: flex;
            justify-content: space-around;
            border-bottom: 1PX solid #D3D3D3;
            li {
                img {
                    display: block;
                    width: 75px;
                    height: 75px;
                }
                span {
                  display: block;
                  font-size: 12px;
                  font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                  color: rgba(0, 0, 0, 0.85);
                  line-height: 17px;
                }
                em {
                  padding-top: 5px;
                  width: 120px;
                  height: 14px;
                  font-size: 10px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: rgba(149, 149, 149, 0.85);
                  line-height: 14px;
                  font-style: normal;
                }
            }
        }
        .total {
            padding: 10px 14px;
            text-align: left;
            h3 {
              height: 20px;
              line-height: 20px;
                span {
                    margin-right: 16px;
                    font-size: 13px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #333;
                    line-height: 18px;
                    em {
                        color: #F7B500;
                        font-style: normal;
                    }
                }
                a {
                  float: right;
                  font-size: 12px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #B4B4B4;
                }
            }
            .van-progress {
              margin: 8px 0;
              height: 10px!important;
            }

        }

    }
    .tasks {
        margin: 10px auto;
        padding: 0 10px;
        width: 325px;
        background: #FFF;
        box-shadow: 0px 2px 5px 2px rgba(0, 0, 0, 0.05);
        border-radius: 5px;
        h4 {
            padding: 10px 0 9px;
            line-height: 19px;
            border-bottom: 1px solid #E0E6ED;
            text-align: left;
            span {
                height: 19px;
                font-size: 15px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #333;
            }
            span:before {
                float: left;
                margin-right: 5px;
                content: '.';
                display: inline-block;
                width: 19px;
                height: 19px;
                display: block;
                text-indent: -9999px;
                background: url('/img/outer/current.png') no-repeat 0 0;
                background-size: 100% 100%;
            }
            a {
              float: right;
              line-height: 14px;
              padding: 2px 2px 0 0;
              color: #119C5B;
            }
            a:after {
                float: right;
                content: '.';
                display: inline-block;
                width: 10px;
                height: 10px;
                display: block;
                text-indent: -9999px;
                background: url('/img/outer/sortIcon.png') no-repeat 0 0;
                background-size: 100% 100%;
            }
        }
        ul li.task-item
           {
              padding: 10px 10px 9px 10px;
              border-bottom: 1px solid #E0E6ED;
              text-align: left;
                h5 {
                    margin-bottom: 3px;
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    height: 21px;
                    line-height: 21px;
                    font-size: 15px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #333;
                }
                p {
                    color: rgba(13, 82, 162, 0.49);
                }
                p.overdue {
                    color: #FA6400;
                }
        }
        ul li.task-item.delete {
            text-decoration: line-through;
            color: #B8B8B8;
            h5 {
                color: #B8B8B8;
            }
            p {
                color: #B8B8B8;
            }
            p.overdue {
                color: #B8B8B8;
            }
        }
    }
    .feature-tasks {
        h4 {
            span:before {
                background: url('/img/outer/notStarted.png') no-repeat 0 0;
                background-size: 100% 100%;
            }
        }

    }

}
</style>
