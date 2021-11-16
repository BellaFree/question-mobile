import Vue from 'vue'
import VueRouter from 'vue-router'
import LayoutView from '../views/Layout.vue'
import HomeView from '../views/Home.vue'
import DemoView from '../views/Demo.vue'
import CreateTaskRoute from './CreateTaskRoute.js';
import CheckInRoute from './CheckInRoute.js';
import PerformTaskRoute from './PerformTaskRoute.js';
import ManagementTaskRoute from './ManagementTaskRoute.js';
import StatisticalReportRoute from './StatisticalReportRoute.js';
import ApproveTaskRoute from './ApprovaTaskRoute.js';
import Workbench from '@/router/Workbench';
import storeChoose from "./storeChoose";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/home',
    component: LayoutView,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: HomeView,
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
      CreateTaskRoute,
      CheckInRoute,
      PerformTaskRoute,
      ManagementTaskRoute,
      StatisticalReportRoute,
      ApproveTaskRoute,
      Workbench,
      storeChoose,
      StatisticalReportRoute
    ]
  },

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
