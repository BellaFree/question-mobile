const StatisticalReportLayoutView = () => import ('../views/statistical-report-views/LayoutView.vue');
const IndexView = () => import('../views/statistical-report-views/Index.vue');
const visitRecord =  () => import('../views/statistical-report-views/storeVisitRecord');

export default {
    path: '/statistical-report',
    name: 'StatisticalReportLayoutView',
    component: StatisticalReportLayoutView,
    children: [
      {
        path: 'index',
        name: 'IndexView',
        component: IndexView,
      },
        {
            path: 'visit-record',
            name: 'visitRecord',
            component: visitRecord
        }
    ]
};
