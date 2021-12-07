const CheckInLayoutView = () => import ('../views/check-in-views/LayoutView.vue');
const IndexView = () => import('../views/check-in-views/Index.vue');
const CheckInResult = () => import('../views/check-in-views/CheckInResult.vue');

export default {
    path: '/check-in',
    name: 'CheckInLayoutView',
    component: CheckInLayoutView,
    children: [
      {
        path: 'index',
        name: 'IndexView',
        component: IndexView,
      },
      {
        path: 'result',
        name: 'CheckInResult',
        component: CheckInResult,
      }
    ]
};
