import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'
import { audioManager } from '@/game/audio/audioManager'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')

const unlockAudio = () => audioManager.unlock()
window.addEventListener('pointerdown', unlockAudio, { passive: true })
window.addEventListener('keydown', unlockAudio, { passive: true })
