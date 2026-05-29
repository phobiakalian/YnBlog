# 🚀 Quick Start: Deploy ke Vercel

## Langkah Cepat (5 Menit)

### 1. Push ke GitHub
```bash
git add .
git commit -m "Setup for Vercel deployment"
git push origin main
```

### 2. Deploy di Vercel Dashboard
1. Buka [vercel.com](https://vercel.com) dan login
2. Klik **"Add New..."** → **"Project"**
3. Import repository GitHub Anda
4. Klik **"Deploy"**

### 3. Setup Database Vercel Postgres
1. Di dashboard project, buka tab **"Storage"**
2. Klik **"Create Database"** → Pilih **"Postgres"**
3. Beri nama `ceritaku-db` dan pilih region
4. Salin **Connection URL** dari tab "Connection Info"

### 4. Add Environment Variable
1. Buka **Settings** → **Environment Variables**
2. Tambahkan variable baru:
   - Name: `POSTGRES_URL`
   - Value: (paste connection URL dari langkah 3)
3. Klik **"Save"**

### 5. Buat Database Schema
Buka SQL editor di Vercel Postgres dan jalankan:

```sql
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
  status VARCHAR(20) DEFAULT 'published'
);

CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
```

### 6. Re-deploy
Kembali ke **Deployments** tab dan klik **"Redeploy"** untuk menerapkan environment variables.

✅ **Selesai!** Aplikasi Anda sekarang live di Vercel dengan database Vercel Postgres.

---

## Testing API

Setelah deploy, test API endpoint:

```bash
# Ganti YOUR_VERCEL_URL dengan domain Vercel Anda
curl https://YOUR_VERCEL_URL.vercel.app/api/articles
```

Response yang diharapkan:
```json
{
  "articles": [...],
  "meta": {...}
}
```

---

## Local Development (Opsional)

```bash
# Install dependencies
npm install

# Link ke Vercel project
vercel link

# Pull environment variables
vercel env pull

# Run local dev server
vercel dev
```

📖 **Dokumentasi Lengkap**: Lihat `README_VERCEL.md`
