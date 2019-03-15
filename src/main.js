// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import utils from './utils/index'
import cookie from './utils/cookies'
import axios from 'axios'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import "babel-polyfill";

/*router.beforeEach((to, from, next) => {
  console.log('路由拦截');
  //判断要去的路由有没有requiresAuth
  if (to.meta.requireAuth) {
    // console.log("需要验证token")
    let token = cookie.getCookie('pempToken');
    // console.log(token)
    if (token){
      next();
    } else {
      console.log(to.fullPath)
      next({
        path: '/main',
        query: { redirect: to.fullPath }
      });
    }
  } else {
    next(); //如果无需token,那么随它去吧
  }
})*/
// http request 拦截器
axios.interceptors.request.use(
  config => {
    let token = cookie.getCookie('token');
    console.log(token)
    if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.authorization = `token ${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if(response.status == 200){
        switch (response.data.code) {
          case 401:
            // 返回 401 清除token信息并跳转到登录页面
            router.replace({//跳转到登录页面
              path: '/',
              query: { redirect: router.currentRoute.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
            });
          case 304:
            return response;
          case 200:
            return response;
        }
    }
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          router.replace({
            path: '/'
          });
      }
    }
    return Promise.reject(error.response.data);   // 返回接口返回的错误信息
  });

Vue.prototype.$utils = utils
Vue.prototype.$cookies = cookie
Vue.prototype.$http = axios
// 组件中使用：
// this.$http.post()

Vue.use(iView);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
