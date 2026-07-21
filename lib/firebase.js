import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoPlaceholderKey',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'hbmr-demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'hbmr-demo',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'hbmr-demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:1234567890:web:1234567890'
};

// Check if Firebase keys are default demo keys
export const isFirebaseConfigured = () => {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  return Boolean(apiKey && !apiKey.includes('your-firebase-api-key') && apiKey !== 'AIzaSyDemoPlaceholderKey');
};

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider configured for Gmail authentication
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Sign in using Google (Gmail) pop-up.
 */
export async function signInWithGoogle() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase project keys are not configured yet in .env.local. Please paste your Firebase API Key and Project ID into .env.local and restart the server.");
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Verify if the email is authorized
    if (!isAllowedAdminEmail(user.email)) {
      await firebaseSignOut(auth);
      throw new Error(`Access Denied: The Gmail account '${user.email}' is not registered as an administrator.`);
    }

    const token = await user.getIdToken();
    return {
      user,
      token,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

/**
 * Sign out user from Firebase Auth.
 */
export async function signOutUser() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

/**
 * Check if a given Gmail email is authorized to access the Admin Panel.
 */
export function isAllowedAdminEmail(email) {
  if (!email) return false;
  
  const allowedList = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS;
  // If no allowed list specified or '*', allow all signed-in Gmail accounts
  if (!allowedList || allowedList.trim() === '' || allowedList.trim() === '*') {
    return true;
  }

  const emails = allowedList.split(',').map(e => e.trim().toLowerCase());
  return emails.includes(email.toLowerCase());
}

/**
 * Subscribe to auth state changes.
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (isAllowedAdminEmail(user.email)) {
        const token = await user.getIdToken();
        callback({
          user,
          token,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        await firebaseSignOut(auth);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}
