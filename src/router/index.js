import Vue from "vue";
import VueRouter from "vue-router";

import Login from '../components/Login.vue';
// import Home from '../components/Home.vue';
// import Welcome from '../components/Welcome.vue';
// import Users from '../components/user/Users.vue';
// import Rights from '../components/power/Rights.vue';
// import Roles from '../components/power/Roles';
// import Cate from '../components/goods/Cate';
// import Params from '../components/goods/Params';
// import GoodsList from '../components/goods/List';
// import AddGoods from '../components/goods/Add';
// import EditGoods from '../components/goods/Edit';
// import Order from '../components/order/Order';
// import Report from '../components/report/Report';

//const Login = () => import( /* webpackChunkName: "login" */ '../components/Login.vue')
const Home = () => import( /* webpackChunkName: "home_welcome" */ '../components/Home.vue')
const Welcome = () => import( /* webpackChunkName: "home_welcome" */ '../components/Welcome.vue')
const Users = () => import( /* webpackChunkName: "Users_Right_Roles" */ '../components/user/Users.vue')
const Rights = () => import( /* webpackChunkName: "Users_Right_Roles" */ '../components/power/Rights.vue')
const Roles = () => import( /* webpackChunkName: "Users_Right_Roles" */ '../components/power/Roles.vue')
const Cate = () => import( /* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import( /* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')
const GoodsList = () => import( /* webpackChunkName: "List_Add_Edit" */ '../components/goods/List.vue')
const AddGoods = () => import( /* webpackChunkName: "List_Add_Edit" */ '../components/goods/Add.vue')
const EditGoods = () => import( /* webpackChunkName: "List_Add_Edit" */ '../components/goods/Edit.vue')
const Order = () => import( /* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () => import( /* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')


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
  if (to.path === '/login') {
    console.log('/login');
    next();
  };
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) {
    return next('/login');
  }
  next();

})
export default router;