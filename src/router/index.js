import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import jwtDecode from 'jwt-decode';

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { public: true } 
  },
  {
    path: '/',
    name: 'app',
    component: () => import('@/App.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignUpView.vue'),
    meta: { public: true } 
  },
  {
    path: "/verify",
    name: "verify",
    component: () => import("../views/VerifyEmailView.vue"),
    meta: { public: true },
  },
  {
    path: "/favorites",
    name: "favorites",
    component: () => import("../views/FavoritesView.vue"),
    meta: { requiresAuth: false },
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/HomeView.vue"),
    meta: { requiresAuth: false },
  }
  ,
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
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp > currentTime) {
        isAuthenticated = true;
      } else {
        localStorage.removeItem('access_token');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('access_token');
    }
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next(); 
  }
});

export default router
