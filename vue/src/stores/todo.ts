// 导入定义PINIA 函数
import { defineStore } from "pinia"


const useTodoStore = defineStore('todo',{
    // 数据
    state(){
        return {
            todoList:JSON.parse(localStorage.getItem("TODOS")) || [],
        }
    },

    // 方法
    actions:{
        add(item){
            this.$patch({
                todoList: [...this.todoList,item]
            })
        },
        remove(idx){
            this.todoList.splice(idx,1)
        },
        check(idx){
            this.todoList[idx].checked =  !this.todoList[idx].checked
        },
        clear(){
            this.todoList = []
        }
    }

    // 监听器
})

export default useTodoStore;

