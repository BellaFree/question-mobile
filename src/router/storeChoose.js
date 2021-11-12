const mapList = () => import('../components/chooseStore/mapList.vue');
const storeLayout = () => import('../components/chooseStore/layOut')

export default {
    path: '/store-choose',
    name: 'storeChoose',
    component: storeLayout,
    children: [
        {
            path: 'mapList',
            name: 'mapList',
            component: mapList,
        }
    ]
};
