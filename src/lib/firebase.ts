// ============================================================
// FIREBASE CONFIG — MATCHED WITH LOGIN MODAL
// ============================================================

// Core
import { initializeApp } from "firebase/app";

// Auth
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

// Optional services
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// ============================================================
// ENV CONFIG
// ============================================================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ============================================================
// INIT APP
// ============================================================

const app = initializeApp(firebaseConfig);

// ============================================================
// AUTH
// ============================================================

export const auth = getAuth(app);

// ✅ PROVIDERS (THIS WAS MISSING 🔥)
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const githubProvider = new GithubAuthProvider();

// Optional: scopes (improves data access)
googleProvider.addScope("profile");
googleProvider.addScope("email");

// ============================================================
// DATABASE & STORAGE (OPTIONAL)
// ============================================================

export const db = getFirestore(app);
export const storage = getStorage(app);

// ============================================================
// ANALYTICS (SAFE)
// ============================================================

let analytics: ReturnType<typeof getAnalytics> | undefined;

if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };

// ============================================================
// EXPORT
// ============================================================

export default app;