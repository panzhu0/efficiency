import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Todo from '@/views/Todo.vue'

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
        redirect: "/login",
    },
]

// 创建路由器
const router = createRouter({
    history: createWebHistory(),
    routes : routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const publicPages = ["/login"]; // 不需要登录的页面
    const authRequired = !publicPages.includes(to.path); // 是否需要登录
  
    if (authRequired && !isLoggedIn()) { // 检查是否登录
        next("/login"); // 未登录则跳转到登录页
    } else {
        next(); // 放行
    }
})

// 判断是否登录
const isLoggedIn = ()=>{
    // 1.查看是否有TOKEN
    const token = localStorage.getItem("todo_token")
    return !!token;
}

export default router;