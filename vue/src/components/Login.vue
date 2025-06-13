<template>
    <div class="login">
        <h1>登录</h1>
        <span>用户名:</span><input type="text" ><br>
        <span>密码:</span><input type="password" ><br>
        <input type="button" @click="login" value="登录">
    </div>
</template>

<script setup>
import api from '@/api/'

const login = function(){
    api.user.login({
        "username":"admin",
        "password":"admin"
    }).then(ret => alert(ret)).catch(err => alert(err));
}
</script>

<style scoped>
.login{
    padding: 400px;
    text-align: center;
}
</style>