/**
 * CeritaKu - Main Application Logic
 * Handles: Auth state management, Article fetching/rendering, UI interactions
 * 
 * 🔐 Note: Firebase config loaded from external config.js (not committed to repo)
 */

// ============================================================================
// 🔐 Config Validation & Firebase Initialization
// ============================================================================

// Check if config is loaded
if (typeof FIREBASE_CONFIG === 'undefined') {
  console.warn('⚠️ FIREBASE_CONFIG tidak ditemukan');
  console.info('💡 Solusi:');
  console.info('   1. Salin config.template.js → config.js');
  console.info('   2. Isi dengan config dari Firebase Console');
  console.info('   3. Jangan commit config.js ke GitHub!');
}

// Initialize Firebase safely
let auth = null;
let app = null;

if (typeof firebase !== 'undefined' && typeof FIREBASE_CONFIG !== 'undefined') {
  try {
    app = firebase.initializeApp(FIREBASE_CONFIG);
    auth = firebase.auth();
    console.log('✅ Firebase initialized');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
}

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
  DOM.authSection = document.getElementById('authSection');
  DOM.loginBtn = document.getElementById('loginBtn');
  DOM.logoutBtn = document.getElementById('logoutBtn');
  DOM.createPostCTA = document.getElementById('createPostCTA');
  DOM.userAvatar = document.getElementById('userAvatar');
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
  checkAuthState();
  
  // Only fetch articles on index.html
  if (DOM.articlesContainer) {
    await loadArticles();
  }
});

// ============================================================================
// Event Listeners Setup
// ============================================================================

function setupEventListeners() {
  // Auth buttons
  DOM.loginBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'login.html';
  });
  
  DOM.logoutBtn?.addEventListener('click', logout);
  
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
  
  // Handle visibility change for session refresh
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && AppState.currentUser) {
      // Optional: Refresh session or check for updates
      console.log('👁️ Page visible, session active');
    }
  });
}

// ============================================================================
// Authentication Functions
// ============================================================================

/**
 * Check authentication state from localStorage and Firebase
 */
function checkAuthState() {
  // Check localStorage first (for static site compatibility)
  const savedAuth = localStorage.getItem('ceritaku_auth');
  
  if (savedAuth) {
    try {
      const authData = JSON.parse(savedAuth);
      const now = new Date();
      const expiresAt = new Date(authData.expiresAt);
      
      // Validate session expiration
      if (now < expiresAt) {
        AppState.currentUser = authData;
        updateAuthUI();
        console.log('✅ Session restored from localStorage');
        return;
      } else {
        console.log('⏰ Session expired, clearing...');
        localStorage.removeItem('ceritaku_auth');
      }
    } catch (e) {
      console.error('Error parsing auth data:', e);
      localStorage.removeItem('ceritaku_auth');
    }
  }
  
  // Firebase auth state listener (if available)
  if (auth) {
    auth.onAuthStateChanged(user => {
      if (user) {
        // Check admin status using config patterns
        const isAdmin = checkIsAdmin(user);
        
        AppState.currentUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAdmin: isAdmin,
          loginTime: new Date().toISOString(),
          expiresAt: new Date(Date.now() + (APP_SETTINGS?.sessionDuration || 24 * 60 * 60 * 1000)).toISOString()
        };
        
        // Sync to localStorage for static compatibility
        localStorage.setItem('ceritaku_auth', JSON.stringify(AppState.currentUser));
        
        updateAuthUI();
        console.log('✅ Firebase auth: User signed in');
      } else {
        AppState.currentUser = null;
        localStorage.removeItem('ceritaku_auth');
        updateAuthUI();
        console.log('👋 Firebase auth: User signed out');
      }
    });
  }
}

/**
 * Check if user is admin based on config patterns
 * @param {Object} user - Firebase user object
 * @returns {boolean}
 */
function checkIsAdmin(user) {
  if (!user || typeof ADMIN_PATTERNS === 'undefined') return false;
  
  const { emailDomains = [], uids = [], customClaimKey } = ADMIN_PATTERNS;
  
  // Check email domain pattern
  if (user.email && emailDomains.some(domain => user.email.endsWith(domain))) {
    return true;
  }
  
  // Check UID list
  if (uids.includes(user.uid)) {
    return true;
  }
  
  // Check custom claims (if using Firebase Custom Claims)
  if (customClaimKey && user.claims?.[customClaimKey]) {
    return true;
  }
  
  return false;
}

/**
 * Update UI based on authentication state
 */
function updateAuthUI() {
  if (!DOM.authSection) return;
  
  if (AppState.currentUser) {
    // User is logged in
    DOM.loginBtn?.classList.add('hidden');
    DOM.logoutBtn?.classList.remove('hidden');
    DOM.createPostCTA?.classList.remove('hidden');
    
    // Update avatar
    if (DOM.userAvatar && AppState.currentUser.photoURL) {
      DOM.userAvatar.src = AppState.currentUser.photoURL;
      DOM.userAvatar.alt = `Avatar ${AppState.currentUser.displayName}`;
    }
    
    console.log('👤 UI updated: Logged in as', AppState.currentUser.displayName);
  } else {
    // User is logged out
    DOM.loginBtn?.classList.remove('hidden');
    DOM.logoutBtn?.classList.add('hidden');
    DOM.createPostCTA?.classList.add('hidden');
    
    console.log('👋 UI updated: Logged out');
  }
}

