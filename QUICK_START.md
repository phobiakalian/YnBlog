# 🚀 Quick Start Guide

## Masalah yang Diperbaiki

✅ Error 404 pada `config.js` - Sekarang ada fallback handler  
✅ Warning Firebase config tidak ditemukan - Auto demo mode  
✅ Config tidak perlu di-commit ke source code  

## Solusi untuk Development Lokal

### Cara Tercepat (3 Langkah)

1. **Set environment variables:**
   ```bash
   export FIREBASE_API_KEY="AIzaSy..."
   export FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   export FIREBASE_PROJECT_ID="your-project-id"
   export FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   export FIREBASE_MESSAGING_SENDER_ID="123456789"
   export FIREBASE_APP_ID="1:123456789:web:abc123"
   ```

2. **Generate config.js:**
   ```bash
   node generate-config.js
   ```

3. **Buka aplikasi:**
   ```bash
   # Gunakan Python simple server atau Live Server VSCode
   python3 -m http.server 8000
   # Lalu buka http://localhost:8000/login.html
   ```

### Alternatif: Pakai .env File

```bash
# Install dotenv-cli
npm install --save-dev dotenv-cli

# Buat file .env dengan isi:
echo "FIREBASE_API_KEY=AIzaSy..." > .env
echo "FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com" >> .env
# ... tambahkan variabel lainnya

# Generate config
npx dotenv-cli -- node generate-config.js
```

## Untuk Production (GitHub Pages)

1. Buka **Settings** → **Secrets and variables** → **Actions**
2. Tambahkan semua Firebase credentials sebagai secrets
3. Push code ke GitHub
4. Workflow akan auto-generate `config.js` saat deployment

📖 **Dokumentasi lengkap**: Lihat `SETUP_ENV.md`

---

## Catatan Tambahan

### ⚠️ Tailwind CDN Warning
Warning ini normal untuk development. Untuk production, install Tailwind via npm:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 🔒 Keamanan
- ✅ `config.js` sudah di `.gitignore`
- ✅ Credentials tidak tersimpan di repository
- ✅ GitHub Secrets untuk production
- ✅ Environment variables untuk development
