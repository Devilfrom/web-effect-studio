// firebase.ts - Firebase 配置
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// TODO: 替换为实际的 Firebase 项目配置
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "web-effect-studio.firebaseapp.com",
  projectId: "web-effect-studio",
  storageBucket: "web-effect-studio.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
