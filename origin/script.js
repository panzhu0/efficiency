// 全局变量
let btnValue; //按钮的值
const CONSTANTBehaviorListStr = "BEHAVIORLIST";       // LS BEHAVIOR 常量名
const CONSTANTTODOLIST = "TODOLIST";                  // LS TODO 常量名
const start = document.getElementById('start-time');  // 开始时间元素对象
const end = document.getElementById('end-time');      // 开始时间元素对象
const todoDiv = document.getElementById('gen-todo')   // todoDIV元素对象 
const behaviorDiv = document.getElementById('gen-behavior');  //behaviorDiv元素对象
const todoInput = document.getElementById('todo-content');    //todo实际内容元素对象

// 饼图
const chartDom = document.getElementById('chart-bar');
const myChart = echarts.init(chartDom);
var option;

// 雷达图
var chartDOM2 = document.getElementById('chart-radar');
var myChart2 = echarts.init(chartDOM2);
var option2;

/**
 * 获取按钮的值
 * @param {} btn 按钮对象
 */
function getVal(btn){
    btnValue = btn.value;
}

/**
 * 增加待办事件数据保存在LS
 */
function addTodo(){
  if(!todoInput.value){
    showToast("请输入TODO内容");
    return;
  }

  // 获取TODO的文本信息 JSON{ 'todo内容' , 点击状态【0:未点击,1点击】};
  const jsObj = {
    todoVal: todoInput.value,
    state: false,
  };

  // 将TODO加入到LS数组
  addTodo2LS(jsObj);

  // 刷新TODO DIV的内容
  freshTodoDiv();

  // 监听-> 多选框点击事件
  addEventListener2Todo();
  
  showToast(`Todo  =>  ${todoInput.value}`);

  // 清空文本
  todoInput.value="";
}

function addEventListener2Todo(){
  const checkboxes = document.querySelectorAll('.todo-checkbox')
  for(const checkbox of checkboxes){
    checkbox.addEventListener('change',(e)=>{
      const checkboxObj = e.target;
      const labelObj =e.target.parentElement;    //Label 标签对象
      const val = labelObj.querySelector('span').textContent;

      // 如果点击了多选框,设置样式，同时将点击状态更新到LS
      if(checkboxObj.checked){
        labelObj.classList.add('strikethrough');
        setTodoState2LS(val,true);
      }else{
        labelObj.classList.remove('strikethrough');
        setTodoState2LS(val,false); 
      };
    })
  }
}

/**
 * 刷新 渲染 TodoList 到页面
 */
function freshTodoDiv(){
  // 从LS加载数据
  const array = JSON.parse(getTodoFromLS());
  // 清空原有的
  todoDiv.innerHTML = "";
  // 如果数据为空,退出
  if(!array){
    return;
  }

  for(const item of array){
    // label
    const label = document.createElement("label");

    //  input
    const input = document.createElement("input");
    input.type='checkbox'
    if(item['state'] == true){
      label.classList.add("strikethrough");
      input.checked=true;
    }else{
      input.checked=false;
    }

    input.classList.add('todo-checkbox');
    label.appendChild(input);

    //  文本内容
    const span = document.createElement('span');
    span.innerText = item['todoVal'];
    label.appendChild(span);
    todoDiv.appendChild(label);

    // br
    const br = document.createElement('br');
    todoDiv.appendChild(br);
  }
}

/**
 * 设置Todo项目的点击状态,保存到LS中
 * @param {Todo内容} val 
 * @param {点击状态} status 
 */
function setTodoState2LS(val,status){
  // 获取原有数据
  data = JSON.parse(getTodoFromLS());
  newArray = [];

  // 遍历 LS-todo,将选中的多选框的 选中状态置反
  for(const item of data){
    if(item['todoVal'] == val){
      item['state'] = !item['state'];
    }
    newArray.push(item);
  }

  // 清空原有LS中的 TODO 数据
  localStorage.setItem(CONSTANTTODOLIST,JSON.stringify(newArray));
}

/**
 * 从LS获取TODO 列表
 */
function getTodoFromLS(){
  return localStorage.getItem(CONSTANTTODOLIST);
}

/**
 * 将TODO增加到LS TODOList
 */
