<template>
  <div class="fixed bottom-5 right-5 z-50">
    <!-- Floating Button -->
    <button
      v-if="!isOpen"
      @click="toggleChat"
      class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-200 animate-pulse-soft"
    >
      <div class="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="animate-bounce-gentle"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span
          class="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"
        ></span>
        <span class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
      </div>
    </button>

    <!-- Chat Window -->
    <div
      v-if="isOpen"
      class="w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-[480px]:w-screen max-[480px]:h-screen max-[480px]:rounded-none"
    >
      <!-- Header -->
      <div
        class="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-sm font-bold shadow-md"
          >
            SB
          </div>
          <div>
            <h3 class="font-semibold text-base m-0">Scanbar Assistant</h3>
            <p class="text-xs opacity-90 m-0">Online</p>
          </div>
        </div>
        <button
          @click="toggleChat"
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Messages -->
      <div class="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4" ref="messagesContainer">
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['flex gap-2 animate-slideIn', msg.role === 'user' ? 'flex-row-reverse' : '']"
        >
          <div
            class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold self-start"
            :class="
              msg.role === 'user'
                ? 'bg-gray-300 text-gray-700'
                : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm'
            "
          >
            {{ msg.role === 'user' ? '👤' : 'SB' }}
          </div>
          <div
            :class="[
              'max-w-[75%] p-3 rounded-xl shadow-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
                : 'bg-white',
            ]"
            v-html="formatMessage(msg.content)"
          ></div>
        </div>

        <div v-if="loading" class="flex gap-2">
          <div
            class="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold self-start text-white shadow-sm"
          >
            SB
          </div>
          <div class="bg-white p-3 rounded-xl shadow-sm flex gap-1">
            <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
            <span
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"
            ></span>
            <span
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"
            ></span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div
        v-if="showQuickActions"
        class="flex flex-wrap gap-2 p-3 bg-white border-t border-gray-200"
      >
        <button
          v-for="action in quickActions"
          :key="action.text"
          @click="sendQuickAction(action.text)"
          class="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-full text-sm transition-colors"
        >
          {{ action.emoji }} {{ action.text }}
        </button>
      </div>

      <!-- Input -->
      <div class="flex gap-2 p-4 bg-white border-t border-gray-200">
        <input
          v-model="inputMessage"
          @keyup.enter="sendMessage"
          placeholder="Ketik pesan..."
          :disabled="loading"
          class="flex-1 border border-gray-200 rounded-full px-4 py-3 text-sm outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
        />
        <button
          @click="sendMessage"
          :disabled="loading || !inputMessage.trim()"
          class="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/axios-config'

export default {
  name: 'Chatbot',
  data() {
    return {
      isOpen: false,
      messages: [
        {
          role: 'assistant',
          content:
            'Halo! 👋 Saya asisten Scanbar. Saya bisa membantu kamu dengan:\n\n• Cara scan barcode makanan\n• Cara scan makanan secara realtime\n• Cara atur ulang BMI\n• Rekomendasi resep makanan sehat\n\nAda yang bisa saya bantu?',
        },
      ],
      inputMessage: '',
      loading: false,
      showQuickActions: true,
      quickActions: [
        { emoji: '📱', text: 'Cara scan barcode' },
        { emoji: '📸', text: 'Cara scan makanan' },
        { emoji: '⚙️', text: 'Atur BMI' },
        { emoji: '🥗', text: 'Resep sehat' },
      ],
    }
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen
    },

    async sendMessage() {
      if (!this.inputMessage.trim() || this.loading) return

      const userMessage = this.inputMessage.trim()
      this.messages.push({
        role: 'user',
        content: userMessage,
      })

      this.inputMessage = ''
      this.loading = true
      this.showQuickActions = false
      this.scrollToBottom()

      try {
        // Kirim ke backend
        const response = await apiClient.post('/api/chatbot/chat', {
          message: userMessage,
          history: this.messages.slice(0, -1), // Kirim history tanpa message terakhir
        })

        this.messages.push({
          role: 'assistant',
          content: response.data.response,
        })
      } catch (error) {
        console.error('Error:', error)
        this.messages.push({
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan. Coba lagi ya!',
        })
      } finally {
        this.loading = false
        this.scrollToBottom()
      }
    },

    sendQuickAction(text) {
      this.inputMessage = text
      this.sendMessage()
    },

    formatMessage(content) {
      // Convert markdown-style formatting to HTML
      return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/• /g, '• ')
    },

    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      })
    },
  },
}
</script>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseSoft {
  0%,
  100% {
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.5);
  }
  50% {
    box-shadow: 0 10px 40px rgba(59, 130, 246, 0.7);
  }
}

@keyframes bounceGentle {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease;
}

.animate-pulse-soft {
  animation: pulseSoft 2s ease-in-out infinite;
}

.animate-bounce-gentle {
  animation: bounceGentle 2s ease-in-out infinite;
}
</style>
