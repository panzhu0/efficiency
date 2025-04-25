import { createApp } from 'vue';
import Echarts from 'vue-echarts';
import App from './App.vue';
import 'echarts';

createApp(App)
    .component('ECharts',Echarts)
    .mount('#app')
