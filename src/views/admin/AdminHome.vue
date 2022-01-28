<template>

  <img src="https://w.wallhaven.cc/full/y8/wallhaven-y8kjek.jpg" alt="">
  <a-layout>
    <a-layout-header class="header" >
      <a-menu class="menu" id="menu-1"
              v-model:selectedKeys="selectedKeys1"
              mode="horizontal"
      >
        <a-menu-item></a-menu-item>
        <a-menu-item key="1">nav 1</a-menu-item>
        <a-menu-item key="2">nav 2</a-menu-item>
        <a-menu-item key="3">nav 3</a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout-content id="main_content" >

      <a-layout id="main_layout" >
        <a-layout-sider id="sider" width="200" >
          <a-menu
              v-model:selectedKeys="selectedKeys2"
              v-model:openKeys="openKeys"
              mode="inline"
              id="menu-2"
          >
            <a-sub-menu key="sub1">
              <template #title>
                <span>
                  <user-outlined />
                  账户管理
                </span>
              </template>
              <a-menu-item key="1">账户信息</a-menu-item>
            </a-sub-menu>

            <a-sub-menu key="sub2">
              <template #title>
                <span>
                  <notification-outlined />
                  商品管理
                </span>
              </template>
              <a-menu-item @click="this.$router.push('/admin/product_info')" key="9">商品信息</a-menu-item>
              <a-menu-item  @click="this.$router.push('/admin/categories_manage')" key="10">分类管理</a-menu-item>
              <a-menu-item @click="this.$router.push('/admin/product_manage')" key="11">商品管理</a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="sub3">
              <template #title>
                <span>
                  <laptop-outlined />
                  订单管理
                </span>
              </template>
              <a-menu-item @click="this.$router.push('/admin/order_info')" key="5">订单信息</a-menu-item>
              <a-menu-item @click="this.$router.push('/admin/order_manage')" key="6">订单管理</a-menu-item>
            </a-sub-menu>

          </a-menu>
        </a-layout-sider>
        <a-layout-content id="content">
          <a-breadcrumb :routes="$route" separator=">" style=" margin: 16px 0">
            <a-breadcrumb-item v-for="(it,k) in  $route.path.trim().split('/')" >
              <router-link :to="$route.path.trim().split('/').slice(0,k+1).join('/')">
                {{it}}
              </router-link>
            </a-breadcrumb-item>

          </a-breadcrumb>
          <router-view>
          
          </router-view>
        </a-layout-content>
      </a-layout>

      <a-layout-footer  style=" height: 25px; width: 100%; bottom: 5px; text-align: center">
        caicai_mall  Created by @caicai
      </a-layout-footer>
    </a-layout-content>

  </a-layout>


</template>

<script>

import {
  BulbTwoTone,
  UserOutlined, LaptopOutlined, NotificationOutlined,
} from '@ant-design/icons-vue'
import {
  defineComponent, ref
} from "vue"
export default {
  name: 'App',
  data(){
    return {
      path:[],
      msg:"hello world"
    }
  },
  components:{
    BulbTwoTone,
    LaptopOutlined,
    NotificationOutlined,
    UserOutlined,
  },
  methods:{
    pathcnt(str){
      this.path.push(str)
      return str
    }
  }

}

</script>


<style scoped>

.header{
  /*-webkit-backdrop-filter: blur(32px);*/
  /*backdrop-filter: blur(32px);*/
  height: 40px;
  position: fixed;
  z-index: 2;
  width: 100%;
  min-width: 100%;
  /*opacity: 0.5;*/
  /*background-color: blanchedalmond;*/
}
.space{
  width: 50px;
  height: 15px;
}
#menu-1{
  line-height: 40px;
  position: fixed;
  /*width: 100%;*/
  min-width: 100%;
  opacity: 0.7;
  left: 0px;
}

#menu-2{

  height: 100%;
}


#main_layout{
  height: 900px;
  padding: 24px 0;
}


#content{
  overflow-y: auto;
  padding-left:35px;
}

#main{
  /*backdrop-filter: blur(30px);*/
  width: 100%;
  height: 100%;
}

#main_content{
  /*opacity: 0.8;*/

  position: relative;
  top: 60px;
  padding: 0 50px;
  /*overflow-y: auto;*/
  /*overflow: hidden;*/
}

img{
  position: fixed;
  width: 100%;
  height: 100%;
}

</style>
