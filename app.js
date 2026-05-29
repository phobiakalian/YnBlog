/**
 * CeritaKu - Main Application Logic
 * Handles: Article fetching/rendering, UI interactions
 * 
 * 🚀 Deployed on Vercel with Vercel Postgres
 */

// ============================================================================
// Application State
// ============================================================================

const AppState = {
  articles: [],
  currentUser: null,
  isLoading: true,
  currentCategory: 'all'
};

// ============================================================================
// DOM Cache
// ============================================================================

const DOM = {};

function cacheDOM() {
  DOM.articlesContainer = document.getElementById('articlesContainer');
  DOM.loadingFeed = document.getElementById('loadingFeed');
  DOM.emptyState = document.getElementById('emptyState');
  DOM.trendingList = document.getElementById('trendingList');
  DOM.toastContainer = document.getElementById('toastContainer');
  DOM.searchBtn = document.getElementById('searchBtn');
  DOM.categoryTags = document.querySelectorAll('[data-category]');
}

// ============================================================================
// Initialization
// ============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  cacheDOM();
  setupEventListeners();
  
  // Only fetch articles on index.html
  if (DOM.articlesContainer) {
    await loadArticles();
  }
});

// ============================================================================
// Event Listeners Setup
// ============================================================================

function setupEventListeners() {
  // Category filter tags
  DOM.categoryTags?.forEach(tag => {
    tag.addEventListener('click', (e) => {
      const category = e.currentTarget.dataset.category;
      filterArticlesByCategory(category);

      // Update active state
      DOM.categoryTags?.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      e.currentTarget.classList.add('active');
      e.currentTarget.setAttribute('aria-pressed', 'true');
    });
  });

  // Search button (placeholder)
  DOM.searchBtn?.addEventListener('click', () => {
    showToast('🔍 Fitur pencarian akan segera hadir!');
  });
}

// ============================================================================
// Article Functions
// ============================================================================

/**
 * Load articles from Vercel Postgres API
 */
async function loadArticles() {
  try {
    showLoading(true);

    const response = await fetch('/api/articles');

    if (!response.ok) {
      throw new Error(`Failed to fetch articles: HTTP ${response.status}`);
    }

    const data = await response.json();
    AppState.articles = data.articles || [];

    // Initial render
    renderArticles();
    renderTrending();

    console.log(`✅ Loaded ${AppState.articles.length} articles`);

  } catch (error) {
    console.error('❌ Error loading articles:', error);
    showEmptyState('Gagal memuat cerita. Silakan refresh halaman atau coba lagi nanti.');
    showToast('Gagal memuat artikel. Periksa koneksi internet.', 'error');

  } finally {
    AppState.isLoading = false;
    showLoading(false);
  }
}

/**
 * Render articles to the DOM
 */
function renderArticles(articles = null) {
  if (!DOM.articlesContainer) return;

  const articlesToRender = articles || AppState.articles.filter(a => a.status === 'published');

  if (articlesToRender.length === 0) {
    showEmptyState();
    return;
  }

  DOM.emptyState?.classList.add('hidden');
  DOM.articlesContainer?.classList.remove('hidden');

  const sorted = [...articlesToRender].sort((a, b) =>
    new Date(b.publishedAt) - new Date(a.publishedAt)
  );

  DOM.articlesContainer.innerHTML = sorted.map(article => createArticleCard(article)).join('');

  DOM.articlesContainer.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.tag') || e.target.tagName === 'A') return;
      const articleId = card.dataset.id;
      showArticleDetail(articleId);
    });
  });
}

/**
 * Create HTML for a single article card
 */
