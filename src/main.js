import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import './plugins/element.js';
import TreeTable from 'vue-table-with-tree-grid'
//导入字体图标
import './assets/iconfont/iconfont.css';
//导入全局样式表
import './assets/css/global.css';
import axios from 'axios';
//配置请求的根路径
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/";

axios.interceptors.request.use(config => {
  // Do something before request is sent
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});

Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.component('tree-table',TreeTable);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");