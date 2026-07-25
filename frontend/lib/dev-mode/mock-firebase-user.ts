import type { IdTokenResult, User } from "firebase/auth";
import type { MockSessionIdentity } from "@/lib/dev-mode/mock-session";

/**
 * Adapts a development session into a Firebase `User`.
 *
 * The whole point of dev mode is that no consumer can tell the difference:
 * `AuthContextValue.user` stays typed as `firebase/auth`'s `User`, so every
 * component reading `user.uid`, `user.email` or `user.emailVerified` compiles
 * and behaves identically whichever provider is mounted. The full interface is
 * implemented — no `as unknown as User` escape hatch — which means a future
 * Firebase SDK upgrade that adds a member breaks the build here, loudly, rather
 * than at runtime in a component.
 */

const DEV_PROVIDER_ID = "password";

function idTokenResult(identity: MockSessionIdentity): IdTokenResult {
  const issued = new Date(identity.signedInAtMs);
  const expires = new Date(identity.signedInAtMs + 60 * 60 * 1000);
  return {
    token: `dev-mock-token.${identity.uid}`,
    authTime: issued.toUTCString(),
    issuedAtTime: issued.toUTCString(),
    expirationTime: expires.toUTCString(),
    signInProvider: DEV_PROVIDER_ID,
    signInSecondFactor: null,
    // The role claim is the authorisation source of truth in production; it is
    // set here by the same mechanism (a server-issued claim) it will be later.
    claims: { role: identity.role },
  };
}

export function createMockFirebaseUser(identity: MockSessionIdentity): User {
  const signInTime = new Date(identity.signedInAtMs).toUTCString();

  const info = {
    uid: identity.uid,
    email: identity.email,
    displayName: identity.displayName,
    photoURL: identity.photoUrl ?? null,
    phoneNumber: null,
    providerId: DEV_PROVIDER_ID,
  };

  const user: User = {
    ...info,
    emailVerified: identity.emailVerified,
    isAnonymous: false,
    tenantId: null,
    refreshToken: `dev-mock-refresh.${identity.uid}`,
    metadata: { creationTime: signInTime, lastSignInTime: signInTime },
    providerData: [info],

    async getIdToken() {
      return idTokenResult(identity).token;
    },
    async getIdTokenResult() {
      return idTokenResult(identity);
    },
    async reload() {
      // No remote record to re-read; the mock store is already authoritative.
    },
    async delete() {
      throw new Error("[dev-mode] Account deletion is not simulated.");
    },
    toJSON() {
      return { ...info, emailVerified: identity.emailVerified };
    },
  };

  return user;
}
