const checkbox = document.getElementsByClassName("checkbox")

loadCheckBoxState()

for(let i=0;i<checkbox.length;i++){
    // Todo 改变事件
    checkbox[i].addEventListener('change',function(){
        const taskText = this.nextSibling.textContent.trim();
        if(this.checked){
            console.log(`"${taskText}" 已完成`);
            this.parentElement.classList.add('completed')
        }else{
            console.log(`"${taskText}" 未完成`);
            this.parentElement.classList.remove('completed');
        }
        // 前端保存:保存数据到本地存储
        saveCheckBoxState();
    })

}

// 保存多选框 选择的结果到本地存储LocalStore
function saveCheckBoxState(){
    const state= {};
    const checkbox = document.querySelectorAll('input[type="checkbox"]')
    checkbox.forEach(checkbox=>{
        state[checkbox.id] = checkbox.checked;
    })

    localStorage.setItem('checkboxState',JSON.stringify(state));
}

// 加载多选框状态
function loadCheckBoxState(){
    const savedState = localStorage.getItem('checkboxState');
    if(savedState){
        // 获取状态信息
        const state = JSON.parse(savedState);
        // 加载状态信息
        const checkbox = document.querySelectorAll('input[type="checkbox"]');
        checkbox.forEach(checkbox=>{
            if(state.hasOwnProperty(checkbox.id)){
                checkbox.checked = state[checkbox.id];
            }
        });
    }
}

