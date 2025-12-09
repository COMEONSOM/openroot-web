import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2dfIAMpvdWlPbhUdF2-63C10wKDIBSBk",
  authDomain: "openroot-hypersite.firebaseapp.com",
  projectId: "openroot-hypersite",
  storageBucket: "openroot-hypersite.firebasestorage.app",
  messagingSenderId: "1006103524599",
  appId: "1:1006103524599:web:c168ce38dd2c0bb1abcff2",
  measurementId: "G-HR51GGV6KL",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// OAuth Providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const githubProvider = new GithubAuthProvider();

//used firebase accout is: aryansom80@gmail.com