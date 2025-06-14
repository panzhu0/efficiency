import axios from "axios";
import user from "@/api/user"
import todo from '@/api/todo'

const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 1500
})

// 请求拦截器
api.interceptors.request.use(config =>{
    const token = localStorage.getItem('todo_token')

    if(token){
        config.headers.Authorization=`Bearer ${token}`
    }

    return config
},error =>{
    return Promise.reject(error)
})


// 响应拦截器
api.interceptors.response.use(resp =>{
    return resp.data;
},error=>{
    return Promise.reject(error.response ?.data || error.message)
})

// 导出
export default{
    user: user(api),
    todo: todo(api),
}