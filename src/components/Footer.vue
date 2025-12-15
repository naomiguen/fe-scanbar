<script setup>
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())
</script>

<template>
  <footer class="bg-blue-600 text-white py-8 sm:py-12 lg:py-16 relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 opacity-5">
      <div
        class="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"
      ></div>
    </div>

    <div class="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
      <div
        class="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-8 sm:gap-12 md:gap-20 lg:gap-32 mb-8 sm:mb-12 pb-8 sm:pb-12 border-b border-white/20"
      >
        <!-- Brand -->
        <div class="flex flex-col gap-4 sm:gap-6">
          <div class="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <div
              class="w-10 h-10 sm:w-14 sm:h-14 bg-white text-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-lg sm:text-2xl font-bold shadow-lg shadow-blue-900/20"
            >
              SB
            </div>
            <span class="text-2xl sm:text-3xl font-bold text-white tracking-tight"> ScanBar </span>
          </div>

          <p class="text-white/90 leading-relaxed max-w-sm text-sm sm:text-base">
            Pilih metode scan favorit Anda untuk mendapatkan informasi nutrisi dari kemasan makanan
            & minuman lengkap
          </p>

          <!-- Social Media -->
          <div class="flex gap-2 sm:gap-3 mt-1 sm:mt-2">
            <a
              href="#"
              class="w-10 h-10 sm:w-11 sm:h-11 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            >
              <span class="text-lg sm:text-xl">📘</span>
            </a>
            <a
              href="#"
              class="w-10 h-10 sm:w-11 sm:h-11 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            >
              <span class="text-lg sm:text-xl">📷</span>
            </a>
            <a
              href="#"
              class="w-10 h-10 sm:w-11 sm:h-11 bg-white/10 hover:bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            >
              <span class="text-lg sm:text-xl">🐦</span>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="flex flex-col gap-3 sm:gap-5">
          <h3 class="text-lg sm:text-xl font-bold text-white mb-0 sm:mb-1">Navigasi Cepat</h3>

          <nav class="flex flex-col gap-2 sm:gap-3">
            <a
              href="#"
              class="text-sm sm:text-base text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
            >
              Tentang Kami
            </a>
            <a
              href="#"
              class="text-sm sm:text-base text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
            >
              Fitur
            </a>
            <a
              href="#"
              class="text-sm sm:text-base text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
            >
              Cara Kerja
            </a>
            <a
              href="#"
              class="text-sm sm:text-base text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
            >
              FAQ
            </a>
          </nav>
        </div>

        <!-- Support -->
        <div class="flex flex-col gap-3 sm:gap-5">
          <h3 class="text-lg sm:text-xl font-bold text-white mb-0 sm:mb-1">Support</h3>

          <nav class="flex flex-col gap-2 sm:gap-3">
            <a
              href="#"
              class="text-sm sm:text-base text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
            >
              FAQ
            </a>
            <a
              href="https://wa.me/6282369615133"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm sm:text-base text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
            >
              WhatsApp
            </a>
            <a
              href="https://instagram.com/its.naomiguen"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm sm:text-base text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
            >
              Instagram
            </a>
          </nav>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div
        class="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 pt-6 sm:pt-8"
      >
        <div class="text-white/70 text-xs sm:text-sm">
          © {{ currentYear }} ScanBar. All rights reserved.
        </div>

        <div class="flex gap-4 sm:gap-6 text-xs sm:text-sm">
          <a href="#" class="text-white/70 hover:text-white transition-colors duration-200">
            Kebijakan Privasi
          </a>
          <a href="#" class="text-white/70 hover:text-white transition-colors duration-200">
            Syarat & Ketentuan
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
