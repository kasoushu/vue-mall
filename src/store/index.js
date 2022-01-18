import { createStore } from 'vuex'

export default createStore({
  state: {
    token:""
  },
  mutations: {
    setToken(tk){
      this.state.token = tk;
    }


  },
  getters:{
    getToken: (state) =>{
      return state.token
    }
  },
  actions: {
  },
  modules: {
  }
})
