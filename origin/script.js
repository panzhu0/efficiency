// 全局变量
let btnValue; //按钮的值
const CONSTANTBehaviorListStr = "BEHAVIORLIST"; // LS 常量名
const div = document.getElementById('gen-behavior');  // 获取div
const start = document.getElementById('start-time'); // 开始时间选择器
const end = document.getElementById('end-time'); // 开始时间选择器

/**
 * 获取按钮的值
 * @param {} btn 按钮对象
 */
function getVal(btn){
    btnValue = btn.value;
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
    div.innerHTML = "";

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
    div.appendChild(ul);
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

freshBehaviorDiv();
freshStartTime()
freshEndTime();

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

// 刷新行为列表
// shBehaviorDiv();

// 清空LS中的习惯数据
function empty(){
    localStorage.removeItem(CONSTANTBehaviorListStr);
    freshBehaviorDiv();
    freshBarChart();
    freshStartTime();
    showToast("已清空!");
}

// 饼图
const chartDom = document.getElementById('chart-bar');
const myChart = echarts.init(chartDom);
var option;

option = {
    title:{
      text:'今日时间分配',
      subtext: getTodayDate(),
      left:'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        const minutes = (params.value) * 60;
        const hours = params.value;
        const percent = params.percent;
        return `
            ${params.name}<br/>
            分钟数: ${minutes} 分钟<br/>
            小时数: ${hours} 小时<br/>
            占比: ${percent}%
        `;
      },
    },
    legend: {
      orient:'vertical',
      top: '5%',
      left: 'left'
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
        data: getBarDate(),
      }
    ]
};
  
option && myChart.setOption(option);

// 获取日期
function getTodayDate(){
  return new Date().toLocaleDateString();
}

// 获取饼图数据
function getBarDate(){
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


// 刷新饼图
function freshBarChart(){
  myChart.setOption({
    series: [{ data: getBarDate()}]
  });
}

// 雷达图
var charDOM2 = document.getElementById('chart-radar');
var myChart2 = echarts.init(charDOM2);
var option2;

option2 = {
  // 标签
    title: {
      text: '时间分布情况',
      left: 'left',
    },
    itemStyle: {
      borderRadius: 1,
      borderColor: '#fff',
      borderWidth: 1
    },
    // 标签
    legend: {
      data: ['极限时间分配', '实际时间分配'],
      left: 'right'
    },
    // 雷达图指标
    radar: {
      // shape: 'circle',
      indicator: getRadarIndicator(),
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          // {
          //   name: '极限时间分配',
          //   value: getRadarExceptData(),
          // },
          {
            name: '实际时间分配',
            value:getRadarActuallData(),
            label:{
              show: true,
              position: 'top', // 标签位置（'top'/'left'/'right'/'bottom'）
              formatter: '{c}' // 显示数据值（{a}系列名, {b}维度名, {c}数值）
            },
            // 区域样式
            areaStyle: { opacity: 0.7 }
          }
        ]
      }
    ],
};

option2 && myChart2.setOption(option2);

// 获取雷达图的最大值
function radarMax(){
  data = getBarDate();
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
  return max;
}

// 获取雷达图的指标信息
// 格式:  {name:"",max:};
function getRadarIndicator(){
  const ret = [];
  // 获取 {name:"",value:""};
  data = getBarDate();
  if(!data){
    return ret;
  }
  // 最大值 max, 设置为已有行为的最大值
  for(const item of data){
    ret.push({
      name:item['name'],
      max:radarMax()
    })
  }

  // 返回数据
  return ret;
}

// 雷达-实际数据
function getRadarActuallData(){
  // 获取 {name:"" ,value:100}
  data = getBarDate();
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


/**
 * 刷新雷达图
 * 雷达图有三个数据量,indicator,两个data
 */
function freshRadarChart(){
  myChart2.setOption()
}