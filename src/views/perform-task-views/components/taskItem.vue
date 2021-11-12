<!--任务内容子项-->
<template>
  <div class="task-item-wrap">
    <!-- 任务名称  -->
    <div class="task-name">
      <i/>
      <p>堂食业绩争创</p>
      <span class="task-item-add">
        <svg-icon icon-class="addTaskItem"/>
      </span>
    </div>
    <!-- 任务 改善内容  -->
    <div class="improve-content">
      <van-field
          v-model="improveContentVal"
          label="改善内容:"
          autosize
          type="textarea"
          placeholder="请输入改善内容"
      />
    </div>
    <!-- 任务 改善时间  -->
    <div class="improve-time">
      <span class="improve-title">改善时间:</span>
      <p class="improve-time-value">
        <span class="placeholder">请选择时间(可填)</span>
        <span class="instruct">
          <svg-icon icon-class="yousanjiao" class-name="instruct-icon"></svg-icon>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "taskItem",
  filedAutosize: {
    minHeight: 50,
    maxHeight: 200
  },
  data() {
    return{
      // 改善内容
      improveContentVal: '',
      //
    }
  }
}
</script>

<style scoped lang="scss">
.task-item-wrap{
  background-color: #fff;
  box-shadow: 0 2px 5px 2px rgba(0,0,0,0.05);
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
</style>
