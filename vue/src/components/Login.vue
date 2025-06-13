<template>
    <div class="login">
        <h1>登录</h1>
        <span>用户名:</span><input type="text" v-model="un" @keydown.enter="login"><br>
        <span>密码:</span><input type="password" v-model="psw" @keydown.enter="login"><br>
        <input type="button" @click="login" value="登录" >
    </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/api/'

// 属性
const un = ref("");
const psw = ref("");

// 登录函数
const login = function(){
    api.user.login({
        "username": un.value,
        "password": psw.value
    }).then(ret => {
        if(!ret.data){
            // alert(ret.message)
            console.log("token:" + ret.message)
        }else{
            localStorage.setItem("todo_token",ret.data)
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