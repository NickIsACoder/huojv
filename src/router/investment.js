
export default [
  {
    path: '/investment',
    name: 'investment',
    redirect: '/investment/fundManagement',
    components: {
      default: () => import('@/views/layout/index'),
    },
    meta: {
      keepAlive: true
    },
    children: [
      {
        path: '/investment/fundManagement',
        name: 'fundManagement',
        component: () => import('@/views/investment/fundManagement'),
        meta: {pageName:'资金管理'}
      },
      {
        path: '/investment/fundManagement/raiseMore',
        name: 'raiseMore',
        component: () => import('@/views/investment/fundManagement/components/raiseMore'),
        meta: {
          pageName: '资金管理-募-更多',
          isSecondPage: true
        }
      },
      {
        path: '/investment/fundManagement/more',
        name: 'more',
        component: () => import('@/views/investment/fundManagement/components/more'),
        meta: {
          pageName: '资金管理-投-退-更多',
          isSecondPage: true
        }
      },
    ]
  }
];
