import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import rawConfig from '../../firebase-applet-config.json';

// Exact config with fallback to the user's provided Firebase Web App ID
export const firebaseConfig = {
  apiKey: rawConfig.apiKey || "AIzaSyDZMkrPnp5r-bgks6E8Gty2goZPyyBI6dY",
  authDomain: rawConfig.authDomain || "buildhaul-65c22.firebaseapp.com",
  projectId: rawConfig.projectId || "buildhaul-65c22",
  storageBucket: rawConfig.storageBucket || "buildhaul-65c22.firebasestorage.app",
  messagingSenderId: rawConfig.messagingSenderId || "1040139389109",
  appId: "1:1040139389109:web:70947b54d13d1db39cd6fc",
  firestoreDatabaseId: rawConfig.firestoreDatabaseId || "ai-studio-buildhaulconstru-cc16182f-24fe-45de-9676-4a763a9cd98f"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore using the named database instance
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Also provide handle to (default) database if user views (default) in console
export const defaultDb = getFirestore(app);

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
};

export enum OperationType {
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}
