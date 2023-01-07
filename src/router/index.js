import Vue from 'vue'
import VueRouter from 'vue-router'
import LayoutView from '../views/Layout.vue'
import HomeView from '../views/Home.vue'
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: LayoutView,
    children: [
      {
        path: '/home',
        name: 'Home',
        component: HomeView,
      },
    ]
  },

];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router
