import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Todo from '@/views/Todo.vue'
import api from '@/api/'

// 路由路径
const routes =[
    {
        path:"/",
        redirect: "/todo",
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path:"/todo",
        name: "Todo",
        component: Todo,
    },
    // 捕获所有未匹配的路径，并重定向到 /login
    {
        path: "/:pathMatch(.*)*", // Vue Router 4.x 推荐写法
        redirect: "/todo",
    },
]

// 创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes : routes,
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
    // alert("PATH:   "+to.path)
    console.log("PATH:   "+to.path)
    const publicPath = ["/login"]
    if(publicPath.includes(to.path)){
        // 是/login  直接放行
        return next();
    }

    // 检查是否有TOKEN
    if(!localStorage.getItem("todo_token")){
        console.log("TOKEN不存在")
        alert("请先登录")
        return next("/login")
    }

    // 向后端发出检查API,检查TOKEN是否有效
    const valid = await isValidToken(localStorage.getItem("todo_token"))
    console.log("是否有效:  "+valid)
    if(!valid){
        console.log("TOKEN无效")
        alert("TOKEN有误,请重新登录")
        return next("/login")
    }
    return next()
})

// 判断TOKEN是否有效
const isValidToken = async (token)=>{
    console.log("检测TOKEN是否有效: 入参: "+token)
    try{
        const result = await api.user.valid(token)
        return result;
    }catch(err){
        alert("TOKEN 验证失败:",err)
    }
}

export default router;