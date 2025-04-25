const BEHAVIORS = 'behaviors'

import { useLS } from '@/composables/useLS';
import { defineStore } from 'pinia'

export const useBehaviorStore = defineStore('behavior',()=>{
    const behaviors = useLS(BEHAVIORS,[])

    // 该store中有 count doublecount increment 三个元素可供使用
    return {behaviors}
})