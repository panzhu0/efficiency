<template>
    <h1>123</h1>
    <h1>{{countStore.count}}</h1>
    <h2>双倍:{{ countStore.doubleCount }}</h2>
    <button @click="countStore.increment">+1</button> 
</template>
  
<script setup>
    import {useCounterStore} from '../stores/count'
    const countStore = useCounterStore()     // 使用模块
</script>