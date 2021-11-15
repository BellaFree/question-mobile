const CreateTaskLayoutView = () => import('../views/create-task-views/LayoutView.vue');
const IndexView = () => import('../views/create-task-views/Index.vue');
const CreateTask = () => import('../views/create-task-views/CreateTask.vue');

export default {
  path: '/create-task',
  name: 'CreateTaskLayoutView',
  component: CreateTaskLayoutView,
  children: [
    {
      path: '/',
      name: 'CreateIndex',
      component: IndexView,
    },
    {
      path: '/create-task/create',
      name: 'CreateTask',
      component: CreateTask
    }
  ]
};
