import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import CalculatorView from '../views/CalculatorView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import ResetPasswordView from '../views/ResetPasswordView.vue'
import PhotoScanView from '../views/PhotoScan.vue'
import AdminDashboardView from '../views/AdminDashboard.vue'
import AdminAddProductView from '@/views/AdminAddProductView.vue'
import AdminTrashView from '@/views/AdminTrashView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { guest: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { guest: true },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView,
    meta: { guest: true },
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordView,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/calculator',
    name: 'Calculator',
    component: CalculatorView,
    meta: { requiresAuth: true },
  },
  {
    path: '/photo-scan',
    name: 'PhotoScan',
    component: PhotoScanView,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/add-product',
    name: 'AdminAddProduct',
    component: AdminAddProductView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/trash',
    name: 'AdminTrash',
    component: AdminTrashView,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // NON-BLOCKING: Load profile di background tanpa await
  if (authStore.user && !authStore.isProfileLoaded) {
    console.log('Loading profile in background...')
    authStore.fetchUserProfile().catch((err) => {
      console.error('Background profile load failed:', err)
    })
    // TIDAK PAKAI AWAIT - biarkan navigation lanjut!
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin)
  const isGuestRoute = to.matched.some((record) => record.meta.guest)
  const isAuthenticated = authStore.isAuthenticated

  console.log('Router Guard:', {
    to: to.name,
    from: from.name,
    isAuthenticated,
    isAdmin: authStore.isAdmin,
    role: authStore.role,
  })

  // Check admin routes
  if (requiresAdmin) {
    console.log(' Checking admin access...')

    if (!isAuthenticated) {
      console.log('Not authenticated, redirect to login')
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }

    // Check role dari store (sudah ada dari Supabase session)
    if (!authStore.isAdmin) {
      console.warn('Access Denied: Not an admin')
      next({ name: 'Dashboard' })
      return
    }

    console.log('Admin access granted')
    next()
    return
  }

  // Check auth requirement
  if (requiresAuth && !isAuthenticated) {
    console.log('Auth required, redirect to login')
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Check guest routes (login/register when already logged in)
  if (isGuestRoute && isAuthenticated) {
    console.log('Already authenticated, redirect to dashboard')

    // Langsung redirect berdasarkan role yang ada
    if (authStore.role === 'admin') {
      next({ name: 'AdminDashboard' })
    } else {
      next({ name: 'Dashboard' })
    }
    return
  }

  next()
})

export default router
