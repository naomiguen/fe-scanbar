<template>
  <Toaster position="top-center" richColors expand :duration="3000" />

  <Navbar v-if="showUserNavbar" />

  <main :class="{ 'pt-24': showUserNavbar }">
    <RouterView />
  </main>

  <!-- Chatbot floating -->
  <Chatbot />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Toaster } from 'vue-sonner'
import Navbar from '@/components/Navbar.vue'
import Chatbot from '@/components/Chatbot.vue'

const route = useRoute()

const showUserNavbar = computed(() => {
  const currentPath = route.path

  // Cek Admin
  const isAdminPage = currentPath.startsWith('/admin')

  // Navbar User HANYA muncul jika BUKAN admin dan BUKAN auth
  return !isAdminPage
})
</script>
