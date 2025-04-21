<template>
    <h1>Todo</h1>
    <div class="container">
        <!-- 左侧元素 -->
        <div class="left">
            <h5>Todo</h5>
            <input type="text" placeholder="输入Todo" v-model="todo"  @keyup="checkKeyTodo" style="text-align: center;"> 
            &nbsp;
            <input type="button" value="添加" @click="addTodo">
            <ul>
                <li v-for="(todo,index) in todos" v-bind:key="todos">
                    {{ todo }} &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="button" value="删除" @click="deleteTodo(index)">
                </li>
            </ul>
            <input type="button" value="清空" v-show="todos.length>0" @click="clearTodo" style="display: block; margin: 0 100px;"><br><br>
            <h5>需要养成的习惯</h5>

            <h5>时间分配</h5>
            <input type="text" placeholder="输入你的行为" style="width: 250px; text-align: center;" @keyup="checkKeyBehavior" v-model="behavior"><br><br>

            开始时间: <input type="time" v-model="start"><br>
            结束时间: <input type="time" v-model="end"><br><br>
            <input type="button" value="增加" style="display: block; margin: 0 100px;" @click="addBehavior">
            <ul>
                <li v-for="(item,index) in behaviors" v-bind:key="behaviors">
                    {{ item.start }} -> {{ item.end }} &nbsp;&nbsp;: &nbsp;&nbsp;&nbsp;[{{ item.behavior}}] &nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="button" value="删除" @click="deleteBehavior(index)">
                </li>
            </ul>
            <input type="button" value="清空" v-show="behaviors.length>0" style="display: block; margin: 0 100px;" @click="clearBehavior">
        </div>
        <!-- 左侧模块 -->
        <Left></Left>
        <!-- 右侧模块 -->
         <Right></Right>
    </div>
</template>

<script>
    import{reactive,ref,watchEffect,computed}from'vue'
    import Left from "@/components/Left.vue"
    import Right from '@/components/Right.vue'

    const TODOLIST ="TODOLIST";
    const BEHAVIORLIST ="BEHAVIORLIST";

    export default{
        name : "App",
        components: {
            Left,
            Right
        },
        setup(){
            const todo = ref("")
            const behavior = ref("")

            // const start = ref("")
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
            const end = ref("")


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

            function clearTodo(){
                todos.splice(0,todos.length)
            }


            function deleteTodo(index){
                todos.splice(index,1)
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
                end.value = ""
            }

            function deleteBehavior(index){
                behaviors.splice(index,1)
            }

            function clearBehavior(){
                behaviors.splice(0,behaviors.length)
            }

            const todos = useLS(TODOLIST,[])
            const behaviors = useLS(BEHAVIORLIST,[])
            // Echart

            return {behavior,todo,addTodo,todos,behaviors,clearTodo,deleteTodo,addBehavior,start,end,deleteBehavior,clearBehavior,checkKeyTodo,checkKeyBehavior,Right}
        }
    }
</script>











<style>
    body{
        margin: 0;
        padding: 0;
        height: 100%;
        /* background: #1f242d; */
        /* background: #949597; */
        /* color:#fff; */
        color:#8a4c4c;
    }

    h1{
        text-align: center;
    }

    input{
        font-size: 18px;
    }

    .container{
        width: 1000px;
        /* text-align: center; */
        margin: 0 auto;
        display: flex;
    }

    .left{
        float: left;
        width: 500px;
    }

    .right{
        float: right;
        width: 500px;
    }
</style>