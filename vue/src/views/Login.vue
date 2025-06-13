<template>
    <div class="login">
        <h1>登录</h1>
        <span>用户名:</span><input type="text" v-model="un" @keydown.enter="login" @click="pswErr=false"><br>
        <span>密码:</span><input type="password" v-model="psw" @keydown.enter="login" @click="pswErr=false"><br>
        <div v-show="pswErr">
            <br>
            <span  style="color: red;">账号或密码错误  请重新输入</span><br>
        </div>
        <input type="button" @click="login" value="登录" >
        <br>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/api/'
import { useRouter } from 'vue-router';

// 属性
const un = ref("");
const psw = ref("");
const pswErr = ref(false)

// 路由器
const router = useRouter()

// 登录函数
const login = function(){
    api.user.login({
        "username": un.value,
        "password": psw.value
    }).then(ret => {
        if(!ret.data){
            console.log(ret.message)
            pswErr.value = true
        }else{
            console.log("token:" + ret.data)
            localStorage.setItem("todo_token",ret.data)

            // 登录成功，跳转到目标页面（如 /todo）
            router.replace({ name: 'Todo' })
            .then(() => console.log('跳转成功'))
            .catch(err => {
                console.error('跳转失败:', err)
                // 检查具体错误：
                if (err.name === 'NavigationDuplicated') {
                console.warn('重复跳转到当前路由')
                }
            })
        }
    }).catch(err => alert(err));
}
</script>

<style scoped>
.login{
    padding: 400px;
    text-align: center;
}
</style>