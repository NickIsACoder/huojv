// const Tabbar = () => import('@/components/Tabbar/');

export default [
    {
        path: '/warning',
        name: 'warning',
        redirect: '/warning/marketing',
        components: {
            // default: () => import('@/views/warning/index'),
            default: () => import('@/views/layout/index'),
            // tabbar: Tabbar
        },
        meta: {
            keepAlive: true
        },
        children: [
            {
              path: '/warning/marketing',
              name: 'marketing',
              component: () => import('@/views/warning/marketing/index'),
              meta: {pageName:'首页预警',pageNo: 'appyj1'}
            },
            {
                path: '/warning/planProgress',
                name: 'planProgress',
                component: () => import('@/views/warning/planProgress/index'),
                meta: {pageName:'计划进度预警',pageNo: 'appyj5'}
            },
            {
                path: '/warning/adminDetail',
                name: 'adminDetail',
                component: () => import('@/views/warning/marketing/adminDetail'),
                meta: {pageName:'管理记录详情',pageNo: 'appyj10',isSecondPage:true, noPageNo: true}
            },
            {
                path: '/warning/fileView',
                name: 'fileView',
                component: () => import('@/views/warning/marketing/fileView'),
                meta: {pageName:'管理记录附件查看',pageNo: 'appyj10',isSecondPage:true, noPageNo: true}
            },
            {
                path: '/warning/financing',
                name: 'warningFinancing',
                component: () => import('@/views/warning/financing/index'),
                meta: {pageName:'资金融资报告',pageNo: 'appbg9'}
            },
            {
                path: '/warning/fullCycle',
                name: 'fullCycle',
                component: () => import('@/views/warning/fullCycle/index'),
                meta: {pageName:'全周期预警',pageNo: 'appyj3'}
            },
            {
                path: '/warning/engineer',
                name: 'warningEngineer',
                component: () => import('@/views/warning/engineer/index'),
                meta: {pageName: '工程建造预警', pageNo: 'appyj10'}
            },
            {
                path: '/warning/customerService',
                name: 'warningCustomerService',
                component: () => import('@/views/warning/customerService/index'),
                meta: {pageName:'客服物业预警',pageNo: 'appyj11'}
            },
            {
                path: '/warning/costContract',
                name: 'warningCostContract',
                component: () => import('@/views/warning/costContract/index'),
                meta: {pageName:'成本合约预警',pageNo: 'appyj8'}
            },
            {
                path: '/warning/immovables',
                name: 'warningImmovablest',
                component: () => import('@/views/warning/immovables/index'),
                meta: {pageName:'不动产预警',}
            },
        ]
    } 
];
