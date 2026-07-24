"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, connectAuthEmulator, type Auth } from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  type Firestore,
} from "firebase/firestore";
import { getStorage, connectStorageEmulator, type FirebaseStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator, type Functions } from "firebase/functions";
import { env } from "@/config/env";

// Fallbacks keep initializeApp/getAuth from throwing `auth/invalid-api-key`
// when env vars aren't set yet (e.g. during `next build` with an empty
// .env.local). Real values from the environment always take precedence, and
// actual auth/network calls only run at runtime once the portal is configured.
const firebaseConfig = {
  apiKey: env.firebase.apiKey || "demo-api-key",
  authDomain: env.firebase.authDomain || "demo-saitm-portal.firebaseapp.com",
  projectId: env.firebase.projectId || "demo-saitm-portal",
  storageBucket: env.firebase.storageBucket || "demo-saitm-portal.appspot.com",
  messagingSenderId: env.firebase.messagingSenderId || "000000000000",
  appId: env.firebase.appId || "1:000000000000:web:demo",
  measurementId: env.firebase.measurementId || undefined,
};

// Without this, a deploy that is missing NEXT_PUBLIC_FIREBASE_* silently boots
// on the demo placeholders above and every sign-in fails with an opaque
// `auth/invalid-api-key` from deep inside the SDK. Say so once, plainly.
// Names only — these values are public by design, but printing them is noise.
if (
  typeof window !== "undefined" &&
  process.env.NODE_ENV === "production" &&
  !env.firebase.apiKey
) {
  console.error(
    "[firebase] NEXT_PUBLIC_FIREBASE_* environment variables are missing. " +
      "Set them in the Vercel project settings and redeploy — " +
      "authentication, Firestore and Storage cannot work until then."
  );
}

// Reuse the app across hot reloads / RSC boundaries.
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);
const functions: Functions = getFunctions(app, env.firebase.functionsRegion);

// Connect to the local emulator suite exactly once (dev only).
let emulatorsConnected = false;
if (env.useEmulator && typeof window !== "undefined" && !emulatorsConnected) {
  emulatorsConnected = true;
  try {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectStorageEmulator(storage, "127.0.0.1", 9199);
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  } catch {
    // Emulators already connected — safe to ignore.
  }
}

export { app, auth, db, storage, functions };
