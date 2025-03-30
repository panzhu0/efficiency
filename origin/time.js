
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
    for(const item of data){
        const li = document.createElement('li');
        li.innerHTML = `${item['startTime']} -> ${item['endTime']} : ${item['behavior']}`
        ul.appendChild(li);
        last_behavior_end_time = item['endTime'];
    }
    display.appendChild(ul);
    // 更新开始时间
    document.getElementById("start_time").value = last_behavior_end_time;
    // 更新图表数据
    option && myChart.setOption(option); 
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
    localStorage.removeItem(CONSTANT_BehaviorListStr);
    showToast("已清空行为记录");
}

// 更新函数
function updateToCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    document.getElementById('end_time').value = `${hours}:${minutes}`;
}
  
  // 每分钟自动更新一次
//   setInterval(updateToCurrentTime, 60000);


// echart 饼图显示数据
var charDom = document.getElementById("behaviorBarCharts");
var myChart = echarts.init(charDom);
var option;

// 饼图配置项目
option = {
    title:{
        text:'今日时间分配',
        subtext: getTodayISODate(),
        left:'center'
    },
    tooltip: {
      trigger: 'item'
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
        avoidLabelOverlap: false,
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
          show: false
        },
        data: getDateFromLocal()
      }
    ]
  };
  
option && myChart.setOption(option);


// 获取当前日期 格式 2020-01-01
function getTodayISODate(){
    return new Date().toISOString().split('T')[0];
}

// 从本地加载数据 然后返回数组结果
function getDateFromLocal(){
    data_str = localStorage.getItem(CONSTANT_BehaviorListStr);
    data = JSON.parse(data_str);
    const map = new Map();

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