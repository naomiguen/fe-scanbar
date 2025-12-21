<template>
  <div class="flex flex-col items-center gap-4 mt-8">
    <!-- Avatar Container -->
    <div class="relative group">
      <!-- Display Avatar or Initials -->
      <div
        v-if="avatarUrl"
        class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer"
        @click="triggerFileInput"
      >
        <img
          :src="avatarUrl"
          class="w-full h-full object-cover"
          alt="Profile Avatar"
          @error="handleImageError"
        />
      </div>

      <div
        v-else
        class="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-200 shadow-lg cursor-pointer"
        @click="triggerFileInput"
      >
        {{ userInitials }}
      </div>

      <!-- Dropdown Menu Button - Pensil dengan lingkaran putih -->
      <div class="absolute bottom-0 right-0">
        <!-- Lingkaran putih sebagai border -->
        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <button
            @click.stop="toggleMenu"
            class="w-10 h-10 bg-blue-600 flex items-center justify-center transition-all duration-150 hover:scale-110 hover:bg-blue-700 rounded-full"
            title="Menu foto profil"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2.5"
              stroke="currentColor"
              class="w-5 h-5 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </button>
        </div>

        <!-- Dropdown Menu -->
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="showMenu"
            class="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
          >
            <!-- Jika BELUM ada foto profil -->
            <template v-if="!avatarUrl">
              <button
                @click="handleMenuAction('upload')"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
              >
                <i class="fa-solid fa-plus w-4"></i>
                <span>Tambahkan Foto Profil</span>
              </button>
            </template>

            <!-- Jika SUDAH ada foto profil -->
            <template v-else>
              <button
                @click="handleMenuAction('upload')"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
              >
                <i class="fa-solid fa-upload w-4"></i>
                <span>Ganti Foto Profil</span>
              </button>

              <hr class="my-1 border-gray-200" />

              <button
                @click="handleMenuAction('delete')"
                class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <i class="fa-solid fa-trash w-4"></i>
                <span>Hapus Foto</span>
              </button>
            </template>
          </div>
        </transition>
      </div>
    </div>

    <!-- File Input (Hidden) -->
    <input
      type="file"
      ref="fileInput"
      accept="image/jpeg,image/png,image/jpg,image/webp"
      class="hidden"
      @change="handleFileUpload"
    />

    <!-- Status Messages -->
    <div class="text-center">
      <p v-if="uploading" class="text-sm text-blue-600 font-semibold animate-pulse">
        <i class="fa-solid fa-spinner fa-spin mr-2"></i>Mengupload...
      </p>
      <p v-else-if="error" class="text-sm text-red-600 font-semibold">
        <i class="fa-solid fa-exclamation-circle mr-2"></i>{{ error }}
      </p>
      <p v-else class="text-xs text-white">
        {{ avatarUrl ? 'Klik untuk mengganti foto profil' : 'Klik untuk menambahkan foto profil' }}
      </p>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] px-4"
        @click.self="showDeleteModal = false"
      >
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div v-if="showDeleteModal" class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <!-- Judul -->
            <h3 class="text-xl font-bold text-gray-900 text-center mb-2">Hapus Foto Profil</h3>

            <!-- Pesan -->
            <p class="text-gray-600 text-center mb-6">
              Apakah Anda yakin ingin menghapus foto profil?
            </p>

            <!-- Tombol -->
            <div class="flex gap-3">
              <button
                @click="showDeleteModal = false"
                class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Batal
              </button>
              <button
                @click="confirmDeleteAction"
                class="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const BUCKET = 'photo profil scanbar'
const fileInput = ref(null)
const uploading = ref(false)
const error = ref('')
const showMenu = ref(false)
const showDeleteModal = ref(false)

// Computed properties
const avatarUrl = computed(
  () => authStore.user?.user_metadata?.avatar_url || authStore.user?.avatar_url
)

