<template>
    <h5>Charts</h5>
    <e-Charts class="pie" id="pie" :option="pieOption"></e-Charts>
    <e-Charts class="radar" id="radar" :option="radarOption"></e-Charts>
</template>

<script setup>
  import { useLS } from '@/composables/useLS';
  import {ref, watch} from 'vue'

  const BEHAVIORS = 'behaviors'

  const behaviors = useLS(BEHAVIORS,[]) // behavior 是一个 ref 数组对象 ,但是behavior数组中元素数量增加减少后，没有alert

  const pieData  = ()=>{
    const m = new Map()

    for(let i=0;i<behaviors.value.length;i++){
      behaviors.value[i]['behavior']
      const [s_h,s_m] = behaviors.value[i]['start'].split(':').map(Number)
      const [e_h,e_m] = behaviors.value[i]['end'].split(':').map(Number)
      const duration = e_h * 60 + e_m - s_h * 60 - s_m

      m.set(
          behaviors.value[i]['behavior'],                                         //Key
          m.get(behaviors.value[i]['behavior']) + duration||0 + duration)         //Value
    }

    const data = []

    m.forEach((v,k)=>{
      data.push({
          'value': v,
          'name' : k,
      })
    })

    return data;
  }

  const pieOption = ref ({
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
        padAngle: 2,
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
        data: pieData()
      }
    ]
  })

  watch(behaviors,(n)=>{
    alert(n)
  })

</script>

<style>
.pie{
    height: 35vh;
}

.radar{
    height: 35vh;
}
</style>