const IndexView =()=>import('../views/statistical-report-views/Index');
const StatisticalReportLayoutView=()=>import('../views/statistical-report-views/LayoutView');
const Division=()=>import('../views/statistical-report-views/Division');
const ListDetails=()=>import('../views/statistical-report-views/ListDetails');
const StatisticalReport=()=>import('../views/statistical-report-views/StatisticalReport')
const DivisionDetail=()=>import('../views/statistical-report-views/DivisionDetail')
const visitRecord =  () => import('../views/statistical-report-views/storeVisitRecord');

export default {
    path:'/Statistical-Report',
    name:'StatisticalReportLayoutView',
    component:StatisticalReportLayoutView,
    children:[
        {
            path:'index',
            name:'IndexView',
            component:IndexView,
        },
        //事业部
        {
            path:'Division',
            name:'Division',
            component:Division,
        },
        //列表详情
        {
            path: 'ListDetails',
            name:'ListDetails',
            component:ListDetails,
        },
        //统计报表
        {
            path:'StatisticalReport',
            name:'StatisticalReport',
            component:StatisticalReport
        },
        //统计报表-->事业部
        {
            path:'DivisionDetail',
            name:'DivisionDetail',
            component:DivisionDetail
        },
        {
            path: 'visit-record',
            name: 'visitRecord',
            component: visitRecord
        }
    ]
};
