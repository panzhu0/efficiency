<template>
    <h5>Charts</h5>
    <div class="pie" id="pie"></div>
    <div class="radar" id="radar"></div>
</template>
<script>
const BEHAVIORS = 'behaviors'
import { useLS } from '@/composables/useLS';
import { onMounted,ref } from 'vue';
import * as echarts from 'echarts';



export default{
    setup(){
        const behaviors = useLS(BEHAVIORS,[])
        var pieChart = ""
        onMounted(()=>{
            const pieDom = document.getElementById('pie')
            pieChart = echarts.init(pieDom)
            var pieOption;

pieOption= {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
};
        pieChart.setOption(pieOption)
        })


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