const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { env } = require('./env');
const path = require('path');

let firebaseApp;

const serviceAccountKey = env.FIREBASE_SERVICE_ACCOUNT_KEY || env.FIREBASE_SERVICE_ACCOUNT_KEY_FILE;

if (!serviceAccountKey) {
  console.warn('Warning: FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not defined.');
  console.warn('Firebase Auth features will not be available.');
} else {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (err) {
    // If parsing fails, try using it as a file path
    try {
      const filePath = serviceAccountKey.startsWith('.')
        ? path.resolve(__dirname, '..', serviceAccountKey)
        : serviceAccountKey;
      firebaseApp = initializeApp({
        credential: cert(filePath),
      });
    } catch (err2) {
      console.error('Firebase Admin SDK initialization failed:', err2.message);
      console.warn('Firebase Auth features will not be available.');
    }
  }
}

const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;

module.exports = { firebaseAuth, firebaseApp };
