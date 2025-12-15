<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4 pt-18 pb-8">
    <div
      class="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-8 md:p-10 text-center animate-fade-in"
    >
      <!-- Logo Icon -->
      <div
        class="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-6 shadow-lg shadow-blue-500/30"
      >
        SB
      </div>

      <!-- Email Verification Notice (jika email terkirim) -->
      <div v-if="showVerificationNotice" class="space-y-4">
        <div
          class="bg-blue-50 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded-xl text-sm text-left"
        >
          <div class="flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 flex-shrink-0 mt-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
              ></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <div>
              <p class="font-semibold mb-1">Cek Email Anda!</p>
              <p class="text-sm">
                Kami telah mengirim link verifikasi ke <strong>{{ registeredEmail }}</strong
                >. Klik link tersebut untuk mengaktifkan akun Anda.
              </p>
              <p class="text-xs mt-2 text-blue-600">
                Periksa folder Spam/Junk jika tidak menemukan email.
              </p>
            </div>
          </div>
        </div>

        <RouterLink
          to="/login"
          class="inline-block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300"
        >
          Kembali ke Login
        </RouterLink>
      </div>

      <!-- Form Register (jika belum submit) -->
      <div v-else>
        <!-- Header Title -->
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">Buat Akun Baru</h1>
        <p class="text-base text-slate-600 mb-8">Daftar untuk mulai melacak nutrisi Anda</p>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Input Nama -->
          <div class="text-left">
            <label for="name" class="block mb-2 font-semibold text-slate-700">Nama</label>
            <input
              type="text"
              id="name"
              v-model="name"
              placeholder="Masukkan nama lengkap"
              required
              class="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-base focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 transition-all duration-300"
            />
          </div>

          <!-- Input Email -->
          <div class="text-left">
            <label for="email" class="block mb-2 font-semibold text-slate-700">Email</label>
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
            <label for="password" class="block mb-2 font-semibold text-slate-700">Password</label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                placeholder="Buat password yang kuat"
                required
                minlength="6"
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
            <p class="text-xs text-slate-500 mt-2">
              Minimal 6 karakter untuk keamanan yang lebih baik
            </p>
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
            type="submit"
            :disabled="isLoading"
            :class="[
              'w-full px-6 py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2',
              isLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/40 shadow-lg shadow-blue-500/30',
            ]"
          >
            <span v-if="isLoading" class="animate-spin">⏳</span>
            {{ isLoading ? 'Memproses...' : 'Register' }}
          </button>
        </form>

        <!-- Extra Links -->
        <div class="mt-6 pt-6 border-t border-slate-200">
          <p class="text-slate-600">
            <RouterLink
              to="/login"
              class="text-blue-600 font-semibold hover:underline transition-all"
            >
              Sudah punya akun? Login di sini
            </RouterLink>
          </p>
        </div>
      </div>
    </div>

    <!-- Footer Text -->
    <p class="text-sm text-slate-500 mt-6 text-center">
      © 2025 ScanBar. Pantau nutrisi Anda dengan mudah.
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue-sonner'

// State Management
const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const authStore = useAuthStore()
const isLoading = ref(false)
const errorMessage = ref(null)
const showVerificationNotice = ref(false)
const registeredEmail = ref('')

/**
 * Fungsi untuk menangani proses registrasi
 */
const handleRegister = async () => {
  // Reset pesan error sebelumnya
  errorMessage.value = null

  // Validasi: pastikan semua field terisi
  if (!name.value || !email.value || !password.value) {
    errorMessage.value = 'Semua field harus diisi.'
    toast.error('Semua field harus diisi')
    return
  }

  // Validasi: password minimal 6 karakter
  if (password.value.length < 6) {
    errorMessage.value = 'Password minimal 6 karakter.'
    toast.error('Password minimal 6 karakter')
    return
  }

  // Validasi: format email valid
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Format email tidak valid.'
    toast.error('Format email tidak valid')
    return
  }

  // Set loading state
  isLoading.value = true

  try {
    // Panggil fungsi register dari auth store
    const result = await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    })

    if (result.success) {
      // Simpan email yang didaftarkan
      registeredEmail.value = email.value

      // Tampilkan notifikasi verifikasi email
      showVerificationNotice.value = true
    }
  } catch (error) {
    // Handle error yang tidak terduga
    console.error('Register error:', error)
    errorMessage.value = error.message || 'Terjadi kesalahan saat registrasi. Silakan coba lagi.'
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

/* Hover effect untuk links */
a {
  transition: all 0.3s ease;
}
</style>
