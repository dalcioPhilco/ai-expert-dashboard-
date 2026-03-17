// ═══════════════════════════════════════════════════════
//  FIREBASE — Estudos IA (estudos-ia-702f1)
// ═══════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyAiVwUPqymlwtsiSBK7H0_eMujBDY7KHq0",
  authDomain:        "estudos-ia-702f1.firebaseapp.com",
  projectId:         "estudos-ia-702f1",
  storageBucket:     "estudos-ia-702f1.firebasestorage.app",
  messagingSenderId: "786620636720",
  appId:             "1:786620636720:web:d9da905aaeaaf9c8e897f5",
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ── Auth ──────────────────────────────────────────────

export function loginGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function logout() {
  return signOut(auth);
}

export function onUser(callback) {
  onAuthStateChanged(auth, callback);
}

// ── Firestore ─────────────────────────────────────────

function userRef(uid) {
  return doc(db, "users", uid);
}

export async function loadProgress(uid) {
  try {
    const snap = await getDoc(userRef(uid));
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    console.error("loadProgress:", e);
    return null;
  }
}

export async function setModuleStatus(uid, moduleKey, status) {
  try {
    await setDoc(
      userRef(uid),
      { moduleStatus: { [moduleKey]: status }, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (e) {
    console.error("setModuleStatus:", e);
  }
}