/**
 * Logout function
 */
function logout() {
  // Clear localStorage
  localStorage.removeItem('ceritaku_auth');
  
  // Firebase sign out if available
  if (auth) {
    auth.signOut()
      .then(() => console.log('✅ Firebase signed out'))
      .catch(error => console.error('❌ Firebase sign out error:', error));
  }
  
  // Reset app state
  AppState.currentUser = null;
  updateAuthUI();
  
  // Show feedback
  showToast('Berhasil keluar 👋');
  
  // Redirect to home
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 800);
}

// ============================================================================
// Article Functions
// ============================================================================

/**
 * Load articles from JSON file
 */
async function loadArticles() {
  try {
    showLoading(true);
    
    const response = await fetch('artikel.json');
    
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
    
    // Show user-friendly error
    showToast('Gagal memuat artikel. Periksa koneksi internet.', 'error');
    
  } finally {
    AppState.isLoading = false;
    showLoading(false);
  }
}

/**
 * Render articles to the DOM
 * @param {Array} articles - Articles to render (defaults to all published)
 */
function renderArticles(articles = null) {
  if (!DOM.articlesContainer) return;
  
  // Use provided articles or filter published from state
  const articlesToRender = articles || AppState.articles.filter(a => a.status === 'published');
  
  // Handle empty state
  if (articlesToRender.length === 0) {
    showEmptyState();
    return;
  }
  
  // Hide empty state, show container
  DOM.emptyState?.classList.add('hidden');
  DOM.articlesContainer?.classList.remove('hidden');
  
  // Sort by published date (newest first)
  const sorted = [...articlesToRender].sort((a, b) => 
    new Date(b.publishedAt) - new Date(a.publishedAt)
  );
  
  // Generate HTML
  DOM.articlesContainer.innerHTML = sorted.map(article => createArticleCard(article)).join('');
  
  // Add click handlers for article cards
  DOM.articlesContainer.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking on tag or link
      if (e.target.closest('.tag') || e.target.tagName === 'A') return;
      
      const articleId = card.dataset.id;
      showArticleDetail(articleId);
    });
  });
}

/**
 * Create HTML for a single article card
 * @param {Object} article - Article data
 * @returns {string} HTML string
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
 * @param {string} category - Category to filter by
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
  
  // Announce to screen readers
  const announcement = category === 'all' 
    ? 'Menampilkan semua artikel' 
    : `Menampilkan artikel kategori ${category}`;
  
  showToast(announcement, 'info');
}

/**
 * Show article detail (placeholder for future detail page)
 * @param {string} articleId - Article ID
 */
function showArticleDetail(articleId) {
  const article = AppState.articles.find(a => a.id === articleId);
  
  if (article) {
    // Increment view count (client-side only for demo)
    article.views = (article.views || 0) + 1;
    
    // Show feedback
    showToast(`📖 Membuka: ${article.title}`);
    
    // In production: Navigate to detail page or open modal
    // window.location.href = `article.html?id=${articleId}`;
    
    // For demo: Log to console
    console.log('📰 Article viewed:', {
      id: article.id,
      title: article.title,
      views: article.views
    });
  }
}

// ============================================================================
// UI State Functions
// ============================================================================

/**
 * Show/hide loading state
 * @param {boolean} show - Whether to show loading
 */
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

/**
 * Show empty state message
 * @param {string} message - Custom message (optional)
 */
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

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 */
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
  
  // Auto remove with animation
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format date to Indonesian locale
 * @param {string|Date} dateString - Date string or Date object
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============================================================================
// Export for Module Usage (Optional)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AppState,
    loadArticles,
    renderArticles,
    showToast,
    checkIsAdmin,
    escapeHtml,
    formatDate,
    debounce
  };
}

// ============================================================================
// Global Error Handler
// ============================================================================

window.addEventListener('error', (event) => {
  console.error('🚨 Global error:', {
    message: event.message,
    source: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
  
  // Don't show error toast for Firebase config missing (handled separately)
  if (event.message?.includes('FIREBASE_CONFIG')) {
    return;
  }
  
  // Show user-friendly error for unexpected issues
  if (AppState.currentUser) {
    showToast('Terjadi kesalahan tak terduga. Silakan refresh halaman.', 'error');
  }
});

// ============================================================================
// Performance: Preload critical resources
// ============================================================================

// Preload avatar placeholder for faster perceived load
const preloadAvatar = new Image();
preloadAvatar.src = 'https://ui-avatars.com/api/?name=Loading&background=333&color=fff';

// Log app ready
console.log('🚀 CeritaKu app.js loaded');
console.log('📦 AppState:', { 
  articles: AppState.articles.length, 
  user: AppState.currentUser?.displayName || null,
  config: typeof FIREBASE_CONFIG !== 'undefined' ? 'loaded' : 'missing'
});