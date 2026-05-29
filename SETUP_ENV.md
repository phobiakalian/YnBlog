# 🔐 Setup Environment Variables untuk Development

File ini menjelaskan cara setup konfigurasi Firebase tanpa menyimpannya di source code.

## 🚀 Quick Start (Development Lokal)

### Opsi 1: Menggunakan Script Generator (Recommended)

1. **Install dependencies** (jika belum):
   ```bash
   npm init -y  # Jika belum ada package.json
   ```

2. **Set environment variables** di terminal:
   ```bash
   export FIREBASE_API_KEY="AIzaSy..."
   export FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   export FIREBASE_PROJECT_ID="your-project-id"
   export FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
   export FIREBASE_MESSAGING_SENDER_ID="123456789"
   export FIREBASE_APP_ID="1:123456789:web:abc123"
   export FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"  # Opsional
   ```

3. **Generate config.js**:
   ```bash
   node generate-config.js
   ```

4. **Buka aplikasi di browser**:
   ```bash
   # Gunakan live server atau buka langsung file HTML
   open login.html
   ```

### Opsi 2: Menggunakan .env File

1. **Install dotenv-cli**:
   ```bash
   npm install --save-dev dotenv-cli
   ```

2. **Buat file `.env`** di root folder:
   ```env
   FIREBASE_API_KEY=AIzaSy...
   FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=123456789
   FIREBASE_APP_ID=1:123456789:web:abc123
   FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Generate config.js**:
   ```bash
   npx dotenv-cli -- node generate-config.js
   ```

### Opsi 3: Manual Copy-Paste (Tidak Recommended)

1. Copy `config.template.js` ke `config.js`:
   ```bash
   cp config.template.js config.js
   ```

2. Edit `config.js` dan isi dengan nilai Firebase Anda.

⚠️ **PENTING**: Jangan commit `config.js` ke Git!

---

## 🌐 Production (GitHub Pages)

Untuk deployment ke GitHub Pages, gunakan **GitHub Secrets**:

1. Buka repository GitHub Anda
2. Pergi ke **Settings** → **Secrets and variables** → **Actions**
3. Klik **New repository secret**
4. Tambahkan secrets berikut:

| Secret Name | Value |
|-------------|-------|
| `FIREBASE_API_KEY` | API Key dari Firebase Console |
| `FIREBASE_AUTH_DOMAIN` | Auth Domain dari Firebase Console |
| `FIREBASE_PROJECT_ID` | Project ID dari Firebase Console |
| `FIREBASE_STORAGE_BUCKET` | Storage Bucket dari Firebase Console |
| `FIREBASE_MESSAGING_SENDER_ID` | Messaging Sender ID dari Firebase Console |
| `FIREBASE_APP_ID` | App ID dari Firebase Console |
| `FIREBASE_MEASUREMENT_ID` | Measurement ID dari Firebase Console (opsional) |

Workflow GitHub Actions akan otomatis membuat `config.js` saat deployment.

---

## 📝 Cara Mendapatkan Firebase Credentials

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Anda
3. Klik ikon ⚙️ (Settings) → **Project settings**
4. Scroll ke bawah ke bagian **Your apps**
5. Jika belum ada web app, klik ikon web **</>** untuk membuat web app
6. Copy nilai-nilai dari `firebaseConfig` object

---

## ❓ Troubleshooting

### Error: "FIREBASE_CONFIG tidak ditemukan"
- Pastikan `config.js` sudah dibuat
- Cek apakah environment variables sudah diset dengan benar
- Jalankan ulang `node generate-config.js`

### Error: "Failed to load resource: config.js (404)"
- Pastikan `config.js` berada di folder yang sama dengan file HTML
- Refresh browser dengan hard reload (Cmd+Shift+R / Ctrl+Shift+R)

### Ingin reset config.js?
```bash
rm config.js
node generate-config.js
```

---

## 🔒 Keamanan

✅ **DO**:
- Simpan credentials di environment variables atau GitHub Secrets
- Gunakan `.gitignore` untuk memblokir `config.js`
- Rotate credentials jika ter-expose

❌ **DON'T**:
- Commit `config.js` ke Git
- Share credentials di public repository
- Hardcode credentials di source code

---

## 📚 Referensi

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Firebase Configuration Guide](https://firebase.google.com/docs/web/setup#config-object)
- [Environment Variables Best Practices](https://12factor.net/config)
