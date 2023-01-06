const LayoutView = () => import ('../views/approval/LayoutView.vue');
const IndexView = () => import('../views/approval/index.vue');
const DetailView = () => import('../views/approval/Detail.vue');

export default {
    path: '/approve',
    name: 'approvePage',
    component: LayoutView,
    children: [
        {
            path: 'index',
            name: 'IndexView',
            component: IndexView,
        },
        {
            path: 'detail',
            name: 'DetailView',
            component: DetailView,
        }
    ]
};
