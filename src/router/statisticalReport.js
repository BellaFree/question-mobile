const statisticalLayoutView = () => import ('../views/statistical-report-views/LayoutView.vue');
const IndexView = () => import('../views/statistical-report-views/Index');

export default {
    path: '/statistical-report',
    name: 'statisticalLayoutView',
    component: statisticalLayoutView,
    children: [
        {
            path: 'index',
            name: 'IndexView',
            component: IndexView,
        },
        {
            path: 'visit-record',
            name: 'visitRecord',
            component: () => import('../views/statistical-report-views/storeVisitRecord'),
        }
    ]
};
