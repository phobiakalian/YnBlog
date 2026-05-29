# 🔐 Konfigurasi Tanpa Menyimpan di Source Code

## ✅ Masalah yang Sudah Diperbaiki

| Error/Warning | Status | Solusi |
|---------------|--------|--------|
| `Failed to load resource: config.js (404)` | ✅ Fixed | Fallback handler + auto demo mode |
| `⚠️ FIREBASE_CONFIG tidak ditemukan` | ✅ Fixed | Graceful fallback ke demo mode |
| Config di source code | ✅ Fixed | Generate dari env vars / GitHub Secrets |

---

## 🚀 Quick Start

### Development Lokal (3 Langkah)

```bash
# 1. Set environment variables
export FIREBASE_API_KEY="AIzaSy..."
export FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
export FIREBASE_PROJECT_ID="your-project-id"
export FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
export FIREBASE_MESSAGING_SENDER_ID="123456789"
export FIREBASE_APP_ID="1:123456789:web:abc123"

# 2. Generate config.js
node generate-config.js

# 3. Jalankan server lokal
python3 -m http.server 8000
# Buka http://localhost:8000/login.html
```

### Production (GitHub Pages)

Simpan credentials di **GitHub Secrets** → Workflow auto-generate `config.js` saat deploy.

📖 **Dokumentasi lengkap**: 
- `QUICK_START.md` - Panduan cepat
- `SETUP_ENV.md` - Setup detail + troubleshooting
- `README_SECRETS.md` - Setup GitHub Secrets

---

## 📁 File yang Ditambahkan

| File | Fungsi |
|------|--------|
| `generate-config.js` | Script untuk generate `config.js` dari env vars |
| `SETUP_ENV.md` | Dokumentasi lengkap setup environment |
| `QUICK_START.md` | Quick start guide |
| `.gitignore` (updated) | Blokir `config.js` agar tidak ter-commit |

---

## 🔒 Keamanan

✅ **TIDAK PERLU** menyimpan `config.js` di repository  
✅ Credentials disimpan di **environment variables** (lokal) atau **GitHub Secrets** (production)  
✅ `config.js` di-generate otomatis saat:
  - Development: jalankan `node generate-config.js`
  - Production: GitHub Actions workflow  

---

## 💡 Cara Kerja

```
┌─────────────────────────────────────────────────────┐
│ DEVELOPMENT (Lokal)                                 │
├─────────────────────────────────────────────────────┤
│ 1. Set env vars (export atau .env file)            │
│ 2. node generate-config.js                          │
│ 3. config.js dibuat → aplikasi jalan                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ PRODUCTION (GitHub Pages)                           │
├─────────────────────────────────────────────────────┤
│ 1. Simpan secrets di GitHub Settings                │
│ 2. Push code ke GitHub                              │
│ 3. GitHub Actions generate config.js otomatis       │
│ 4. Deploy ke GitHub Pages                           │
└─────────────────────────────────────────────────────┘
```

---

## ⚠️ Catatan

### Tailwind CDN Warning
```
[Warning] cdn.tailwindcss.com should not be used in production
```
Ini normal untuk development. Untuk production, install Tailwind via npm:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Demo Mode
Jika `config.js` tidak ada atau Firebase credentials tidak valid, aplikasi akan otomatis masuk **Demo Mode** dengan data dummy.

---

## 🆘 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Error 404 config.js | Jalankan `node generate-config.js` |
| Masih error setelah generate | Cek env vars sudah benar |
| Ingin pakai .env file | Install `dotenv-cli`, lihat `SETUP_ENV.md` |
| Deployment gagal | Cek GitHub Secrets sudah diset |

---

**Happy Coding! 🎉**
