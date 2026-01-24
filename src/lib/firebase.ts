import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

// ============================================================
// FIREBASE CONFIG
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyC2dfIAMpvdWlPbhUdF2-63C10wKDIBSBk",
  authDomain: "openroot-hypersite.firebaseapp.com",
  projectId: "openroot-hypersite",
  storageBucket: "openroot-hypersite.firebasestorage.app",
  messagingSenderId: "1006103524599",
  appId: "1:1006103524599:web:c168ce38dd2c0bb1abcff2",
  measurementId: "G-HR51GGV6KL",
};

// ============================================================
// INIT
// ============================================================

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ============================================================
// OAUTH PROVIDERS (HARDENED)
// ============================================================

// Google
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Facebook
export const facebookProvider = new FacebookAuthProvider();

// ✅ CRITICAL FIX — prevent redirect fallback on mobile browsers
facebookProvider.setCustomParameters({
  display: "popup",
});

// GitHub
export const githubProvider = new GithubAuthProvider();
githubProvider.setCustomParameters({
  allow_signup: "true",
});
