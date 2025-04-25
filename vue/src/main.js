import { createApp } from "vue";
import ECharts from 'vue-echarts' // 引入Echarts
import App from './App.vue';
import { createPinia } from "pinia";
import 'echarts';

createApp(App)
    .component('ECharts',ECharts) // 全局引入Echarts
    .use(createPinia())
    .mount('#app');
