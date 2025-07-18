import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // Store
app.use(router) // Router
app.use(Antd) // Ant design vue

app.mount('#app')
