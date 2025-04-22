<template>
    <h5>Todo List</h5>
    <!-- 行为 -->
    <input type="text" v-model="todo" placeholder="Input Todo" @keyup.enter="addTodo">
    <input type="button" value="Add" @click="addTodo"><br>
    <ul>
        <li v-for="(item) of todos" v-bind:key=todos>{{ item }}</li>
    </ul>
    <input type="button" value="Clear" class="btn" @click="clearTodo"><br><br><br>

    <!-- 时间 -->

    <h5>Time Usage</h5>
    <input type="text" v-model="behavior" placeholder="Input Behavior" @keyup.enter="addBehavior"><br><br>
    <input type="button" class="btn" value="Add" @click="addBehavior"><br><br>
    Start:&nbsp;<input type="time" v-model="start"><br>
    End:&nbsp;&nbsp;&nbsp;<input type="time" v-model="end"><br>
    <ul>
        <li v-for="(item) of behaviors" v-bind:key="behaviors">
            {{ item['start'] }} -> {{ item['end'] }} : {{ item['behavior'] }}
        </li>
    </ul>
    <input type="button" value="Clear" class="btn" @click="clearBehavior"><br><br><br>

</template>

<script>
import { ref } from 'vue';
import { useLS } from '@/composables/useLS';

const TODOS = 'todos'
const BEHAVIORS = 'behaviors'
export default{
    setup(){
        const todo =ref("")
        const behavior = ref('')
        const start = ref('')
        const end = ref('')
        const addTodo =()=>{
            todos.value.push(todo.value)
            todo.value=''
        }

        const addBehavior =()=>{ 
            // if(!start.value||!end.value){
            //     return
            // }
            alert(start.value)
            const obj = {
                "behavior" : behavior.value,
                'start' : start.value,
                'end' : end.value,
            }
            behaviors.value.push(obj)
            behavior.value=''
        }

        const clearTodo=()=>{
            todos.value=[]
        }
        const clearBehavior=()=>{
            behaviors.value = []
        }

        const todos = useLS(TODOS,[])
        const behaviors = useLS(BEHAVIORS,[])
        return {todo,behavior,behaviors,todos,addTodo,addBehavior,clearTodo,clearBehavior,start,end}
    }
}
</script>
<style>
input{
    font-size: 17px;
}

.btn{
    margin: 0px 100px;
}


</style>