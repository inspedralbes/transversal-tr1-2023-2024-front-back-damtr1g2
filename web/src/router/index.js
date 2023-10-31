// Composables
import { createRouter, createWebHistory } from 'vue-router'
import store from '../store';

const requireAuth = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
  } else {
    next({ name: 'Login' });
  }
};

const routes = [
  {
    path: '/',
    name: 'Login',
    
    component: () => import('@/components/Login.vue'),
    
    
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/components/Home.vue'),
    beforeEnter: requireAuth,
    children: [
      
      
      {
        path: '/estadisticas',
        name: 'Estadisticas',
        component: () => import('@/components/Estadisticas.vue'),
        beforeEnter: requireAuth,
      }
    ],
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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
