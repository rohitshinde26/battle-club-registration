import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { 
  initializeFirestore,
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  getDocFromServer,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { RegistrationEntry } from './types';
import firebaseConfigJson from '../firebase-applet-config.json';

// Project Firebase Configuration
const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey || "AIzaSyDi8XsIU2fS_VXdr9ukFVEl1PvLMxxPFv0",
  authDomain: firebaseConfigJson.authDomain || "battle-club-registration.firebaseapp.com",
  projectId: firebaseConfigJson.projectId || "battle-club-registration",
  storageBucket: firebaseConfigJson.storageBucket || "battle-club-registration.firebasestorage.app",
  messagingSenderId: firebaseConfigJson.messagingSenderId || "875539416897",
  appId: firebaseConfigJson.appId || "1:875539416897:web:ec97db0a643d96fb4f43c0"
};

const DATABASE_ID = firebaseConfigJson.firestoreDatabaseId || "ai-studio-battleclubregist-be413eff-8a9c-44f3-a901-57cb02d80335";

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with robust long polling to prevent WebRTC/WebSocket timeout disconnects in preview containers
export const db = initializeFirestore(
  app, 
  {
    experimentalForceLongPolling: true,
  }, 
  DATABASE_ID && DATABASE_ID !== '(default)' ? DATABASE_ID : undefined
);

// Real Firebase Authentication (used to gate the admin dashboard)
export const auth = getAuth(app);

/**
 * Sign an admin in with a real Firebase Authentication account.
 * Throws on invalid credentials — the caller should catch and show an error.
 */
export async function adminSignIn(email: string, password: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  return cred.user;
}

/**
 * Sign the current admin out.
 */
export async function adminSignOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Subscribe to admin auth state. Calls back with the signed-in User, or null when logged out.
 */
export function subscribeToAdminAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

const REGISTRATIONS_COLLECTION = 'registrations';

/**
 * Validate and test live connection to Firestore
 */
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Connected to Firestore database successfully:", DATABASE_ID);
    return true;
  } catch (error) {
    console.warn("Firestore connection check note (operating in offline/cached resilience mode):", error);
    return false;
  }
}

/**
 * Sanitize object to remove undefined values before Firestore writes
 */
function sanitizeForFirestore(entry: RegistrationEntry) {
  const cleanPlayers = (entry.players || []).map((p) => ({
    name: p.name || '',
    inGameName: p.inGameName || '',
    gameUid: p.gameUid || '',
  }));

  const data: Record<string, any> = {
    registrationNumber: entry.registrationNumber || `BC-${Date.now()}`,
    teamName: entry.teamName || 'Battle Club Team',
    teamId: entry.teamId || 'BC-01',
    contactNumber: entry.contactNumber || '',
    gameMode: entry.gameMode || 'squad',
    slotDate: entry.slotDate || new Date().toISOString().split('T')[0],
    slotTime: entry.slotTime || '07:00 PM',
    map: entry.map || 'Erangel / Battle Royale',
    players: cleanPlayers,
    paymentMethod: entry.paymentMethod || 'upi',
    paymentUtr: entry.paymentUtr || '',
    paymentStatus: entry.paymentStatus || 'pending',
    amount: typeof entry.amount === 'number' ? entry.amount : 100,
    createdAt: entry.createdAt || new Date().toISOString(),
  };

  if (entry.paymentSlipUrl) {
    data.paymentSlipUrl = entry.paymentSlipUrl;
  }

  return data;
}

/**
 * Subscribe to real-time registrations from Firestore
 */
export function subscribeToRegistrations(
  onData: (registrations: RegistrationEntry[]) => void,
  onError?: (err: Error) => void
) {
  const q = query(collection(db, REGISTRATIONS_COLLECTION), orderBy('createdAt', 'desc'));
  
  return onSnapshot(
    q,
    { includeMetadataChanges: true },
    (snapshot) => {
      const list: RegistrationEntry[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          registrationNumber: data.registrationNumber || '',
          teamName: data.teamName || '',
          teamId: data.teamId || '',
          contactNumber: data.contactNumber || '',
          gameMode: data.gameMode || 'squad',
          slotDate: data.slotDate || '',
          slotTime: data.slotTime || '',
          map: data.map || 'Erangel / Battle Royale',
          players: Array.isArray(data.players) ? data.players : [],
          paymentMethod: data.paymentMethod || 'upi',
          paymentUtr: data.paymentUtr || undefined,
          paymentSlipUrl: data.paymentSlipUrl || undefined,
          paymentStatus: data.paymentStatus || 'pending',
          amount: typeof data.amount === 'number' ? data.amount : 100,
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      onData(list);
    },
    (error) => {
      console.warn("Firestore live snapshot note:", error.message);
      if (onError) onError(error);
    }
  );
}

/**
 * Save new registration to Firestore
 */
export async function saveRegistration(entry: RegistrationEntry): Promise<string> {
  const colRef = collection(db, REGISTRATIONS_COLLECTION);
  const dataToSave = sanitizeForFirestore(entry);
  const docRef = await addDoc(colRef, dataToSave);
  return docRef.id;
}

/**
 * Update an existing registration in Firestore
 */
export async function updateRegistration(entry: RegistrationEntry): Promise<void> {
  if (!entry.id) return;
  const docRef = doc(db, REGISTRATIONS_COLLECTION, entry.id);
  const dataToUpdate = sanitizeForFirestore(entry);
  await updateDoc(docRef, dataToUpdate);
}

/**
 * Delete a registration from Firestore
 */
export async function deleteRegistration(id: string): Promise<void> {
  if (!id) return;
  const docRef = doc(db, REGISTRATIONS_COLLECTION, id);
  await deleteDoc(docRef);
}
