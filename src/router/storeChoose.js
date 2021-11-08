const storeList = () => import ('../components/chooseStore/list.vue');
const mapList = () => import('../components/chooseStore/mapList.vue');
const storeLayout = () => import('../components/chooseStore/layOut')

export default {
    path: '/storeChoose',
    name: 'storeChoose',
    component: storeLayout,
    children: [
        {
            path: 'index',
            name: 'IndexView',
            component: storeList,
        },
        {
            path: 'mapList',
            name: 'IndexView',
            component: mapList,
        }
    ]
};
