import { createApp } from 'vue'
import App from './App'
import './registerServiceWorker'
import router from './router'

import './assets/main.scss'
import './assets/tailwind.css'

createApp(App).use(router).mount('#app')
