const index =()=>import('../views/approve-task-views/index');
const TaskApprovalLayoutView=()=>import('../views/approve-task-views/LayoutView');
const ApproveList=()=>import('../views/approve-task-views/ApproveList');
const ApproveDetails=()=>import('../views/approve-task-views/ApproveDetails');
const locationDetails=()=>import('../views/approve-task-views/locationDetails');
export default {
    path:'/task-Approval',
    name:'TaskApprovalLayoutView',
    component:TaskApprovalLayoutView,
    children:[
        {
            path:'index',
            name:'index',
            component:index,
        },
        //审批列表
        {
            path:'ApproveList',
            name:'ApproveList',
            component:ApproveList
        },
        //审批详情
        {
            path:'ApproveDetails',
            name:'ApproveDetails',
            component:ApproveDetails,
        },
        //任务地点详情
        {
            path:'locationDetails',
            name:'locationDetails',
            component:locationDetails,
        },
    ]
}