function createArticleCard(article) {
  const date = new Date(article.publishedAt).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  const tagsHtml = (article.tags || []).slice(0, 3).map(tag =>
    `<span class="tag" role="tag">${escapeHtml(tag)}</span>`
  ).join('');

  const imageUrl = article.imageUrl || `https://picsum.photos/seed/${article.id}/800/400`;
  const authorAvatar = article.authorAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(article.author)}&background=333&color=fff`;

  return `
    <article class="card article-card image-top" data-id="${article.id}" tabindex="0" role="article" aria-labelledby="title-${article.id}">
      ${article.imageUrl ? `
        <img src="${escapeHtml(imageUrl)}"
             alt="Gambar untuk ${escapeHtml(article.title)}"
             class="article-image"
             loading="lazy"
             onerror="this.src='https://picsum.photos/seed/placeholder/800/400'; this.alt='Gambar tidak tersedia'">
      ` : ''}

      <div>
        <div class="article-meta">
          <div class="article-author">
            <img src="${escapeHtml(authorAvatar)}"
                 alt="Avatar ${escapeHtml(article.author)}"
                 class="w-8 h-8 rounded-full"
                 loading="lazy">
            <span>${escapeHtml(article.author)}</span>
          </div>
          <span aria-hidden="true">•</span>
          <time datetime="${article.publishedAt}">${date}</time>
          <span aria-hidden="true">•</span>
          <span>👁️ ${(article.views || 0).toLocaleString('id-ID')}</span>
        </div>

        <h2 class="article-title" id="title-${article.id}">
          <a href="#" class="hover:text-primary transition-colors"
             onclick="showArticleDetail('${article.id}'); return false;"
             aria-label="Baca: ${escapeHtml(article.title)}">
            ${escapeHtml(article.title)}
          </a>
        </h2>

        <p class="article-excerpt">${escapeHtml(article.excerpt)}</p>

        ${tagsHtml ? `<div class="article-tags" role="list" aria-label="Tags">${tagsHtml}</div>` : ''}
      </div>
    </article>
  `;
}

/**
 * Render trending articles in sidebar
 */
function renderTrending() {
  if (!DOM.trendingList) return;

  const trending = [...AppState.articles]
    .filter(a => a.status === 'published')
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  if (trending.length === 0) {
    DOM.trendingList.innerHTML = '<p class="text-text-muted text-sm">Belum ada data trending</p>';
    return;
  }

  DOM.trendingList.innerHTML = trending.map((article, index) => `
    <div class="trending-item" role="listitem">
      <span class="trending-number" aria-hidden="true">#${index + 1}</span>
      <div>
        <a href="#" class="hover:text-primary text-sm font-medium block truncate"
           onclick="showArticleDetail('${article.id}'); return false;"
           title="${escapeHtml(article.title)}">
          ${escapeHtml(article.title)}
        </a>
        <span class="trending-views">👁️ ${(article.views || 0).toLocaleString('id-ID')}</span>
      </div>
    </div>
  `).join('');
}

/**
 * Filter articles by category
 */
function filterArticlesByCategory(category) {
  AppState.currentCategory = category;

  if (category === 'all') {
    renderArticles();
  } else {
    const filtered = AppState.articles.filter(a =>
      a.category === category && a.status === 'published'
    );
    renderArticles(filtered);
  }

  const announcement = category === 'all'
    ? 'Menampilkan semua artikel'
    : `Menampilkan artikel kategori ${category}`;

  showToast(announcement, 'info');
}

/**
 * Show article detail
 */
function showArticleDetail(articleId) {
  const article = AppState.articles.find(a => a.id === articleId);

  if (article) {
    article.views = (article.views || 0) + 1;
    showToast(`📖 Membaca: ${article.title}`);
    
    // Update view count via API
    fetch('/api/update-views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: articleId })
    }).catch(err => console.error('Failed to update views:', err));
  }
}

// ============================================================================
// UI State Functions
// ============================================================================

function showLoading(show) {
  if (DOM.loadingFeed) {
    DOM.loadingFeed.classList.toggle('hidden', !show);
  }
  if (DOM.articlesContainer) {
    if (show) {
      DOM.articlesContainer.classList.add('hidden');
    } else if (!AppState.isLoading && AppState.articles.length > 0) {
      DOM.articlesContainer.classList.remove('hidden');
    }
  }
}

function showEmptyState(message = 'Belum ada cerita yang dipublikasikan') {
  if (DOM.emptyState) {
    const titleEl = DOM.emptyState.querySelector('.empty-state-title');
    if (titleEl) titleEl.textContent = message;
    DOM.emptyState.classList.remove('hidden');
  }
  if (DOM.articlesContainer) {
    DOM.articlesContainer.classList.add('hidden');
  }
  if (DOM.loadingFeed) {
    DOM.loadingFeed.classList.add('hidden');
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

function showToast(message, type = 'success') {
  if (!DOM.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : type === 'warning' ? 'warning' : type === 'info' ? 'info' : ''}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">
      ${type === 'error' ? '⚠️' : type === 'warning' ? 'ℹ️' : type === 'info' ? '💡' : '✅'}
    </span>
    <span class="toast-message">${escapeHtml(message)}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

console.log('🚀 CeritaKu app.js loaded - Vercel + Postgres');
