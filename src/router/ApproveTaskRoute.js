const ApproveTaskLayoutView = () => import('../views/approve-task-views/LayoutView.vue');
const IndexView = () => import('../views/approve-task-views/index.vue');

export default {
  path: '/approve-task',
  name: 'ApproveTaskLayoutView',
  component: ApproveTaskLayoutView,
  children: [
    {
      path: 'index',
      name: 'IndexView',
      component: IndexView,
    }
  ]
};
