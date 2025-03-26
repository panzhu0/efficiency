const checkbox = document.getElementsByClassName("checkbox")

for(let i=0;i<checkbox.length;i++){
    checkbox[i].addEventListener('change',function(){
        const taskText = this.nextSibling.textContent.trim();
        if(this.checked){
            console.log(`"${taskText}" 已完成`);
            this.parentElement.classList.add('completed')
        }else{
            console.log(`"${taskText}" 未完成`);
            this.parentElement.classList.remove('completed');
        }
    })
    // checkbox[i].checked=true;
}

