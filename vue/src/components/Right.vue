<template>
        <!-- 右侧元素 -->
        <div class="right">
            <h5>图示</h5>
            <div id="pie"></div>
            <div id="radar"></div>
        </div>
</template>

<script>
    import { reactive,watchEffect,onMounted,ref,onBeforeUnmount, computed  } from 'vue';
    import * as echarts from 'echarts';
    
    const TODOLIST ="TODOLIST";
    const BEHAVIORLIST ="BEHAVIORLIST";

    export default{
        setup(){
            let pieChart = null;
            let radarChart = null;
            onMounted(()=>{
                const pie = ref(document.getElementById('pie'))
                // 1.初始化饼图
                pieChart = echarts.init(pie.value)
                // 2.设置饼图配置
                const pieOption = {
                    title: {
                        text: 'Vue 3 中使用 ECharts'
                    },
                    tooltip: {},
                    xAxis: {
                        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
                    },
                    yAxis: {},
                    series: [
                        {
                            name: '销量',
                            type: 'pie',
                            data: [5, 20, 36, 10, 10, 20]
                        }
                    ]
                };
                // 3.应用配置
                pieChart.setOption(pieOption)
                // 4.响应式调整
                window.addEventListener('resize',function(){
                    pieChart.resize()
                })


                const radar = ref(document.getElementById('radar'))
            })
            onBeforeUnmount(()=>{
                // 组件卸载时销毁图表
                if(pieChart){
                    pieChart.dispose()
                    pieChart = null
                }
            })
            // 获取饼图数据
            // 获取雷达图数据
            // 使用LS
            let behaviors = useLS(BEHAVIORLIST,[])

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
            // 解析LS中的行为数据，转换为Pie图能接受的形式
            // pie类型数据
            let pieData = computed(()=>{
                for(let i=0;i<behaviors.length;i++){
                    let m = new Map()
                    // 获取当前行为的时间
                    let [h_s,m_s] = behaviors[i]['start'].split(':').map(Number)
                    let [h_e,m_e] = behaviors[i]['end'].split(':').map(Number)
                    let duration = h_e * 60 + m_e -  h_s*60 - m_s  //单位分钟
                    alert(duration)
                    m.set(
                        behaviors[i]['name'],                       //Key
                        duration + m.get(behaviors[i]['name']))     //Value
                }
                return m;
            })
            return {behaviors,pieChart,pieData}
        }
    }
</script>
<style>
/* 饼图 */
#pie{
    width: 500px;
    height: 600px;
}

/* 雷达图 */
#radar{
    width: 500px;
    height: 600px;
}
</style>