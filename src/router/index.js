import { createRouter, createWebHistory } from 'vue-router'
import AdminHome from '../views/admin/AdminHome.vue'
import store from '../store'
import * as path from "path";
const routes = [
  {
    path: '/admin',
    name: 'AdminHome',
    beforeEnter:(to,from,next)=>{
      if(to.name!=='AdminLogin'&& (store.getters.getToken===""||store.getters.getExpire) ){
        alert("you should login first")
        next({
          name:"AdminLogin"
        })
        return
      }else{
        next()
      } },
    component: () => import('../views/admin/AdminHome'),
    children:[
      {
        path:'product_manage',
        component:()=> import('../views/admin/ProductManage'),
      },
      {
        path:'product_info',
        component:()=>import('../views/admin/ProductInfo')
      },
      {
        path:'categories_manage',
        component:()=>import('../views/admin/CategoryManage')
      },
      {
        path:'admin_info',
        component:()=>import('../views/admin/adminInfo')
      }
    ],

  },
  {
    path: '/admin_login',
    name: 'AdminLogin',
    component: () => import('../views/admin/AdminLogin')
  },
  {
    path: '/admin_register',
    name: 'AdminRegister',
    component: () => import('../views/admin/AdminRegister')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/user/login')
  },
  {
    path: '/signup',
    name:'Signup',
    component: ()=>import('../views/user/signup')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
