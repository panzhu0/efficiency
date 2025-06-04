<template>
    <h2>TODO</h2>
    <hr>
    <div class="container">
        <div class="left">
            <h3>待办</h3>
            <input type="text" v-model="todo" placeholder="请输入TODO" @keydown.enter="addTodo"> <input type="button" value="增加" @click="addTodo"> <br>
            <label v-for="item,index in todos" class="todo-item" >
                <input type="checkbox" :checked="item.checked" @click="checkTodo(index)">
                <span :class="{'checked':item.checked}">{{item.todo}}</span>
                <input type="button"  value="删除" @click="delTodo(index)" class="todo-btn"><br>
            </label>
            <br><input type="button" value="清空" @click="clearTodo" class="btn" v-show="todos.length > 0">
            <!-- <h3>原则</h3> -->

            <h3>行为</h3>
            <input type="text" placeholder="请输入你的行为" v-model="behavior" @keydown.enter="addBehavior"> <input type="button" value="增加" @click="addBehavior"><br><br>
            开始时间: <input type="time" v-model="start" @keydown.enter="addBehavior"><br>
            结束时间: <input type="time" v-model="end" @keydown.enter="addBehavior"><br>
            <div id="remainTime">剩余时间: {{ time }}</div>
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
            <h3>图表</h3>
            <e-charts class="pie" id="pie" :option="pieOption"></e-charts>
            <br>
            <br>
            <e-charts class="radar" id="radar" :option="radarOption"></e-charts>
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref,watch,computed, onBeforeUnmount} from 'vue'

const time = ref('')

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
const end = ref('')

// 饼图 + 雷达图
const pieData=computed(()=>{
    const m = new Map()

    for(let i=0;i<behaviors.value.length;i++){
        const b = behaviors.value[i]['behavior']

        const start = behaviors.value[i]['start']
        const end = behaviors.value[i]['end']
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
}});

// 挂载时 
onMounted(()=>{
    // 开始时间
    calStart()
    // 结束时间
    freshEnd()
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
    if(behavior.value!='' && start.value!='' &&end.value!=''){
        const obj = {
            'behavior' : behavior.value,
            'start' : start.value,
            'end' : end.value
        }
        behavior.value = ''
        behaviors.value.push(obj)
    }
    calStart();
    freshEnd();
}

const delBehavior=(index)=>{
    behaviors.value.splice(index,1)
    calStart()
    freshEnd()
}

const checkTodo = (index)=>{
    todos.value[index].checked = !(todos.value[index].checked)
}

const clearTodo = ()=>{
    start.value = '00:00';
    todos.value = []
    todo.value = ''
}

const clearBehavior = ()=>{
    behaviors.value = []
    behavior.value = ''
    calStart()
    freshEnd()
    pieOption
}

// 开始时间 + 结束时间
const calStart=()=>{
    // 开始时间
    let max_ = ''
    let max = 0;
    for(let i=0;i<behaviors.value.length;i++){
        // alert(typeof(behaviors.value[i]['end']))
        const [e_h,e_m] = behaviors.value[i]['end'].split(":").map(Number)
        if((e_h*60+e_m) > max){
            max = e_h * 60  + e_m
            max_ = behaviors.value[i]['end']
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