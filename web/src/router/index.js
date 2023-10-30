// Composables
import { createRouter, createWebHistory } from 'vue-router'

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
    children: [
      
      
      {
        path: '/estadisticas',
        name: 'Estadisticas',
        component: () => import('@/components/Estadisticas.vue'),
      }
    ],
  },
  {
    path: '/comandas',
    name: 'Comandas',
    component: () => import('@/components/Comandas.vue'),
  },
  {
    path: '/productes',
    name: 'Productes',
    component: () => import('@/components/Productes.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
