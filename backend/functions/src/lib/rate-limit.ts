import { createHash } from "crypto";
import { HttpsError } from "firebase-functions/v2/https";
import { adminDb } from "./admin";

/**
 * Firestore-backed fixed-window rate limiter for PUBLIC (unauthenticated)
 * callables.
 *
 * Why this exists: `sendOtp` throttles itself, but any other public endpoint
 * that creates accounts or sends mail is otherwise unbounded. That matters here
 * because student OTPs and recruiter verification emails leave through the SAME
 * Gmail SMTP account — Gmail caps a workspace-free account near 500 messages a
 * day, so unmetered signups could burn the quota and take student sign-in down
 * with them.
 *
 * Counters live in `rateLimits/{hash}` — a server-only collection (denied to
 * every client by firestore.rules; the Admin SDK bypasses rules). Keys are
 * hashed so raw emails and IPs are never stored.
 *
 * This is a per-instance-independent, strongly-consistent counter because the
 * read+write runs in a Firestore transaction; concurrent calls cannot race past
 * the cap.
 */

export interface RateLimitRule {
  /** Bucket name, e.g. "recruiter-signup". Keeps counters from colliding. */
  scope: string;
  /** Caller identity to meter on — an email, an IP, or any stable string. */
  key: string;
  /** Maximum calls permitted inside one window. */
  max: number;
  /** Window length in milliseconds. */
  windowMs: number;
  /** Message shown to the caller when the cap is hit. */
  message: string;
}

interface CounterDoc {
  count: number;
  windowStart: number;
  /** TTL anchor — lets a Firestore TTL policy reap stale counters. */
  expiresAt: number;
}

function counterId(scope: string, key: string): string {
  return createHash("sha256")
    .update(`${scope}:${key.trim().toLowerCase()}`)
    .digest("hex");
}

/**
 * Consume one unit from the caller's bucket.
 *
 * Throws `resource-exhausted` when the cap is exceeded, otherwise records the
 * call and returns. Fails OPEN: if the counter itself cannot be read or written
 * the request proceeds, because a Firestore hiccup must not lock every user out
 * of signing up.
 */
export async function enforceRateLimit(rule: RateLimitRule): Promise<void> {
  const ref = adminDb.collection("rateLimits").doc(counterId(rule.scope, rule.key));
  const now = Date.now();

  try {
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const prev = (snap.exists ? snap.data() : undefined) as CounterDoc | undefined;

      const withinWindow =
        prev !== undefined && now - prev.windowStart < rule.windowMs;
      const windowStart = withinWindow ? prev.windowStart : now;
      const count = (withinWindow ? prev.count : 0) + 1;

      if (count > rule.max) {
        // Signal through the transaction so the write is rolled back — a
        // rejected call must not consume further budget.
        throw new HttpsError("resource-exhausted", rule.message);
      }

      tx.set(ref, {
        count,
        windowStart,
        expiresAt: windowStart + rule.windowMs,
      } satisfies CounterDoc);
    });
  } catch (err) {
    if (err instanceof HttpsError) throw err;
    // Fail open — see doc comment.
    return;
  }
}
