import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles/global.scss'; // Подключение глобальных стилей

createApp(App).use(router).mount('#app');
