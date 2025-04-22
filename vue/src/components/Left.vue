<template>
    <h5>Todo List</h5>
    <input type="text" v-model="todo" placeholder="Input Todo" @keyup.enter="cTodo()">
    <input type="button" value="Add" @click="addTodo">

</template>

<script>
import { ref} from 'vue';
export default{
    setup(){
        const todo =ref("")
        const addTodo =()=>{
            alert(todo.value)
        }
        const cTodo=()=>{
            alert(todo.value)
        }
        return {todo,addTodo,cTodo}
    }
}
</script>
<style>
input{
    font-size: 17px;
}
</style>