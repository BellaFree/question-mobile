<template>
  <div class="create_task">
    <van-cell-group class="create_task_cell_group" inset>
      <van-field v-model="taskType.name" label="任务类型：" placeholder="请输入用户名" readonly />
    </van-cell-group>
    <van-cell-group class="create_task_cell_group" inset>
      <van-field v-model="task.workName" label="任务名称：" placeholder="请输入任务名称" />
      <van-field v-model="task.description" label="任务描述：" placeholder="请输描述任务内容" />
      <van-cell class="ctcg_cell_width" title="执行人：" @click="handleCellSelectApprove" clickable>
        <template value>
          <div class="ctcg_cell_executor">
            <div class="ctcg_cell_executor_list">
              <p>选择任务执行人</p>
            </div>
            <div class="ctcg_cell_icon_add">
              <img :src="img.imgIconCreateAdd" alt="">
            </div>
          </div>

        </template>
      </van-cell>
      <van-cell class="ctcg_cell_width" title="任务地点：" value="请选择任务地点" is-link></van-cell>
    </van-cell-group>

    <van-cell-group class="create_task_cell_group" inset>
      <van-cell title="任务开始时间：" value="请选择任务开始时间" is-link></van-cell>
      <van-cell title="任务截止时间：" value="请选择任务截止时间" is-link></van-cell>
    </van-cell-group>

    <van-cell-group class="create_task_cell_group" inset>
      <van-cell title="任务审批流程">
        <template #right-icon>
          <van-switch v-model="task.isApprove" size="22px" active-color="#0A9B58" />
        </template>
      </van-cell>
      <div class="ctcg_approve_items">
        <div v-for="(approve, approveIndex) in approveList"
          :key="approveIndex"
          class="ctcg_approve_item"
        >
          <div class="ctcg_approve_item_left">
            <div class="ctcg_approve_name">
              <div class="ctcg_approve_dot"></div>
              <h4>审批人1</h4>
            </div>
            <div class="ctcg_approve_position">主管审批</div>
            <div class="ctcg_approve_handle">
              <div class="ctcg_approve_handle_button"
                @click="handleApproveListAdd"
              >添加</div>
              <div class="ctcg_approve_handle_button"
                @click="handleApproveListRemove"
              >删除</div>
            </div>
          </div>
          <div class="ctcg_approve_item_right">
            <div class="ctcg_approve_person_items">
              <div class="ctcg_approve_person_item">亮亮
                <div class="ctcg_approve_person_item_name">张亮亮</div>
              </div>
              <div class="ctcg_approve_person_item_divider">+</div>
              <div class="ctcg_approve_person_item ctcg_approve_person_item_push"></div>
            </div>
          </div>
        </div>
      </div>
    </van-cell-group>

    <div class="handle_confirm_box">
      <van-button class="handle_confirm">立即提交</van-button>
    </div>
    <SelectApprove />
  </div>
</template>

<script>
import imgIconCreateAdd from '../../../public/img/create_task/icon_create_add.png';
import SelectApprove from './components/SelectApprove.vue';
export default {
  name: 'CreateTask',
  components: {SelectApprove},
  subtitle() {
    return '创建任务';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    this.$router.go(-1);
  },
  data() {
    return {
      img: { imgIconCreateAdd },
      taskType: {},
      task: {
        workName: '',
        description: '',
        isApprove: true,
      },
      approveList: [
        [],
        [],
        [],
        [],
      ]
    };
  },
  created() {
    let task = this.$route.params;
    this.taskType = task;
    this.taskType = {
      name: '访店任务',
      type: '1',
      info: '7大类型访店任务',
    };
    if (this.taskType.type === '1') {
      this.taskType.name = '标准访店任务';
    }
  },
  methods: {
    handleCellSelectApprove() {

      this.$notice.$emit('navigation', {
        title: '选择执行人'
      })
    },
    handleApproveListAdd() {
      console.log(1);
    },
    handleApproveListRemove() {
      console.log(2);
    }
  }
};
</script>

<style lang="scss" scoped>
$mainColor: #0A9B58;
.create_task {
  padding-bottom: 100px;
  .create_task_cell_group {
    margin-top: 20px;
    box-shadow: 0px 2px 5px 2px rgba(0,0,0,0.05);
    .van-cell {
      &:after {
        left: 0;
      }
      &.ctcg_cell_width {
        .van-cell__title {
          flex-grow: 0;
          flex-shrink: 0;
          flex-basis: auto;
          display: block;
        }
      }
      .ctcg_cell_executor {
        display: flex;
        justify-content: space-between;
        .ctcg_cell_executor_list {

        }
        .ctcg_cell_icon_add {
          width: 20px;
          height: 20px;
          img {
            width: 100%;
          }
        }
      }
    }
    .van-cell {
      font-style: 20px;
      &::v-deep .van-cell__title {
        margin-right: 0;
        width: 80px;
        color: #333;
        text-align: left;
        font-style: 14px;
        font-weight: bold;
      }
    }
    .ctcg_approve_items {
      .ctcg_approve_item {
        padding: 10px 16px;
        display: flex;
        justify-content: space-between;
        .ctcg_approve_item_left {
          display: flex;
          flex-direction: column;
          flex-grow: 0;
          .ctcg_approve_name {
            display: flex;
            align-items: center;
            font-size: 15px;
            .ctcg_approve_dot {
              position: relative;
              display: inline-block;
              margin-right: 10px;
              width: 13px;
              height: 13px;
              background: #d8d8d8;
              border-radius: 50%;
              &::after {
                position: absolute;
                left: 50%;
                bottom: 100%;
                display: block;
                height: 75px;
                content: '';
                border-right: 1px solid #d8d8d8;
                transform: translateX(-50%);
              }
            }
          }
          .ctcg_approve_position {
            display: block;
            padding: 4px 0;
            padding-left: 10px;
            color: #999;
            font-size: 13px;
          }
          .ctcg_approve_handle {
            display: flex;
            padding-left: 24px;
            .ctcg_approve_handle_button {
              color: $mainColor;
              font-size: 13px;
              & ~ .ctcg_approve_handle_button {
                margin-left: 10px;
              }
            }
          }
        }
        .ctcg_approve_item_right {
          flex-grow: 1;
          .ctcg_approve_person_items {
            display: flex;
            justify-content: right;
            .ctcg_approve_person_item {
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
              width: 40px;
              height: 40px;
              color: #fff;
              font-size: 13px;
              background: $mainColor;
              border-radius: 50%;
              .ctcg_approve_person_item_name {
                position: absolute;
                bottom: -24px;
                color: #999999;
                font-size: 12px;
              }

              &.ctcg_approve_person_item_push {
                background: url('../../../public/img/create_task/icon_create_add.png');
                background-size: cover;
                border-radius: initial;
              }
            }
            .ctcg_approve_person_item_divider {
              padding: 0 6px;
              height: 40px;
              line-height: 40px;
              color: #999;
              font-size: 15px;
            }
          }
        }
      }
      .ctcg_approve_item:nth-child(1) {
        .ctcg_approve_item_left {
          .ctcg_approve_name {
            .ctcg_approve_dot {
             &::after {
                display: none;
              }
            }
          }
        }
      }
    }
  }
  .handle_confirm_box {
    position: fixed;
    padding-top: 5px;
    padding-bottom: 35px;
    left: 0;
    bottom: 0;
    width: 100%;
    box-shadow: 0px -2px 5px 0px rgba(0,0,0,0.06);
    background: #fff;
    .handle_confirm {
      margin: 0 auto;
      width: 345px;
      height: 44px;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
      border-radius: 22px;
    }
  }
}
</style>
