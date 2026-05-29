# CeritaKu - Platform Blog Modern

Platform membaca dan berbagi cerita yang dihosting di **Vercel** dengan database **Vercel Postgres**.

## 🚀 Deploy ke Vercel

### 1. Push ke GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Import ke Vercel

1. Buka [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik **Add New Project**
3. Import repository GitHub Anda
4. Vercel akan auto-detect konfigurasi

### 3. Setup Database

1. Di Vercel Dashboard, buka tab **Storage**
2. Klik **Create Database** → Pilih **Postgres**
3. Beri nama database (misal: `ceritaku-db`)
4. Database akan dibuat otomatis

### 4. Setup Environment Variables

Di Vercel Dashboard → Settings → Environment Variables:

```
POSTGRES_URL=<url_dari_Vercel_Postgres>
```

### 5. Buat Tabel Database

Jalankan SQL ini di Vercel Postgres (via Vercel Dashboard → Storage → Database):

```sql
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  author_avatar TEXT,
  category TEXT NOT NULL,
  tags JSONB DEFAULT '[]',
  image_url TEXT,
  published_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  status TEXT DEFAULT 'published'
);

-- Insert sample data
INSERT INTO articles (id, title, excerpt, content, author, category, tags, status) VALUES
('art-1', 'Selamat Datang di CeritaKu', 'Ini adalah artikel pertama di platform CeritaKu.', 'Konten lengkap artikel...', 'Admin', 'tutorial', '["welcome", "intro"]', 'published');
```

### 6. Deploy!

Klik **Deploy** di Vercel. Done! 🎉

## 📁 Struktur File

```
/workspace
├── api/                  # Vercel Edge Functions
│   ├── articles.js       # GET /api/articles
│   ├── create-article.js # POST /api/articles
│   └── update-views.js   # POST /api/update-views
├── index.html            # Halaman utama
├── app.js                # Frontend logic
├── style.css             # Styling
├── package.json          # Dependencies
├── vercel.json           # Vercel config
└── README.md             # Dokumentasi ini
```

## 🔧 Local Development

```bash
# Install dependencies
npm install

# Run locally with Vercel CLI
npx vercel dev
```

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Hosting**: Vercel
- **Database**: Vercel Postgres
- **API**: Vercel Edge Functions

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | Get semua artikel |
| POST | `/api/articles` | Create artikel baru |
| POST | `/api/update-views` | Update view count |

## 📄 License

MIT License
