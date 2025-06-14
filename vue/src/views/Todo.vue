<template>
    <h2>TODO</h2>
    <hr>

    <div class="container">
        <div class="left"> <h3>待办</h3>
            <input type="text" v-model="todo" placeholder="请输入TODO" @keydown.enter="addTodo"> 
            <input type="button" value="增加" @click="addTodo"> 
            <br>

            <!-- 展示区:TODO -->
            <div v-for="item,idx in todoStore.todoList">
                <label :class="{'checked':item.checked}">
                <!-- CHECKBOk -->
                <input 
                type="checkbox" 
                :id="idx"
                v-model="item.checked"
                >
                <!-- 内容 -->
                {{ item.todo }}
                <!-- 删除按钮 -->
                <button @click="removeTodo(idx)">删除</button>
                </label>
            </div>
            <!-- 清空 -->
            <button v-show="todoStore.todoList.length > 0" @click="clearTodo">清空</button>
            <br>

            <h3>行为</h3>
            <input type="text" placeholder="请输入你的行为" v-model="behavior" @keydown.enter="addBehavior"> 
            <input type="button" value="增加" @click="addBehavior">
            <br>
            <br>
            

            开始时间: <input type="time" v-model="start" @keydown.enter="addBehavior">
            <br>


            结束时间: <input type="time" v-model="end" @keydown.enter="addBehavior">
            <br>


            <div id="remainTime">剩余时间: {{ time }}</div>
            <br>


            <input type="button" value="增加" class="btn_time" @click="addBehavior">

            <!-- 展示区BEHAVIOR-->
            <ul>
                <li v-for="item,index in behaviorStore.behaviorList" class="behavior-item">
                    {{ item.start }} -> {{ item.end }} : {{item.behavior }} 
                    <input type="button" value="删除" @click="delBehavior(index)" class="del-btn"> 
                </li>
            </ul>
            <br>


            <input type="button" value="清空" class="btn" v-show="behaviorStore.behaviorList.length > 0" @click="clearBehavior">
            <br>
            <br>

            <a href="#" @click="exit()">退出</a>
        </div>


        <div class="right">
            <h3>图表</h3>
            <e-charts class="pie" id="pie" :option="pieOption"></e-charts>
            <br>
            <br>
            <e-charts class="radar" id="radar" :option="radarOption"></e-charts>
        </div>
    </div>
</template>

<script setup>
import { onMounted,ref,computed,onBeforeUnmount} from 'vue'
import {storeToRefs} from 'pinia'
import { useRouter } from 'vue-router'
import useTodoStore from '@/stores/todo'
import useBehaviorStore from '@/stores/behavior'

const todoStore = useTodoStore()

todoStore.$subscribe((m,s)=>{
    // 数据改变后，将数据保存到LS
    console.log(todoStore.todoList)
    localStorage.setItem("TODOS",JSON.stringify(todoStore.todoList))
})

const addTodo =()=>{
    console.log('@@@',todoStore.todoList)
    if(!todo.value || todo.value.length == 0){
        // alert("TODO 不能为空")
        return
    }
    if(todo.value.length > 10){
        alert("TODO 字数过长")
        return
    }

    todoStore.add({
        todo: todo.value,
        checked: false
    })
    todo.value = ''
}

const removeTodo =(idx)=>{
    todoStore.remove(idx);
}

const clearTodo=()=>{
    todoStore.clear()
}

// BEHAVIOR
const behaviorStore = useBehaviorStore()

behaviorStore.$subscribe(()=>{
    // 数据改变后，将数据保存到LS
    console.log(behaviorStore.behaviorList)
    localStorage.setItem("BEHAVIORS",JSON.stringify(behaviorStore.behaviorList))
})

const time = ref('')
const router  = useRouter()

onBeforeUnmount(()=>{
    const pieChart = echarts.getInstanceByDom(document.getElementById('pie'));
    const radarChart = echarts.getInstanceByDom(document.getElementById('radar'));
    pieChart?.dispose();
    radarChart?.dispose();
})

const exit = async()=>{
    localStorage.removeItem("todo_token")
    await router.replace('/login');

    if (router.currentRoute.value.path === '/login') {
        window.location.reload(); // 完全重置应用状态
    }
}

const updateTime = ()=>{
    const now = new Date()
    const hours = String(23-now.getHours()).padStart(2, '0')
    const minutes = String(59-now.getMinutes()).padStart(2, '0')
    const seconds = String(59-now.getSeconds()).padStart(2, '0')
    time.value = `${hours}:${minutes}:${seconds}`
}

updateTime()

// 设置定时器
const timer = setInterval(updateTime,100)

onMounted(()=>{
    onBeforeUnmount(()=>{clearInterval(timer)})
})

// 变量声明
const todo = ref('')
const BEHAVIORS= 'BEHAVIORS'
const behavior = ref('')
const behaviors = ref([])
const start = ref('')
const end = ref('')


