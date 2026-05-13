import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { guestOnly: true }
    },
    {
      path: '/booking',
      name: 'booking',
      component: () => import('@/views/BookingView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/my-appointments',
      name: 'my-appointments',
      component: () => import('@/views/MyAppointmentsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminDashboard.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/appointments',
      name: 'admin-appointments',
      component: () => import('@/views/admin/AdminAppointments.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/services',
      name: 'admin-services',
      component: () => import('@/views/admin/AdminServices.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/availability',
      name: 'admin-availability',
      component: () => import('@/views/admin/AdminAvailability.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/membership',
      name: 'membership',
      component: () => import('@/views/MembershipView.vue')
    },
    {
      path: '/reviews',
      name: 'reviews',
      component: () => import('@/views/ReviewsView.vue')
    },
    {
      path: '/admin/reviews',
      name: 'admin-reviews',
      component: () => import('@/views/admin/AdminReviews.vue'),
      meta: { requiresAdmin: true }
    }
  ]
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  // Wait for Firebase auth to resolve on first load
  if (auth.loading) {
    await auth.init()
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'login' }
  }
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { name: auth.isAdmin ? 'admin' : 'home' }
  }
})

export default router
