import Vue from "vue";
import VueRouter from "vue-router";
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Welcome from '../components/Welcome.vue';
import Users from '../components/user/Users.vue';
import Rights from '../components/power/Rights.vue';
import Roles from '../components/power/Roles';
import Cate from '../components/goods/Cate';
import Params from '../components/goods/Params';
import GoodsList from '../components/goods/List';
import AddGoods from '../components/goods/Add';
import EditGoods from '../components/goods/Edit';
import Order from '../components/order/Order';
import Report from '../components/report/Report';

Vue.use(VueRouter);

const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  }, {
    path: '/users',
    component: Users
  }, {
    path: '/rights',
    component: Rights
  }, {
    path: '/roles',
    component: Roles
  }, {
    path: '/categories',
    component: Cate
  }, {
    path: '/params',
    component: Params
  }, {
    path: '/goods',
    component: GoodsList
  }, {
    path: '/goods/add',
    component: AddGoods
  }, {
    path: '/goods/edit/:id',
    component: EditGoods
  }, {
    path: '/orders',
    component: Order
  }, {
    path: '/reports',
    component: Report
  }]
}];

const router = new VueRouter({
  routes
});

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 将要访问的路径
  //from 从哪个路途跳转
  //next 是一个函数 next() 直接放行 next('/login') 强制跳转
  if (to.path === '/login') next();
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login');
  next();

})
export default router;