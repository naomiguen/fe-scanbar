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
    console.log('⏳ Waiting for profile to load...')
    try {
      await authStore.fetchUserProfile()
      console.log(' Profile loaded! Role:', authStore.role)
    } catch (err) {
      console.error('Failed to load profile:', err)
      authStore.logout()
      return next({ name: 'Login' })
    }
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

  if (isGuestRoute && isAuthenticated) {
    console.log('Already authenticated on guest route')

    // Wait for profile if not loaded
    if (!authStore.isProfileLoaded) {
      await authStore.fetchUserProfile()
    }

    // Redirect based on role
    if (authStore.isAdmin) {
      console.log('Redirecting admin from guest route to /admin')
      return next({ name: 'AdminDashboard' })
    } else {
      console.log('Redirecting user from guest route to /dashboard')
      return next({ name: 'Dashboard' })
    }
  }

  // Check admin routes
  if (requiresAdmin) {
    console.log('Checking admin access...')

    if (!isAuthenticated) {
      console.log('Not authenticated, redirect to login')
      return next({ name: 'Login', query: { redirect: to.fullPath } })
    }

    // Extra safety: wait for profile
    if (!authStore.isProfileLoaded) {
      console.log('Waiting for profile before admin check...')
      await authStore.fetchUserProfile()
    }

    if (!authStore.isAdmin) {
      console.warn('Access Denied: Not an admin')
      console.warn('   Expected: "admin", Got:', authStore.role)
      return next({ name: 'Dashboard' })
    }

    console.log('Admin access granted')
    return next()
  }

  // Check auth requirement
  if (requiresAuth && !isAuthenticated) {
    console.log('Auth required, redirect to login')
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  if (to.name === 'Home' && isAuthenticated) {
    console.log('Authenticated user on Home page')

    // Wait for profile
    if (!authStore.isProfileLoaded) {
      await authStore.fetchUserProfile()
    }

    if (authStore.isAdmin) {
      console.log('Admin on Home, redirecting to /admin')
      return next({ name: 'AdminDashboard' })
    }
  }
  next()
})

export default router
