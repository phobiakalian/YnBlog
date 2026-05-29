#!/usr/bin/env node

/**
 * Script untuk generate config.js dari Environment Variables (untuk development lokal)
 * 
 * Cara pakai:
 * 1. Set environment variables di terminal:
 *    export FIREBASE_API_KEY="your_key"
 *    export FIREBASE_AUTH_DOMAIN="your_domain"
 *    ... (dst)
 * 
 * 2. Jalankan script ini:
 *    node generate-config.js
 * 
 * Atau gunakan .env file jika menggunakan tools seperti dotenv-cli:
 *    npx dotenv-cli -- node generate-config.js
 */

const fs = require('fs');
const path = require('path');

// Ambil nilai dari environment variables atau gunakan default kosong
const config = {
  firebaseConfig: {
    apiKey: process.env.FIREBASE_API_KEY || "",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.FIREBASE_APP_ID || "",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || ""
  }
};

const outputPath = path.join(__dirname, 'config.js');

const fileContent = `// ⚠️ JANGAN COMMIT FILE INI KE GIT!
// File ini di-generate otomatis oleh generate-config.js
// Untuk production, gunakan GitHub Secrets di GitHub Actions.

window.FIREBASE_CONFIG = ${JSON.stringify(config, null, 2)};

// Validasi sederhana
if (!window.FIREBASE_CONFIG.firebaseConfig.apiKey) {
  console.warn("⚠️ FIREBASE_CONFIG tidak lengkap. Pastikan environment variables sudah diset.");
}
`;

try {
  fs.writeFileSync(outputPath, fileContent);
  console.log(`✅ config.js berhasil dibuat di: ${outputPath}`);
  console.log("📝 Sekarang Anda bisa menjalankan aplikasi di browser.");
  
  if (!process.env.FIREBASE_API_KEY) {
    console.log("\n⚠️  PERHATIAN: Environment variables belum diset!");
    console.log("Silakan set variabel berikut sebelum menjalankan aplikasi:");
    console.log("  - FIREBASE_API_KEY");
    console.log("  - FIREBASE_AUTH_DOMAIN");
    console.log("  - FIREBASE_PROJECT_ID");
    console.log("  - FIREBASE_STORAGE_BUCKET");
    console.log("  - FIREBASE_MESSAGING_SENDER_ID");
    console.log("  - FIREBASE_APP_ID");
    console.log("\nContoh (Mac/Linux):");
    console.log('  export FIREBASE_API_KEY="AIzaSy..."');
    console.log("\nAtau buat file .env dan gunakan: npx dotenv-cli -- node generate-config.js");
  }
} catch (error) {
  console.error("❌ Gagal membuat config.js:", error.message);
  process.exit(1);
}
