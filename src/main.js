import Vue from 'vue';
import App from './App.vue';

import 'font-awesome/css/font-awesome.css';

import event from './utils/event';
Vue.prototype.$event = event;

import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(ViewUI);

import TextHighlight from 'vue-text-highlight';
Vue.component('text-highlight', TextHighlight);

//引入axios
import axios from 'axios';
import qs from 'qs';

axios.defaults.baseURL = process.env.VUE_APP_URL;
Vue.prototype.$url = process.env.VUE_APP_URL;
Vue.prototype.$axios = axios    //全局注册，使用方法为:this.$axios
Vue.prototype.$qs = qs           //全局注册，使用方法为:this.$qs

// import './utils/flexible' //rem 转换

Vue.config.productionTip = false

//实例化 store
import store from './store'; // this.$store.commit("setUser", user); 

//引入路由文件
import router from './router';
//// 路由拦截
// const whiteList = ['/task'];//不需要登录能访问的path
// router.beforeEach((to, from, next) => {
//   console.log('beforeEach');
//   // let userInfo = JSON.parse(sessionStorage.getItem('state'));//获取缓存看是否登录过
//   let state = sessionStorage.getItem('state');//获取缓存看是否登录过
//   if (whiteList.indexOf(to.path) < 0) {//访问了需要登录才能访问的页面
//     if (state === 'true') {//登录过来直接进去
//       next();
//     } else {
//       if (to.path == '/login') {
//         next();
//       } else {
//         next('/login');
//       }
//     }
//   } else {
//     next();
//   }
// });

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
