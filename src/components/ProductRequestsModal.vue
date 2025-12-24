<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-4"
        @click.self="$emit('close')"
      >
        <div
          class="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-slate-200 dark:border-slate-700"
          >
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <h2
                  class="text-base sm:text-lg md:text-xl font-bold text-slate-800 dark:text-white"
                >
                  Permintaan Produk
                </h2>
                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Kelola produk yang diminta user
                </p>
              </div>
            </div>
            <button
              @click="$emit('close')"
              class="p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 dark:text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Filter Tabs -->
          <div
            class="flex gap-1.5 sm:gap-2 p-3 sm:p-4 border-b border-slate-200 dark:border-slate-700 overflow-x-auto"
          >
            <button
              v-for="status in statuses"
              :key="status"
              @click="currentFilter = status"
              :class="[
                'px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap',
                currentFilter === status
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
              ]"
            >
              {{ getStatusLabel(status) }}
              <span
                v-if="counts[status]"
                class="ml-1.5 px-1.5 py-0.5 bg-white/20 rounded-full text-[10px] font-bold"
              >
                {{ counts[status] }}
              </span>
            </button>
            <button
              @click="fetchRequests"
              :disabled="loading"
              class="ml-auto p-1.5 sm:p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                :class="[
                  'w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-300',
                  loading && 'animate-spin',
                ]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-12">
              <div
                class="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
              ></div>
            </div>

            <!-- Empty State -->
            <div v-else-if="requests.length === 0" class="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                Tidak ada permintaan produk {{ getStatusLabel(currentFilter) }}
              </p>
            </div>

            <!-- Requests List -->
            <div v-else class="space-y-3 sm:space-y-4">
              <div
                v-for="request in requests"
                :key="request._id"
                class="bg-slate-50 dark:bg-slate-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                <!-- Header -->
                <div class="flex items-start justify-between mb-3 gap-3">
                  <div class="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div
                      class="p-1.5 sm:p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg flex-shrink-0"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          class="font-mono font-bold text-sm sm:text-base md:text-lg text-slate-800 dark:text-white truncate"
                        >
                          {{ request.barcode }}
                        </span>
                        <span
                          :class="[
                            'inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border',
                            getStatusColor(request.status),
                          ]"
                        >
                          <component :is="getStatusIcon(request.status)" class="w-3 h-3" />
                          {{ getStatusLabel(request.status) }}
                        </span>
                      </div>
                      <div
                        class="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-slate-600 dark:text-slate-400"
                      >
                        <span class="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span class="truncate max-w-[120px] sm:max-w-none">{{
                            request.requestedByName || 'Unknown'
                          }}</span>
                        </span>
                        <span class="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {{ formatDate(request.lastAttemptDate) }}
                        </span>
                        <span
                          v-if="request.attemptCount > 1"
                          class="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-semibold"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          {{ request.attemptCount }}x
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Admin Notes -->
                <div
                  v-if="request.adminNotes"
                  class="mb-3 p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <p class="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <span class="font-semibold">Catatan Admin:</span> {{ request.adminNotes }}
                  </p>
                </div>

                <!-- PENDING ACTIONS -->
                <div
                  v-if="request.status === 'pending'"
                  class="flex flex-wrap gap-2 pt-3 border-t border-slate-200 dark:border-slate-700"
                >
                  <!-- Tombol Tambah Produk (Primary Action) -->
                  <button
                    @click="goToAddProduct(request.barcode)"
                    class="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Produk
                  </button>

                  <!-- Tombol Set Processing -->
                  <button
                    @click="updateStatus(request._id, 'processing', 'Sedang diproses admin')"
                    :disabled="processingIds.has(request._id)"
                    class="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 border border-blue-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span class="hidden sm:inline">Set Proses</span>
                  </button>

                  <!-- Tombol Reject -->
                  <button
                    @click="
                      updateStatus(request._id, 'rejected', 'Produk tidak tersedia/tidak valid')
                    "
                    :disabled="processingIds.has(request._id)"
                    class="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs sm:text-sm font-semibold transition-all disabled:opacity-50 border border-red-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <!-- PROCESSING ACTIONS -->
                <div
                  v-else-if="request.status === 'processing'"
                  class="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700"
                >
                  <!-- Info Box -->
                  <div
                    class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  >
                    <p
                      class="text-xs sm:text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span
                        >Setelah menambahkan produk, klik tombol
                        <strong>"Tandai Selesai"</strong> untuk memindahkan ke riwayat.</span
                      >
                    </p>
                  </div>

                  <div class="flex flex-wrap gap-2">
                    <!-- Tombol Tambah Produk -->
                    <button
                      @click="goToAddProduct(request.barcode)"
                      class="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Tambah Produk
                    </button>

                    <!-- Tombol Tandai Selesai (Prominent) -->
                    <button
                      @click="
                        updateStatus(
                          request._id,
                          'completed',
                          'Produk sudah ditambahkan oleh admin'
                        )
                      "
                      :disabled="processingIds.has(request._id)"
                      class="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Tandai Selesai
                    </button>

                    <!-- Tombol Kembali ke Pending -->
                    <button
                      @click="updateStatus(request._id, 'pending', 'Dikembalikan ke pending')"
                      :disabled="processingIds.has(request._id)"
                      class="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs sm:text-sm font-semibold transition-all disabled:opacity-50"
                      title="Kembali ke Pending"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- COMPLETED/REJECTED ACTIONS -->
                <div
                  v-else-if="request.status === 'completed' || request.status === 'rejected'"
                  class="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700"
                >
                  <!-- Resolved Info -->
                  <div
                    v-if="request.resolvedAt"
                    class="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
                  >
                    <p class="text-xs text-slate-600 dark:text-slate-400">
                      <span class="font-semibold"
                        >{{ request.status === 'completed' ? 'Selesai' : 'Ditolak' }}:</span
                      >
                      {{ formatDate(request.resolvedAt) }}
                    </p>
                  </div>

                  <div class="flex gap-2">
                    <button
                      @click="deleteRequest(request._id)"
                      class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-xs sm:text-sm font-semibold transition-all"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Hapus dari Riwayat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, h } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '@/axios-config'
