import {ref,computed} from 'vue'
import { defineStore } from 'pinia'

// 定义了一个叫 counter 的Store
export const useCounterStore = defineStore('counter',()=>{
    const count = ref(0)        // STATE
    const doubleCount = computed(()=>{return count.value * 2})  // 
    function increment(){
        count.value ++ 
    }

    // 该store中有 count doublecount increment 三个元素可供使用
    return {count,doubleCount,increment}
})