const userInitials = computed(() => {
  const name = authStore.user?.user_metadata?.name || authStore.user?.email
  if (!name) return '?'

  const names = name.split(' ')
  if (names.length > 1) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

// Functions
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const closeMenu = () => {
  showMenu.value = false
}

const handleMenuAction = (action) => {
  closeMenu()

  switch (action) {
    case 'upload':
      triggerFileInput()
      break
    case 'edit':
      // Navigasi ke halaman edit profil
      // router.push('/profile/edit')
      console.log('Edit profil clicked')
      break
    case 'delete':
      showDeleteModal.value = true
      break
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleImageError = (e) => {
  console.error('Error loading image:', e)
  e.target.style.display = 'none'
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Ukuran file maksimal 5MB'
    setTimeout(() => (error.value = ''), 3000)
    return
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    error.value = 'Format file harus JPG, PNG, atau WEBP'
    setTimeout(() => (error.value = ''), 3000)
    return
  }

  uploading.value = true
  error.value = ''

  try {
    const user = authStore.user
    if (!user) throw new Error('User tidak ditemukan')

    const oldAvatarUrl = avatarUrl.value
    if (oldAvatarUrl) {
      const oldPath = extractPathFromUrl(oldAvatarUrl)
      if (oldPath) {
        await supabase.storage.from(BUCKET).remove([oldPath])
      }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}_${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    console.debug('Uploading avatar', {
      bucket: BUCKET,
      path: filePath,
      name: file.name,
      size: file.size,
      type: file.type,
    })
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.debug('Supabase upload error', uploadError)
      throw uploadError
    }

    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(filePath)

    const publicUrl = publicUrlData.publicUrl

    const { data: updatedAuthData, error: updateError } = await supabase.auth.updateUser({
      data: {
        avatar_url: publicUrl,
      },
    })

    if (updateError) throw updateError

    if (updatedAuthData?.user) {
      authStore.user = updatedAuthData.user
    }
    await authStore.fetchUserProfile()

    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (err) {
    console.error('Error uploading avatar:', err)
    if (err && err.message && err.message.toLowerCase().includes('bucket not found')) {
      error.value = `Bucket "${BUCKET}" tidak ditemukan. Buat bucket ini di Supabase Storage dashboard.`
    } else {
      error.value = err.message || 'Gagal mengupload foto'
    }
    setTimeout(() => (error.value = ''), 5000)
  } finally {
    uploading.value = false
  }
}

const confirmDeleteAction = async () => {
  showDeleteModal.value = false
  uploading.value = true
  error.value = ''

  try {
    const user = authStore.user
    if (!user) throw new Error('User tidak ditemukan')

    const currentAvatarUrl = avatarUrl.value
    if (!currentAvatarUrl) return

    const filePath = extractPathFromUrl(currentAvatarUrl)
    if (filePath) {
      const { error: deleteError } = await supabase.storage.from(BUCKET).remove([filePath])

      if (deleteError) throw deleteError
    }

    const { data: updatedAuthData, error: updateError } = await supabase.auth.updateUser({
      data: {
        avatar_url: null,
      },
    })

    if (updateError) throw updateError

    if (updatedAuthData?.user) {
      authStore.user = updatedAuthData.user
    }
    await authStore.fetchUserProfile()
  } catch (err) {
    console.error('Error deleting avatar:', err)
    if (err && err.message && err.message.toLowerCase().includes('bucket not found')) {
      error.value = `Bucket "${BUCKET}" tidak ditemukan. Buat bucket ini di Supabase Storage dashboard.`
    } else {
      error.value = err.message || 'Gagal menghapus foto'
    }
    setTimeout(() => (error.value = ''), 5000)
  } finally {
    uploading.value = false
  }
}

const extractPathFromUrl = (url) => {
  if (!url) return null
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname

    const objectIndex = pathname.indexOf('/object/')
    if (objectIndex === -1) {
      const parts = pathname.split('/')
      const idx = parts.indexOf(BUCKET)
      if (idx === -1) return null
      return decodeURIComponent(parts.slice(idx + 1).join('/'))
    }

    let rest = pathname.slice(objectIndex + '/object/'.length)
    if (rest.startsWith('public/')) rest = rest.slice('public/'.length)

    const parts = rest.split('/')
    if (parts.length < 2) return null
    const filePathParts = parts.slice(1)
    return decodeURIComponent(filePathParts.join('/'))
  } catch {
    return null
  }
}

const handleClickOutside = (event) => {
  const target = event.target
  if (!target.closest('.relative.group')) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
