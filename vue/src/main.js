import { createApp } from "vue";
import ECharts from 'vue-echarts' // 引入Echarts
import App from './App.vue';
import 'echarts';

createApp(App)
    .component('ECharts',ECharts) // 全局引入Echarts
    .mount('#app');
