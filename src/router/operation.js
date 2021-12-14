const Layout = () => import('../views/operation/LayoutView')
const index = () => import('../views/operation/index')

export default {
    path: '/operation',
    component: Layout,
    children: [
        {
            path: '/index',
            component: index
        }
    ]
}
