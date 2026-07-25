/**
 * Simulated network latency for the mock services.
 *
 * Without it every mock query resolves in the same tick, so `isLoading` is
 * never observably true and skeletons, spinners and disabled submit buttons go
 * untested — exactly the states most likely to be broken against real Firestore.
 * The range is small enough to keep development snappy.
 */
const MIN_MS = 120;
const MAX_MS = 380;

export function simulateLatency(ms?: number): Promise<void> {
  const delay = ms ?? MIN_MS + Math.random() * (MAX_MS - MIN_MS);
  return new Promise((resolve) => setTimeout(resolve, delay));
}
