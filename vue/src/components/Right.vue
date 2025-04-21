<template>
        <!-- 右侧元素 -->
        <div class="right">
            <h5>图示</h5>
            <div id="bar"></div>
            <div id="radar"></div>
        </div>
</template>

<script>
    import * as echarts from 'echarts';
    import { onMounted } from 'vue';

    export default{
        setup(){
            onMounted(()=>{
                // 将饼图数据、雷达图数据渲染到页面
            })
            // 获取饼图数据
            // 获取雷达图数据
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