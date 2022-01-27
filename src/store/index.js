import { createStore } from 'vuex'
import request from "../utils/request";
import router from "@/router";
export default createStore({
  state: {
    userinfo:{
      name:'',
      id:'',
      phone:'',
      token:"",
    },
    token_expire:false,
    categories : [],
  },
  mutations: {
    addCategory(state,list){
      console.log('now   ',state)
      console.log('list  ',list)
      for (let i=0;i<list.length;i++){
        state.categories.push(list[i])
      }
    },
    initCategory(state){
      request({
        url:'/admin/get_category_parent/0',
        method: 'get',
      }).then(
          res=>{
            console.log(res)
            if (res.data.code===401){
              state.userinfo.token=""
              alert(res.data.message)
              router.push('/admin_login')
              console.log(res.message)
            }else if (res.data.code===200){
              let t= res.data.data.total
              // console.log(t)
              for (let i=0;i<t;i++){
                state.categories.push({
                  id: res.data.data.list[i].id,
                  pId:res.data.data.list[i].parent_id ,
                  value: res.data.data.list[i].id,
                  title: res.data.data.list[i].name,
                  // isLeaf:res.data.list[t].parent_id===0,
                })
              }
              // let newMap = new Map(state.categories)
              // state.categories = Array.from(newMap)
            }else {
              console.log(res.message)
            }
          }
      ).catch(
          err=>console.log(err)
      )



      console.log(state.categories)
    },
    setUserInfo(state,tk){
      state.userinfo.token = tk.token;
      state.userinfo.name = tk.name;
      state.userinfo.id = tk.id;
      state.userinfo.phone = tk.phone;
    },
    cleanToken(state){
      state.userinfo.token=""
    },
  },
  getters:{

    getToken: (state) =>{
      return state.userinfo.token
    },
    getUserInfo: (state) =>{
      return {
        name:state.userinfo.name,
        phone:state.userinfo.phone,
        id:state.userinfo.id,
      }
    },
    getExpire: (state)=>{
      return state.token_expire
    },
    getCategories(state){
      let mymap = new Map;

      for (let i=0;i<state.categories.length;i++){
        mymap.set(state.categories[i].id,state.categories[i])
      }
      console.log(mymap)
      return Array.from(mymap.values())
    },
    getCategoryName:(state)=> (id)=>{

        let mymap = new Map;

        for (let i=0;i<state.categories.length;i++){
          mymap.set(state.categories[i].id,state.categories[i])
        }
        return mymap.get(id).name
      }
  },
  actions: {
  },
  modules: {
  }
})