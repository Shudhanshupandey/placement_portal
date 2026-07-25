import type { Role } from "@/constants/roles";

/**
 * The development session — what Firebase Auth's persistence layer does for
 * real users, reduced to the identity fields `AuthContextValue.user` exposes.
 *
 * Deliberately an observable store rather than React state: the mock auth
 * services are plain, framework-free modules (same as their Firebase
 * counterparts), so `verifyOtp()` must be able to establish a session without
 * reaching into a component. The provider subscribes, exactly as it subscribes
 * to `onAuthStateChanged` in production.
 */

const STORAGE_KEY = "saitm.dev-mode.session.v1";

export interface MockSessionIdentity {
  uid: string;
  email: string;
  role: Role;
  displayName: string;
  photoUrl?: string;
  emailVerified: boolean;
  /** Epoch ms — mirrors Firebase's `metadata.lastSignInTime`. */
  signedInAtMs: number;
}

type Listener = () => void;

let current: MockSessionIdentity | null = null;
let hydrated = false;
const listeners = new Set<Listener>();

function read(): MockSessionIdentity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockSessionIdentity) : null;
  } catch {
    return null;
  }
}

function notify(): void {
  for (const listener of listeners) listener();
}

/** Keep tabs in sync — signing out in one tab must sign out the others. */
function onStorage(event: StorageEvent): void {
  if (event.key !== STORAGE_KEY) return;
  current = read();
  notify();
}

export const mockSession = {
  /** Read the persisted session on first access, then serve from memory. */
  get(): MockSessionIdentity | null {
    if (!hydrated && typeof window !== "undefined") {
      hydrated = true;
      current = read();
      window.addEventListener("storage", onStorage);
    }
    return current;
  },

  set(identity: Omit<MockSessionIdentity, "signedInAtMs">): MockSessionIdentity {
    hydrated = true;
    current = { ...identity, signedInAtMs: Date.now() };
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      } catch {
        // Storage disabled — the session still lives for this page's lifetime.
      }
    }
    notify();
    return current;
  },

  clear(): void {
    hydrated = true;
    current = null;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Nothing to do — the in-memory session is already gone.
      }
    }
    notify();
  },

  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
