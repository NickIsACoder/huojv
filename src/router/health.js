// const Tabbar = () => import('@/components/Tabbar/');

export default [
  {
    path: '/health',
    name: 'health',
    redirect: '/health/estate',
    components: {
      default: () => import('@/views/layout/index'),
    },
    meta: {
      keepAlive: true
    },
    children: [
      {
        path: '/health/business',
        name: 'healthBusiness',
        component: () => import('@/views/health/business'),
        meta: {pageName:'商管'}
      },
      {
        path: '/health/ranking/business',
        name: 'healthRankingBusiness',
        component: () => import('@/views/health/ranking/business'),
        meta: {pageName:'商管排行榜'}
      },
      {
        path: '/health/warning/business',
        name: 'healthWarningBusiness',
        component: () => import('@/views/health/warning/business'),
        meta: {pageName:'商管预警'}
      },
      {
        path: '/health/estate',
        name: 'healthEstate',
        component: () => import('@/views/health/estate/index'),
        meta: {pageName:'物业'}
      },
      {
        path: '/health/ranking/estate',
        name: 'healthRankingEstate',
        component: () => import('@/views/health/ranking/estate/index'),
        meta: {pageName:'物业排行榜'}
      },
      {
        path: '/health/warning/estate',
        name: 'healthWarningEstate',
        component: () => import('@/views/health/warning/estate/index'),
        meta: {pageName:'物业预警'}
      },
    ]
  }
];
