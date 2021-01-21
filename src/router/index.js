import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/dashboard',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Shop/First'),
          meta: { title: '系统首页' }
        },
        {
          path: '/type',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Shop/Type'),
          meta: { title: '商品类型' }
        },{
          path: '/brand',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Shop/Brand'),
          meta: { title: '商品品牌' }
        },
        {
          path: '/natur',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Shop/Natur'),
          meta: { title: '商品属性' }
        },
        {
          path: '/goodsAdd',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Shop/GoodsAdd'),
          meta: { title: '添加商品' }
        },
        {
          path: '/goods',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Shop/Goods'),
          meta: { title: '商品展示' }
        }
      ]
    }
  ]
});
