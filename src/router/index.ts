import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/welcome'
  },
  {
    path: '/welcome',
    name: 'login',
    component: () => import('@/views/welcome/Login.vue')
  },
  {
    path: '/groups/join',
    component: () => import('@/views/groups/JoinGroup.vue')
  },
  {
    path: '/group/',
    component: () => import('@/views/group/Layout.vue'),
    children: [
      {
        path: '',
        redirect: '/group/weekly'
      },
      {
        path: 'weekly',
        component: () => import('@/views/group/Weekly.vue')
      },
      {
        path: 'overall',
        component: () => import('@/views/group/Overall.vue')
      },
      {
        path: 'info',
        component: () => import('@/views/group/Info.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
