<template>
  <div>
    任务详情
    <van-popup v-model="show"  round  closeable position="bottom"  :style="{ height: '22%' }">
      <h3>更多操作</h3>
      <div class="list">
        <div class="list-img"><img :src="edit" alt=""><div>编辑修改</div></div>
        <div class="list-img"><img :src="stop" alt=""><div>中止任务</div></div>
        <div class="list-img"><img :src="del"  alt=""><div>删除任务</div></div>
      </div>


    </van-popup>
  </div>
</template>
<script>
export  default {
  name:'TaskDetails',
  subtitle() {
    return '任务详情';
  },
  leftIcon() {
    return 'arrow-left';
  },
  rightIcon() {
    return 'edit';
  },
  onLeft() {
    window.history.go(-1);
  },
  onRight(){
    this.show=true
  },
  data(){
    return{
      show:false,
      //图片引入
      edit:require("/src/assets/img/edit.png"),
      stop:require("/src/assets/img/stop.png"),
      del:require("/src/assets/img/del.png"),
    }
  },
  methods:{

  }
}
</script>
<style lang="scss" scoped>
.van-popup{
  background: #EFF0F1;
  h3{
    margin-top: 16px;
    font-size: 17px;
    font-weight: 600;
    color: #6B6B6B;
  }
}
.list{
  margin-top:21px;
  display: flex;
  justify-content: space-around;
  .list-img{
    img{
      width: 55px;
      height: 55px;
      margin-bottom:7px;
    }
    div{
      margin-left: 2px;
    }
  }
}

</style>