import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const routes = [
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
    path: '/hello',
    name: 'hello',
    component: () => import('../views/HelloView.vue'),
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
  const isAuthenticated = localStorage.getItem('jwtToken')

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Неавторизованный пользователь → логин
    next('/login')
  } else if (to.meta.public && isAuthenticated) {
    // Авторизованный пытается зайти на публичную (login/register) → домой
    next('/home')
  } else {
    next()
  }
})

export default router
