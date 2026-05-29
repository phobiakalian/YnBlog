# 🚀 Deploy CeritaKu ke Vercel dengan Vercel Postgres

Panduan lengkap untuk memigrasikan CeritaKu dari GitHub Pages ke Vercel dengan database Vercel Postgres.

## 📋 Apa yang Berubah?

| Komponen | Sebelum (GitHub Pages) | Sesudah (Vercel) |
|----------|------------------------|------------------|
| Hosting | GitHub Pages (static) | Vercel (static + Edge Functions) |
| Database | Firebase Firestore | Vercel Postgres |
| API | Client-side Firebase SDK | Vercel Edge Functions |
| Config | Firebase config | Vercel Environment Variables |
| Deployment | GitHub Actions | Vercel CLI / Git integration |

## 🎯 Prerequisites

1. **Akun Vercel** - Daftar di [vercel.com](https://vercel.com)
2. **Vercel CLI** (opsional untuk local development):
   ```bash
   npm install -g vercel
   ```
3. **Node.js** v18+ untuk local development

## 📦 Langkah 1: Setup Project di Vercel

### Opsi A: Deploy via Git Integration (Recommended)

1. Push kode Anda ke repository GitHub/GitLab/Bitbucket
2. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
3. Klik **"Add New..."** → **"Project"**
4. Import repository Anda
5. Vercel akan auto-detect settings:
   - **Framework Preset**: Other
   - **Build Command**: `echo 'Static site - no build needed'`
   - **Output Directory**: `.`
6. Klik **"Deploy"**

### Opsi B: Deploy via Vercel CLI

```bash
# Login ke Vercel
vercel login

# Deploy ke production
vercel --prod

# Atau deploy ke preview
vercel
```

## 🗄️ Langkah 2: Setup Vercel Postgres Database

1. Buka dashboard project Anda di Vercel
2. Navigasi ke tab **"Storage"**
3. Klik **"Create Database"** → Pilih **"Postgres"**
4. Beri nama database (misal: `ceritaku-db`)
5. Pilih region yang sesuai (dekat dengan target user)
6. Klik **"Create"**

### Dapatkan Connection String

Setelah database dibuat:

1. Klik database yang baru dibuat
2. Klik tab **"Connection Info"**
3. Salin **"Postgres Connection URL"** (format: `postgres://...`)
4. Simpan sebagai environment variable di Vercel

## 🔐 Langkah 3: Setup Environment Variables

Di Vercel Dashboard → Settings → Environment Variables, tambahkan:

```bash
# Vercel Postgres Connection
POSTGRES_URL="postgres://..."

# (Opsional) Jika masih menggunakan Firebase Auth
FIREBASE_API_KEY="AIzaSy..."
FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
FIREBASE_MESSAGING_SENDER_ID="123456789"
FIREBASE_APP_ID="1:123456789:web:abc123"
```

**Catatan**: Untuk keamanan maksimal, gunakan Vercel Environment Variables daripada menyimpan di `config.js`.

## 🏗️ Langkah 4: Buat Database Schema

Jalankan SQL berikut di Vercel Postgres (via dashboard atau psql client):

```sql
-- Tabel articles
CREATE TABLE IF NOT EXISTS articles (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  author_avatar VARCHAR(255),
  category VARCHAR(50) NOT NULL,
  tags JSONB DEFAULT '[]',
  image_url VARCHAR(255),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('published', 'draft', 'archived'))
);

-- Index untuk performa
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_views ON articles(views DESC);

-- Insert sample data (opsional)
INSERT INTO articles (id, title, excerpt, content, author, category, tags, status) VALUES
('art-001', 
 'Memulai Perjalanan Coding di 2024',
 'Panduan lengkap untuk developer pemula yang ingin memulai karir di bidang teknologi.',
 '<p>Tahun 2024 menjadi momentum tepat...</p>',
 'Andi Developer',
 'tutorial',
 '["coding", "pemula", "web-development"]',
 'published'),
('art-002',
 'Tips Produktif Kerja Remote ala Developer',
 'Strategi menjaga fokus dan produktivitas saat bekerja dari rumah.',
 '<p>Kerja remote memberikan fleksibilitas...</p>',
 'Siti Tech',
 'lifestyle',
 '["remote-work", "produktivitas"]',
 'published');
```

## 🔄 Langkah 5: Update Frontend untuk Menggunakan API

File `app.js` perlu dimodifikasi untuk fetch data dari Vercel Edge Functions:

```javascript
// Ganti fungsi loadArticles() dengan:
async function loadArticles() {
  try {
    showLoading(true);
    
    // Fetch dari Vercel Edge Function
    const response = await fetch('/api/articles');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: HTTP ${response.status}`);
    }
    
    const data = await response.json();
    AppState.articles = data.articles || [];
    
    renderArticles();
    renderTrending();
    
    console.log(`✅ Loaded ${AppState.articles.length} articles from Vercel Postgres`);
    
  } catch (error) {
    console.error('❌ Error loading articles:', error);
    showEmptyState('Gagal memuat cerita. Silakan refresh halaman.');
    showToast('Gagal memuat artikel. Periksa koneksi internet.', 'error');
  } finally {
    AppState.isLoading = false;
    showLoading(false);
  }
}
```

## 🧪 Langkah 6: Testing Local Development

```bash
# Install dependencies
npm install

