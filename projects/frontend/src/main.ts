import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import { createPinia } from 'pinia'
import router from '@/router'
import App from './App.vue'
import 'ant-design-vue/dist/reset.css'
import './style.css'

const pinia = createPinia()
createApp(App).use(pinia).use(router).use(Antd).mount('#app')
