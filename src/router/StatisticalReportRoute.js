const StatisticalReportLayoutView = () => import ('../views/statistical-report-views/LayoutView.vue');
const IndexView = () => import('../views/statistical-report-views/Index.vue');

export default {
    path: '/statistical-report',
    name: 'StatisticalReportLayoutView',
    component: StatisticalReportLayoutView,
    children: [
      {
        path: 'index',
        name: 'IndexView',
        component: IndexView,
      }
    ]
};