# Link ke Vercel project
vercel link

# Pull environment variables dari Vercel
vercel env pull

# Jalankan local dev server
vercel dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📊 Struktur File Baru

```
/workspace
├── api/                    # Vercel Edge Functions
│   ├── articles.js        # GET /api/articles
│   ├── create-article.js  # POST /api/articles
│   └── update-views.js    # POST /api/update-views
├── index.html
├── app.js                 # Updated untuk fetch dari API
├── package.json           # Dependencies Vercel
├── vercel.json            # Vercel configuration
└── README_VERCEL.md       # Dokumentasi ini
```

## 🔑 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/articles` | Get semua articles |
| POST | `/api/articles` | Create article baru |
| POST | `/api/update-views` | Increment view count |

### Contoh Response GET /api/articles

```json
{
  "articles": [
    {
      "id": "art-001",
      "title": "Memulai Perjalanan Coding di 2024",
      "excerpt": "...",
      "author": "Andi Developer",
      "category": "tutorial",
      "tags": ["coding", "pemula"],
      "views": 1247,
      "publishedAt": "2024-01-15T08:30:00Z"
    }
  ],
  "meta": {
    "totalArticles": 3,
    "lastUpdated": "2024-01-15T08:30:00Z"
  }
}
```

## 🔒 Keamanan

1. **Environment Variables**: Jangan commit `.env` atau connection strings
2. **CORS**: Edge functions sudah include CORS headers untuk keamanan
3. **Rate Limiting**: Vercel menyediakan basic rate limiting
4. **Firebase Rules**: Jika masih menggunakan Firebase Auth, pastikan rules sudah dikonfigurasi

## 🆘 Troubleshooting

### Error: "POSTGRES_URL is not defined"

- Pastikan environment variable sudah diset di Vercel Dashboard
- Re-deploy setelah menambahkan environment variable
- Untuk local: jalankan `vercel env pull`

### Error: "relation 'articles' does not exist"

- Database schema belum dibuat
- Jalankan SQL migration di atas

### Build Failed di Vercel

- Cek log deployment di Vercel Dashboard
- Pastikan `package.json` valid
- Verify `vercel.json` configuration

## 📈 Monitoring

- **Vercel Analytics**: Enable di dashboard untuk tracking traffic
- **Vercel Logs**: Lihat logs real-time di dashboard
- **Database Insights**: Monitor query performance di Storage tab

## 🎉 Next Steps

1. ✅ Setup custom domain (opsional)
2. ✅ Enable Vercel Analytics
3. ✅ Setup automatic previews untuk pull requests
4. ✅ Implement authentication (jika diperlukan)
5. ✅ Add admin dashboard untuk manage articles

---

**Dokumentasi Tambahan:**
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [@vercel/postgres SDK](https://github.com/vercel/storage/tree/main/packages/postgres)

**Happy Deploying! 🚀**
