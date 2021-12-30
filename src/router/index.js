import Vue from 'vue'
import VueRouter from 'vue-router'
import LayoutView from '../views/Layout.vue'
import HomeView from '../views/Home.vue'
import DemoView from '../views/Demo.vue'
import OperationRouter from './operation'
import CheckInRoute from './CheckInRoute.js';
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/operation/index',
    component: LayoutView,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: HomeView,
        meta: {
            keepalive: false
        }
      },
      {
        path: '/demo',
        name: 'Demo',
        component: DemoView,
      },
      {
        path: '/error/:id',  // id: 1-错误提示页，2-未登录提示页
        name: 'Error',
        component: () => import(/* webpackChunkName: "about" */ '../views/ErrorPage.vue')
      },
      OperationRouter,
      CheckInRoute
    ]
  },

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
