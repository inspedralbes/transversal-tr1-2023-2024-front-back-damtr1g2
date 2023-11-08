// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { getLogin } from '@/communicationsManager.js';
import store from '../store';

const requireAuth = (to, from, next) => {
  console.log(store.getters.isAuthenticated)
  if (store.getters.isAuthenticated) {
    next();
  } else {
    store.dispatch('hasCookieId')
        .then((isAuthenticated) => {
          if (isAuthenticated) {
            next();
          } else {
            next({ name: 'Login' });
          }
        });
    
  }
};
const checkAuth = (to, from, next) => {
  console.log(store.getters.isAuthenticated)
  if (store.getters.isAuthenticated) {
    next({ name: 'Home' });
  } else {
    store.dispatch('hasCookieId')
        .then((isAuthenticated) => {
          if (isAuthenticated) {
            next({ name: 'Home' });
          } else {
            next();
          }
        });
    
  }
};

const routes = [
  {
    path: '/',
    name: 'Login',
    
    component: () => import('@/components/Login.vue'),
    beforeEnter: checkAuth,
    
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/components/Home.vue'),
    beforeEnter: requireAuth,
  },
  {
    path: '/estadisticas',
    name: 'Estadisticas',
    component: () => import('@/components/Estadisticas.vue'),
    beforeEnter: requireAuth,
  },
  {
    path: '/comandas',
    name: 'Comandas',
    component: () => import('@/components/Comandas.vue'),
    beforeEnter: requireAuth,
  },
  {
    path: '/productes',
    name: 'Productes',
    component: () => import('@/components/Productes.vue'),
    beforeEnter: requireAuth,
  },
  {
    path: '/:catchAll(.*)',
    redirect: to => {
      return { path: '/'}
    },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
