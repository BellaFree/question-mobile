import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import './icons';
import '../public/style/basic.scss'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import Vant from 'vant';
import 'vant/lib/index.css';
import VueCookies from 'vue-cookies';
import titleMixin from './utils/title.js'
import navigation from './utils/navigation.js'
import notice from './utils/notice.js'
// import 'amfe-flexible/index.js'
import 'lib-flexible/flexible'
import store from './store'
import { fetch } from '../api'
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(Vant);
Vue.use (fetch)
Vue.use(notice)
Vue.use(VueCookies)
Vue.mixin(navigation)
Vue.mixin(titleMixin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
