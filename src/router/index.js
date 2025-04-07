import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta: { public: true } // Доступ без аутентификации
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { requiresAuth: true } // Требуется аутентификация
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { requiresAuth: true } // Требуется аутентификация
  },
  {
    path: '/hello',
    name: 'hello',
    component: () => import('../views/HelloView.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Навигационный guard для проверки аутентификации
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('jwtToken')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Если маршрут требует аутентификации, а пользователь не авторизован
    next('/')
  } else if (to.meta.public && isAuthenticated) {
    // Если пользователь авторизован, но пытается попасть на публичную страницу (например, login)
    next('/home')
  } else {
    // Во всех остальных случаях
    next()
  }
})

export default router