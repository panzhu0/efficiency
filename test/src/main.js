import { createApp } from 'vue';
import Echarts from 'vue-echarts';
import { createPinia } from 'pinia'
import App from './App.vue';
import 'echarts';

createApp(App)
    .component('ECharts',Echarts)
    .use(createPinia())
    .mount('#app')
