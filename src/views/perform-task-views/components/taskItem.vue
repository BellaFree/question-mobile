<!--任务内容子项-->
<template>
  <div class="task-item-wrap">
    <!-- 任务名称  -->
    <div class="task-name">
      <i />
      <p>{{ list.workContentName }}</p>
      <span v-if="$attrs.editStatus" class="task-item-add" @click="addItem">
        <svg-icon icon-class="addTaskItem" />
      </span>
    </div>
    <template v-for="(item, childIndex) of list.children">
      <div v-if="item.status !== 'D'" :key="item.workNo + '_' + childIndex">
        <!-- 任务 改善内容  -->
        <div v-if="childIndex > 0 && $attrs.editStatus" class="improve-header">
          <span @click="deleteItem(childIndex)"><svg-icon icon-class="close" /></span>
        </div>
        <div class="improve-content">
          <van-field
            v-model="item.improveContent"
            label="改善内容:"
            autosize
            type="textarea"
            maxlength="100"
            placeholder="请输入改善内容"
            :readonly="!$attrs.editStatus"
            @blur="blurInput(item.improveContent)" />
        </div>
        <!-- 任务 改善时间  -->
        <div class="improve-time">
          <span class="improve-title">改善时间:</span>
          <p class="improve-time-value" @click="openTime(childIndex)">
            <span :class="{'placeholder': true, 'active': item.improveDate}">{{ item.improveDate ? moment(item.improveDate).format('YYYY-MM-DD') : '请选择时间(可填)' }}</span>
            <span class="instruct">
              <svg-icon icon-class="yousanjiao" class-name="instruct-icon" />
            </span>
          </p>
        </div>
        <!-- 任务 上传附件  -->
        <div class="improve-file">
          <div class="improve-file-title">上传附件：</div>
          <upload
            ref="uploadChild"
            :file="item.filesRealUrl"
            :fileName="item.filesUrl"
            :index="{
              index: index,
              childIndex: childIndex
            }"
            :updateKey="updateKey"
            :closeShow="$attrs.editStatus"
            v-bind="$attrs"
            v-on="$listeners" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import upload from '@/components/upload/index';
import moment from 'moment';
export default {
  name: 'taskItem',
  filedAutosize: {
    minHeight: 50,
    maxHeight: 200
  },
  components: { upload },
  props: ['list', 'index', 'openTimeChoose', 'addChildItem', 'handleTaskType'],
  data() {
    return {
      // 上传的文件
      uploadUrl: '',
      updateKey: 0
    };
  },
  mounted() {
    this.updateKey = new Date().getTime();
  },
  methods: {
    moment,
    // 开启时间选择
    openTime(childIndex) {
      if (!this.$attrs.editStatus) {
        return;
      }
      this.$emit('openTimeChoose', this.index, childIndex);
    },
    // 添加子类
    addItem() {
      if (!this.$attrs.editStatus) {
        return;
      }
      this.$emit('addChildItem', this.index);
    },
    blurInput(value) {
      if (!value) {
        return false;
      }
    },
    // 删除改善子类
    deleteItem(childIndex) {
      if (!this.$attrs.editStatus) {
        return;
      }
      this.$emit('deleteItem', this.index, childIndex);
    }
  }
};
</script>

<style scoped lang="scss">
.task-item-wrap{
  background-color: #fff;
  box-shadow: 0 2px 5px 2px rgba(0,0,0,0.05);
  ::v-deep{
    .van-calendar__day--end, .van-calendar__day--start{
      background-color: rgba(10, 155, 88, .9);
    }
    .van-calendar__day--middle{
      background-color: rgba(10, 155, 88, .4);
      color: #343333;
    }
    .van-calendar__confirm{
      background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
      border: 1px solid #0A9B58;
    }
  }
}
.task-name{
  display: flex;
  align-items: center;
  height: 40px;
  background-color: #fff;
  text-align: left;
  position:relative;
  i{
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background: #0A9B58;
    margin-left: 10px;
    margin-right: 5px;
  }
  p{
    font-size: 14px;
    font-weight: 600;
    color: #3A3A3A;
  }
  .task-item-add{
    display: inline-block;
    width: 20px;
    height: 20px;
    position: absolute;
    top: 12px;
    right: 15px;
    svg{
      display: inline-block;
      width: 20px;
      height: 20px;
    }
  }
}
.improve-content{
  display: flex;
  background-color: #fff;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  ::v-deep{
    .van-cell{
      padding: 0;
    }
    .van-cell__title{
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      width: 60px;
    }
    .van-cell__value{
      flex-shrink: 0;
      width: 154px !important;
    }
    .van-field__body{
      width: 154px !important;
    }
    .van-field--min-height .van-field__control{
      min-height: 50px;
    }
    .van-cell--required::before{
      display: none;
    }
    .van-field--error .van-field__control, .van-field--error .van-field__control::placeholder{
      color: #333333;
      -webkit-text-fill-color: #333333;
    }
  }
}
.improve-header{
  height: 30px;
  position: relative;
  span{
    display: inline-block;
    color: #D5D5D5;
    width: 30px;
    height: 30px;
    position: absolute;
    top: 0;
    right: 10px;
  }
  svg{
    width: 100%;
    height: 100%;
  }
}
.improve-title{
  display: inline-block;
  width: 60px;
  font-size: 14px;
  font-weight: 400;
  color: #3A3A3A;
  line-height: 20px;
  margin-right: 12px;
}
.improve-time{
  display: flex;
  height: 50px;
  background-color: #fff;
  align-items: center;
  padding: 0 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  &-value{
    position: relative;
    width: 160px;
    text-align: left;
    .placeholder{
      font-size: 12px;
      font-weight: 400;
      color: #C3C3C3;
      line-height: 17px;
      text-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    }
    .active{
      color: #333;
      font-size: 14px;
    }
    .instruct{
      position: absolute;
      right: 0;
      top: -8px;
    }
    .instruct-icon{
      width: 30px;
      height: 30px;
    }
  }
}
.improve-file{
  text-align: left;
  padding: 0 10px 10px 10px;
  &-title{
    font-size: 14px;
    font-weight: 400;
    color: #333;
    line-height: 30px;
  }
}
</style>
