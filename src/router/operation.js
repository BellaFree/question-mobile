const Layout = () => import('../views/operation/Layout')
const index = () => import('../views/operation/Index')

export default {
    path: '/operation',
    component: Layout,
    children: [
        {
            path: 'index',
            component: index
        }
    ]
}
