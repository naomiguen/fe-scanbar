# ScanBar

![ScanBar Banner](https://via.placeholder.com/1200x400?text=ScanBar+App+Banner)
**ScanBar** adalah aplikasi pelacak nutrisi berbasis web (PWA) yang dirancang khusus untuk produk makanan di Indonesia. Aplikasi ini membantu pengguna memantau asupan kalori, gula, dan garam dengan cara memindai barcode kemasan atau menggunakan analisis AI untuk makanan tanpa kemasan.

[KLIK DI SINI UNTUK COBA APLIKASI]([https://link-frontend-vercel-kamu.app](https://scan-bar-y26r.vercel.app/)

---

## Fitur Utama

* **Barcode Scanner:** Pindai barcode makanan kemasan (integrasi Open Food Facts & Database Lokal) untuk melihat nutrisi secara instan.
* **AI Food Analysis:** Gunakan kamera untuk memotret makanan rumahan (tanpa barcode), dan **Google Gemini AI** akan mengestimasi kalori & nutrisinya.
* **Jurnal Harian:** Visualisasi progress bar untuk Kalori, Protein, Karbo, Lemak, Gula, dan Garam harian.
* **Personalisasi:** Menghitung kebutuhan kalori harian (TDEE) berdasarkan berat, tinggi, dan usia pengguna.
* **Manajemen User:** Sistem Login/Register aman menggunakan Supabase Auth.
* **Smart Caching:** Menyimpan data produk eksternal ke database lokal (MongoDB Atlas) untuk akses super cepat di pemindaian berikutnya.

---

## Tech Stack

Aplikasi ini dibangun menggunakan arsitektur **MEVN** (MongoDB, Express, Vue, Node) yang terpisah (*Decoupled*).

### Frontend (Client)
* **Framework:** Vue.js 3 (Composition API)
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **State Management:** Pinia
* **Scanner:** html5-qrcode
* **Deploy:** Vercel

### Backend (Server)
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database NoSQL:** MongoDB Atlas (Data Produk & Jurnal)
* **Auth & User Data:** Supabase (PostgreSQL)
* **AI Integration:** Google Gemini API
* **Deploy:** Railway

---
