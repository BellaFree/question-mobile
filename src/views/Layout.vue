<template>
  <div class="Layout">
    <NavigationBar
      :class="navClass"
      :heading="title"
      :navShowStatus="navShowStatus"
      :leftIcon="leftIcon"
      :leftTitle="leftTitle"
      :exportIcon="exportIcon"
      :rightIcon="rightIcon"
      :rightTitle="rightTitle"
      :onLeft="onClickLeft"
      :onRight="onClickRight"
      :onExport="onExportClick"
      v-if="isNav" />
    <div :class="isNav ? 'layout-container-nav' : 'layout-container-nonav'">
        <router-view />
    </div>
  </div>

</template>

<script>
// import { MessageBox } from 'mint-ui';
import { browser } from '@/utils';
import NavigationBar from '@/components/NavigationBar';

export default {
  name: 'Layout',
  components: { NavigationBar },
  data() {
    return {
      navClass: '',
      title: '',
      leftIcon: '',
      leftTitle: '',
      // 导出
      exportIcon: '',
      rightIcon: '',
      rightTitle: '',
      navShowStatus: true,
      onLeft: () => {},
      onRight: () => {},
      onExport:() => {},
      isLoginClass: 'login-off',
      isNav: true
    };
  },
  created() {
    this.$notice.$on('navigation', this.onNavigation);
  },
  mounted() {
    let os = browser();
    if (os.isApp) {
      this.isNav = false;
    }
    // if (!location.href.includes('/error/') && !location.href.includes('/enter')) {
    //     let { userId, SESSION } = this.$route.query
    //     if (!userId || !SESSION) {
    //       MessageBox({
    //         title: '提示',
    //         message: '用户Id或SESSION不存在！',
    //       });
    //     }
    //     // this.login(username, password);
    //     this.$cookies.set('SESSION', SESSION, {
    //         expires: '1M',
    //         domain: location.hostname
    //     });
    //     this.getUserInfoFn(userId);
    // }
  },
  destroyed() {
    this.$notice.$off('navigation', this.onNavigation);
  },
  beforeRouteLeave(to, from, next) {
    Object.assign(this.$data, {
      navClass: '',
      title: '',
      leftIcon: '',
      leftTitle: '',
      rightIcon: '',
      rightTitle: '',
      navShowStatus: true,
      onLeft: () => {},
      onRight: () => {},
      onExport:() => {}
    });
    next();
  },
  methods: {
    onNavigation(params) {
      console.info('onNavigation', this.$data, params)
      Object.assign(this.$data, params);
    },
    onClickLeft(e) {
        e && this.onLeft && this.onLeft(e);
    },
    onClickRight(e) {
      this.onRight && this.onRight(e);
    },
    onExportClick(e) {
      this.onExport && this.onExport(e);
    },
    // login (tuid, tuname) {
    //   this.$fetch.post('/api/common/mobile/login', {
    //     systemId: '8191ed2726114e4fb731f5b77e330ff9',
    //     tuid,
    //     tuname,
    //     isLoading: true
    //   }).then(res => {
    //       console.log(res);
    //       if (res.code == 200) {
    //         window.sessionStorage.setItem ('userInfo', JSON.stringify(res.data));
    //         console.log(window.sessionStorage.getItem('userInfo'));
    //         this.$store.commit('set_userInfo', res.data)
    //       }
    //   })
    // },

    // getUserInfoFn(userId) {
    //   this.$fetch.get(`/napi/dev/map/org/getUserAndCity?userId=${ userId }`, {}, { headers: { Accept: 'application/x-www-form-urlencoded' } }
    //   ).then(res => {
    //     if (res.code == 200) {
    //       const { cityList, ...userInfo } = res.data;
    //       Object.assign(userInfo, { userId });
    //       window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    //       window.sessionStorage.setItem('cityList', JSON.stringify(cityList));
    //     }
    //   });
    // }
  }
};
</script>
<style lang="scss" scoped>
.Layout {
  height: 100vh;
}
</style>
