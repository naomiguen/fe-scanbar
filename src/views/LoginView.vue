<template>
  <!-- Container Utama - Full height dengan padding untuk navbar -->
  <div class="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 pt-18 pb-8">
    <!-- Card Login -->
    <div
      class="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-8 md:p-10 text-center animate-fade-in"
    >
      <!-- Logo Icon -->
      <div
        class="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/30"
      >
        SB
      </div>

      <!-- Header Title -->
      <h1 class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">Login ke ScanBar</h1>

      <!-- Subtitle -->
      <p class="text-base text-slate-600 mb-8">Masuk untuk melacak nutrisi Anda</p>

      <!-- Form Login -->
      <div class="space-y-5">
        <!-- Input Email -->
        <div class="text-left">
          <label for="email" class="block mb-2 font-semibold text-slate-700"> Email </label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="nama@email.com"
            required
            class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
          />
        </div>

        <!-- Input Password -->
        <div class="text-left">
          <label for="password" class="block mb-2 font-semibold text-slate-700"> Password </label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="password"
              placeholder="Masukkan password"
              required
              class="w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors p-1"
              aria-label="Toggle password visibility"
            >
              <!-- Icon Mata Terbuka -->
              <svg
                v-if="!showPassword"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <!-- Icon Mata Tertutup -->
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                ></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl text-sm text-left"
        >
          {{ errorMessage }}
        </div>

        <!-- Submit Button -->
        <button
          @click="handleLogin"
          :disabled="isLoading"
          :class="[
            'w-full px-6 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2',
            isLoading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 shadow-lg shadow-blue-500/30',
          ]"
        >
          <!-- Loading State -->
          <span v-if="isLoading" class="animate-spin">⏳</span>
          {{ isLoading ? 'Memproses...' : 'Login' }}
        </button>
      </div>

      <!-- Extra Links -->
      <div class="mt-8 pt-6 border-t border-slate-200 space-y-3">
        <p class="text-slate-600">
          <RouterLink
            to="/forgot-password"
            class="text-blue-600 font-semibold hover:underline transition-all"
          >
            Lupa Password?
          </RouterLink>
        </p>
        <p class="text-slate-600">
          <RouterLink
            to="/register"
            class="text-blue-600 font-semibold hover:underline transition-all"
          >
            Belum punya akun? Daftar di sini
          </RouterLink>
        </p>
      </div>
    </div>

    <!-- Footer Text (Optional) -->
    <p class="text-sm text-slate-500 mt-6 text-center">
      © 2025 ScanBar. Pantau nutrisi Anda dengan mudah.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

// State Management
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(false)
const errorMessage = ref(null)

/**
 * Fungsi untuk menangani proses login
 * - Validasi input tidak boleh kosong
 * - Panggil authStore.login dengan credentials
 * - Jika berhasil: tampilkan toast sukses dan redirect ke home
 * - Jika gagal: tampilkan pesan error
 */
const handleLogin = async () => {
  // Validasi: pastikan email dan password tidak kosong
  if (!email.value || !password.value) {
    errorMessage.value = 'Email dan password harus diisi.'
    toast.error('Email dan password harus diisi')
    return
  }

  // Set loading state
  isLoading.value = true
  errorMessage.value = null

  try {
    // Panggil fungsi login dari auth store
    const success = await authStore.login({
      email: email.value,
      password: password.value,
    })

    if (success) {
      // Login berhasil: tampilkan notifikasi toast
      toast.success('Login Berhasil!', {
        description: 'Selamat datang kembali!',
        duration: 1500,
      })

      // Redirect ke home setelah login berhasil
      // router.push('/')
    } else {
      // Login gagal: tampilkan pesan error
      errorMessage.value = 'Email atau password salah. Silakan coba lagi.'
      toast.error('Login Gagal', {
        description: 'Email atau password salah',
      })
    }
  } catch (error) {
    // Handle error yang tidak terduga
    console.error('Login error:', error)
    errorMessage.value = 'Terjadi kesalahan. Silakan coba lagi.'
    toast.error('Terjadi kesalahan. Silakan coba lagi.')
  } finally {
    // Reset loading state
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Animasi fade in dari bawah */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeInUp 0.5s ease-out;
}

/* Animasi spinning untuk loading icon */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Focus enhancement untuk accessibility */
input:focus {
  outline: none;
}

/* Hover effect untuk links  */
a {
  transition: all 0.3s ease;
}
</style>
