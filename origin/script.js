const checkbox = document.getElementsByClassName("checkbox")

alert(document.getElementById("c1").parentElement) //获取到label对象
document.getElementById("c1").parentElement.classList.add("completed")


for(let i=0;i<checkbox.length;i++){
    checkbox[i].addEventListener('change',function(){
        const taskText = this.nextSibling.textContent.trim();
        alert("sibliing:",this.nextSibling)
        if(this.checked){
            // alert(`"${taskText}" 已完成`);
            // 增加样式
            this.nextSibling.style.textDecoration = "line-through";
            this.nextSibling.style.color = "#888";
        }else{
            alert(`"${taskText}" 未完成`);
            this.nextSibling.style.textDecoration = "none";
            this.nextSibling.style.color = "#000";
        }
    })
    // checkbox[i].checked=true;
}

