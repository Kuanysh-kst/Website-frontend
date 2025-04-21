import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import jwtDecode from 'jwt-decode';

const routes = [
  {
    path: '/',
    redirect: '/dashboard' // Перенаправление на страницу входа
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true } // Доступ без аутентификации
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { public: true } // Зарегистрироваться можно без авторизации
  },
  // Опционально: страница 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token');
  let isAuthenticated = false;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); // Текущее время в секундах

      if (decodedToken.exp > currentTime) {
        isAuthenticated = true; // Токен действителен
      } else {
        localStorage.removeItem('access_token'); // Удаляем просроченный токен
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('access_token'); // Удаляем некорректный токен
    }
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Если маршрут требует авторизации, а токен недействителен
    next('/login');
  } else {
    next(); // Разрешаем переход
  }

  console.log('Навигация к:', to.fullPath);
  console.log('Token:', token);
  console.log('isAuthenticated:', isAuthenticated);
});

export default router
