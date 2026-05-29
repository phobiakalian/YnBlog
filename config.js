/**
 * 🔐 Firebase Configuration Template - CeritaKu Platform
 * 
 * ============================================================================
 * INSTRUKSI SETUP:
 * ============================================================================
 * 1. Salin file ini menjadi: config.js
 *    Command: cp config.template.js config.js
 * 
 * 2. Buka Firebase Console: https://console.firebase.google.com/
 *    - Buat project baru atau pilih existing
 *    - Project Settings ⚙️ → General → Your apps → Web app (</>)
 *    - Registrasi app dengan nickname "CeritaKu"
 *    - Salin firebaseConfig object yang muncul
 * 
 * 3. Ganti semua nilai "XXXXXXXXXXX" di config.js dengan nilai asli
 * 
 * 4. ⚠️ PENTING: JANGAN commit config.js ke repositori publik!
 *    File ini sudah ditambahkan di .gitignore
 * 
 * 5. Setup Authentication di Firebase Console:
 *    - Authentication → Sign-in method
 *    - Enable: Email/Password, Google, GitHub (sesuai kebutuhan)
 * 
 * 6. Setup Admin Access (opsional):
 *    - Atur ADMIN_PATTERNS.emailDomains untuk deteksi admin via email
 *    - Atau tambahkan UID admin di ADMIN_PATTERNS.uids
 * 
 * ============================================================================
 */

// 🔥 Firebase Configuration - GANTI DENGAN NILAI ASLI DARI FIREBASE CONSOLE
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyCq4iqaVMAoqSrvT7u3iOVml6Iu-Khee8c",
  authDomain: "janjsa.firebaseapp.com",
  projectId: "janjsa",
  storageBucket: "janjsa.firebasestorage.app",
  messagingSenderId: "946723375078",
  appId: "1:946723375078:web:1db1220a80002b9a2df827",
  measurementId: "G-4VN93EZCQ3"
};

// 👮 Admin Access Patterns - Untuk deteksi role admin
// User dengan email yang match pattern ini akan dianggap sebagai admin
const ADMIN_PATTERNS = {
  // Domain email yang dianggap admin (case-sensitive)
  emailDomains: [
    "@admin.ceritaku.com",
    "@yourdomain.com"
  ],
  
  // UID Firebase user yang dianggap admin (override email pattern)
  uids: [
    // Contoh: "abc123XYZ456..."
  ],
  
  // Custom claim key (jika menggunakan Firebase Custom Claims)
  customClaimKey: "admin"
};

// ⚙️ Application Settings (opsional)
const APP_SETTINGS = {
  // Nama aplikasi
  appName: "CeritaKu",
  
  // URL default untuk redirect setelah login
  defaultRedirect: {
    user: "index.html",
    admin: "admin.html"
  },
  
  // Session duration dalam milidetik (default: 24 jam)
  sessionDuration: 24 * 60 * 60 * 1000,
  
  // Enable demo mode untuk testing tanpa Firebase config
  enableDemoMode: true,
  
  // Demo credentials (hanya untuk development)
  demoCredentials: {
    user: {
      email: "user@demo.com",
      displayName: "Pengguna Demo",
      photoURL: "https://ui-avatars.com/api/?name=Pengguna+Demo&background=6366f1&color=fff"
    },
    admin: {
      email: "admin@demo.com",
      displayName: "Admin Demo", 
      photoURL: "https://ui-avatars.com/api/?name=Admin+Demo&background=ec4899&color=fff"
    }
  }
};

// 🌍 Environment detection (auto)
const APP_ENV = {
  isLocalhost: window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1',
  isGitHubPages: window.location.hostname.endsWith('github.io'),
  get isProduction() {
    return !this.isLocalhost;
  }
};

// Export untuk module systems (CommonJS/ESM compatibility)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    FIREBASE_CONFIG, 
    ADMIN_PATTERNS, 
    APP_SETTINGS,
    APP_ENV 
  };
}

// Log info untuk debugging (hanya di console, tidak di UI)
if (APP_ENV.isLocalhost && typeof console !== 'undefined') {
  console.log('🔐 CeritaKu Config Loaded');
  console.log('   Environment:', APP_ENV.isLocalhost ? 'Development' : 'Production');
  console.log('   Firebase Config:', FIREBASE_CONFIG.apiKey?.startsWith('AIza') ? '✓ Valid format' : '✗ Invalid');
  console.log('   Admin Patterns:', ADMIN_PATTERNS.emailDomains.length + ' domains configured');
}
