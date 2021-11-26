
const user = {
  state:{
    userInfo:{
      // 暂时写固定数据 便于接口请求数据，后期置空
      // tuid: '81011103',
      // orgId: '234',
      // orgname: '总部',
      tuid: 'T0018',
      tuidName: '测试名字',
      orgId: 'AA139120100000000',
      orgname: '',
    },
    token:null,
    hotPopulat: false, // 热力图开关
    layerShow: 0,
    zoom: 14,
    cityName: '',
    cityCode: '',
    planLngLat: '', // 市政规划跳转到地图页的点位位置
  },
  getters:{
    token:state => state.token,
    userInfo:state => state.userInfo,
    hotPopulat: state => state.hotPopulat,
    layerShow: state => state.layerShow,
    zoom:state => state.zoom, // 获取当前缩放级别
    cityName:state => state.cityName, // 获取中心点所在城市名字
    cityCode:state => state.cityCode, // 获取中心点所在城市code
    planLngLat: state => state.planLngLat,
    // 用户ID
    userId: state => state.tuid
  },
  mutations:{
    set_token:(state, token) => {
      state.token = token;
    },
    set_userInfo:(state, userInfo) => {
      state.userInfo = userInfo;
    },
    set_hotPopulat: (state, hotPopulat) => {
      state.hotPopulat = hotPopulat;
    },
    set_layerShow:(state, layerShow) => {
      state.layerShow = layerShow;
    },
    set_zoom:(state, zoom) => {
      state.zoom = zoom;
    },
    set_cityName:(state, cityName) => {
      state.cityName = cityName;
    },
    set_cityCode:(state, cityCode) => {
      state.cityCode = cityCode;
    },
    set_planLngLat:(state, planLngLat) => {
      state.planLngLat = planLngLat;
    },
  },
  actions:{
    setToken({ commit }, data) {
      commit('set_token', data);
    },
    setUser({ commit }, data) {
      commit('set_userInfo', data);
    },
    setHotPopulat({ commit }, data) {
      commit('set_hotPopulat', data);
    },
    setPlanLngLat({ commit }, data) {
      commit('set_planLngLat', data);
    },
  }

};

export default user;
