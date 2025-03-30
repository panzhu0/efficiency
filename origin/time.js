
const CONSTANT_BehaviorListStr = "BEHAVIORLIST";

let butVal;
let start_time;
let end_time;
let saveBahaviors;

// 更新开始时间
updateToCurrentTime();
// 加载数据
loadFromLocal();

function getVal(button){
    // 获取按钮的值
    butVal = button.value;
}

function save(){
    // 获取值
    start_time = document.getElementById("start_time").value
    end_time = document.getElementById("end_time").value

    // 检测值
    console.log(butVal)
    console.log(start_time)
    console.log(end_time)

    // 运行
    // if(butVal=="" || butVal == undefined || start_time == undefined|| start_time == "" || end_time == undefined || end_time == ""){
    if(!butVal||!start_time||!end_time){
        showToast("信息不全,无法记录");
    }else{
        // 将数据保存到本地(JSON)并渲染到时间记录
        const behaviorList = {
            behavior : butVal,
            startTime : start_time,
            endTime : end_time
        };

        // 从本地加载数据
        let saveBahaviors =JSON.parse(localStorage.getItem(CONSTANT_BehaviorListStr)) || [];

        // 将数据添加并记录到本地
        saveBahaviors.push(behaviorList);
        localStorage.setItem(CONSTANT_BehaviorListStr,JSON.stringify(saveBahaviors));

        // 将数据显示到页面上
        displayBehavior(saveBahaviors);
        freshChart();
    }

}

// 刷新所有chart
function freshChart(){
  myChart.clear();
  myChart2.clear();
  if(option){
    option&&myChart.setOption(option);
  }
  if(option2){
    option2&&myChart2.setOption(option2);
  }
}

// 从本地存储加载数据
function loadFromLocal() {
    const savedEvents = JSON.parse(localStorage.getItem(CONSTANT_BehaviorListStr)) || [];
    displayBehavior(savedEvents);
}

// 页面展示数据
function displayBehavior(data){
    const display = document.getElementById("displayArea");
    // 清空原有数据
    display.innerHTML = "";
    // 重新加载数据
    const ul = document.createElement('ul');
    // 今日最近一件已完成行为的结束时间
    let last_behavior_end_time;
    if(data){
      // 如果有数据
      for(const item of data){
          const li = document.createElement('li');
          li.innerHTML = `${item['startTime']} -> ${item['endTime']} : ${item['behavior']}`
          ul.appendChild(li);
          last_behavior_end_time = item['endTime'];
      }
      display.appendChild(ul);
      // 更新开始时间
      if(last_behavior_end_time){
        document.getElementById("start_time").value = last_behavior_end_time;
      }
      // 更新图表数据
      option && myChart.setOption(option);
    }
}

// TOAST 显示
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2000); // 3秒后消失
}

// 清空LocalStore 中的行为数组记录,然后刷新显示
function empty(){
    loadFromLocal();
    displayBehavior();
    localStorage.removeItem(CONSTANT_BehaviorListStr);
    //重新获取数据
    // 刷新所有Chart
    freshChart();
    showToast("已清空行为记录");
}

// 更新函数
function updateToCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('end_time').value = `${hours}:${minutes}`;
}

// echart 饼图显示数据
var charDom = document.getElementById("behaviorBarCharts");
var myChart = echarts.init(charDom);
var option;

// 饼图配置项目
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
      orient: 'vertical',
      top: '5%',
      left: 'left',
    },
    series: [
      {
        name: '时间分配',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        // hover时的标签
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
          show: true
        },
        data: getDateFromLocal()
      }
    ]
  };
  
option && myChart.setOption(option);


// 获取当前日期 格式 2020-01-01
function getTodayDate(){
    return new Date().toLocaleString().split(' ')[0];
}

/**
 * 从LOCALSTORAGE 获取数据并返回
 * @returns 结果数组 [{name:"", value:100},{} ,{} ,{}]]
 */
function getDateFromLocal(){
    data_str = localStorage.getItem(CONSTANT_BehaviorListStr);
    data = JSON.parse(data_str);
    const map = new Map();
    if(!data){
      return;
    }
    for(const item of data){
        // 间隔时间
        const duration = getTimeDiffSimple(item['startTime'],item['endTime']);

        // Map 记录对应的数据
        map.set(
            item['behavior'],
            Number(map.get(item['behavior'])) + duration || 0 + duration
        );
    }

    // 转换为 {value: 时间(h) name: 行为} JSON 对象并返回
    const retData = [];
    map.forEach((value, key) => {
        a = {
            name : key,
            value : value,
        }
        retData.push(a);
    });

    return retData;
}

function getTimeDiffSimple(startTime, endTime) {
    // 解析时间字符串
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    // 计算总分钟数差值
    const totalStartMinutes = startHour * 60 + startMinute;
    const totalEndMinutes = endHour * 60 + endMinute;
    const diffMinutes = totalEndMinutes - totalStartMinutes;
    
    // 转换为小时
    return diffMinutes / 60;
}

/**
 * 将小时数据转换为分钟
 * @param {Array} hoursData - 原始小时数据数组
 * @returns {Array} 转换后的分钟数据数组
 */
function hoursToMinutes(hoursData) {
    return hoursData.map(item => {
        return {
            name: item.name,
            value: parseFloat((item.value * 60).toFixed(2)),
            rawValue: item.value,
            // 保留原始对象的所有其他属性
            ...item
        };
    });
}

// 雷达图
var charDOM2 = document.getElementById('summary');
var myChart2 = echarts.init(charDOM2);
var option2;

option2 = {
  // 标签
    title: {
      text: '时间分布情况',
      left: 'left',
    },
    // 标签
    legend: {
      data: ['目标时间分配', '实际时间分配'],
    },
    // 雷达图指标
    radar: {
    //   shape: 'circle',
      indicator: radar_indicator(),
    },
    // 
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            // name: '目标时间分配',
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
            areaStyle: { opacity: 0.2 }
          }
        ]
      }
    ],
};

if(option2){
  option2 && myChart2.setOption(option2);
}

// 获取雷达图的最大值
function radar_max(){
  data = getDateFromLocal();
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
// 格式:  {name:"",max:123};
function radar_indicator(){
  const ret = [];
  data = getDateFromLocal();
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


// 获取雷达图的数据
function radar_actuall_data(){
  data = getDateFromLocal();
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
  