<template>
        <div class="left">
            <h5>Todo</h5>
            <input type="text" placeholder="输入Todo" v-model="todo"  @keyup="checkKeyTodo" class='text'> &nbsp;
            <input type="button" value="添加" @click="addTodo">
            <ul>
                <li v-for="(todo,index) in todos" v-bind:key="todos">
                    {{ todo }} &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="button" value="删除" @click="deleteTodo(index)">
                </li>
            </ul>
            <br>

            <input type="button" value="清空" v-show="todos.length>0" @click="clearTodo" class="btn">
            <br><br>

            <h5>需要养成的习惯</h5>

            <h5>时间分配</h5>
            <input type="text" placeholder="输入你的行为" class="behaviorText" @keyup="checkKeyBehavior" v-model="behavior">
            <br><br>

            开始时间: <input type="time" v-model="start"><br>
            结束时间: <input type="time" v-model="end"><br><br>
            <input type="button" value="增加" class="btn" @click="addBehavior">
            <ul>
                <li v-for="(item,index) in behaviors" v-bind:key="behaviors">
                    {{ item.start }} -> {{ item.end }} &nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;{{ item.behavior}} &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="button" value="删除" @click="deleteBehavior(index)">
                </li>
            </ul>
            <input type="button" value="清空" v-show="behaviors.length>0" class="btn" @click="clearBehavior">
        </div>
</template>

<script>
    import {reactive,ref,watchEffect,computed, getCurrentInstance, onMounted, onUnmounted} from 'vue'

    const TODOLIST ="TODOLIST";
    const BEHAVIORLIST ="BEHAVIORLIST";
    export default{
        name:'Left',
        setup(){
            // Todo文本框
            const todo = ref("")
            // 行为文本框
            const behavior = ref("")

            function getCurrTime(){
                const date = new Date();
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                return `${hours}:${minutes}`;
            }

            // 开始时间
            const start = computed(()=>{
                let max =0; 
                let max_ = "00:00"
                if(behaviors.length==0){
                    return "00:00";
                }else{
                    for(let i=0;i<behaviors.length;i++){
                        const [h,m] = behaviors[i]['end'].split(":").map(Number)
                        if((h*60 + m)>max){
                            max = h*60+m;
                            max_ = behaviors[i]['end']
                        }
                    }
                    return max_
                }
            })
            // 结束时间
            const end = ref(getCurrTime());

            const addTodo = function(){
                if(todo.value == ""){
                    return;
                }
                todos.push(todo.value)
                todo.value = ''
            }

            const checkKeyTodo = (e)=>{
                if(e.key == 'Enter'){
                    addTodo()
                }
            }

            const checkKeyBehavior = (e)=>{
                if(e.key == 'Enter'){
                    addBehavior()
                }
            }

            // 使用LS
            function useLS(key, defaultValue) {
                // 从 localStorage 读取初始值或使用默认值
                const initialValue = localStorage.getItem(key)
                    ? JSON.parse(localStorage.getItem(key))
                    : defaultValue
                
                // 创建响应式引用
                const data = reactive(initialValue)
                
                // 使用 watchEffect 自动同步到 localStorage
                watchEffect(() => {
                    localStorage.setItem(key, JSON.stringify(data))
                })

                return data
            }


            function deleteTodo(index){
                todos.splice(index,1)
            }

            function clearTodo(){
                todos.splice(0,todos.length)
            }

            function addBehavior(){
                if(!(start.value && end.value && behavior.value)){
                    alert("需要输入开启时间     结束时间    行为")
                    return
                }
                const o = {
                    "start":start.value,
                    "end":end.value,
                    "behavior": behavior.value
                }
                behaviors.push(o);

                // 清空原有数据
                behavior.value = ""
                end.value = getCurrTime()
            }

            function deleteBehavior(index){
                behaviors.splice(index,1)
            }

            function clearBehavior(){
                behaviors.splice(0,behaviors.length)
            }

            const todos = useLS(TODOLIST,[])
            const behaviors = useLS(BEHAVIORLIST,[])

            return {
                behavior,todo,addTodo,todos,behaviors,clearTodo,
                deleteTodo,addBehavior,start,end,deleteBehavior,
                clearBehavior,checkKeyTodo,checkKeyBehavior
            }
        }
    }
</script>

<style>
/* 按钮 */
.btn{
    display: block; 
    margin: 0 100px;
}

.behaviorText{
    width: 250px; 
    text-align: center;
}

.text{
    text-align: center;
}

</style>