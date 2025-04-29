<template>
    <h4>todo</h4>
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
            <e-charts class="pie" id="pie" :option="pieOption"></e-charts>
            <e-charts class="radar" id="radar" :option="radarOption"></e-charts>
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref,watch} from 'vue'
import * as echarts from 'echarts'

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

// 图像数据
const pieOption = ref({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
})

const radarOption= ref({
  title: {
    text: 'Basic Radar Chart'
  },
  legend: {
    data: ['Allocated Budget', 'Actual Spending']
  },
  radar: {
    // shape: 'circle',
    indicator: [
      { name: 'Sales', max: 6500 },
      { name: 'Administration', max: 16000 },
      { name: 'Information Technology', max: 30000 },
      { name: 'Customer Support', max: 38000 },
      { name: 'Development', max: 52000 },
      { name: 'Marketing', max: 25000 }
    ]
  },
  series: [
    {
      name: 'Budget vs spending',
      type: 'radar',
      data: [
        {
          value: [4200, 3000, 20000, 35000, 50000, 18000],
          name: 'Allocated Budget'
        },
        {
          value: [5000, 14000, 28000, 26000, 42000, 21000],
          name: 'Actual Spending'
        }
      ]
    }
  ]
})
console.log(radarOption.value)

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


// 饼图 + 雷达图

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

.pie{
    width: 700px;
    height: 500px;
}

.radar{
    width: 700px;
    height: 500px;
}
</style>