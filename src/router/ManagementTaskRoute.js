const ManagementTaskLayoutView = () => import ('../views/management-task-views/LayoutView.vue');
const IndexView = () => import('../views/management-task-views/Index.vue');

export default {
    path: '/management-task',
    name: 'ManagementTaskLayoutView',
    component: ManagementTaskLayoutView,
    children: [
      {
        path: 'index',
        name: 'IndexView',
        component: IndexView,
      }
    ]
};
