const storeList = () => import ('../components/chooseStore/list.vue');
const mapList = () => import('../components/chooseStore/mapList.vue');
const storeLayout = () => import('../components/chooseStore/layOut')

export default {
    path: '/store-choose',
    name: 'storeChoose',
    component: storeLayout,
    children: [
        {
            path: 'index',
            name: 'index',
            component: storeList,
        },
        {
            path: 'mapList',
            name: 'mapList',
            component: mapList,
        }
    ]
};
