// 全局变量
let btn_value; //按钮的值
const CONSTANT_BehaviorListStr = "BEHAVIORLIST"; // LS 常量名
const div = document.getElementById('gen_behavior');  // 获取div
const start = document.getElementById('start_time'); // 开始时间选择器
const end = document.getElementById('end_time'); // 开始时间选择器

/**
 * 获取按钮的值
 * @param {} btn 按钮对象
 */
function getVal(btn){
    btn_value = btn.value;
}

/**
 * 保存行为信息到LocalStore,并刷新行为列表
 */
function save_behavior(){
    // 更新LocalStore
    if(!btn_value || !start.value || !end.value){
        //数据不够就提示错误，并退出
        showToast("错误,数据不够!");
        return;
    }

    // JSON数组
    const jsObj = {
        //行为
        behavior : btn_value,
        //起始时间
        startTime : start.value,
        //结束时间
        endTime: end.value,
    }

    // 对象数组增加要给数据并返回
    local_store_behavior_add(jsObj); 

    // 刷新对应数据
    fresh_behavior_div(); //无序列表
    fresh_bar_chart();    //饼图
    fresh_radar_chart();  //雷达图
    fresh_start_time();   //开始时间
    fresh_end_time();     //结束时间
}

/**
 * 向LocalStore 的behaviorList 增加一个JSON对象数据
 */
function local_store_behavior_add(jsObj){
    // 1. 从LS 获取数据(字符串 => JSON数组)
    let array = JSON.parse(getDataFromLS());

    // 2. 增加对象到数组
    array.push(jsObj);

    // 3. 写回到LS(JSON数组 => 字符串)
    const arrayStr = JSON.stringify(array);
    localStorage.setItem(CONSTANT_BehaviorListStr,arrayStr);
}

/**
 * 从LocalStorage 获取数据 并刷新生成 无序列表
 */
function fresh_behavior_div(){
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
function fresh_start_time(){
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
function fresh_end_time(){
    // 默认设置为当前时间
    end.value = currentTime();
}

fresh_behavior_div();
fresh_start_time()
fresh_end_time();

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
    const dataStr = localStorage.getItem(CONSTANT_BehaviorListStr) || [];   //JSON数组 字符串形式
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
// sh_behavior_div();

// 清空LS中的习惯数据
function empty(){
    localStorage.removeItem(CONSTANT_BehaviorListStr);
    fresh_behavior_div();
    fresh_bar_chart();
    fresh_start_time();
    showToast("已清空!");
}

// 饼图
const chartDom = document.getElementById('char_bar');
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
function fresh_bar_chart(){
  myChart.setOption({
    series: [{ data: getBarDate()}]
  });
}

// 雷达图
var charDOM2 = document.getElementById('char_radar');
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
    },
    // 雷达图指标
    radar: {
      // shape: 'circle',
      indicator: radar_indicator(),
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            name: '极限时间分配',
            value: radar_except_data(),
          },
          {
            name: '实际时间分配',
            value:radar_actuall_data(),
            label:{
              show: true,
              position: 'top', // 标签位置（'top'/'left'/'right'/'bottom'）
              formatter: '{c}' // 显示数据值（{a}系列名, {b}维度名, {c}数值）
            },
            // 区域样式
            areaStyle: { opacity: 0.8 }
          }
        ]
      }
    ],
};

option2 && myChart2.setOption(option2);

// 获取雷达图的最大值
function radar_max(){
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
function radar_indicator(){
  const ret = [];
  data = getBarDate();
  if(!data){
    return ret;
  }
  for(const item of data){
    ret.push({
      name:item['name'],
      max:radar_max()
    })
  }

  // 遍历
  return ret;
}

// 雷达-实际数据
function radar_actuall_data(){
  data = getBarDate();
  let ret= [];
  if(!data){
    return ret; 
  }
  for(const v of data){
    ret.push(
      parseFloat(v['value'].toFixed(2))
    ); //值 只保留后两位
  }
  return ret;
}

// 雷达-预期数据
function radar_except_data(){
  const data = JSON.parse(localStorage.getItem(CONSTANT_BehaviorListStr));
  const val = [];
  if(!data){
    return undefined;
  }

  for(const v of data){
    val.push(radar_max());
  }
  return val;
}


// 更新雷达图
function fresh_radar_chart(){
  myChart2.setOption(option2);
}