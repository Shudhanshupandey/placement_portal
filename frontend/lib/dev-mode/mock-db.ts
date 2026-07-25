import type { Application } from "@/features/applications";
import type { AppNotification } from "@/features/notifications";
import type { PlacementDrive } from "@/features/placement-drives";
import type { FullStudentProfile } from "@/features/profile";
import type { StudentProfile } from "@/types/models/student";
import {
  MOCK_ACCOUNTS,
  MOCK_APPLICATIONS,
  MOCK_DRIVES,
  MOCK_FULL_STUDENT_PROFILE,
  MOCK_NOTIFICATIONS,
  DEV_STUDENT_UID,
  emptyStudentProfile,
  type MockAccount,
} from "@/data/mock";

/**
 * The development data store — an in-memory stand-in for Firestore, mirrored
 * into `localStorage` so a page reload does not wipe work in progress.
 *
 * It exists because read-only fixtures are not enough: applying to a drive,
 * finishing onboarding, marking a notification read and registering a recruiter
 * all have to *stick*, or half the UI cannot be exercised. Every mutation here
 * has a one-to-one counterpart in the real Firestore services, so behaviour
 * observed in dev mode is behaviour you will see in production.
 *
 * Scope: mutable collections only. Drives, companies, analytics and reports are
 * read-only fixtures served straight from `data/mock`.
 */

const STORAGE_KEY = "saitm.dev-mode.db.v1";

interface MockDbState {
  /** Credentialed accounts, including recruiters registered during the session. */
  accounts: MockAccount[];
  /** students/{uid} + academicDetails + professionalDetails + documents. */
  profiles: Record<string, FullStudentProfile>;
  applications: Application[];
  notifications: AppNotification[];
}

function seed(): MockDbState {
  return {
    accounts: structuredClone(MOCK_ACCOUNTS),
    profiles: { [DEV_STUDENT_UID]: structuredClone(MOCK_FULL_STUDENT_PROFILE) },
    applications: structuredClone(MOCK_APPLICATIONS),
    notifications: structuredClone(MOCK_NOTIFICATIONS),
  };
}

let state: MockDbState | null = null;

function load(): MockDbState {
  if (state) return state;

  // Server render (or a browser without storage): in-memory only.
  if (typeof window === "undefined") {
    state = seed();
    return state;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<MockDbState>;
      // Tolerate a partially-written or older payload rather than crashing the
      // whole app on a stale key — a dev store is not worth a white screen.
      state = {
        accounts: parsed.accounts ?? seed().accounts,
        profiles: parsed.profiles ?? {},
        applications: parsed.applications ?? [],
        notifications: parsed.notifications ?? seed().notifications,
      };
      return state;
    }
  } catch {
    // Corrupt JSON — fall through and reseed.
  }

  state = seed();
  persist();
  return state;
}

function persist(): void {
  if (typeof window === "undefined" || !state) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or storage disabled — the session still works in memory.
  }
}

/** Mutate + write through in one step, so no caller can forget to persist. */
function write<T>(mutate: (db: MockDbState) => T): T {
  const db = load();
  const result = mutate(db);
  persist();
  return result;
}

export const mockDb = {
  /** Wipe every local change and return to the pristine fixtures. */
  reset(): void {
    state = seed();
    persist();
  },

  accounts: {
    list(): MockAccount[] {
      return load().accounts;
    },
    get(uid: string): MockAccount | undefined {
      return load().accounts.find((a) => a.uid === uid);
    },
    findByEmail(email: string): MockAccount | undefined {
      const needle = email.trim().toLowerCase();
      return load().accounts.find((a) => a.email.toLowerCase() === needle);
    },
    /** Insert, or replace an existing account with the same uid. */
    upsert(account: MockAccount): MockAccount {
      return write((db) => {
        const index = db.accounts.findIndex((a) => a.uid === account.uid);
        if (index >= 0) db.accounts[index] = account;
        else db.accounts.push(account);
        return account;
      });
    },
    /** Shallow-merge a patch into one account (e.g. flip approvalStatus). */
    patch(uid: string, patch: Partial<MockAccount>): MockAccount | undefined {
      return write((db) => {
        const account = db.accounts.find((a) => a.uid === uid);
        if (!account) return undefined;
        Object.assign(account, patch);
        return account;
      });
    },
  },

  profiles: {
    /** Never null — an unknown student gets the empty shape, as in production. */
    get(uid: string): FullStudentProfile {
      return load().profiles[uid] ?? emptyStudentProfile();
    },
    save(uid: string, profile: FullStudentProfile): void {
      write((db) => {
        db.profiles[uid] = profile;
      });
    },
    /** Patch only the `students/{uid}` document (settings, photo, flags). */
    patchStudent(uid: string, patch: Partial<StudentProfile>): void {
      write((db) => {
        const existing = db.profiles[uid] ?? emptyStudentProfile();
        db.profiles[uid] = {
          ...existing,
          student: existing.student
            ? { ...existing.student, ...patch }
            : ({ uid, ...patch } as StudentProfile),
        };
      });
    },
  },

  drives: {
    /** Read-only fixture — drives are authored by admins, not by the portal. */
    list(): PlacementDrive[] {
      return MOCK_DRIVES;
    },
    get(id: string): PlacementDrive | null {
      return MOCK_DRIVES.find((d) => d.id === id) ?? null;
    },
  },

  applications: {
    listByStudent(uid: string): Application[] {
      return load().applications.filter((a) => a.studentId === uid);
    },
    get(id: string): Application | undefined {
      return load().applications.find((a) => a.id === id);
    },
    add(application: Application): void {
      write((db) => {
        db.applications.push(application);
      });
    },
  },

  notifications: {
    /** Personal messages plus broadcasts — mirrors the Firestore `in` query. */
    listFor(uid: string): AppNotification[] {
      return load().notifications.filter(
        (n) => n.recipientId === uid || n.recipientId === "all"
      );
    },
    add(notification: AppNotification): void {
      write((db) => {
        db.notifications.unshift(notification);
      });
    },
    markRead(id: string): void {
      write((db) => {
        const notification = db.notifications.find((n) => n.id === id);
        if (notification) notification.read = true;
      });
    },
    markAllRead(ids: string[]): void {
      write((db) => {
        const wanted = new Set(ids);
        for (const notification of db.notifications) {
          if (wanted.has(notification.id)) notification.read = true;
        }
      });
    },
  },
};
