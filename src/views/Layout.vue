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
      :onClose="onClickClose"
      :onRight="onClickRight"
      :onExport="onExportClick"
      v-if="isNav" />
    <div :class="isNav ? 'layout-container-nav' : 'layout-container-nonav'">
        <router-view />
    </div>
  </div>

</template>

<script>
import { MessageBox } from 'mint-ui';
import { browser } from '@/utils';
import NavigationBar from '@/components/NavigationBar';
import {Notify} from "vant";

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
      onClose: () => {},
      onRight: () => {},
      onExport:() => {},
      isLoginClass: 'login-off',
      isNav: true
    };
  },
  created() {
    this.$notice.$on('navigation', this.onNavigation);
  },
  mounted () {
    let userInfo = window.sessionStorage.getItem ('userInfo') ?  JSON.parse(window.sessionStorage.getItem ('userInfo')) : {}
    const userId = this.$route.query.userId || userInfo && userInfo.tuId;
    const SESSION = this.$route.query.SESSION || window.sessionStorage.getItem('SESSION');

    if (!userId || !SESSION) {
      Notify ({ type: 'warning', message: '缺少用户信息', duration: 1000 });
      return
    }
    window.sessionStorage.setItem ('SESSION', SESSION);
    this.$fetch.get (`/api/dev/map/org/getUserAndCity`, {
      userId: userId
    }, {
      isHeaderFormUrlencoded : true
    }).then (res => {
      const { code, data, message } = res;
      if ( code != 200 || !data ) {
        Notify ({ type: 'warning', message, duration: 1000 });
        return;
      }
      this.userInfo = {
        avatarUrl: '',
        deptName: '',
        orgName: '',
        orgNo: '',
        roleName: '',
        roleNo: '',
        userName: '',
        userNo: '',
      }
      Object.assign (this.userInfo, data);
      this.userInfo.tuid = this.userInfo.userNo;
      this.userInfo.tuidName = this.userInfo.userName;
      this.userInfo.orgId = this.userInfo.orgNo = this.userInfo.orgNo || this.userInfo.orgId;
      this.userInfo.orgname = this.userInfo.orgName;

      window.sessionStorage.setItem ('userInfo', JSON.stringify(this.userInfo));
    })
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
      onClose: () => {},
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
    onClickClose(e) {
        e && this.onClose && this.onClose(e);
    },
    onClickRight(e) {
      this.onRight && this.onRight(e);
    },
    onExportClick(e) {
      this.onExport && this.onExport(e);
    },
  }
};
</script>
<style lang="scss" scoped>
.Layout {
  height: 100vh;
}
</style>
