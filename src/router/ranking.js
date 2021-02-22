// const Tabbar = () => import('@/components/Tabbar/');

export default [
  {
    path: '/ranking',
    name: 'ranking',
    redirect: '/ranking/marketing',
    components: {
      // default: () => import('@/views/ranking/index'),
      default: () => import('@/views/layout/index'),
      // tabbar: Tabbar
    },
    meta: {
      keepAlive: true
    },
    children: [
      {
        path: '/ranking/marketing',
        name: 'rankingMarketing',
        component: () => import('@/views/ranking/marketing/index'),
        meta: {pageName:'首页龙虎榜',pageNo: 'applhb1'}
      },
      {
        path: '/ranking/planProgress',
        name: 'rankingPlanProgress',
        component: () => import('@/views/ranking/planProgress/index'),
        meta: {pageName:'计划进度龙虎榜',pageNo: 'applhb5'}
      },
      {
        path: '/ranking/costContract',
        name: 'rankingCostContract',
        component: () => import('@/views/ranking/costContract/index'),
        meta: {pageName:'成本合约龙虎榜',pageNo: 'applhb8'}
      },
      {
          path: '/ranking/resourceStructure',
          name: 'rankingResourceStructure',
          component: () => import('@/views/ranking/resourceStructure/index'),
          meta: {pageName:'资源结构龙虎榜',pageNo: 'applhb4'}
      },
      {
        path: '/ranking/fullCycle',
        name: 'rankingFullCycle',
        component: () => import('@/views/ranking/fullCycle/index'),
        meta: {pageName:'全周期龙虎榜',pageNo: 'applhb3'}
      },
      {
        path: '/ranking/customerService',
        name: 'rankingCustomerService',
        component: () => import('@/views/ranking/customerService/index'),
        meta: {pageName:'客服物业龙虎榜',pageNo: 'applhb11'}
      },
      {
        path: '/ranking/militaryOrder',
        name: 'rankingMilitaryOrder',
        component: () => import('@/views/ranking/militaryOrder/index'),
        meta: {pageName:'军令状龙虎榜'}
      },
      {
        path: '/ranking/human',
        name: 'rankinghuman',
        component: () => import('@/views/ranking/human/index'),
        meta: {pageName:'人力行政龙虎榜',}
      },
      {
        path: '/ranking/financing',
        name: 'rankingFinancing',
        component: () => import('@/views/ranking/financing/index'),
        meta: {pageName:'资金融资龙虎榜',}
      },
      {
        path: '/ranking/engineer',
        name: 'rankingEngineer',
        component: () => import('@/views/ranking/engineer/index'),
        meta: {pageName:'工程建造龙虎榜',}
      },
      {
        path: '/ranking/immovables',
        name: 'rankingImmovables',
        component: () => import('@/views/ranking/immovables/index'),
        meta: {pageName:'不动产龙虎榜',}
      },
    ]
  }
];
