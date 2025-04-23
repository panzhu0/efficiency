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
    Start:&nbsp;<input type="time" v-model="start" @keyup.enter="addBehavior"><br>
    End:&nbsp;&nbsp;&nbsp;<input type="time" v-model="end" @keyup.enter="addBehavior"><br><br>
    <input type="button" class="btn" value="Add" @click="addBehavior"><br><br>
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
        const todos = useLS(TODOS,[])
        const behaviors = useLS(BEHAVIORS,[])

        start.value = '00:00'

        const addTodo =()=>{
            if(!todo.value){
                return
            }
            todos.value.push(todo.value)
            todo.value=''
        }

        const addBehavior =()=>{ 
            if(!start.value || !end.value || !behavior.value){
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

        watch(behaviors.value,(val)=>{
            if(val.length == 0){
                start.value = '00:00'
            }

            // START TIME
            let max = 0
            let max_ = ''
            for(let i=0;i<val.length;i++){
                const [s_h,s_m] = val[i]['start'].split(":").map(Number)
                const [e_h,e_m] = val[i]['end'].split(":").map(Number)
                const duration = e_h * 60 + e_m
                if(duration > max){
                    max = duration
                    max_ = val[i]['end']
                }
            }
            start.value = max_

            // END TIME
            const time = new Date()
            const hours = time.getHours().toString().padStart(2, '0');          // 补零，如 "09"
            const minutes = time.getMinutes().toString().padStart(2, '0');      // 补零，如 "05"
            const shortTime = `${hours}:${minutes}`; 
            end.value = shortTime
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
  right: 70%;
  /* top: 50%; */
  /* transform: translateY(-10%); 垂直居中 */
}

.del-btn-behavior {
  position: absolute;
  right: 62%;
  /* top: 50%; */
  /* transform: translateY(-10%); 垂直居中 */
}

</style>