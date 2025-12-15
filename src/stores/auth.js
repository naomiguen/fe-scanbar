import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/supabaseClient'
import { toast } from 'vue-sonner'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // STATE
  const user = ref(null)
  const profile = ref(null)
  const session = ref(null)
  const role = ref('user')
  const isProfileLoaded = ref(false)

  // COMPUTED
  const isAuthenticated = computed(() => !!user.value)

  const isAdmin = computed(() => {
    const currentRole = String(role.value || '')
      .trim()
      .toLowerCase()
    console.log('isAdmin computed:', {
      role: role.value,
      trimmed: currentRole,
      result: currentRole === 'admin',
    })
    return currentRole === 'admin'
  })

  const userFullName = computed(() => {
    return profile.value?.name || user.value?.user_metadata?.name || user.value?.email || 'Pengguna'
  })

  //  ACTIONS

  /**
   * Cek sesi login saat halaman di-refresh
   */
  async function checkSession() {
    try {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
      user.value = data.session?.user || null

      if (user.value) {
        await fetchUserProfile()
      } else {
        role.value = 'user'
        isProfileLoaded.value = true
      }
    } catch (error) {
      console.error('Check session error:', error)
      user.value = null
      session.value = null
      role.value = 'user'
      isProfileLoaded.value = true
    }
  }

  /**
   * Listen untuk perubahan auth state
   */
  supabase.auth.onAuthStateChange(async (_event, newSession) => {
    session.value = newSession
    user.value = newSession?.user || null

    if (newSession?.user) {
      await fetchUserProfile()
    } else {
      profile.value = null
      role.value = 'user'
      isProfileLoaded.value = false
    }
  })

  /**
   * REGISTER - Mendaftarkan user baru
   */
  async function register({ name, email, password }) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: import.meta.env.VITE_APP_URL
            ? `${import.meta.env.VITE_APP_URL}/login`
            : 'https://scan-bar-y26r.vercel.app/login',
        },
      })

      if (error) throw error

      // Cek apakah user perlu verifikasi email
      const needsEmailVerification = data.user && !data.user.confirmed_at

      if (needsEmailVerification) {
        toast.success('Berhasil Mendaftar!', {
          description:
            'Silakan cek email Anda untuk verifikasi. Periksa folder Spam/Junk jika tidak menemukan email.',
          duration: 5000,
        })
      } else {
        // Jika email confirmation dimatikan, buat profile langsung
        if (data.user) {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            email: email,
            name: name,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

          if (profileError && profileError.code !== '23505') {
            // Ignore duplicate key error
            console.warn('Failed to create profile:', profileError.message)
          }
        }

        toast.success('Berhasil Mendaftar!', {
          description: 'Anda sudah bisa login sekarang.',
          duration: 4000,
        })
      }

      return { success: true, needsVerification: needsEmailVerification }
    } catch (error) {
      console.error('Register error:', error)
      toast.error('Pendaftaran Gagal:', {
        description: error.message || 'Terjadi kesalahan saat registrasi',
      })
      throw error
    }
  }

  /**
   * LOGIN - Masuk ke aplikasi
   */
  async function login({ email, password }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Cek apakah email sudah diverifikasi (jika email confirmation enabled)
      if (data.user && !data.user.email_confirmed_at) {
        // Supabase akan menolak login otomatis jika email belum verified (jika enabled)
        throw new Error('Email belum diverifikasi. Silakan cek inbox Anda.')
      }

      session.value = data.session
      user.value = data.user
      await fetchUserProfile()

      // Debug log
      console.log('=== AFTER LOGIN DEBUG ===')
      console.log('Login berhasil')
      console.log('role.value:', role.value)
      console.log('isAdmin.value:', isAdmin.value)
      console.log('typeof role.value:', typeof role.value)
      console.log('role === "admin":', role.value === 'admin')
      console.log('=========================')

      // Redirect berdasarkan role
      const targetRoute = isAdmin.value ? '/admin' : '/'
      console.log('Attempting redirect to:', targetRoute)

      // Wait untuk pastikan state sudah terupdate
      await new Promise((resolve) => setTimeout(resolve, 100))
      router.push(targetRoute)

      toast.success('Login Berhasil!', {
        description: `Selamat datang, ${userFullName.value}!`,
        duration: 2000,
      })

      return true
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Gagal Masuk:', {
        description: error.message || 'Email atau password salah.',
      })
      throw error
    }
  }

  /**
   * LOGOUT - Keluar dari aplikasi
   */
  async function logout() {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        toast.error('Gagal Keluar:', {
          description: error.message,
        })
        return false
      }

      // Clear state
      user.value = null
      session.value = null
      profile.value = null
      role.value = 'user'
      isProfileLoaded.value = false

      toast.success('Berhasil Logout', {
        description: 'Anda telah keluar dari akun',
        duration: 2000,
      })

      router.push('/login')
      return true
    } catch (error) {
      console.error('Logout error:', error)
      return false
    }
  }

  /**
   * FETCH USER PROFILE - Ambil data profile dari Supabase
   */
  async function fetchUserProfile() {
    if (!user.value) {
      isProfileLoaded.value = true
      return null
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .maybeSingle()

      // Ignore error PGRST116 (data tidak ditemukan)
      if (error && error.code !== 'PGRST116') {
        console.warn('Gagal mengambil profil:', error.message)
        profile.value = null
        role.value = 'user'
        isProfileLoaded.value = true
        return null
      }

      // Jika data tidak ada, set profile null
      if (!data) {
        console.warn('Profile belum dibuat untuk user:', user.value.id)
        profile.value = null
        role.value = 'user'
        isProfileLoaded.value = true
        return null
      }

      profile.value = data
      const rawRole = data.role || 'user'
      role.value = String(rawRole)
        .trim()
        .replace(/^['"]|['"]$/g, '') // Hapus tanda petik di awal/akhir
        .toLowerCase()
      isProfileLoaded.value = true

      // Debug log
      console.log('=== FETCH PROFILE DEBUG ===')
      console.log('Raw role dari DB:', rawRole)
      console.log('Role setelah clean:', role.value)
      console.log('Role length:', role.value.length)
      console.log('isAdmin computed:', isAdmin.value)
      console.log('==========================')

      return data
    } catch (error) {
      console.error('Error fetching profile:', error)
      profile.value = null
      role.value = 'user'
      isProfileLoaded.value = true
      return null
    }
  }

  /**
   * UPDATE PROFILE - Update data profil user
   */
  async function updateProfile(dataToUpdate) {
    if (!user.value?.id) {
      throw new Error('User tidak login')
    }

    try {
      // 1. Update user metadata di Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: dataToUpdate,
      })

      if (authError) throw authError

      // 2. Update ke table profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
          name: dataToUpdate.name,
          age: dataToUpdate.age,
          weight: dataToUpdate.weight,
          height: dataToUpdate.height,
          daily_calorie_goal: dataToUpdate.dailyCalorieGoal,
          daily_protein_goal: dataToUpdate.dailyProteinGoal,
          daily_carbs_goal: dataToUpdate.dailyCarbsGoal,
          daily_fat_goal: dataToUpdate.dailyFatGoal,
          daily_sugar_goal: dataToUpdate.dailySugarGoal,
          daily_sodium_goal: dataToUpdate.dailySodiumGoal,
          daily_salt_goal: dataToUpdate.dailySaltGoal,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.value.id)
        .select()
        .single()

      if (profileError) throw profileError

      // 3. Update local state
      user.value = authData.user
      profile.value = profileData

      toast.success('Berhasil!', {
        description: 'Profil Anda telah diperbarui.',
        duration: 2000,
      })

      return profileData
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Gagal', {
        description: 'Gagal memperbarui profil: ' + error.message,
      })
      throw error
    }
  }

  /**
   * UPDATE GOALS - Update target nutrisi
   */
  async function updateGoals(goals) {
    if (!user.value?.id) {
      throw new Error('User tidak login')
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          daily_calorie_goal: goals.dailyCalorieGoal,
          daily_protein_goal: goals.dailyProteinGoal,
          daily_carbs_goal: goals.dailyCarbsGoal,
          daily_fat_goal: goals.dailyFatGoal,
          daily_sugar_goal: goals.dailySugarGoal,
          daily_salt_goal: goals.dailySaltGoal,
          age: goals.age,
          weight: goals.weight,
          height: goals.height,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.value.id)
        .select()
        .single()

      if (error) throw error

      profile.value = data

      toast.success('Target Berhasil Diupdate!', {
        description: 'Target nutrisi harian Anda telah diperbarui.',
        duration: 2000,
      })

      return data
    } catch (error) {
      console.error('Update goals error:', error)
      toast.error('Gagal Update Target', {
        description: error.message,
      })
      throw error
    }
  }

  /**
   * FORGOT PASSWORD - Kirim email reset password
   */
  async function forgotPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: import.meta.env.VITE_APP_URL
          ? `${import.meta.env.VITE_APP_URL}/reset-password`
          : 'https://scan-bar-y26r.vercel.app/reset-password',
      })

      if (error) throw error

      return true
    } catch (error) {
      console.error('Forgot password error:', error)
      throw error
    }
  }

  /**
   * RESET PASSWORD - Set password baru
   */
  async function resetPassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      return true
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  /**
   * GET ACCESS TOKEN - Untuk API calls ke backend
   */
  async function getAccessToken() {
    if (!session.value) {
      // Try to refresh session
      const { data } = await supabase.auth.getSession()
      session.value = data.session
    }

    return session.value?.access_token || null
  }

  /**
   * INITIALIZE AUTH - Panggil saat app mounted
   */
  async function initializeAuth() {
    try {
      // Get current session
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      if (currentSession) {
        session.value = currentSession
        user.value = currentSession.user
        await fetchUserProfile()
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log('Auth state changed:', event)
        session.value = newSession
        user.value = newSession?.user || null

        if (newSession) {
          await fetchUserProfile()
        } else {
          profile.value = null
          role.value = 'user'
          isProfileLoaded.value = false
        }
      })
    } catch (error) {
      console.error('Initialize auth error:', error)
    }
  }

  // Return semua state dan actions
  return {
    // State
    user,
    profile,
    session,
    role,
    isProfileLoaded,

    // Computed
    isAuthenticated,
    isAdmin,
    userFullName,

    // Actions
    checkSession,
    initializeAuth,
    register,
    login,
    logout,
    fetchUserProfile,
    updateProfile,
    updateGoals,
    forgotPassword,
    resetPassword,
    getAccessToken,
  }
})
