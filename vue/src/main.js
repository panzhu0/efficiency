import { createApp } from 'vue'
import App from './App.vue'
import {createPinia} from 'pinia'
import ECharts from 'vue-echarts';
import 'echarts';
import router from "@/router/index"

createApp(App)
    .component('ECharts',ECharts)       // 第一个参数:Vue组件中使用时的名字,第二个参数导入vue-echarts 时的名字(默认导出)
    .use(createPinia())
    .use(router)
    .mount('#app')
