// 导入定义PINIA 函数
import { defineStore } from "pinia"
import api from "@/api"
import todo from "@/api/todo"


const useTodoStore = defineStore('todo',{
    // 数据
    state(){
        return {
            todoList:JSON.parse(localStorage.getItem("TODOS")) || [], // 先加载本地数据,再从网络中加载数据
        }
    },

    // 方法
    actions:{
        // 获取数据
        async fetchTodos(){
            try{
                const res = await api.todo.list()
                this.todoList = res.data;
            }catch(error){
                console.error("获取TODO失败:",error)
            }
        },
        async add(item){
            // API增加数据
            try{
                const res = await api.todo.add(item)
                if(res.code !=200){
                    console.error("新增TODO失败,网络错误")
                    alert("添加TODO失败!   网络错误")
                }
                // 完成后FETCH
                this.fetchTodos()
            }catch(error){
                console.error("新增TODO失败:",error)
                alert("添加TODO失败!   网络错误")
            }
        },
        async remove(id){
            // 删除记录
            try{
                const res =await api.todo.remove(id)
                if(res.code !=200){
                    console.error("删除TODO失败,网络错误")
                    alert("删除TODO失败!  网络错误")
                    return;
                }
                this.fetchTodos()
            }catch(err){
                console.error("删除TODO失败:",err)
                alert("删除TODO失败!   网络错误")
            }
        },
        async check(id){
            // 修改记录状态
            // this.todoList[idx].checked = !this.todoList[idx].checked
            const todo = this.todoList.find(item => item.id === id)
            if(todo){
                try{
                    const res = await api.todo.check(id,!todo.checked)
                    if(res.code !=200){
                        console.error("更新TODO失败,网络错误")
                        alert("更新TODO失败!  网络错误")                  
                        return;
                    }
                    todo.checked = ! todo.checked
                }catch(err){
                    console.error("更新TODO失败:",err)
                    alert("更新TODO失败!   网络错误")
                }
            }
        },
        async clear(){
            // 清空所有记录
            try{
                const res = await api.todo.clear()
                if(res.code !=200){
                    console.error("清空 TODO失败,网络错误")
                    alert("清空TODO失败!  网络错误")
                    return;
                }
            }catch(err){
                console.error("清空TODO失败:",err)
                alert("清空TODO失败!   网络错误")
            }
            this.fetchTodos()
            this.todoList = []
        }
    }
})

export default useTodoStore;

