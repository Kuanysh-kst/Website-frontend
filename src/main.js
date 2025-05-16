import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css'; // Подключение глобальных стилей
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

const app = createApp(App);
app.use(router);
app.use(autoAnimatePlugin) // Подключение плагина auto-animate
app.mount('#app');
