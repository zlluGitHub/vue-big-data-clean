import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

export default new Router({
  // mode: 'history',
  // mode: 'hash', //默认 有#号
  routes: [
   
    // {
    //   path: '/login',
    //   name: 'login',
    //   component: () => import('../components/pages/login')
    // },
    {
      path: '/',
      name: 'main',
      component: () => import('../index/Main.vue'),
      // redirect: '/',//设置默认指向的路径
      // children: [ //这里就是二级路由的配置
      //   {
      //     path: '/',
      //     name: 'index',
      //     component: () => import('../components/pages/index')
      //   }
      // ]
    },
  ]
})