function addTodo2LS(todo){
  // 获取原有数组
  const array = JSON.parse(localStorage.getItem(CONSTANTTODOLIST)) || [];

  // 增加todo到数组
  array.push(todo);



  // 保存数据到LS
  const arrayStr = JSON.stringify(array);
  localStorage.setItem(CONSTANTTODOLIST,arrayStr);
}

// 清空todo
function emptyTodo(){
  localStorage.removeItem(CONSTANTTODOLIST);
  todoDiv.innerHTML = "";
  showToast("清空Todo!")
}

/**
 * 保存行为信息到LocalStore,并刷新行为列表
 */
function saveBehavior(){
    // 更新LocalStore
    if(!btnValue || !start.value || !end.value){
        //数据不够就提示错误，并退出
        showToast("错误,数据不够!");
        return;
    }

    // JSON数组
    const jsObj = {
        //行为
        behavior : btnValue,
        //起始时间
        startTime : start.value,
        //结束时间
        endTime: end.value,
    }

    // 对象数组增加要给数据并返回
    localStoreBehaviorAdd(jsObj); 

    // 刷新对应数据
    freshBehaviorDiv(); //无序列表
    freshBarChart();    //饼图
    freshRadarChart();  //雷达图
    freshStartTime();   //开始时间
    freshEndTime();     //结束时间
}

/**
 * 向LocalStore 的behaviorList 增加一个JSON对象数据
 */
function localStoreBehaviorAdd(jsObj){
    // 1. 从LS 获取数据(字符串 => JSON数组)
    let array = JSON.parse(getDataFromLS());

    // 2. 增加对象到数组
    array.push(jsObj);

    // 3. 写回到LS(JSON数组 => 字符串)
    const arrayStr = JSON.stringify(array);
    localStorage.setItem(CONSTANTBehaviorListStr,arrayStr);
}

/**
 * 从LocalStorage 获取数据 并刷新生成 无序列表
 */
function freshBehaviorDiv(){
    // 清空原有数据
    behaviorDiv.innerHTML = "";

    // 从LS加载数据
    const data = JSON.parse(getDataFromLS());
    if(!data){
        //如果data 为空
        data = [];
    }

    // 刷新行为记录列表的数据
    const ul = document.createElement('ul');
    for(const item of data){
        const li = document.createElement('li');
        li.innerHTML = `${item['startTime']} -> ${item['endTime']} : ${item['behavior']}`
        ul.appendChild(li);
    }
    behaviorDiv.appendChild(ul);
}

/**
 * 刷新 开启时间选择框
 */
function freshStartTime(){
    // 值为最后一个已完成项目的结束时间
    jsObjArray = JSON.parse(getDataFromLS());
    let end;
    for(const item of jsObjArray){
        end = item['endTime']
    }
    //BUG: end undefined
    if(end){
        start.value = end;
    }else{
        start.value = '00:00';
    }
}

/**
 * 刷新 结束时间选择框
 */
function freshEndTime(){
    // 默认设置为当前时间
    end.value = currentTime();
}

/**
 * 获取当前时间
 * @returns 当前时间 hh:mm:sss
 */
function currentTime(){
    return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

/**
 * 从LS获取behavior数据数组 (字符串)
 * @returns {behavior:"",startTime:"",endTime:""} 数据为[JSON数组列表] 的 字符串
 */
function getDataFromLS(){
    const dataStr = localStorage.getItem(CONSTANTBehaviorListStr) || [];   //JSON数组 字符串形式
    if(dataStr == ""){
        return "[]";
    }
    return dataStr;
}

// 实现Toast 功能
// TOAST 显示
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500); // 3秒后消失
}

// 清空LS中的习惯数据
function empty(){
  localStorage.removeItem(CONSTANTBehaviorListStr);
  freshAll();
  myChart2.clear(); //这里有个为解决的BUG : TODO :::::BUG 为什么数据清空后，myCharts2.setOption(option2); 会报错,清空不了(),这里直接强制把myChart2清空掉整个图层
  showToast("已清空!"); 
}

function freshBarChart(){
  option = {
      title:{
        text:'今日时间分配',
        subtext: getTodayDate(),
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
          data: getBarData(),
        }
      ]
  };
    
  option && myChart.setOption(option);
}

