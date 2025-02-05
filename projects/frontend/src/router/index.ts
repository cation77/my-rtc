import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../pages/home/index.vue')
  },
  {
    path: '/meeting',
    name: 'meeting',
    component: () => import('../pages/meeting/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  // 跳转路由后导航栏置顶
  scrollBehavior() {
    return { left: 0, top: 0 }
  }
})

export default router
