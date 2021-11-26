const ManagementTaskLayoutView = () => import ('../views/management-task-views/LayoutView.vue');
const IndexView = () => import('../views/management-task-views/Index.vue');
const Itinerary=()=>import('../views/management-task-views/Itinerary');
// const TaskDetails=()=>import('../views/management-task-views/TaskDetails');
// const TaskDetailsEdit=()=>import('../views/management-task-views/TaskDetailsEdit.vue');
export default {
    path: '/management-task',
    name: 'ManagementTaskLayoutView',
    component: ManagementTaskLayoutView,
    children: [
      {
        path: 'index',
        name: 'IndexView',
        component: IndexView,
      },
        //行程日程
        {
            path:'Itinerary',
            name:'Itinerary',
            component:Itinerary,
        },
        //行程日程--任务详情
        // {
        //   path:'TaskDetails',
        //   name:'TaskDetails',
        //   component:TaskDetails,
        // },
        //行程日程--任务详情--编辑
        // {
        //     path:'TaskDetailsEdit',
        //     name:'TaskDetailsEdit',
        //     component:TaskDetailsEdit,
        // }
    ]
};
