import { createRouter, createWebHistory } from 'vue-router'

import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      children: [
        {
          path: '',
          component: () => import('@/pages/Dashboard/Home.vue'),
          name: 'dashboard',
        },
        {
          path: 'category',
          component: () => import('@/pages/Dashboard/Category.vue'),
          name: 'dashboard.category',
        },
        {
          path: 'chart',
          component: () => import('@/pages/Dashboard/Chart.vue'),
          name: 'dashboard.chart',
        },
        {
          path: 'recipient',
          component: () => import('@/pages/Dashboard/Recipient.vue'),
          name: 'dashboard.recipient',
        },
        {
          path: 'saving-account',
          component: () => import('@/pages/Dashboard/SavingAccount.vue'),
          name: 'dashboard.saving-account',
        },
      ],
    },
    {
      path: '/account',
      component: () => import('@/pages/Account/Account.vue'),
      name: 'account',
    },
    {
      path: '/auth',
      children: [
        {
          path: '',
          component: () => import('@/pages/Auth/Authentication.vue'),
          name: 'auth',
        },
        {
          path: 'logout',
          component: () => import('@/pages/Auth/Logout.vue'),
          name: 'logout',
        },
      ],
    },

    {
      path: '/',
      redirect: { name: 'dashboard' },
    },
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/pages/Errors/NotFound.vue'),
      name: 'notFound',
    },
  ],
})

router.beforeEach(async (to, from) => {
  const userStore = useUserStore()
  const sessionState: boolean | undefined = await userStore.checkSession()

  if (!sessionState && to.name !== 'auth') {
    return { name: 'auth' }
  }
})

export default router
