<template>
    <h5>Charts</h5>
    <div class="pie" id="pie"></div>
    <div class="radar" id="radar"></div>
</template>
<script>
const BEHAVIORS = 'behaviors'
import { useLS } from '@/composables/useLS';
import { onMounted,ref, render, watch } from 'vue';
import * as echarts from 'echarts';



export default{
    setup(){
        const behaviors = useLS(BEHAVIORS,[])
        var pieChart = ""

        onMounted(()=>{
            const pieDom = document.getElementById('pie')
            pieChart = echarts.init(pieDom)
            var pieOption;
            pieOption= {tooltip: {trigger: 'item'},legend: {top: '5%',left: 'center'},series: [{name: 'Access From',type: 'pie',radius: ['40%', '70%'],avoidLabelOverlap: false,padAngle: 5,itemStyle: {borderRadius: 10},label: {show: false,position: 'center'},emphasis: {label: {show: true,fontSize: 40,fontWeight: 'bold'}},labelLine: {show: false},data: [{ value: 1048, name: 'Search Engine' },{ value: 735, name: 'Direct' },{ value: 580, name: 'Email' },{ value: 484, name: 'Union Ads' },{ value: 300, name: 'Video Ads' }]}]};

            const renderPie = ()=>{
                pieOption && pieChart.setOption(pieOption)
            }

            watch(pieDom,()=>{

            })
            renderPie()

            pieData()
        })

        const pieData  = ()=>{
            const m = new Map()
            for(let i=0;i<behaviors.value.length;i++){
                behaviors.value[i]['behavior']
                const [s_h,s_m] = behaviors.value[i]['start'].split(':').map(Number)
                const [e_h,e_m] = behaviors.value[i]['end'].split(':').map(Number)
                const duration = e_h * 60 + e_m - s_h * 60 - s_m

                m.set(
                    behaviors.value[i]['behavior'],                             //Key
                    m.get(behaviors.value[i]['behavior']) + duration||0 + duration)        //Value

                alert(m.get(behaviors.value[i]['behavior']))
            }
            return m;
        }

        return {behaviors}
    }
}
</script>

<style>
#pie{
    height: 35vh;
}
#radar{
    height: 35vh;
}
</style>