// 饼图 + 雷达图
const pieData=computed(()=>{
    const m = new Map()

    for(let i=0;i<behaviorStore.behaviorList.length;i++){
        const b = behaviorStore.behaviorList[i]['behavior']

        const start = behaviorStore.behaviorList[i]['start']
        const end = behaviorStore.behaviorList[i]['end']
        const [s_h,s_m] =  start.split(':').map(Number)
        const [e_h,e_m] =  end.split(':').map(Number)
        const duration = e_h * 60 + e_m - s_h * 60 - s_m

        m.set(b,(m.get(b)||0)+duration);
    }

    const data = []
    m.forEach((value,name)=>{
        data.push({
            'name':name,
            'value':value/60
        })
    })
    return data
})

const pieOption = computed(()=>{
  return {
    title:{
        text:'今日时间分配',
        // subtext: getTodayDate(),
        left:'left'
    },
    tooltip: {
    trigger: 'item',
    formatter: function(params) {
        const minutes = (params.value) * 60;
        const hours = params.value;
        const percent = params.percent;
        return `
            ${params.name}<br/>
            分钟数: ${parseFloat(minutes).toFixed(2)} 分钟<br/>
            小时数: ${parseFloat(hours).toFixed(2)} 小时<br/>
            占比: ${percent}%
        `;
    },
    },
    legend: {
        orient:'vertical',
        top: '5%',
        left: 'right'
    },
    series: [
        {
          name: '时间分布',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: true,
            position: 'outside',  // 标签显示在扇形外侧
            alignTo: '',  // 标签对齐边缘
            formatter: function(param){
              return `${param.name} : ${parseFloat(param.value).toFixed(2)} 小时`
            },
            margin: 0  // 标签与饼图的距离
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 35,
              formatter: function(param){
                return `${param.name} ${parseFloat(param.value).toFixed(1)}`
              },
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true 
          },
          data: pieData.value || [],
        }
      ]
}}
)

const radarData = computed(()=>{
    let max = 0;

    if(pieData.value.length==0){
        return []
    }

    const data = []

    for(let i=0;i<pieData.value.length;i++){
        if(pieData.value[i]['value'] > max){
            max = pieData.value[i]['value'];
        }
    }

    for(let i=0;i<pieData.value.length;i++){
        data.push({
            'name':pieData.value[i]['name'],
            'value':pieData.value[i]['value'],
            'max': max
        })
    }
    return data
})

const radarOption = computed(()=>{
    // 无数据,友好展示
    if(behaviorStore.behaviorList.length ==0 || !behaviorStore.behaviorList){
        return {
            title: {
                text: '暂无数据',
                left: 'center',
                top: 'center',
                textStyle: {
                color: '#999',
                fontSize: 16
                }
            },
            graphic: [{
                type: 'text',
                left: 'center',
                top: '45%',
                style: {
                text: '当前没有可显示的数据',
                fill: '#ccc',
                fontSize: 14
                }
            }],
        }
    }

    return {
        title: {
            text: '时间分配雷达图'
        },
        legend: {
            data: ['极限', '实际分配']
        },
        radar: {
            indicator: radarData.value.map(item=>{
                return {
                    name:item.name,
                    max:item.max
                }
            })
        },
        series: [
            {
            name: '时间分配',
            type: 'radar',
            data: [
                {
                    value: radarData.value.map(v=>{
                        return v.max
                    }),
                    name:'极限'
                },
                {
                    value: radarData.value.map(v=>{
                        return v.value
                    }),
                    name:'实际分配'
                }
            ]
            }
        ]
    }
    });

// 挂载时 
onMounted(()=>{
    // 开始时间
    calStart()
    // 结束时间
    freshEnd()
})


const addBehavior=()=>{
    if(behavior.value!='' && start.value!='' &&end.value!=''){
        const obj = {
            'behavior' : behavior.value,
            'start' : start.value,
            'end' : end.value
        }
        behavior.value = ''
        behaviorStore.add(obj)
    }
    calStart();
    freshEnd();
}

const delBehavior=(index)=>{
    behaviorStore.remove(index)
    calStart()
    freshEnd()
}

const clearBehavior = ()=>{
    behavior.value = ''
    behaviorStore.clear()
    calStart()
    freshEnd()
    pieOption
}

// 开始时间 + 结束时间
const calStart=()=>{
    // 开始时间
    let max_ = ''
    let max = 0;
    for(let i=0;i<behaviorStore.behaviorList.length;i++){
        // alert(typeof(behaviors.value[i]['end']))
        const [e_h,e_m] = behaviorStore.behaviorList[i]['end'].split(":").map(Number)
        if((e_h*60+e_m) > max){
            max = e_h * 60  + e_m
            max_ = behaviorStore.behaviorList[i]['end']
        }
    }
    start.value = max_ || '00:00'
}

const freshEnd=()=>{
    var now = new Date();
    end.value = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
}
</script>

<style scoped>
.container{
    justify-content: center;
    margin: 20px auto;
    width: 1200px;
}

h2{
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

.todo-item{
    position: relative;
    padding-right: 60px; /* 给删除按钮留出空间 */
}

.todo-btn{
    position: absolute;
    left: 160px;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.todo-item:hover .todo-btn {
    opacity: 1;
}

.pie {
    width: 700px;
    height: 500px;
    background: #ffffff;
    box-shadow: 1px 1px 20px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(100px);
}

.radar{
    width: 700px;
    height: 500px;
    background: #ffffff;
    box-shadow: 1px 1px 20px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(100px);
}

</style>