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
    path: '/group',
    component: () => import('@/views/group/Layout.vue'),
    children: [
      {
        path: '',
        redirect: 'weekly'
      },
      {
        path: 'weekly',
        name: 'weekly',
        component: () => import('@/views/group/Weekly.vue')
      },
      {
        path: 'overall',
        component: () => import('@/views/group/Overall.vue')
      },
      {
        path: 'info',
        component: () => import('@/views/group/Info.vue')
      },
    ]
  },
  {
    path: '/groups/mine',
    component: () => import('@/views/group/MyGroups.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
