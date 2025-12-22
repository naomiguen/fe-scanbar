<template>
  <div class="bg-white rounded-3xl shadow-xl p-6 md:p-8 mb-10 max-w-7xl mx-auto">
    <!-- Header -->
    <h2 class="text-2xl md:text-3xl font-bold text-blue-900 mb-6 flex items-center gap-2">
      <span>Favorit Saya</span>
    </h2>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <div
        class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"
      ></div>
      <p class="text-lg text-slate-600">Memuat favorit...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="favorites.length === 0" class="text-center py-16">
      <p class="text-lg text-slate-700 font-medium mb-2">Belum ada produk favorit</p>
      <p class="text-slate-500">Bintangi produk dari halaman scan untuk akses cepat!</p>
    </div>

    <!-- Grid Favorit -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
    >
      <div
        v-for="fav in favorites"
        :key="fav._id"
        class="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
      >
        <!-- Gambar Produk -->
        <div class="flex justify-center mb-4">
          <img
            v-if="fav.product?.image_small_url || fav.product?.image_url"
            :src="fav.product.image_small_url || fav.product.image_url"
            :alt="fav.product.product_name"
            class="w-24 h-24 object-contain rounded-xl"
          />
        </div>

        <!-- Info Produk -->
        <div class="flex-1 text-center mb-4">
          <h4 class="font-bold text-slate-800 text-base line-clamp-2 mb-1">
            {{ fav.product?.product_name || 'Tanpa Nama' }}
          </h4>
          <p class="text-sm text-slate-600">
            {{ fav.product?.brands || '-' }}
          </p>
        </div>

        <!-- Info Nutrisi Singkat -->
        <div class="grid grid-cols-2 gap-2 mb-4">
          <div class="bg-blue-100 rounded-xl p-2 text-center">
            <div class="text-lg font-bold text-blue-600">
              {{
                Math.round(
                  fav.product?.nutriments?.calories ||
                    fav.product?.nutriments?.['energy-kcal'] ||
                    fav.product?.nutriments?.['energy-kcal_100g'] ||
                    0
                )
              }}
            </div>
            <div class="text-xs font-medium text-blue-700">kcal</div>
          </div>
          <div class="bg-orange-100 rounded-xl p-2 text-center">
            <div class="text-lg font-bold text-orange-600">
              {{
                Math.round(
                  fav.product?.nutriments?.proteins || fav.product?.nutriments?.proteins_100g || 0
                )
              }}g
            </div>
            <div class="text-xs font-medium text-orange-700">protein</div>
          </div>
        </div>

        <!-- Tombol Actions -->
        <div class="flex gap-2">
          <!-- Tombol Quick Add -->
          <button
            @click="quickAdd(fav)"
            :disabled="addingId === fav._id"
            :class="[
              'flex-1 py-3 px-3 rounded-xl font-bold transition-all duration-300 text-sm flex items-center justify-center gap-1.5',
              addingId === fav._id
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white hover:scale-105 shadow-md hover:shadow-lg',
            ]"
          >
            <span v-if="addingId === fav._id">⏳</span>
            <span v-else>➕</span>
            <span class="hidden sm:inline">{{
              addingId === fav._id ? 'Menambah...' : 'Tambah'
            }}</span>
          </button>

          <!-- Tombol Hapus Favorit -->
          <button
            @click="openDeleteModal(fav)"
            :disabled="deletingId === fav._id"
            :class="[
              'py-3 px-4 rounded-xl font-bold transition-all duration-300 text-sm flex items-center justify-center gap-1.5',
              deletingId === fav._id
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white hover:scale-105 shadow-md hover:shadow-lg',
            ]"
            :title="deletingId === fav._id ? 'Menghapus...' : 'Hapus dari Favorit'"
          >
            <span v-if="deletingId === fav._id">⏳</span>
            <span v-else>🗑️</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeDeleteModal"
    >
      <div
        class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all"
      >
        <!-- Title -->
        <h3 class="text-2xl font-bold text-slate-800 text-center mb-3">Hapus dari Favorit?</h3>

        <!-- Product Info -->
        <div v-if="selectedFavorite" class="bg-slate-50 rounded-xl p-4 mb-6">
          <div class="flex items-center gap-3">
            <img
              v-if="
                selectedFavorite.product?.image_small_url || selectedFavorite.product?.image_url
              "
              :src="selectedFavorite.product.image_small_url || selectedFavorite.product.image_url"
              :alt="selectedFavorite.product.product_name"
              class="w-16 h-16 object-contain rounded-lg"
            />
            <div class="flex-1">
              <p class="font-bold text-slate-800 text-sm line-clamp-2">
                {{ selectedFavorite.product?.product_name || 'Tanpa Nama' }}
              </p>
              <p class="text-xs text-slate-500">
                {{ selectedFavorite.product?.brands || '-' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Description -->
        <p class="text-slate-600 text-center mb-6">
          Produk ini akan dihapus dari daftar favorit Anda.
        </p>

        <!-- Buttons -->
        <div class="flex gap-3">
          <button
            @click="closeDeleteModal"
            class="flex-1 py-3 px-4 rounded-xl font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-all duration-300"
          >
            Batal
          </button>
          <button
            @click="confirmDelete"
            :disabled="deletingId === selectedFavorite?._id"
            :class="[
              'flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300',
              deletingId === selectedFavorite?._id
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white hover:scale-105 shadow-md',
            ]"
          >
            {{ deletingId === selectedFavorite?._id ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '@/axios-config'
import { useFoodStore } from '@/stores/food'
import { toast } from 'vue-sonner'

const foodStore = useFoodStore()

const favorites = ref([])
const isLoading = ref(true)
const addingId = ref(null)
const deletingId = ref(null)
const showDeleteModal = ref(false)
const selectedFavorite = ref(null)

// Fetch favorit saat komponen dimuat
const fetchFavorites = async () => {
  isLoading.value = true
  try {
    const response = await apiClient.get('/api/favorites')
    favorites.value = response.data.favorites
  } catch (error) {
    console.error('Error fetching favorites:', error)

    if (error.response?.status === 401) {
      toast.error('Sesi berakhir', {
        description: 'Silakan login kembali',
      })
    } else {
      toast.error('Gagal memuat favorit', {
        description: error.message || 'Terjadi kesalahan saat mengambil data favorit',
      })
    }
  } finally {
    isLoading.value = false
  }
}

// Quick Add ke jurnal harian
const quickAdd = async (fav) => {
  if (!fav.product) {
    toast.error('Data produk tidak tersedia')
    return
  }

  addingId.value = fav._id

  try {
    const saltValue =
      fav.product.nutriments?.salt_100g ||
      fav.product.nutriments?.sodium_100g ||
      fav.product.nutriments?.salt ||
      0

    const saltInMg = saltValue < 100 ? saltValue * 1000 : saltValue

    const foodData = {
      productName: fav.product.product_name || 'Tanpa Nama',
      barcode: fav.productCode,
      calories: fav.product.nutriments?.['energy-kcal_100g'] || 0,
      protein: fav.product.nutriments?.proteins_100g || 0,
      carbs: fav.product.nutriments?.carbohydrates_100g || 0,
      fat: fav.product.nutriments?.fat_100g || 0,
      sugar: fav.product.nutriments?.sugars_100g || 0,
      salt: saltInMg,
      imageUrl: fav.product.image_small_url || fav.product.image_url,
    }

    console.log('Calling foodStore.addFood with:', foodData)

    await foodStore.addFood(foodData)

    console.log('addFood completed, showing toast')

    toast.success('Berhasil Ditambahkan!', {
      description: `${foodData.productName} dengan ${Math.round(
        foodData.calories
      )} kalori telah disimpan ke jurnal harian Anda`,
      duration: 4000,
    })
  } catch (error) {
    console.error('Error in quickAdd:', error)
    toast.error('Gagal menambahkan ke jurnal', {
      description: error.response?.data?.message || error.message || 'Terjadi kesalahan',
    })
  } finally {
    addingId.value = null
  }
}

// Hapus dari favorit
const removeFavorite = async (fav) => {
  if (!fav.productCode) {
    toast.error('Kode produk tidak tersedia')
    return
  }

  deletingId.value = fav._id

  try {
    // Panggil endpoint toggle favorit (akan menghapus karena sudah ada di favorit)
    const response = await apiClient.post('/api/favorites', {
      productCode: fav.productCode,
    })

    if (response.data.success && !response.data.isFavorited) {
      // Hapus dari array lokal
      favorites.value = favorites.value.filter((f) => f._id !== fav._id)

      toast.success('Dihapus dari Favorit', {
        description: `${fav.product?.product_name || 'Produk'} telah dihapus dari daftar favorit`,
        duration: 3000,
      })
    }
  } catch (error) {
    console.error('Error removing favorite:', error)
    toast.error('Gagal menghapus favorit', {
      description: error.response?.data?.message || error.message || 'Terjadi kesalahan',
    })
  } finally {
    deletingId.value = null
  }
}

// Buka modal konfirmasi hapus
const openDeleteModal = (fav) => {
  selectedFavorite.value = fav
  showDeleteModal.value = true
}

// Tutup modal
const closeDeleteModal = () => {
  showDeleteModal.value = false
  selectedFavorite.value = null
}

// Konfirmasi hapus
const confirmDelete = async () => {
  if (!selectedFavorite.value) return

  const fav = selectedFavorite.value
  deletingId.value = fav._id

  try {
    const response = await apiClient.post('/api/favorites', {
      productCode: fav.productCode,
    })

    if (response.data.success && !response.data.isFavorited) {
      favorites.value = favorites.value.filter((f) => f._id !== fav._id)

      toast.success('Dihapus dari Favorit', {
        description: `${fav.product?.product_name || 'Produk'} telah dihapus dari daftar favorit`,
        duration: 3000,
      })
    }

    closeDeleteModal()
  } catch (error) {
    console.error('Error removing favorite:', error)
    toast.error('Gagal menghapus favorit', {
      description: error.response?.data?.message || error.message || 'Terjadi kesalahan',
    })
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  fetchFavorites()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
