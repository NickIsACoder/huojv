// const Tabbar = () => import('@/components/Tabbar/');

export default [
  {
    path: '/building',
    name: 'building',
    components: {
      default: () => import('@/views/building/index'),
      // tabbar: Tabbar
    },
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/error',
    name: 'error',
    components: {
      default: () => import('@/views/error/index'),
      // tabbar: Tabbar
    },
    meta: {
      keepAlive: true
    }
  }
];
