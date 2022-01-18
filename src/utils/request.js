import axios from "axios";
import store from "@/store";
// axios.defaults.baseURL = "http://localhost:8080"


const request = axios.create({
    timeout:5000,
    headers:{
        'Content-Type': 'application/json;charset=UTF-8'
    }
});


request.interceptors.request.use(config=>{
    config.headers["token"] = store.getters.getToken
    return config
})

// request.interceptors.response.use( response=>{
//     if (response.data.code === 200){
//         // console.log(response)
//         // let msg = response.data.message
//         // if (msg === '登录成功' || msg === '创建成功' || msg === '删除成功' || msg === '更新成功'){
//         //     ElMessage.success(response.data.message)
//         // }
//         // return response;
//     } else {
//         console.log(response)
//         return Promise.reject(response)
//     }
// },error => {
//     console.log(error)
//     return Promise.reject(error)
// }
// )

export default request;