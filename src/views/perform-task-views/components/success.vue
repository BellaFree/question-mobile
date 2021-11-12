<!--任务成功提交页-->
<template>
  <div class="success-wrap">
      <!-- 成功提交 提示     -->
      <div class="content-tips">
          <svg-icon icon-class="success"/>
          <p>任务提交成功!</p>
      </div>
    <!--  btn 操作区    -->
    <div class="footer-btn">
      <button>查看任务</button>
      <button>返回首页</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "success"
}
</script>

<style scoped lang="scss">
  .success-wrap{
    width: 100%;
    height: 100%;
  }
  .content-tips{
    align-items: center;
    flex-direction: column;
    padding-top: 30%;
    svg{
      display: inline-block;
      width: 250px;
      height: 165px;
    }
    p{
      font-size: 20px;
      font-weight: 600;
      color: #333333;
    }
  }
  .footer-btn{
    width: 375px;
    height: 50px;
    background: linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%);
    box-shadow: 0 -2px 5px 0 rgba(0,0,0,0.06);
    padding-top: 10px;
    position: fixed;
    bottom: 34px;
    left: 0;
    button{
      broder: none;
      outline: none;
      width: 166px;
      height: 44px;
      background: linear-gradient(180deg, #7ACC2C 0%, #0A9B58 100%);
      border-radius: 22px;
      font-size: 16px;
      font-weight: 600;
      color: #FFFFFF;
      margin-right: 10px;
    }
  }
</style>
