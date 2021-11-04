const CreateTaskLayoutView = () => import ('../views/create-task-views/LayoutView.vue');
const IndexView = () => import('../views/create-task-views/Index.vue');

export default {
    path: '/create-task',
    name: 'CreateTaskLayoutView',
    component: CreateTaskLayoutView,
    children: [
      {
        path: 'index',
        name: 'IndexView',
        component: IndexView,
      }
    ]
};
