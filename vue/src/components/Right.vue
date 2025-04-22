<template>
        <!-- 右侧元素 -->
        <div class="right">
            <h5>图示</h5>
            <div id="bar"></div>
            <div id="radar"></div>
        </div>
</template>

<script>
    import { onMounted } from 'vue';
    import { reactive,watchEffect } from 'vue';
    
    const TODOLIST ="TODOLIST";
    const BEHAVIORLIST ="BEHAVIORLIST";

    export default{
        setup(){
            onMounted(()=>{
                // 将饼图数据、雷达图数据渲染到页面
            })
            // 获取饼图数据
            // 获取雷达图数据
            // 使用LS
            let behaviors = useLS(BEHAVIORLIST,[])
            alert(behaviors)

            function useLS(key, defaultValue) {
                // 从 localStorage 读取初始值或使用默认值
                const initialValue = localStorage.getItem(key)
                    ? JSON.parse(localStorage.getItem(key))
                    : defaultValue
                
                // 创建响应式引用
                const data = reactive(initialValue)
                
                // 使用 watchEffect 自动同步到 localStorage
                watchEffect(() => {
                    localStorage.setItem(key, JSON.stringify(data))
                })

                return data
            }
            return {behaviors,todos}
        }
    }
</script>
<style>
/* 饼图 */
#bar{
    width: 500px;
    height: 600px;
}

/* 雷达图 */
#radar{
    width: 500px;
    height: 600px;
}
</style>