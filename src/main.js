import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAppStore } from './stores/appStore'
import './assets/css/main.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const appStore = useAppStore()
appStore.initializeSeedData()
document.documentElement.dataset.theme = appStore.theme

app.mount('#app')
