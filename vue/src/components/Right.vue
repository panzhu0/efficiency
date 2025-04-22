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
    
    const BEHAVIORLIST ="BEHAVIORLIST"

    export default{
        setup(){
            let pieChart = null
            onMounted(()=>{
            const pieDiv = ref(document.getElementById('pie'));
                pieChart = echarts.init(pieDiv.value)
                const pieOption = {
                    title:{
                        text:'今日时间分配',
                        subtext: getTodayDate(),
                        left:'left'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: function(params) {
                        const minutes = (params.value) * 60;
                        const hours = params.value;
                        const percent = params.percent;
                        return `
                            ${params.name}<br/>
                            分钟数: ${parseFloat(minutes).toFixed(2)} 分钟<br/>
                            小时数: ${parseFloat(hours).toFixed(2)} 小时<br/>
                            占比: ${percent}%
                        `;
                        },
                    },
                    legend: {
                        orient:'vertical',
                        top: '5%',
                        left: 'right'
                    },
                    series: 
                    [
                        {
                        name: '时间分布',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: true,
                            position: 'outside',  // 标签显示在扇形外侧
                            alignTo: '',  // 标签对齐边缘
                            formatter: function(param){
                            return `${param.name} : ${parseFloat(param.value).toFixed(2)} 小时`
                            },
                            margin: 0  // 标签与饼图的距离
                        },
                        emphasis: {
                            label: {
                            show: true,
                            fontSize: 35,
                            formatter: function(param){
                                return `${param.name} ${parseFloat(param.value).toFixed(1)}`
                            },
                            fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: true 
                        },
                        data: pieData.value,
                        }
                    ]
                };
                pieChart.setOption(pieOption)
                // 响应式更新
                window.addEventListener('resize',function(){
                    pieChart.resize()
                })

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
            const pieData = computed(() => {
                const m = new Map();
                for(let i =0;i<behaviors.length;i++){
                    const [h_s, m_s] = behaviors[i].start.split(':').map(Number);
                    const [h_e, m_e] = behaviors[i].end.split(':').map(Number);
                    const duration = h_e*60+m_e - h_s*60 - m_s
                    // alert(behaviors[i]['behavior'])
                    // alert(duration)
                    m.set(
                        behaviors[i]['behavior'],
                        duration + (m.get(behaviors[i]['behavior'])||0)
                    )
                    // alert("=>"+m.get(behaviors[i]['behavior']))
                }
                var obj = []
                for(const [k,v] of m){
                    obj.push({
                        'value':v/60,
                        'name':k
                    })
                }
                return obj
            });

            function getTodayDate(){
                const d = new Date()
                return d.toLocaleDateString()
            }

            alert(JSON.stringify(pieData.value)) //pieData 惰性访问
            return {behaviors,pieChart,pieData}
        }
    }
</script>
<style>
/* 饼图 */
#pie{
    width: 900px;
    height: 600px;
}

/* 雷达图 */
#radar{
    width: 900px;
    height: 600px;
}
</style>