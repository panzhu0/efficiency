
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
    for(const item of data){
        const li = document.createElement('li');
        li.innerHTML = `${item['startTime']} -> ${item['endTime']} : ${item['behavior']}`
        ul.appendChild(li);
    }
    display.appendChild(ul);
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
    document.getElementById('start_time').value = `${hours}:${minutes}`;
  }
  
  // 每分钟自动更新一次
//   setInterval(updateToCurrentTime, 60000);