import { toast } from 'vue-sonner'

const router = useRouter()

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const statuses = ['pending', 'processing', 'completed', 'rejected']
const currentFilter = ref('pending')
const requests = ref([])
const loading = ref(false)
const processingIds = ref(new Set())
const counts = ref({
  pending: 0,
  processing: 0,
  completed: 0,
  rejected: 0,
})

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    processing: 'Diproses',
    completed: 'Selesai',
    rejected: 'Ditolak',
  }
  return labels[status] || status
}

const goToAddProduct = (barcode) => {
  // Close modal
  emit('close')

  // Navigate ke halaman add product dengan barcode di query
  router.push({
    path: '/admin/add-product',
    query: { barcode },
  })

  toast.info('Silakan tambahkan produk dengan barcode: ' + barcode)
}

const fetchRequests = async () => {
  try {
    console.log('🔍 [MODAL] Fetching product requests...')
    loading.value = true

    const { data } = await apiClient.get(
      `/api/admin/product-requests?status=${currentFilter.value}`
    )
    console.log('✅ [MODAL] Received:', data.length, 'requests')
    requests.value = data

    // Update counts for all statuses
    for (const status of statuses) {
      const { data: statusData } = await apiClient.get(
        `/api/admin/product-requests?status=${status}`
      )
      counts.value[status] = statusData.length
    }

    console.log('✅ [MODAL] Counts:', counts.value)
  } catch (error) {
    console.error('❌ [MODAL] Error:', error)
    toast.error('Gagal memuat permintaan produk')
  } finally {
    loading.value = false
  }
}

const updateStatus = async (id, status, notes = '') => {
  processingIds.value.add(id)
  try {
    await apiClient.put(`/api/admin/product-requests/${id}/status`, {
      status,
      adminNotes: notes,
    })

    const statusLabel = getStatusLabel(status)
    toast.success(`Status diupdate menjadi "${statusLabel}"!`)
    await fetchRequests()
  } catch (error) {
    console.error('Error updating status:', error)
    toast.error('Gagal mengupdate status')
  } finally {
    processingIds.value.delete(id)
  }
}

const deleteRequest = async (id) => {
  if (!confirm('Hapus request ini dari riwayat?')) return

  try {
    await apiClient.delete(`/api/admin/product-requests/${id}`)
    toast.success('Request berhasil dihapus dari riwayat')
    await fetchRequests()
  } catch (error) {
    console.error('Error deleting request:', error)
    toast.error('Gagal menghapus request')
  }
}

const getStatusColor = (status) => {
  const colors = {
    pending:
      'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    processing:
      'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    completed:
      'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    rejected:
      'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  }
  return colors[status] || colors.pending
}

const getStatusIcon = (status) => {
  const icons = {
    pending: () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          class: 'w-3 h-3',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
        },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
          }),
        ]
      ),
    processing: () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          class: 'w-3 h-3',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
        },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
          }),
        ]
      ),
    completed: () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          class: 'w-3 h-3',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
        },
        [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M5 13l4 4L19 7' })]
      ),
    rejected: () =>
      h(
        'svg',
        {
          xmlns: 'http://www.w3.org/2000/svg',
          class: 'w-3 h-3',
          fill: 'none',
          viewBox: '0 0 24 24',
          stroke: 'currentColor',
          'stroke-width': '2',
        },
        [
          h('path', {
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            d: 'M6 18L18 6M6 6l12 12',
          }),
        ]
      ),
  }
  return icons[status] || icons.pending
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins} menit lalu`
  if (diffHours < 24) return `${diffHours} jam lalu`
  if (diffDays < 7) return `${diffDays} hari lalu`

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

// Watch for filter changes
watch(currentFilter, () => {
  fetchRequests()
})

// Watch for modal open
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      fetchRequests()
    }
  }
)
</script>
