<template>
  <div class="create_task_type_wrap">
    <h2 class="create_task_type_title">请选择创建任务类型</h2>
    <div class="create_task_type_items">
      <div v-for="(task, taskIndex) in taskList" :key="taskIndex" @click.stop="handleSelectType(taskIndex)" :class="task.class">
        <div class="create_task_type_box">
          <div class="create_task_type_icon">
            <img :src="task.icon">
          </div>
          <div class="create_task_type_info">
            <strong>{{task.name}}</strong>
            <p>{{task.info}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="create_task_logo_bg"></div>
    <van-button @click="handleConfirm" class="create_task_confirm">确定创建</van-button>
  </div>
</template>
<script>
import Utils from '../../utils/utilsTask';
import imgIconCreateElse from '../../../public/img/create_task/icon_create_else.png';
import imgIconCreateVisit from '../../../public/img/create_task/icon_create_visit.png';
export default {
  name: 'IndexView',
  subtitle() {
    return '创建任务';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    window.location.href = 'http://103.13.247.70:8091/gisApp/page/home/home.html?timestamp=' + new Date().getTime();
  },
  data() {
    return {
      taskList: [
        {
          name: '访店任务',
          icon: imgIconCreateVisit,
          type: '1',
          info: '7大类型访店任务',
          class: [ 'create_task_type_item', 'create_task_type_item_active' ]
        },
        {
          name: '其他任务',
          icon: imgIconCreateElse,
          type: '2',
          info: '督导或主管权限配置的任务',
          class: ['create_task_type_item']
        }
      ],
      taskIndex: 0,
    };
  },
  mounted() {
  },
  methods: {
    /**
     * @description: 选择任务类型
     * @param {*} index 选择的下标
     * @param {*} taskType 任务类型
     * @return {*}
     */
    handleSelectType(typeIndex) {
      this.taskList.map((item, index) => {
        if (typeIndex == index) {
          item.class = [ 'create_task_type_item', 'create_task_type_item_active' ];
          this.taskIndex = index;
        } else {
          item.class = ['create_task_type_item'];
        }
      });
    },
    handleConfirm() {
      let task = Utils.cloneDeep(this.taskList[this.taskIndex]);
      delete task.class;
      delete task.icon;
      this.$router.push({ name: 'CreateTask', params: task });
    }
  }
};
</script>
<style lang="scss" scoped>
$mainColor: #0A9B58;
.create_task_type_wrap {
  .create_task_type_title {
    margin-top: 40px;
  }
  .create_task_type_items {
    margin: 100px auto 0;
    width: 272px;
    .create_task_type_item {
      position: relative;
      width: 100%;
      border-width: 3px;
      border-radius: 30px;
      border-style: solid;
      background: #F9FFED;
      box-sizing: border-box;
      border-color: transparent;
      margin-bottom: 60px;
      box-shadow: 0px 1px 3px 2px rgba(0,0,0,0.11);
      &.create_task_type_item_active {
        border-color: $mainColor;
        &:after {
          z-index: -1;
          display: inline-block;
          position: absolute;
          left: 20px;
          top: -31px;
          content: 'dicos';
          color: $mainColor;
          font-size: 30px;
          font-weight: bold;
        }
      }
      .create_task_type_box {
        display: flex;
        padding: 20px 26px;
        .create_task_type_icon {
          margin-right: 17px;
          width: 50px;
          height: 50px;
          img {
            width: 100%;
          }
        }
        .create_task_type_info {
          text-align: left;
          strong {
            display: inline-block;
            margin-top: 6px;
            color: #333;
            font-size: 16px;
          }
          p {
            color: $mainColor;
          }
        }
      }
    }
  }
  .create_task_confirm {
    position: absolute;
    left: 50%;
    bottom: 50px;
    width: 345px;
    height: 44px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    background: linear-gradient(180deg, #7ACC2C 0%, $mainColor 100%);
    border-radius: 22px;
    transform: translateX(-50%);
  }
  .create_task_logo_bg {
    position: absolute;
    left: 0;
    bottom: 65px;
    width: 158px;
    height: 166px;
    background: url('../../../public/img/create_task/bg_create_logo.png');
    background-size: cover;
  }
}
</style>
