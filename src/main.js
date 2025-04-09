import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/styles/global.scss'; // Подключение глобальных стилей
import '@fortawesome/fontawesome-free/css/all.css';

createApp(App).use(router).mount('#app');
