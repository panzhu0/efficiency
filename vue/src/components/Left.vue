<template>
    <h5>Todo List</h5>
    <!-- 行为 -->
    <input type="text" v-model="todo" placeholder="Input Todo" @keyup.enter="addTodo">
    <input type="button" value="Add" @click="addTodo"><br>
    <ul>
        <li 
            v-for="(item,index) of todos" v-bind:key=todos>{{ item }}
            <input type="button" @click="rT(index)" value="DEL" class="del-btn-to">
        </li> 
    </ul>
    <br>

    <input type="button"  v-show="todos.length>0" value="Clear" 
    class="btn" @click="clearTodo"><br><br><br>

    <!-- 时间 -->

    <h5>Time Usage</h5>
    <input type="text" v-model="behavior" placeholder="Input Behavior" @keyup.enter="addBehavior"><br><br>
    <input type="button" class="btn" value="Add" @click="addBehavior"><br><br>
    Start:&nbsp;<input type="time" v-model="start"><br>
    End:&nbsp;&nbsp;&nbsp;<input type="time" v-model="end"><br>
    <ul>
        <li v-for="(item,index) of behaviors" v-bind:key="behaviors">
            {{ item['start'] }} -> {{ item['end'] }} &nbsp; BEHABIOR : {{ item['behavior'] }} 
            <input type="button" value="DEL" @click="rB(index)" class="del-btn-behavior">
        </li>
    </ul>
    <br>

    <input type="button" value="Clear" class="btn" v-show="behaviors.length>0" @click="clearBehavior"><br><br><br>

</template>

<script>
import { ref, watch } from 'vue';
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
            if(!start.value||!end.value){
                return
            }
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

        const rB=(index)=>{
            behaviors.value.splice(index,1)
        }

        const rT=(index)=>{
            todos.value.splice(index,1)
        }

        const todos = useLS(TODOS,[])
        const behaviors = useLS(BEHAVIORS,[])

        watch(behaviors.value,(n,o)=>{
            // 更新start,end的值
            for(let i =0;i<n.values.length;i++){

            }
        })
        return {todo,behavior,behaviors,todos,addTodo,addBehavior,clearTodo,clearBehavior,rB,rT,start,end}
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

.del-btn-to {
  position: absolute;
  right: 65%;
  /* top: 50%; */
  /* transform: translateY(-10%); 垂直居中 */
}

.del-btn-behavior {
  position: absolute;
  right: 56%;
  /* top: 50%; */
  /* transform: translateY(-10%); 垂直居中 */
}

</style>