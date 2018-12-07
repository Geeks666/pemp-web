// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import utils from './utils/index'
import cookies from './utils/cookies'
import axios from 'axios'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import "babel-polyfill";

Vue.prototype.$utils = utils
Vue.prototype.$cookies = cookies
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
