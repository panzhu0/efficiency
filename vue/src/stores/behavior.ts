import { defineStore } from "pinia";

const useBehaviorStore = defineStore("behavior",{
    // 数据
    state(){
        return {
            behaviorList: JSON.parse(localStorage.getItem("BEHAVIORS")) || [],
        }
    },
    // 方法
    actions:{
        add(item){
            this.$patch({
                behaviorList: [...this.behaviorList,item]
            })
        },
        remove(idx){
            this.behaviorList.splice(idx,1)
        },
        clear(){
            this.behaviorList= []
        }
    }
})

export default useBehaviorStore