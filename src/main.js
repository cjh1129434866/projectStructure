// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import _COOKIE from '@/assets/js/cookie'
import _P from '@/assets/js/public'
import axios from '@/apis/http/axios.js'
import store from '@/store'
import './assets/css/reset.styl'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(_COOKIE)
Vue.use(_P)
Vue.prototype.axios = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
