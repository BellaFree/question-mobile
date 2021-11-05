const PerformTaskLayoutView = () => import ('../views/perform-task-views/LayoutView.vue');
const IndexView = () => import('../views/perform-task-views/Index.vue');

export default {
    path: '/perform-task',
    name: 'PerformTaskLayoutView',
    component: PerformTaskLayoutView,
    children: [
      {
        path: 'index',
        name: 'IndexView',
        component: IndexView,
      }
    ]
};
