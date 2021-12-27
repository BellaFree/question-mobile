<template>
  <div class="error-page-wrapper">
    <div class="item-page" v-if="id === '1'">
      <img src="/img/icons/error_page.png" alt="" />
      <p>哎呀，抱歉，页面出错了，请返回重新尝试</p>
      <van-button
        class="back-button"
        type="primary"
        color="#19be6b"
        @click="toBack"
        >返回</van-button
      >
    </div>
    <div class="item-page" v-if="id === '2'">
      <img src="/img/icons/overtime_page.png" alt="" />
      <p>你的账户信息已过期，请重新登录</p>
      <van-button
        class="back-button"
        type="primary"
        color="#19be6b"
        @click="toLogin"
        >登录</van-button
      >
    </div>
    <div class="item-page" v-else>
      <img src="/img/icons/overtime_page.png" alt="" />
      <p>您的账户暂未开通权限</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "ErrorPage",
  subtitle() {
    return "提示信息";
  },
  leftIcon() {
    return "arrow-left";
  },
  onLeft() {
    this.$router.go(-1);
  },
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  methods: {
    toBack() {
      this.$router.go(-1);
    },
    toLogin() {
      // 后期改为跳转登录页路由
        window.location.href = 'http://103.13.247.70:8091/gisApp/page/home/home.html?timestamp=' + new Date().getTime()
    },
  },
};
</script>

<style lang="scss" scoped>
.error-page-wrapper {
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  padding-top: 50px;
  .item-page {
    height: 100%;
    position: relative;
    img {
      width: 230px;
      height: 240px;
      margin-top: 20%;
    }
    p {
      margin-top: 30px;
      font-size: 14px;
    }
    .back-button {
      position: absolute;
      bottom: 30px;
      left: calc(50% - 65px);
      width: 130px;
      height: 45px;
    }
  }
}
</style>
