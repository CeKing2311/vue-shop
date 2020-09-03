import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import './plugins/element.js';
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

//导入字体图标
import './assets/iconfont/iconfont.css';
//导入全局样式表
import './assets/css/global.css';
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

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
Vue.component('tree-table', TreeTable);
// 将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor, /* { default global options } */)


Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0');
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");