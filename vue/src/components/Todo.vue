<template>
    <h4>todo</h4>
    <hr>
    <div class="container">
        <div class="left">
            <h3>待办</h3>
            <input type="text" v-model="todo" placeholder="请输入TODO" @keydown.enter="addTodo"> <input type="button" value="增加" @click="addTodo"> <br>
            <label v-for="item,index in todos" class="todo-item" @mouseenter="item.showDel=true" @mouseleave="item.showDel=fase">
                <input type="checkbox" :checked="item.checked" @click="checkTodo(index)">
                <span :class="{'checked':item.checked}">{{item.todo}}</span>
                <input type="button"  value="删除" @click="delTodo(index)" v-show="item.showDel"><br>
            </label>
            <br><input type="button" value="清空" @click="clearTodo" class="btn" v-show="todos.length > 0">
            <!-- <h3>原则</h3> -->

            <h3>行为</h3>
            <input type="text" placeholder="请输入你的行为" v-model="behavior" @keydown.enter="addBehavior"> <input type="button" value="增加"><br><br>
            开始时间: <input type="time" v-model="start" @keydown.enter="addBehavior"><br>
            结束时间: <input type="time" v-model="end" @keydown.enter="addBehavior"><br>
            <br><input type="button" value="增加" class="btn_time" @click="addBehavior">
            <ul>
                <li v-for="item,index in behaviors" class="behavior-item">
                    {{ item.start }} -> {{ item.end }} : {{item.behavior }} 
                    <input type="button" value="删除" @click="delBehavior(index)" class="del-btn"> 
                </li>
            </ul>
            <br><input type="button" value="清空" class="btn" v-show="behaviors.length > 0" @click="clearBehavior">
        </div>
        <div class="right">
            <h4>图表</h4>
        </div>
    </div>
</template>

<script setup>
import {computed, ref,watch} from 'vue'

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
const start = ref('')
const end = computed(()=>{
        // 实时时间
        const now = new Date()
        const h =  now.getHours()
        const m =  now.getMinutes()
        return `${h}:${m}`
})


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
    console.log(start.value)
    console.log(end.value)
    console.log(behavior.value)
    if(behavior.value!='' && start.value!='' &&end.value!=''){
        const obj = {
            'behavior' : behavior.value,
            'start' : start.value,
            'end' : end.value
        }
        behavior.value = ''
        behaviors.value.push(obj)
    }
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
    font-size: 18px;
}

.checked{
    text-decoration: line-through;
    color: rgb(34, 94, 39);
}

.behavior-item {
    position: relative;
    padding-right: 60px; /* 给删除按钮留出空间 */
}

.del-btn {
    position: absolute;
    right: 110px;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.behavior-item:hover .del-btn {
    opacity: 1;
}

.behavior-item:hover{
    color: rgb(201, 0, 0);
}
</style>