import { createStore } from 'vuex'

export default createStore({
  state: {
    userinfo:{
      name:'',
      id:'',
      phone:'',
      token:"",
    },
    token_expire:false,
  },
  mutations: {
    setUserInfo(state,tk){
      state.userinfo.token = tk.token;
      state.userinfo.name = tk.name;
      state.userinfo.id = tk.id;
      state.userinfo.phone = tk.phone;
    }
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
    }
  },
  actions: {
  },
  modules: {
  }
})
