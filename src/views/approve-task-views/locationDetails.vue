<template>
  <!--    任务地点详情-->
  <div class="wrap">
    <div class="title">选择执行人，会出现对应的任务门店</div>
    <div class="users">
      <div :class="index===currentIndex?'border':'borderactive'" v-for="(item,index) in userList" :key="index"  >
      <div class="user" @click="check(index)" >{{item.name}}</div><div v-show="index===currentIndex" class="san"></div>
      </div>
      <div class="line"></div>
    </div>
    <div class="list" v-for="(item,index) in locallist" :key="index">
        <div class="img"><img src="" alt=""></div>
      <ul>
        <li class="shop">德克士（火车站店)</li>
        <li class="local"><van-icon name="location-o" />上海市静安区曹家渡万航渡路849号海森国际大厦(康定路)</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name:'locationDetails',
  subtitle() {
    return '任务地点详情';
  },
  leftIcon() {
    return 'arrow-left';
  },
  onLeft() {
    window.history.go(-1);
  },
  data(){
    return{
      currentIndex:0,
      locallist:[{}],
      userList:[{name:'亮亮'},{name:'吴京'},{name:'美丽'},{name:'小米'}]
    }
  },
  methods:{
    check(index){
      this.currentIndex=index;
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap{
  width: 100%;
  background: #FAFAFA;
  overflow: hidden;
}
.title{
  font-size: 14px;
  font-weight: 500;
  color: #495060;
  margin: 12px 0px;
}
/*执行人列表*/
.users{
  width: 344px;
  height: 79px;
  margin: 0 auto;
  padding-left: 11px;
  padding-bottom: 10px;
  background: #FFFFFF;
  box-shadow: 0px 2px 5px 2px rgba(0,0,0,0.03);
  border-radius: 5px;
  overflow: hidden;
  /*点击后样式*/
  .borderactive{
    width: 50px;
    height: 50px;
    float: left;
    border-radius: 50%;
    position: relative;
    margin: 11px 9px 15px 5px;
    border: 2px solid  #FFFFFF;
  }
  .border{
    width: 50px;
    height: 50px;
    float: left;
    position: relative;
    margin: 11px 9px 15px 5px;
    border-radius: 50%;
    border: 2px solid #F7B500;
  }
 .line{
   width: 13px;
   height: 79px;
   float: right;
   background: #FFFFFF;
   box-shadow: -1px 0px 5px 0px rgba(0,0,0,0.1);
   border-radius: 0px 5px 5px 0px;
 }
}
//执行人样式
.user{
  width: 40px;
  height: 40px;
  margin: 5px;
  font-size: 12px;
  font-weight: 500;
  color: #FFFFFF;
  text-align: center;
  line-height: 40px;
  border-radius: 50%;
  background: #0A9B58;
}
//点击后三角形
.san{
  width: 0;
  height: 0;
  left:18px;
  top:55px;
  position: absolute;
  border-right:8px solid transparent ;
  border-left: 8px solid transparent;
  border-bottom:8px solid #F7B500;

}
//门店列表
.list{
  overflow: hidden;
  width: 355px;
  height: 89px;
  margin: 10px auto;
  background: #FFFFFF;
  box-shadow: 0px 2px 5px 2px rgba(0,0,0,0.03);
  border-radius: 5px;
  .img{
    width: 99px;
    height: 68px;
    float: left;
  }
  ul{
    float: left;
    margin: 10px 10px 14px 10px;
    .shop{
      text-align: left;
      font-size: 15px;
      font-weight: 600;
      color: #424242;
    }
    .local{
      width: 224px;
      margin-top: 7px;
      text-align: left;
      font-size: 13px;
      font-weight: 400;
      color: #999999;
    }
  }
}

</style>