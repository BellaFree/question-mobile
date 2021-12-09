<template>
  <footer>
    <ul v-if='userInfo.deptName != "店长"'>
      <li class='taskMNG-btn' :class='option==1 ? "on" : ""'>
        <a :href='option==1 ? "javascript:void(0);" : "/home"'><span>首页</span></a>
      </li>
      <li class='creat-btn'>
        <a href='/create-task'><span>创建任务</span></a>
      </li>
      <li class='bench-btn' :class='option==3 ? "on" : ""'>
        <a :href='option==3 ? "javascript:void(0);" : "/workbench"'><span>工作台<i v-if='countNum != 0'>{{ countNum }}</i></span></a>
      </li>
    </ul>
  </footer>
</template>
<script>

export default {
  props: {
    option: {
      type: Number,
      default: 1
    }
  },
  data() {
      return {
          userInfo: {},
          countNum: 0
      };
  },
  mounted() {
      const userInfo = window.sessionStorage.getItem('userInfo');
      this.userInfo = userInfo ? JSON.parse(userInfo) : this.userInfo;
      this.getCountFn ();
  },
  methods: {
      getCountFn () {
          this.$fetch.get ('/api/approve/count', {
              userNo: this.userInfo.userNo
          }).then(res => {
              const { code, data, message } = res;
              if ( code != 200 || !data ) {
                  Notify ({ type: 'warning', message, duration: 1000 });
                  return;
              }
              this.countNum = data;
          });
      },
  }
};
</script>
<style lang="scss" scoped>
    footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      // height: 63px;

        ul {
            display: flex;
            width: 100%;
            height: 63px;
            background: #fff;
            li {
                flex: 1;
                span {
                    display: block;
                    width: 100%;
                    line-height: 17px;
                    font-size: 12px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #495060;
                    text-align: center;
                }
            }
            li.on {
                span {
                    color: #119C5B;
                }
            }
            .taskMNG-btn span,
            .bench-btn span {
                position: relative;

            }
            .taskMNG-btn span i,
            .bench-btn span i {
                position: absolute;
                top: 0;
                left: 50%;
                display: block;
                width: 15px;
                height: 15px;
                line-height: 15px;
                background: #FE0000;
                border: 1px solid #fff;
                font-size: 11px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                font-style: normal;
                color: #fff;
                border-radius: 50%;
            }
            .taskMNG-btn span:before,
            .bench-btn span:before {
                margin: 5px auto 2px;
                content: '.';
                width: 24px;
                height: 24px;
                display: block;
                text-indent: -9999px;
                background: url('/img/outer/taskManage.png') no-repeat 0 0;
                background-size: 100% 100%;
            }
            .taskMNG-btn.on span:before {
                background: url('/img/outer/taskManageOn.png') no-repeat 0 0;
                background-size: 100% 100%;
            }
            .bench-btn span:before {
                background: url('/img/outer/bench.png') no-repeat 0 0;
                background-size: 100% 100%;
            }
            .bench-btn.on span:before {
                background: url('/img/outer/benchOn.png') no-repeat 0 0;
                background-size: 100% 100%;
            }
            .creat-btn {
                position: relative;
            }
            .creat-btn a {
                position: absolute;
                top: 0;
                left: 50%;
                transform: translate(-50%, -50%);
                text-indent: -9999px;
                display: block;
                width: 61px!important;
                height: 61px;
                background: url('/img/outer/creatTask.png') no-repeat 0 0;
                background-size: 100% 100%;

            }
        }
    }
</style>
