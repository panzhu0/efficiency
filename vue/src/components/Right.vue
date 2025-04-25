<template>
    <h5>Charts</h5>
    <e-Charts class="pie" id="pie" :option="pieOption"></e-Charts>
    <e-Charts class="radar" id="radar" :option="radarOption"></e-Charts>
    <h1>{{ countStore.count }}</h1>
</template>

<script setup>
  import { ref,watch } from 'vue'
  import { useCounterStore } from '../stores/count';   // 仅是引用不会执行
  import { useBehaviorStore } from '../stores/behavior';
  const countStore = useCounterStore()     // 使用模块
  const behaviorStore = useBehaviorStore()     // 使用模块

  const behaviors = behaviorStore.behaviors

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
        // data: pieData()
      }
    ]
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