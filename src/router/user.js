const Tabbar = () => import('@/components/Tabbar/');

export default [
  {
    path: '/user',
    name: 'user',
    components: {
      default: () => import('@/views/user/index'),
      tabbar: Tabbar
    },
    meta: {
      keepAlive: true
    }
  }
];
