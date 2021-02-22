export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/login'),
    meta: {
      meta: {pageName:'登录页面'}
    }
  }
];
