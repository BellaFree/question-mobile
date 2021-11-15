const WorkbenchLayoutView = () => import('../views/workbench/LayoutView.vue');
const IndexView = () => import('../views/workbench/Index.vue');

export default {
  path: '/workbench',
  name: 'WorkbenchLayoutView',
  component: WorkbenchLayoutView,
  children: [
    {
      path: '/',
      name: 'WorkbenchIndex',
      component: IndexView,
    }
  ]
};