// 获取日期
function getTodayDate(){
  return new Date().toLocaleDateString();
}

// 获取饼图数据
function getBarData(){
  const map = new Map();
  const data = JSON.parse(getDataFromLS());
  for(const item of data){
    if(!map.get(item['behavior'])){
      //如果没有，设置为该值
      map.set(item['behavior'],timeDiff(item['startTime'],item['endTime']));
    }else{
      //如果已有，增加原有数据
      const sum =  Number(map.get(item['behavior']))  //原有的
        + timeDiff(item['startTime'],item['endTime']) //新加的;

      // 设置为更新后的数据
      map.set(item['behavior'],sum);
    }
  }

  // 设置数据
  const ret = [];
  map.forEach((value, key) => {
    d = {
      name : key,
      value : value,
    }
    ret.push(d);
  })

  // 返回数据
  return ret;
}

// 获取两个时间值的时间差 (1:00,2:30) return 1.5H
function timeDiff(start,end){
  // 解析时间字符串
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  
  // 计算总分钟数差值
  const totalStartMinutes = startHour * 60 + startMinute;
  const totalEndMinutes = endHour * 60 + endMinute;
  const diffMinutes = totalEndMinutes - totalStartMinutes;
  
  // 转换为小时
  return diffMinutes / 60;
}



function freshRadarChart(){
  option2 = {
    title: {
      text: '时间分配雷达图'
    },
    legend: {
      data: ['极限', '实际时间']
    },
    radar: {
      // shape: 'circle',
      indicator: getRadarIndicator(),
    },
    series: [
      {
        name: '极限时间 vs 实际时间',
        type: 'radar',

        data: [
          {
            value: getRadarExceptData(),
            name: '极限'
          },
          {
            value: getRadarActuallData(),
            name: '实际时间',
            label: {
              show: true,
              position: 'left',
              color: '#000',
              fontSize: 14,
              fontWeight: 'bold',
              formatter: '{c}'  // {c} 表示数据值
            },
          }
        ]
      }
    ]
  };

  // 刷新
  if(getBarData().length > 0){
    option2 && myChart2.setOption(option2);
  }
}


// 获取雷达图的最大值
function radarMax(){
  data = getBarData();
  let max = 0;

  // 没有数据就返回0
  if(!data){
    return max;
  }

  // 返回时间最大值
  for(const item of data){
    if(item['value'] > max){
      max = item['value'];
    }
  }
  return parseFloat(max).toFixed(2);
}

// 获取雷达图的指标信息
// 格式:  {name:"",max:};
function getRadarIndicator(){
  const ret = [];
  // 获取 {name:"",value:""};
  data = getBarData();
  if(!data||data.length == 0){
    return ret;
  }

  // 最大值 max, 设置为已有行为的最大值
  for(const item of data){
    ret.push({
      name:item['name'],
      max: parseFloat(radarMax()).toFixed(2),
    })
  }

  // 返回数据(数组类型)
  return ret;
}

// 雷达-实际数据
function getRadarActuallData(){
  // 获取 {name:"" ,value:100}
  data = getBarData();
  // 
  let ret= [];
  if(!data){
    // 如果没有数据需要显示，直接返回
    return ret; 
  }
  // 从数据数组中获取值,只保留小数点后两位
  for(const v of data){
    ret.push(
      parseFloat(v['value'].toFixed(2))
    ); //值 只保留后两位
  }
  // 返回
  return ret;
}

// 雷达-预期数据
function getRadarExceptData(){
  // 获取 {name:"",value:100}
  const data = JSON.parse(localStorage.getItem(CONSTANTBehaviorListStr));
  const ret = [];
  if(!data){
    // 如果数据数组中没有数据,直接返回
    return undefined;
  }

  // 预期数据这里设置为,当前所有行为中，最大已经完成的行为的时长
  const max = radarMax();
  for(const item of data){
    ret.push(max);
  }
  // 返回
  return ret;
}

function freshAll(){
  freshBarChart();
  freshBehaviorDiv();
  freshEndTime();
  freshStartTime();
  freshRadarChart();
  freshTodoDiv();
  addEventListener2Todo();
}

// 显示数据
freshAll();