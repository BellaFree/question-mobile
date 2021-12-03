<template>
    <div class="home">
        <div class='user-info'>
            <img src='/img/outer/user.png' alt='' @click='jumpDemo' />
            <div>
              <p><span>{{ userInfo.userName }}</span> ，欢迎登录！</p>
              <span><em>{{ userInfo.orgName }}</em><i>{{ userInfo.deptName || '超级管理员' }}</i></span>
            </div>
        </div>
        <div class='list'>
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
            <div class='total' v-if='userInfo.deptName != "店长"'>
                <h3>
                    <span>本月计划任务: <em>{{ progressNum.planned }}</em></span><span>本月完成任务: <em>{{ progressNum.completed }}</em></span>
                    <a href='javascript:void(0);'>更多<van-icon name="arrow" /></a>
                </h3>
                <van-progress :percentage=" percentage " pivot-text="" pivot-color="#0A9B58" color="linear-gradient(to right, #0A9B58, #7ACC2C)" />
            </div>
        </div>
        <div class='tasks current-tasks'>
            <h4>
              <span>今日任务</span>
              <a href='javascript:void(0);'>截止时间</a>
            </h4>
            <ul>
                <li v-for='(item, i) in today' :key='i'>
                    <van-checkbox class='task-item' v-model="checked" checked-color="#07c160" shape="square">
                        <h5>{{ item.workName }}</h5>
                        <p>{{ item.endDate }}任务截止 <span v-if='item.workStatus == "已逾期"'>已逾期</span></p>
                    </van-checkbox>
                </li>
                <!-- <li>
                    <van-checkbox class='task-item' v-model="checked" checked-color="#07c160" shape="square">
                        <h5>德克士(新客站封闭路段)</h5>
                        <p>10月27日任务截止</p>
                    </van-checkbox>
                </li>
                <li>
                    <van-checkbox class='task-item' v-model="checked" checked-color="#07c160" shape="square">
                        <h5>德克士(宝山路地铁站)</h5>
                        <p>10月27日任务截止</p>
                    </van-checkbox>
                </li> -->
            </ul>
        </div>
        <div class='tasks not-start-tasks'>
            <h4>
              <span>即将开始</span>
              <a href='javascript:void(0);'>创建时间</a>
            </h4>
            <ul>
                <li v-for='(item, i) in feature' :key='i'>
                    <van-checkbox class='task-item' v-model="checked" checked-color="#07c160" shape="square">
                        <h5>{{ item.workName }}</h5>
                        <p>{{ item.startDate }} - {{ item.endDate }}</p>
                    </van-checkbox>
                </li>
                <!-- <li>
                    <van-checkbox class='task-item' v-model="checked" checked-color="#07c160" shape="square">
                        <h5>德克士(外滩餐厅)</h5>
                        <p>10月27日 - 11月3日</p>
                    </van-checkbox>
                </li>
                <li>
                    <van-checkbox class='task-item' v-model="checked" checked-color="#07c160" shape="square">
                        <h5>德克士(北石路店)</h5>
                        <p>10月27日20:00 -12月28日</p>
                    </van-checkbox>
                </li> -->
            </ul>
        </div>
        <FooterBar :option=1 />
    </div>
</template>

<script>
// @ is an alias to /src
import { mixin } from '@/utils'
import FooterBar from '@/components/FooterBar.vue'
import { changeStatusBar } from '@/utils/interact.js'
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
  onLeft() {
      changeStatusBar ('FFFFFF').then (() => {
          history.go(-1)
      })
  },
  data () {
    return {
      checked: false,
      userInfo: {},
      percentage: 0,
      progressNum: {},
      feature: [],
      today: []
    }
  },
  components: {
    FooterBar
  },
  mixins: [mixin],
  beforeMount () {
    changeStatusBar ('0A9B58').then(() => {
        console.log('0A9B58 HOME statusBarColor');
    })
  },
  mounted () {
      if (window.sessionStorage.getItem ('userInfo')) {
          console.log('90909090');
          this.userInfo = JSON.parse(window.sessionStorage.getItem ('userInfo')) || this.userInfo
      }
      this.getProgressFn ()
      this.getTodayFn ()
  },
  methods: {
    jumpDemo () {
        location.href = '/demo';
    },
    getProgressFn () {
        this.$fetch.get (`/api/dicos/task/progress?userNo=${this.userInfo.userNo}`).then(res => {
            console.log ('res:', res);
            const { code, data, message } = res;
            if ( code != 200 ) {
                Notify ({ type: 'warning', message, duration: 1000 });
                return;
            }
            this.progressNum = data;
            this.percentage = (this.progressNum.completed / this.progressNum.planned) * 100;
        });
    },
    
    getTodayFn () {
        this.$fetch.get (`/api/dicos/task/today?userNo=${this.userInfo.userNo}`).then(res => {
            const { code, data, message } = res;
            if ( code != 200 || !data ) {
                Notify ({ type: 'warning', message, duration: 1000 });
                return;
            }
            // console.log('data:', data);
            this.feature = data.feature;
            this.today = data.today;
        });
    },
  },

}
</script>
<style lang="scss">
nav.shop-inspect-nav {
    background: url('/img/outer/bg.png') no-repeat 0 0;
    background-size: 100% auto;
    border-bottom: 0 none;
    color: #fff;
}
.home {
    width: 100%;
    padding-top: 50px;
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
                  // :after {

                  // }
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
        ul li {
          .task-item {
              padding: 10px 0 9px;
              border-bottom: 1px solid #E0E6ED;
              .van-checkbox__label {
                  margin-left: 12px!important;
                  h5 {
                      margin-bottom: 3px;
                      height: 21px;
                      line-height: 21px;
                      font-size: 15px;
                      font-family: PingFangSC-Semibold, PingFang SC;
                      font-weight: 600;
                      color: #333;
                  }
                  p {
                      text-align: left;
                  }
              }

          }
        }
    }
    .not-start-tasks {
        h4 {
            span:before {
                background: url('/img/outer/notStarted.png') no-repeat 0 0;
                background-size: 100% 100%;
            }
        }
    }

}
</style>
