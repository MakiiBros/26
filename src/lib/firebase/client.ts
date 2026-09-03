import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { FIREBASE_CONFIG } from '@/lib/constants'

const app = getApps().length > 0 ? getApp() : initializeApp(FIREBASE_CONFIG)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account',
})
