# 🔐 Setup GitHub Secrets untuk CeritaKu

Dokumen ini menjelaskan cara mengatur GitHub Secrets agar konfigurasi Firebase tidak perlu disimpan di source code.

## 📋 Daftar Secrets yang Diperlukan

### Firebase Configuration (Wajib untuk Production)

| Secret Name | Deskripsi | Contoh Nilai |
|-------------|-----------|--------------|
| `FIREBASE_API_KEY` | API Key dari Firebase Console | `AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXX` |
| `FIREBASE_AUTH_DOMAIN` | Auth domain Firebase | `your-project-id.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | Project ID Firebase | `your-project-id` |
| `FIREBASE_STORAGE_BUCKET` | Storage bucket Firebase | `your-project-id.appspot.com` |
| `FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | `123456789012` |
| `FIREBASE_APP_ID` | App ID Firebase | `1:123456789012:web:abcdef1234567890abcdef12` |
| `FIREBASE_MEASUREMENT_ID` | Measurement ID (opsional) | `G-XXXXXXXXXX` |

### Admin Configuration (Opsional)

| Secret Name | Deskripsi | Default |
|-------------|-----------|---------|
| `ADMIN_EMAIL_DOMAIN` | Domain email untuk admin | `@admin.ceritaku.com` |

## 🚀 Cara Menambahkan Secrets

### Langkah 1: Buka Repository Settings

1. Buka repository GitHub Anda
2. Klik tab **Settings**
3. Di sidebar kiri, klik **Secrets and variables** → **Actions**

### Langkah 2: Tambahkan Setiap Secret

Untuk setiap secret di atas:

1. Klik tombol **New repository secret**
2. Isi **Name** dengan nama secret (misal: `FIREBASE_API_KEY`)
3. Isi **Value** dengan nilai dari Firebase Console Anda
4. Klik **Add secret**

Ulangi untuk semua secret yang diperlukan.

### Langkah 3: Dapatkan Nilai dari Firebase Console

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Anda atau buat project baru
3. Klik ikon gear ⚙️ (Project Settings)
4. Scroll ke bagian **Your apps**
5. Jika belum ada web app, klik ikon web `</>` untuk membuat app baru
6. Salin nilai-nilai dari `firebaseConfig` object

Contoh firebaseConfig dari Firebase Console:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef12",
  measurementId: "G-XXXXXXXXXX"
};
```

Salin setiap nilai ke GitHub Secrets sesuai tabel di atas.

## 🔄 Cara Kerja Deployment

Setelah secrets diatur:

1. **Setiap kali push ke main/master**, GitHub Actions akan:
   - Memastikan `config.js` TIDAK di-commit ke repository
   - Membuat file `config.js` secara otomatis saat build menggunakan nilai dari secrets
   - Deploy ke GitHub Pages dengan config yang sudah terisi

2. **Jika secrets tidak diatur**, workflow akan:
   - Menggunakan mode demo dengan konfigurasi dummy
   - Aplikasi tetap bisa di-deploy tapi Firebase tidak akan berfungsi penuh

## ✅ Verifikasi Setup

Setelah menambahkan secrets:

1. Push perubahan ke repository (atau trigger manual workflow)
2. Buka tab **Actions** di GitHub
3. Klik workflow **🚀 Deploy CeritaKu to GitHub Pages**
4. Periksa log step **🔐 Generate config.js from GitHub Secrets**
5. Pastikan muncul pesan: `✅ Production config.js generated from secrets`

## 🔒 Keamanan

- ✅ Secrets **tidak akan** terlihat di log GitHub Actions
- ✅ Secrets **tidak akan** di-commit ke repository
- ✅ File `config.js` hanya ada saat runtime deployment
- ✅ Setiap developer lokal harus setup `config.js` sendiri untuk development

## 🛠️ Development Lokal

Untuk development di komputer lokal:

```bash
# 1. Clone repository
git clone https://github.com/username/repo.git

# 2. Copy template config
cp config.template.js config.js

# 3. Edit config.js dengan Firebase credentials Anda
nano config.js  # atau gunakan text editor favorit

# 4. Jalankan local server
# Gunakan Live Server extension di VSCode atau:
python3 -m http.server 8000
```

⚠️ **PENTING**: Jangan pernah commit `config.js` ke repository!

File `config.js` sudah ditambahkan di `.gitignore` untuk mencegah accidental commit.

## ❓ Troubleshooting

### Error: "FIREBASE_API_KEY secret not set"

- Pastikan secret sudah ditambahkan dengan nama yang tepat (case-sensitive)
- Refresh halaman Settings setelah menambahkan secret
- Coba trigger ulang workflow

### Deployment berhasil tapi Firebase error di browser

- Periksa apakah semua 6 secrets Firebase sudah terisi
- Verifikasi nilai secrets sesuai dengan Firebase Console
- Periksa Firebase Rules di Firebase Console

### Config tidak ter-generate saat deployment

- Periksa log GitHub Actions untuk error detail
- Pastikan workflow memiliki permission yang cukup
- Cek apakah branch protection rules memblokir deployment

## 📚 Referensi

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Firebase Configuration Guide](https://firebase.google.com/docs/web/setup#config-object)
- [GitHub Actions Deployment](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

---

**Dibuat untuk CeritaKu Platform** | 🔐 Secure by Design
