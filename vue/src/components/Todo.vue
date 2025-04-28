<template>
    <div class="container">
        <h4>todo</h4>
        <hr>
        <div class="left">
            <h5>待办</h5>
            <input type="text" v-model="todo" placeholder="请输入TODO" @keydown.enter="addTodo"> <input type="button" value="增加" @click="addTodo"> <br>
            <label v-for="item,index in todos" @mouseenter="item.showDel=true" @mouseleave="item.showDel=false">
                <input type="checkbox" :checked="item.checked" @click="checkTodo(index)">
                <span :class="{'checked':item.checked}">{{item.todo}}</span><input type="button" @click="delTodo" value="删除" v-show="item.showDel"><br>
            </label>
            <br><input type="button" value="清空" @click="clearTodo" class="btn" v-show="todos.length > 0">
            <h5>原则</h5>

            <h5>行为</h5>
            <input type="text" placeholder="请输入你的行为" v-model="behavior" @keydown.enter="addBehavior"> <input type="button" value="增加"><br><br>
            开始时间: <input type="time" v-model="start" @keydown.enter="addBehavior"><br>
            结束时间: <input type="time" v-model="end" @keydown.enter="addBehavior"><br>
            <br><input type="button" value="增加" class="btn_time" @click="addBehavior">
            <br><input type="button" value="清空" class="btn" v-show="behaviors.length > 0" @click="clearBehavior">
            <ul>
                <li v-for="item,index in behaviors" @mouseenter="item.showDel=true" @mouseleave="item.showDel=false">
                    {{ item.start }} -> {{ item.end }} : {{item.behavior }} <input type="button" value="删除" @click="delBehavior(index)" v-show="item.showDel">
                </li>
            </ul>
        </div>
        <div class="right">
            <h4>图表</h4>
        </div>
    </div>
</template>

<script setup>
import {ref,watch} from 'vue'

const useLS=(key,defaultVal)=>{
    const storedVal = localStorage.getItem(key)
    const data = ref(storedVal?JSON.parse(storedVal):defaultVal)

    // 监听变化
    watch(data,(newVal)=>{
        localStorage.setItem(key,JSON.stringify(newVal));
    },{deep:true})

    return data;
}

// 变量声明
const todo = ref('')
const TODOS = 'TODOS'
const BEHAVIORS= 'BEHAVIORS'
const todos = useLS(TODOS,[])
const behavior = ref('')
const behaviors = useLS(BEHAVIORS,[])
const start = ref('00:00')
const end = ref('00:00')


// 方法
const addTodo = ()=>{
    if (todo.value != '' || todo.value.length >0){
        const obj = {
            todo :todo.value,
            checked : false,
        }
        todos.value.push(obj)
        todo.value = ''
    }
}

const delTodo =(index)=>{
    todos.value.splice(index,1)
}

const addBehavior=()=>{
    const obj = {
        'behavior' : behavior.value,
        'start' : start.value,
        'end' : end.value
    }
    behavior.value = ''
    behaviors.value.push(obj)
}

const delBehavior=(index)=>{
    behaviors.value.splice(index,1)
}

const checkTodo = (index)=>{
    todos.value[index].checked = !(todos.value[index].checked)
}

const clearTodo = ()=>{
    todos.value = []
    todo.value = ''
}

const clearBehavior = ()=>{
    behaviors.value = []
    behavior.value = ''
}
</script>

<style scoped>
.container{
    justify-content: center;
    margin: 20px auto;
    width: 1200px;
}

h4{
    text-align: center;
}

.left{
    float: left;
    width: 500px;
}

.right{
    float: right;
    width: 700px;
}

.btn{
    display: block;
    margin: 0 100px;
}

.btn_time{
    display: block;
    margin: 0 80px;
}

input{
    font-size: 15px;
}

.checked{
    text-decoration: line-through;
    color: rgb(34, 94, 39);
}
</style>